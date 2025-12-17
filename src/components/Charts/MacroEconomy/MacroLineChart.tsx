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
  /**
   * When true, the tooltip shows the raw
   * series value instead of the auto-scaled
   * (divided) value used for axis ticks.
   */
  tooltipUseRawValue?: boolean;
};

export type MacroLineChartProps = {
  datasetUrl?: string | null;
  parseRow: (row: d3.DSVRowString<string>) => MacroLineDatum | null;
  series: MacroSeriesConfig[];
  yAxisLabel: string;
  yAxisRightLabel?: string;
  /**
   * When true, use the CSV's first column header for the X‑axis label
   * and the second column header for the (left) Y‑axis label.
   */
  axisLabelsFromCsv?: boolean;
  yAxisLabelColumnIndexes?: {
    left?: number;
    right?: number;
  };
  controlIds: {
    zoomInId: string;
    zoomOutId: string;
    resetId: string;
  };
  yMaxPadding?: number;
  minY?: number;
  initialScale?: number;
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
  axisLabelsFromCsv,
  yAxisLabelColumnIndexes,
  controlIds,
  yMaxPadding = 2,
  minY,
  initialScale = 1,
}: MacroLineChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<MacroLineDatum[]>([]);
  const [axisLabels, setAxisLabels] = useState<{
    x?: string;
    yLeft?: string;
    yRight?: string;
  }>({});

  // ----------------
  // Load CSV data
  // ----------------
  useEffect(() => {
    let isMounted = true;
    async function loadDataset() {
      if (!datasetUrl) {
        setData([]);
        if (axisLabelsFromCsv) {
          setAxisLabels({});
        }
        return;
      }
      try {
        const text = await fetchCsvWithFallback(datasetUrl);
        const cleanedText = text.replace(/\uFEFF/g, "");
        const raw = d3.csvParse(cleanedText);

        const columns = raw.columns ?? [];
        const [firstCol] = columns;

        const leftIndex =
          axisLabelsFromCsv && columns.length > 1
            ? 1
            : (yAxisLabelColumnIndexes?.left ?? undefined);
        const rightIndex = yAxisLabelColumnIndexes?.right ?? undefined;

        const yLeftHeader =
          leftIndex != null && leftIndex >= 0 && leftIndex < columns.length
            ? columns[leftIndex]
            : undefined;
        const yRightHeader =
          rightIndex != null && rightIndex >= 0 && rightIndex < columns.length
            ? columns[rightIndex]
            : undefined;

        if (axisLabelsFromCsv || yAxisLabelColumnIndexes) {
          if (isMounted) {
            setAxisLabels({
              x: axisLabelsFromCsv ? firstCol || undefined : undefined,
              yLeft: yLeftHeader,
              yRight: yRightHeader,
            });
          }
        } else if (isMounted) {
          setAxisLabels({});
        }

        const parsed = raw
          .map((row) => {
            const parsedRow = parseRow(row as d3.DSVRowString<string>);
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
        if (isMounted) {
          setData([]);
          if (axisLabelsFromCsv || yAxisLabelColumnIndexes) {
            setAxisLabels({});
          }
        }
      }
    }
    loadDataset();
    return () => {
      isMounted = false;
    };
  }, [
    datasetUrl,
    parseRow,
    series,
    axisLabelsFromCsv,
    yAxisLabelColumnIndexes,
  ]);

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

    // --- root svg ---
    const root = d3
      .select(container)
      .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`);
    root.selectAll("*").remove();

    // --- zoom group (everything zooms inside this group) ---
    const zoomGroup = root
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);
    const svg = zoomGroup; // keep your naming

    // const svg = d3
    //   .select(container)
    //   .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
    //   .append("g")
    //   .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const years = data.map((d) => d.year);

    // Determine overall magnitude of Y values so we can
    // keep axis label units in sync with compact tick format.
    const allValues: number[] = [];
    data.forEach((d) => {
      series.forEach(({ key }) => {
        const v = d[key];
        if (typeof v === "number" && Number.isFinite(v)) {
          allValues.push(Math.abs(v));
        }
      });
    });

    const maxAbs = allValues.length ? (d3.max(allValues) as number) : 0;
    let scaleLevel: "base" | "thousand" | "million" | "billion" = "base";
    if (maxAbs >= 1000 && maxAbs < 1_000_000) {
      scaleLevel = "thousand";
    } else if (maxAbs >= 1_000_000 && maxAbs < 1_000_000_000) {
      scaleLevel = "million";
    } else if (maxAbs >= 1_000_000_000) {
      scaleLevel = "billion";
    }

    let valueDivisor = 1;
    if (scaleLevel === "thousand") valueDivisor = 1000;
    else if (scaleLevel === "million") valueDivisor = 1_000_000;
    else if (scaleLevel === "billion") valueDivisor = 1_000_000_000;
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
    const yLeft = d3
      .scaleLinear()
      .domain([yLeftMin, yLeftMax])
      .range([height, 0]);

    let yRight: d3.ScaleLinear<number, number> | null = null;
    if (useDualAxis) {
      const [mn, mx] = computeDomain(rightSeries);
      yRight = d3.scaleLinear().domain([mn, mx]).range([height, 0]);
    }

    // FORMATTER
    const formatWithTwoDecimals = (num: number) =>
      Number.isInteger(num) ? num.toString() : num.toFixed(2);

    const formatCompact = (num: number) => {
      const abs = Math.abs(num);
      if (abs < 1000) return formatWithTwoDecimals(num);
      if (abs < 1_000_000) return (num / 1000).toFixed(num >= 10_000 ? 0 : 1);
      if (abs < 1_000_000_000)
        return (num / 1_000_000).toFixed(num >= 10_000_000 ? 0 : 1);
      return (num / 1_000_000_000).toFixed(num >= 10_000_000_000 ? 0 : 1);
    };

    const adjustLabelForScale = (label: string): string => {
      if (scaleLevel !== "thousand") return label;
      let next = label;
      // Convert common "USD mn" patterns to "USD (Bn)" when values are compacted 1000 -> 1.0.
      next = next.replace(/USD\s*\(?\s*mn\)?\.?/i, "USD (Bn)");
      next = next.replace(/\(USD\s*mn\)/i, "(USD Bn)");
      next = next.replace(/\bmn\b\.?/i, "Bn");
      next = next.replace(/\bmillions?\b/i, "Billions");
      return next;
    };

    const resolvedYAxisLabel = adjustLabelForScale(
      axisLabels.yLeft || yAxisLabel
    );
    const resolvedYAxisRightLabel = axisLabels.yRight || yAxisRightLabel;

    // AXES
    svg
      .append("g")
      .call(
        d3
          .axisLeft(yLeft)
          .ticks(5)
          .tickFormat(formatCompact as any)
      )
      .selectAll("text")
      .attr(
        "class",
        "font-sourcecodepro text-slate-600 text-xs md:text-base font-semibold"
      );

    if (useDualAxis && yRight) {
      svg
        .append("g")
        .attr("transform", `translate(${width},0)`)
        .call(
          d3
            .axisRight(yRight)
            .ticks(5)
            .tickFormat(formatCompact as any)
        )
        .selectAll("text")
        .attr(
          "class",
          "font-sourcecodepro text-slate-600 text-xs md:text-base font-semibold"
        );
    }

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(Math.min(data.length, 10))
          .tickFormat(d3.format("d"))
      )
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
        "class",
        "font-baskervville text-slate-600 text-sm md:text-base xl:text-lg font-normal"
      )
      .text(resolvedYAxisLabel);

    if (useDualAxis && yAxisRightLabel) {
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width + 50},${height / 2}) rotate(90)`)
        .attr(
          "class",
          "font-baskervville text-slate-600 text-sm md:text-base xl:text-lg font-normal"
        )
        .text(resolvedYAxisRightLabel ?? "");
    }

    // GRID LINES
    const gridLayer = svg.append("g");

    // dashed grid lines (except zero line)
    gridLayer
      .append("g")
      .call(
        d3
          .axisLeft(yLeft)
          .tickSize(-width)
          .tickFormat(() => "")
      )
      .call((g) =>
        g
          .selectAll("line")
          .attr("stroke", (d) => (d === 0 ? "transparent" : "#CBD5E1"))
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

    const plotLayer = svg.append("g").attr("clip-path", "url(#chart-clip)");

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
      const yScale = axis === "right" && useDualAxis && yRight ? yRight : yLeft;

      const line = d3
        .line<MacroLineDatum>()
        .defined((d) => typeof d[key] === "number")
        .x((d) => x(d.year)!)
        .y((d) => yScale!(d[key] as number))
        .curve(d3.curveLinear);

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
                const rawValue = d[cfg.key];
                const valueForTooltip =
                  typeof rawValue === "number"
                    ? cfg.tooltipUseRawValue
                      ? rawValue
                      : rawValue / valueDivisor
                    : null;
                return `
                  <div class="flex items-start justify-between gap-1">
                    <div class="flex items-center gap-1">
                      <span style="width:6px;height:6px;background:${cfg.color};border-radius:50%;display:inline-block;"></span>
                      <span class="text-slate-600 text-[10px] md:text-xs">${cfg.label}:</span>
                    </div>
                    <span style="color:${cfg.color}" class="text-[10px] md:text-xs">
                      ${
                        typeof valueForTooltip === "number"
                          ? (cfg.valueFormatter?.(valueForTooltip) ??
                            formatWithTwoDecimals(valueForTooltip))
                          : "N/A"
                      }
                    </span>
                  </div>
                `;
              })
              .join("");

            tooltip.style("display", "block").html(`
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

    // =========================
    // ZOOM (buttons + d3.zoom)
    // =========================
    const minScale = Math.min(initialScale, MIN_SCALE);
    const initialTransform = d3.zoomIdentity.scale(initialScale);

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([minScale, MAX_SCALE])
      .translateExtent([
        [0, 0],
        [viewBoxWidth, viewBoxHeight],
      ])
      .extent([
        [0, 0],
        [viewBoxWidth, viewBoxHeight],
      ])
      .on("zoom", (event) => {
        const scale = event.transform.k;
        const horizontalBalance = scale < 1 ? (width - width * scale) / 2 : 0;
        const verticalBalance = scale < 1 ? (height - height * scale) / 2 : 0;

        zoomGroup.attr(
          "transform",
          `translate(${MARGIN.left + horizontalBalance},${MARGIN.top + verticalBalance}) scale(${scale})`
        );
      });

    let zoomInCount = 0;
    let zoomOutCount = 0;
    const MAX_ZOOM_CLICKS = 2;

    // attach zoom to root svg (but disable mouse/touch interactions)
    // buttons will still work because they call zoom programmatically
    root
      .style("touch-action", "none")
      .call(zoom as any)
      .on("wheel.zoom", null)
      .on("mousedown.zoom", null)
      .on("dblclick.zoom", null)
      .on("touchstart.zoom", null)
      .on("touchmove.zoom", null)
      .on("touchend.zoom", null);

    root.call(zoom.transform as any, initialTransform);

    const zoomInSel = d3.select(
      `#${controlIds.zoomInId}`
    ) as unknown as d3.Selection<HTMLButtonElement, unknown, null, undefined>;
    const zoomOutSel = d3.select(
      `#${controlIds.zoomOutId}`
    ) as unknown as d3.Selection<HTMLButtonElement, unknown, null, undefined>;
    const resetSel = d3.select(
      `#${controlIds.resetId}`
    ) as unknown as d3.Selection<HTMLButtonElement, unknown, null, undefined>;

    const setDisabled = (
      sel: d3.Selection<HTMLButtonElement, unknown, null, undefined>,
      disabled: boolean
    ) => {
      if (sel.empty()) return; // safety
      sel.property("disabled", disabled).style("opacity", disabled ? 0.7 : 1);
    };

    // Zoom IN (max 2)
    zoomInSel.on("click.trajectoryZoom", () => {
      if (zoomInCount >= MAX_ZOOM_CLICKS) return;

      zoomInCount++;
      zoomOutCount = Math.max(0, zoomOutCount - 1);

      root
        .transition()
        .duration(200)
        .call(zoom.scaleBy as any, SCALE_STEP);

      setDisabled(zoomInSel, zoomInCount >= MAX_ZOOM_CLICKS);
      setDisabled(zoomOutSel, false); // re-enable opposite
    });

    // Zoom OUT (max 2)
    zoomOutSel.on("click.trajectoryZoom", () => {
      if (zoomOutCount >= MAX_ZOOM_CLICKS) return;

      zoomOutCount++;
      zoomInCount = Math.max(0, zoomInCount - 1);

      root
        .transition()
        .duration(200)
        .call(zoom.scaleBy as any, 1 / SCALE_STEP);

      setDisabled(zoomOutSel, zoomOutCount >= MAX_ZOOM_CLICKS);
      setDisabled(zoomInSel, false); // re-enable opposite
    });

    // Reset (restore zoom + buttons)
    resetSel.on("click.trajectoryZoom", () => {
      zoomInCount = 0;
      zoomOutCount = 0;

      root
        .transition()
        .duration(250)
        .call(zoom.transform as any, initialTransform);

      setDisabled(zoomInSel, false);
      setDisabled(zoomOutSel, false);
    });

    // cleanup
    return () => {
      root.on(".zoom", null); // remove zoom listeners from root
      zoomInSel.on(".trajectoryZoom", null);
      zoomOutSel.on(".trajectoryZoom", null);
      resetSel.on(".trajectoryZoom", null);
    };
  }, [
    data,
    series,
    yAxisLabel,
    yAxisRightLabel,
    controlIds,
    yMaxPadding,
    minY,
    axisLabels,
    initialScale,
  ]);

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
