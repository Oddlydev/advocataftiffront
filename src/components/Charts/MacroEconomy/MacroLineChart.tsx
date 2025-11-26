"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export type MacroLineDatum = {
  year: number;
} & Record<string, number | null>;

export type MacroSeriesConfig = {
  key: string;
  label: string;
  color: string;
  valueFormatter?: (value: number | null) => string;
  axis?: "left" | "right";
  formatInMillions?: boolean;
};

export type MacroLineChartProps = {
  datasetUrl?: string | null;
  parseRow: (row: d3.DSVRowString<string>) => MacroLineDatum | null;
  series: MacroSeriesConfig[];
  yAxisLabel: string;
  yAxisRightLabel?: string;
  controlIds: {
    zoomInId: string;
    zoomOutId: string;
    resetId: string;
  };
  yMaxPadding?: number;
  minY?: number;
};

const MARGIN = { top: 40, right: 40, bottom: 60, left: 70 };
const SCALE_STEP = 1.2;
const MIN_SCALE = 1;
const MAX_SCALE = 5;
const DURATION = 2000;
const HTTP_URL_REGEX = /^https?:\/\//i;

async function fetchCsvWithFallback(url: string): Promise<string> {
  const attempt = async (target: string) => {
    const response = await fetch(target, { cache: "no-cache" });
    if (!response.ok)
      throw new Error(`Request failed with status ${response.status}`);
    return response.text();
  };
  try {
    return await attempt(url);
  } catch (primaryError) {
    if (HTTP_URL_REGEX.test(url)) {
      const proxied = `https://corsproxy.io/?${encodeURIComponent(url)}`;
      return attempt(proxied).catch((proxyError) => {
        throw proxyError ?? primaryError;
      });
    }
    throw primaryError;
  }
}

function coerceNumber(
  value: string | number | null | undefined
): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

