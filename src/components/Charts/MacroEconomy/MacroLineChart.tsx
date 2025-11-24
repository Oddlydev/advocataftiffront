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

    // ----------------
    // Tooltip
    // ----------------
    const tooltip = d3.select(tooltipEl)
      .style("display", "none")
      .style("border-radius", "6px")
      .style("border", "1px solid #E2E8F0")
      .style("background", "#FFF")
      .style("box-shadow", "0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -4px rgba(0,0,0,0.1)")
      .style("pointer-events", "none");

    // ----------------
    // Clear SVG
    // ----------------
    d3.select(container).selectAll("*").remove();
    const viewBoxWidth = 1200;
    const viewBoxHeight = 500;
    const width = viewBoxWidth - MARGIN.left - MARGIN.right;
    const height = viewBoxHeight - MARGIN.top - MARGIN.bottom;

    const svg = d3.select(container)
      .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .append("g")
      .attr("class", "chart-content")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // ----------------
    // Scales
    // ----------------
    const years = data.map(d => d.year);
    const x = d3.scalePoint<number>().domain(years).range([0, width]).padding(0.5);

    const leftSeries = series.filter(s => (s.axis ?? "left") === "left");
    const rightSeries = series.filter(s => (s.axis ?? "left") === "right");
    const useDualAxis = Boolean(yAxisRightLabel && rightSeries.length);

    const computeDomain = (targetSeries: MacroSeriesConfig[], forcedMin?: number) => {
      const maxValue = d3.max(data, d => d3.max(targetSeries, ({ key }) => d[key] ?? Number.NEGATIVE_INFINITY));
      const minValue = d3.min(data, d => d3.min(targetSeries, ({ key }) => d[key] ?? Number.POSITIVE_INFINITY));
      const safeMax = Number.isFinite(maxValue ?? NaN) ? maxValue as number : 0;
      const safeMin = Number.isFinite(minValue ?? NaN) ? minValue as number : 0;
      const upperPadding = Math.max(yMaxPadding, Math.abs(safeMax) * 0.05);
      const lowerPadding = Math.max(yMaxPadding, Math.abs(safeMin) * 0.05);
      let domainMin = typeof forcedMin === "number" ? Math.min(forcedMin, safeMin - lowerPadding) : safeMin - lowerPadding;
      let domainMax = safeMax + upperPadding;
      if (safeMin >= 0 && domainMin < 0) domainMin = 0;
      if (domainMax <= domainMin) domainMax = domainMin + Math.max(upperPadding, Math.abs(domainMin) * 0.1, 1);
      return [domainMin, domainMax] as const;
    };

    const [yLeftMin, yLeftMax] = computeDomain(leftSeries.length ? leftSeries : series, minY);
    const yLeft = d3.scaleLinear().domain([yLeftMin, yLeftMax]).range([height, 0]);

    let yRight: d3.ScaleLinear<number, number> | null = null;
    if (useDualAxis) {
      const [yRightMin, yRightMax] = computeDomain(rightSeries);
      yRight = d3.scaleLinear().domain([yRightMin, yRightMax]).range([height, 0]);
    }

    // ----------------
    // Axes
    // ----------------
    // Compact Y-axis number formatter (max 2 digits + suffix)
    const formatCompact = (num: number) => {
      const abs = Math.abs(num);
      let value: number;
      // let suffix = "";

      if (abs >= 1_000_000_000) {
        value = num / 1_000_000_000;
        // suffix = "B";
      } else if (abs >= 1_000_000) {
        value = num / 1_000_000;
        // suffix = "M";
      } else if (abs >= 1_000) {
        value = num / 1_000;
        // suffix = "K";
      } else {
        return num.toString(); // leave small numbers as-is
      }

      // Show only up to 2 significant digits max
      const formatted =
        value >= 10 ? value.toFixed(0) : value.toFixed(1);

      return `${formatted}`;
    };

    // -----------------------------
    // Y-AXIS (Left)
    // -----------------------------
    const leftAxis = d3.axisLeft(yLeft)
      .ticks(5)
      .tickFormat(formatCompact as any);

    svg.append("g")
      .call(leftAxis)
      .selectAll<SVGTextElement, number>("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-xs md:text-base xl:text-lg font-semibold");

    // -----------------------------
    // Y-AXIS (Right, if dual)
    // -----------------------------
    if (useDualAxis && yRight) {
      const rightAxis = d3.axisRight(yRight)
        .ticks(5)
        .tickFormat(formatCompact as any);

      svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(rightAxis)
        .selectAll<SVGTextElement, number>("text")
        .attr("class", "font-sourcecodepro text-slate-600 text-xs md:text-base xl:text-lg font-semibold");
    }

    // -----------------------------
    // X-AXIS
    // -----------------------------
    const xAxis = d3.axisBottom(x)
      .tickFormat(d3.format("d"))
      .ticks(Math.min(data.length, 10)); // limit to avoid label crowding

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll<SVGTextElement, number>("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-xs md:text-base xl:text-lg font-semibold");

    // -----------------------------
    // Y-AXIS LABEL
    // -----------------------------
    svg.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
      .attr("class", "font-baskervville text-slate-600 text-sm md:text-base/6 xl:text-lg/7 font-normal")
      .text(yAxisLabel);

    // -----------------------------
    // RIGHT Y-AXIS LABEL (optional)
    // -----------------------------
    if (useDualAxis && yAxisRightLabel) {
      svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width + 50},${height / 2})rotate(90)`)
        .attr("class", "font-baskervville text-slate-600 text-sm md:text-base/6 xl:text-lg/7 font-normal")
        .text(yAxisRightLabel);
    }

    // ----------------
    // Grid lines
    // ----------------
    const gridLayer = svg.append("g").attr("class", "grid-layer");

    // Horizontal dashed Y grid lines
    gridLayer.append("g").call(d3.axisLeft(yLeft).tickSize(-width).tickFormat(() => ""))
      .call(g => g.selectAll("line").attr("stroke", "#CBD5E1").attr("stroke-width", 1).attr("stroke-dasharray", "4,4"))
      .call(g => g.select(".domain").remove());

    // Vertical dashed X grid lines
    gridLayer.selectAll("line.vertical").data(years).enter().append("line")
      .attr("class", "vertical")
      .attr("x1", d => x(d)!)
      .attr("x2", d => x(d)!)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("opacity", 0.8);
      
    // ----------------
    // Clip path to constrain zoomed content
    // ----------------
    svg.append("defs")
      .append("clipPath")
      .attr("id", "chart-clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    // Plot layer
    const plotLayer = svg.append("g")
      .attr("class", "plot-layer")
      .attr("clip-path", "url(#chart-clip)");

    // ----------------
    // Lines, dots, hover
    // ----------------
    const hoverLine = svg.append("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("y1", 0)
      .attr("y2", height)
      .attr("opacity", 0);

    const hoverCircle = svg.append("circle")
      .attr("r", 0)
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("opacity", 0);

   series.forEach(({ key, color, axis }) => {
      const yScale = axis === "right" && useDualAxis && yRight ? yRight : yLeft;

      const line = d3.line<MacroLineDatum>()
        .defined(d => typeof d[key] === "number" && Number.isFinite(d[key]))
        .x(d => x(d.year)!)
        .y(d => yScale(d[key] as number))
        .curve(d3.curveMonotoneX);

      const path = plotLayer.append("path") // <-- use plotLayer here
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5)
        .attr("d", line);

      const totalLength = (path.node() as SVGPathElement).getTotalLength();

      // Animate line
      path.attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(DURATION)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Dots
      data.forEach((d, i) => {
        const value = d[key];
        if (value === null || !Number.isFinite(value)) return;

        const dot = plotLayer.append("circle") // <-- use plotLayer here
          .attr("cx", x(d.year)!)
          .attr("cy", yScale(value))
          .attr("r", 0)
          .attr("fill", color)
          .style("cursor", "pointer");

      // Animate dot
      dot.transition().delay((i / (data.length - 1)) * DURATION).duration(300).ease(d3.easeBackOut).attr("r", 4);

      // Hover events (leave as-is, hoverLine/hoverCircle are outside plotLayer)
      let hideTooltipTimeout: ReturnType<typeof setTimeout> | null = null;

      dot
        .on("mouseover", () => {
          if (hideTooltipTimeout) {
            clearTimeout(hideTooltipTimeout);
            hideTooltipTimeout = null;
          }

          hoverLine.transition().duration(150)
            .attr("x1", x(d.year)!)
            .attr("x2", x(d.year)!)
            .attr("opacity", 1);

          hoverCircle.transition().duration(150)
            .attr("cx", x(d.year)!)
            .attr("cy", yScale(value))
            .attr("r", 7)
            .attr("stroke", color)
            .attr("opacity", 1);

          dot.transition().duration(150).attr("r", 5);

          const tooltipRows = series.map(cfg => {
            const v = d[cfg.key];
            return `<div class="flex items-start justify-between gap-0.5 md:gap-2">
                      <div class="flex items-start md:items-center gap-1">
                        <div class="flex items-center gap-1 pt-1 md:pt-0">
                          <span style="width:6px;height:6px;background:${cfg.color};
                                border-radius:50%;display:inline-block;"></span>
                        </div>
                        <div><span class="text-slate-600 font-sourcecodepro text-[10px] md:text-xs">${cfg.label}:</span></div>
                      </div>
                      <span style="color:${cfg.color};" class="text-[10px] md:text-xs font-sourcecodepro">
                        ${typeof v === "number"
                          ? (cfg.valueFormatter?.(Number(v.toFixed(3))) ?? v.toFixed(3))
                          : "N/A"}
                      </span>
                    </div>`;
          }).join("");

          tooltip
            .style("display", "block")
            .html(`
              <div class="flex flex-col gap-0.5 md:gap-1">
                <div class="font-semibold text-slate-600 font-sourcecodepro text-[10px] md:text-xs pb-1 md:pb-2.5 uppercase">
                  Year: ${d.year}
                </div>
                ${tooltipRows}
              </div>`);
        })

        // .on("mousemove", (event) => {
        //   const rect = container.getBoundingClientRect();
        //   tooltip
        //     .style("left", `${event.clientX - rect.left + 15}px`)
        //     .style("top", `${event.clientY - rect.top - 50}px`);
        // })

        .on("mousemove", (event) => {
          const rect = container.getBoundingClientRect();
          const tooltipWidth = tooltipEl.offsetWidth;
          const tooltipHeight = tooltipEl.offsetHeight;

          let xPos = event.clientX - rect.left + 10;
          let yPos = event.clientY - rect.top - tooltipHeight - 10;

          // If tooltip goes beyond the right boundary → flip to the left side
          if (xPos + tooltipWidth > rect.width) {
            xPos = event.clientX - rect.left - tooltipWidth - 10;
          }

          // If tooltip goes above top → push below
          if (yPos < 0) {
            yPos = event.clientY - rect.top + 20;
          }

          tooltip
            .style("left", `${xPos}px`)
            .style("top", `${yPos}px`);
        })

        .on("mouseout", () => {
          if (hideTooltipTimeout) clearTimeout(hideTooltipTimeout);
          hideTooltipTimeout = setTimeout(() => {
            hoverLine.transition().duration(200).attr("opacity", 0);
            hoverCircle.transition().duration(200).attr("r", 0).attr("opacity", 0);
            dot.transition().duration(200).attr("r", 4);
            tooltip.style("display", "none");
          }, 120); // <-- small delay prevents flicker
        });
      });
    });
    
    // ----------------
    // Zoom buttons
    // ----------------
    let currentScale = 1, zoomInCount = 0, zoomOutCount = 0;
    const maxClicks = 2;
    const zoomInBtn = document.getElementById(controlIds.zoomInId)! as HTMLButtonElement;
    const zoomOutBtn = document.getElementById(controlIds.zoomOutId)! as HTMLButtonElement;
    const resetZoomBtn = document.getElementById(controlIds.resetId)! as HTMLButtonElement;

    // Ensure a clip-path is applied so zoomed content stays inside chart
    plotLayer.attr("clip-path", "url(#chart-clip)");

    // Apply the zoom transform
    const applyZoom = () => {
      // Clamp scale so zoom does not go beyond max clicks
      const clampedScale = Math.max(1 / Math.pow(SCALE_STEP, maxClicks), Math.min(currentScale, Math.pow(SCALE_STEP, maxClicks)));
      
      // Compute translation to zoom from center
      const midX = width / 2;
      const transformX = midX - midX * clampedScale;
      
      // Apply transform only to plotLayer (lines & dots)
      plotLayer.transition().duration(300)
        .attr("transform", `translate(${transformX},0) scale(${clampedScale},1)`);

      const applyZoom = () => {
        const clampedScale = Math.max(1 / Math.pow(SCALE_STEP, maxClicks), Math.min(currentScale, Math.pow(SCALE_STEP, maxClicks)));
        const midX = width / 2;
        const transformX = midX - midX * clampedScale;
        plotLayer.transition().duration(300)
          .attr("transform", `translate(${transformX},0) scale(${clampedScale},1)`);

        zoomInBtn.disabled = zoomInCount >= maxClicks;
        zoomOutBtn.disabled = zoomOutCount >= maxClicks;
      };

      // Update button states
      zoomInBtn.disabled = zoomInCount >= maxClicks;
      zoomOutBtn.disabled = zoomOutCount >= maxClicks;
    };

    // Zoom in button
    const onZoomIn = () => {
      if (zoomInCount < maxClicks) {
        currentScale *= SCALE_STEP;
        zoomInCount++;
        zoomOutCount = Math.max(0, zoomOutCount - 1);
        applyZoom();
      }
    };

    // Zoom out button
    const onZoomOut = () => {
      if (zoomOutCount < maxClicks) {
        currentScale /= SCALE_STEP;
        zoomOutCount++;
        zoomInCount = Math.max(0, zoomInCount - 1);
        applyZoom();
      }
    };

    // Reset zoom button
    const onReset = () => {
      currentScale = 1;
      zoomInCount = 0;
      zoomOutCount = 0;
      applyZoom();
    };

    // Attach event listeners
    zoomInBtn.addEventListener("click", onZoomIn);
    zoomOutBtn.addEventListener("click", onZoomOut);
    resetZoomBtn.addEventListener("click", onReset);

    // Cleanup on unmount
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