export function MacroLineChart({
  datasetUrl,
  parseRow,
  series,
  yAxisLabel,
  yAxisRightLabel,
  controlIds,
  yMaxPadding = 2,
  minY,
}: MacroLineChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<MacroLineDatum[]>([]);

  // ----------------
  // Load CSV data
  // ----------------
  useEffect(() => {
    let isMounted = true;
    async function loadDataset() {
      if (!datasetUrl) {
        setData([]);
        return;
      }
      try {
        const text = await fetchCsvWithFallback(datasetUrl);
        const parsed = d3
          .csvParse(text.replace(/\uFEFF/g, ""), (row) => {
            const parsedRow = parseRow(row);
            if (!parsedRow) return null;
            const sanitized: MacroLineDatum = { year: parsedRow.year };
            series.forEach(({ key }) => {
              sanitized[key] = coerceNumber(parsedRow[key]) ?? null;
            });
            return sanitized;
          })
          .filter((item): item is MacroLineDatum => item !== null);

        if (!parsed.length) throw new Error("Dataset did not contain any rows");
        if (isMounted) setData(parsed);
      } catch (error) {
        console.error(
          `[MacroLineChart] Failed to load dataset ${datasetUrl} ::`,
          error
        );
        if (isMounted) setData([]);
      }
    }
    loadDataset();
    return () => {
      isMounted = false;
    };
  }, [datasetUrl, parseRow, series]);

  useEffect(() => {
    const container = chartRef.current;
    const tooltipEl = tooltipRef.current;
    if (!container || !tooltipEl || !data.length) return;

    const tooltip = d3
      .select(tooltipEl)
      .style("display", "none")
      .style("border-radius", "6px")
      .style("border", "1px solid #E2E8F0")
      .style("background", "#FFF")
      .style(
        "box-shadow",
        "0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)"
      )
      .style("pointer-events", "none");

    d3.select(container).selectAll("*").remove();

    const viewBoxWidth = 1200;
    const viewBoxHeight = 500;
    const width = viewBoxWidth - MARGIN.left - MARGIN.right;
    const height = viewBoxHeight - MARGIN.top - MARGIN.bottom;

    const svg = d3
      .select(container)
      .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const years = data.map((d) => d.year);
    const x = d3
      .scalePoint<number>()
      .domain(years)
      .range([0, width])
      .padding(0.5);

    // SERIES SEPARATION
    const leftSeries = series.filter((s) => (s.axis ?? "left") === "left");
    const rightSeries = series.filter((s) => (s.axis ?? "left") === "right");
    const useDualAxis = Boolean(yAxisRightLabel && rightSeries.length);

    // FORCE 0 INTO DOMAIN (Option A)
    const computeDomain = (target: MacroSeriesConfig[]) => {
      const maxVal = d3.max(data, (d) =>
        d3.max(target, ({ key }) => d[key] ?? Number.NEGATIVE_INFINITY)
      );
      const minVal = d3.min(data, (d) =>
        d3.min(target, ({ key }) => d[key] ?? Number.POSITIVE_INFINITY)
      );
      const safeMax = Number.isFinite(maxVal!) ? maxVal! : 0;
      const safeMin = Number.isFinite(minVal!) ? minVal! : 0;

      const upperPadding = Math.max(yMaxPadding, Math.abs(safeMax) * 0.05);
      const lowerPadding = Math.max(yMaxPadding, Math.abs(safeMin) * 0.05);

      let domainMin = Math.min(safeMin - lowerPadding, 0); // force includes zero
      let domainMax = Math.max(safeMax + upperPadding, 0); // force includes zero

      if (domainMax <= domainMin) domainMax = domainMin + 1;
      return [domainMin, domainMax] as const;
    };

    const [yLeftMin, yLeftMax] = computeDomain(
      leftSeries.length ? leftSeries : series
    );
    const yLeft = d3.scaleLinear().domain([yLeftMin, yLeftMax]).range([height, 0]);

    let yRight: d3.ScaleLinear<number, number> | null = null;
    if (useDualAxis) {
      const [mn, mx] = computeDomain(rightSeries);
      yRight = d3.scaleLinear().domain([mn, mx]).range([height, 0]);
    }

    // FORMATTER
    const formatCompact = (num: number) => {
      const abs = Math.abs(num);
      if (abs < 1000) return num.toString();
      if (abs < 1_000_000) return (num / 1000).toFixed(num >= 10000 ? 0 : 1);
      if (abs < 1_000_000_000)
        return (num / 1_000_000).toFixed(num >= 10_000_000 ? 0 : 1);
      return (num / 1_000_000_000).toFixed(num >= 10_000_000_000 ? 0 : 1);
    };

    // AXES
    svg
      .append("g")
      .call(d3.axisLeft(yLeft).ticks(5).tickFormat(formatCompact as any))
      .selectAll("text")
      .attr(
        "class",
        "font-sourcecodepro text-slate-600 text-xs md:text-base font-semibold"
      );

    if (useDualAxis && yRight) {
      svg
        .append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yRight).ticks(5).tickFormat(formatCompact as any))
        .selectAll("text")
        .attr(
          "class",
          "font-sourcecodepro text-slate-600 text-xs md:text-base font-semibold"
        );
    }

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(Math.min(data.length, 10)).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr(
        "class",
        "font-sourcecodepro text-slate-600 text-xs md:text-base font-semibold"
      );

    // LABELS
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-50},${height / 2}) rotate(-90)`)
      .attr(
        "class", "font-baskervville text-slate-600 text-sm md:text-base xl:text-lg font-normal"
      )
      .text(yAxisLabel);

    if (useDualAxis && yAxisRightLabel) {
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width + 50},${height / 2}) rotate(90)`)
        .attr(
          "class", "font-baskervville text-slate-600 text-sm md:text-base xl:text-lg font-normal"
        )
        .text(yAxisRightLabel);
    }

    // GRID LINES
    const gridLayer = svg.append("g");

    // dashed grid lines (except zero line)
    gridLayer
      .append("g")
      .call(d3.axisLeft(yLeft).tickSize(-width).tickFormat(() => ""))
      .call((g) =>
        g
          .selectAll("line")
          .attr("stroke", (d) =>
            d === 0 ? "transparent" : "#CBD5E1"
          )
          .attr("stroke-width", 1)
          .attr("stroke-dasharray", (d) => (d === 0 ? "0" : "4,4"))
      )
      .call((g) => g.select(".domain").remove());

    // ➤ SOLID ZERO LINE (requested)
    gridLayer
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yLeft(0))
      .attr("y2", yLeft(0))
      .attr("stroke", "#475569")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.8);

    // vertical dashed grid lines
    gridLayer
      .selectAll("line.vertical")
      .data(years)
      .enter()
      .append("line")
      .attr("x1", (d) => x(d)!)
      .attr("x2", (d) => x(d)!)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.8);

    // CLIP PATH
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "chart-clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    const plotLayer = svg
      .append("g")
      .attr("clip-path", "url(#chart-clip)");

    // HOVER ELEMENTS
    const hoverLine = svg
      .append("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("opacity", 0);

    const hoverCircle = svg
      .append("circle")
      .attr("r", 0)
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("opacity", 0);

    // LINES + DOTS
    series.forEach(({ key, color, axis }) => {
      const yScale =
        axis === "right" && useDualAxis && yRight ? yRight : yLeft;

      const line = d3
        .line<MacroLineDatum>()
        .defined((d) => typeof d[key] === "number")
        .x((d) => x(d.year)!)
        .y((d) => yScale!(d[key] as number))
        .curve(d3.curveMonotoneX);

      const path = plotLayer
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5)
        .attr("d", line);

      const totalLength = (path.node() as SVGPathElement).getTotalLength();
      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(DURATION)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      data.forEach((d, i) => {
        const value = d[key];
        if (value == null) return;

        const dot = plotLayer
          .append("circle")
          .attr("cx", x(d.year)!)
          .attr("cy", yScale(value))
          .attr("r", 0)
          .attr("fill", color)
          .style("cursor", "pointer");

        dot
          .transition()
          .delay((i / (data.length - 1)) * DURATION)
          .duration(300)
          .ease(d3.easeBackOut)
          .attr("r", 4);

        let hideTooltipTimeout: any = null;

        dot
          .on("mouseover", () => {
            if (hideTooltipTimeout) clearTimeout(hideTooltipTimeout);

            hoverLine
              .transition()
              .duration(150)
              .attr("x1", x(d.year)!)
              .attr("x2", x(d.year)!)
              .attr("opacity", 1);

            hoverCircle
              .transition()
              .duration(150)
              .attr("cx", x(d.year)!)
              .attr("cy", yScale(value))
              .attr("r", 7)
              .attr("stroke", color)
              .attr("opacity", 1);

            dot.transition().duration(150).attr("r", 5);

            const tooltipRows = series
              .map((cfg) => {
                const v = d[cfg.key];
                return `
                  <div class="flex items-start justify-between gap-1">
                    <div class="flex items-center gap-1">
                      <span style="width:6px;height:6px;background:${cfg.color};border-radius:50%;display:inline-block;"></span>
                      <span class="text-slate-600 text-[10px] md:text-xs">${cfg.label}:</span>
                    </div>
                    <span style="color:${cfg.color}" class="text-[10px] md:text-xs">
                      ${
                        typeof v === "number"
                          ? (cfg.valueFormatter?.(v) ?? v.toFixed(3))
                          : "N/A"
                      }
                    </span>
                  </div>
                `;
              })
              .join("");

            tooltip
              .style("display", "block")
              .html(`
                <div class="flex flex-col gap-1">
                  <div class="font-semibold text-slate-600 text-[10px] md:text-xs pb-1 uppercase">
                    Year: ${d.year}
                  </div>
                  ${tooltipRows}
                </div>
              `);
          })
          .on("mousemove", (event) => {
            const rect = container.getBoundingClientRect();
            const tw = tooltipEl.offsetWidth;
            const th = tooltipEl.offsetHeight;

            let xPos = event.clientX - rect.left + 10;
            let yPos = event.clientY - rect.top - th - 10;

            if (xPos + tw > rect.width) {
              xPos = event.clientX - rect.left - tw - 10;
            }

            if (yPos < 0) {
              yPos = event.clientY - rect.top + 20;
            }

            tooltip.style("left", `${xPos}px`).style("top", `${yPos}px`);
          })
          .on("mouseout", () => {
            hideTooltipTimeout = setTimeout(() => {
              hoverLine.transition().duration(200).attr("opacity", 0);
              hoverCircle
                .transition()
                .duration(200)
                .attr("r", 0)
                .attr("opacity", 0);
              dot.transition().duration(200).attr("r", 4);
              tooltip.style("display", "none");
            }, 120);
          });
      });
    });

    // ZOOM (unchanged)
    let currentScale = 1,
      zoomInCount = 0,
      zoomOutCount = 0;
    const maxClicks = 2;

    const zoomInBtn = document.getElementById(
      controlIds.zoomInId
    ) as HTMLButtonElement;
    const zoomOutBtn = document.getElementById(
      controlIds.zoomOutId
    ) as HTMLButtonElement;
    const resetZoomBtn = document.getElementById(
      controlIds.resetId
    ) as HTMLButtonElement;

    const applyZoom = () => {
      const clampedScale = Math.max(
        1 / Math.pow(SCALE_STEP, maxClicks),
        Math.min(currentScale, Math.pow(SCALE_STEP, maxClicks))
      );

      const midX = width / 2;
      const transformX = midX - midX * clampedScale;

      plotLayer
        .transition()
        .duration(300)
        .attr("transform", `translate(${transformX},0) scale(${clampedScale},1)`);

      zoomInBtn.disabled = zoomInCount >= maxClicks;
      zoomOutBtn.disabled = zoomOutCount >= maxClicks;
    };

    const onZoomIn = () => {
      if (zoomInCount < maxClicks) {
        currentScale *= SCALE_STEP;
        zoomInCount++;
        zoomOutCount = Math.max(0, zoomOutCount - 1);
        applyZoom();
      }
    };

    const onZoomOut = () => {
      if (zoomOutCount < maxClicks) {
        currentScale /= SCALE_STEP;
        zoomOutCount++;
        zoomInCount = Math.max(0, zoomInCount - 1);
        applyZoom();
      }
    };

    const onReset = () => {
      currentScale = 1;
      zoomInCount = 0;
      zoomOutCount = 0;
      applyZoom();
    };

    zoomInBtn.addEventListener("click", onZoomIn);
    zoomOutBtn.addEventListener("click", onZoomOut);
    resetZoomBtn.addEventListener("click", onReset);

    return () => {
      zoomInBtn.removeEventListener("click", onZoomIn);
      zoomOutBtn.removeEventListener("click", onZoomOut);
      resetZoomBtn.removeEventListener("click", onReset);
    };
  }, [data, series, yAxisLabel, yAxisRightLabel, controlIds, yMaxPadding, minY]);

  return (
    <div className="relative w-full">
      <svg ref={chartRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="absolute hidden bg-white text-[10px] md:text-xs text-slate-800 px-2 py-1 md:py-2 md:px-3 rounded shadow-lg pointer-events-none"
        style={{ border: "1px solid #E2E8F0" }}
      />
    </div>
  );
}

export type MacroChartWrapperProps = Pick<
  MacroLineChartProps,
  "datasetUrl" | "controlIds"
>;
