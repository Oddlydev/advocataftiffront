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
  /** Which axis this series belongs to. Defaults to "left". */
  axis?: "left" | "right";
  formatInMillions?: boolean; // ✅ new flag
};

export type MacroLineChartProps = {
  datasetUrl?: string | null;
  parseRow: (row: d3.DSVRowString<string>) => MacroLineDatum | null;
  series: MacroSeriesConfig[];
  /** Left Y-axis label (always required) */
  yAxisLabel: string;
  /** Optional: provide to enable a right Y-axis */
  yAxisRightLabel?: string;
  controlIds: {
    zoomInId: string;
    zoomOutId: string;
    resetId: string;
  };
  yMaxPadding?: number;
  /** Optional: force a minimum Y for the left axis (default auto) */
  minY?: number;
};

const MARGIN = { top: 40, right: 40, bottom: 60, left: 70 };
const SCALE_STEP = 1.2;
const MIN_SCALE = 1;
const MAX_SCALE = 5;
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
  minY, // left axis only
}: MacroLineChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [data, setData] = useState<MacroLineDatum[]>([]);

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

    const tooltip = d3.select(tooltipEl);
    d3.select(container).selectAll("*").remove();

    const width = Math.max(
      container.clientWidth - MARGIN.left - MARGIN.right,
      320
    );
    const height = Math.max(
      container.clientHeight - MARGIN.top - MARGIN.bottom,
      240
    );

    const svg = d3
      .select(container)
      .attr(
        "viewBox",
        `0 0 ${width + MARGIN.left + MARGIN.right} ${height + MARGIN.top + MARGIN.bottom}`
      )
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    // X scale
    const years = data.map((d) => d.year);
    const x = d3
      .scalePoint<number>()
      .domain(years)
      .range([0, width])
      .padding(0.5);

    // Split series across axes
    const leftSeries = series.filter((s) => (s.axis ?? "left") === "left");
    const rightSeries = series.filter((s) => (s.axis ?? "left") === "right");
    const useDualAxis = Boolean(yAxisRightLabel && rightSeries.length);

    function computeDomain(
      targetSeries: MacroSeriesConfig[],
      forcedMin?: number
    ) {
      const maxValue = d3.max(data, (d) =>
        d3.max(targetSeries, ({ key }) => d[key] ?? Number.NEGATIVE_INFINITY)
      );
      const minValue = d3.min(data, (d) =>
        d3.min(targetSeries, ({ key }) => d[key] ?? Number.POSITIVE_INFINITY)
      );

      const safeMax = Number.isFinite(maxValue ?? NaN)
        ? (maxValue as number)
        : 0;
      const safeMin = Number.isFinite(minValue ?? NaN)
        ? (minValue as number)
        : 0;

      const upperPadding = Math.max(yMaxPadding, Math.abs(safeMax) * 0.05);
      const lowerPadding = Math.max(yMaxPadding, Math.abs(safeMin) * 0.05);

      let domainMin =
        typeof forcedMin === "number"
          ? Math.min(forcedMin, safeMin - lowerPadding)
          : safeMin - lowerPadding;

      let domainMax = safeMax + upperPadding;

      // ✅ Ensure positive-only series don’t dip below zero
      if (safeMin >= 0 && domainMin < 0) {
        domainMin = 0;
      }

      if (domainMax <= domainMin) {
        domainMax =
          domainMin + Math.max(upperPadding, Math.abs(domainMin) * 0.1, 1);
      }

      return [domainMin, domainMax] as const;
    }

    const [yLeftMin, yLeftMax] = computeDomain(
      leftSeries.length ? leftSeries : series,
      minY
    );
    const yLeft = d3
      .scaleLinear()
      .domain([yLeftMin, yLeftMax])
      .range([height, 0]);

    let yRight: d3.ScaleLinear<number, number> | null = null;
    if (useDualAxis) {
      const [yRightMin, yRightMax] = computeDomain(rightSeries);
      yRight = d3
        .scaleLinear()
        .domain([yRightMin, yRightMax])
        .range([height, 0]);
    }

    // X axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    // Left Y axis
    svg
      .append("g")
      .call(
        d3
          .axisLeft(yLeft)
          .ticks(5)
          .tickFormat((d) => {
            const needsMillions = leftSeries.some((s) => s.formatInMillions);
            return needsMillions
              ? d3.format(",")(Number(d) / 1_000_000) // ✅ divide in millions
              : d3.format(",")(Number(d)); // normal formatting
          })
      )
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    // Right Y axis (optional)
    if (useDualAxis && yRight) {
      svg
        .append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yRight).ticks(5))
        .selectAll("text")
        .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("transform", `translate(${width + 50},${height / 2})rotate(90)`)
        .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal")
        .text(yAxisRightLabel!);
    }

    // Left Y label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal")
      .text(
        leftSeries.some((s) => s.formatInMillions)
          ? `${yAxisLabel} (Mn)`
          : yAxisLabel
      );

    // Grid (from left axis)
    const gridGroup = svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(yLeft)
          .tickSize(-width)
          .tickFormat(() => "")
      );
    gridGroup
      .selectAll("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    gridGroup.select(".domain").remove();

    // Lines
    series.forEach(({ key, color, axis }) => {
      const yScale = axis === "right" && useDualAxis && yRight ? yRight : yLeft;

      const line = d3
        .line<MacroLineDatum>()
        .defined((d) => {
          const value = d[key];
          return typeof value === "number" && Number.isFinite(value);
        })
        .x((d) => x(d.year)!)
        .y((d) => yScale((d[key] as number) ?? 0))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5)
        .attr("d", line);
    });

    // Tooltip dots
    data.forEach((datum) => {
      series.forEach((serie) => {
        const value = datum[serie.key];
        if (value === null || !Number.isFinite(value)) return;

        const yScale =
          serie.axis === "right" && useDualAxis && yRight ? yRight : yLeft;

        svg
          .append("circle")
          .attr("cx", x(datum.year)!)
          .attr("cy", yScale(value))
          .attr("r", 4)
          .attr("fill", serie.color)
          .on("mouseover", () => {
            const tooltipRows = series
              .map((cfg) => {
                const v = datum[cfg.key];
                return `
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1">
                      <span style="width:10px;height:10px;background:${cfg.color};border-radius:50%;display:inline-block;"></span>
                      <span class="text-slate-600">${cfg.label}:</span>
                    </div>
                    <span style="color:${cfg.color}; font-weight: 600;">
                      ${
                        typeof v === "number"
                          ? (cfg.valueFormatter?.(Number(v.toFixed(3))) ??
                            v.toFixed(3))
                          : "N/A"
                      }
                    </span>
                  </div>`;
              })
              .join("");

            tooltip.style("display", "block").html(`
                <div class="flex flex-col gap-1">
                  <div class="font-bold text-slate-800">Year: ${datum.year}</div>
                  ${tooltipRows}
                </div>
              `);
          })
          .on("mousemove", (event) => {
            const rect = container.getBoundingClientRect();
            tooltip
              .style("left", `${event.clientX - rect.left + 15}px`)
              .style("top", `${event.clientY - rect.top - 50}px`);
          })
          .on("mouseout", () => tooltip.style("display", "none"));
      });
    });

    // Zoom controls
    let currentScale = 1;
    const applyZoom = () => {
      svg.attr(
        "transform",
        `translate(${MARGIN.left},${MARGIN.top}) scale(${currentScale})`
      );
    };
    const onZoomIn = () => {
      currentScale = Math.min(MAX_SCALE, currentScale * SCALE_STEP);
      applyZoom();
    };
    const onZoomOut = () => {
      currentScale = Math.max(MIN_SCALE, currentScale / SCALE_STEP);
      applyZoom();
    };
    const onReset = () => {
      currentScale = 1;
      applyZoom();
    };

    const zoomInBtn = document.getElementById(controlIds.zoomInId);
    const zoomOutBtn = document.getElementById(controlIds.zoomOutId);
    const resetBtn = document.getElementById(controlIds.resetId);
    zoomInBtn?.addEventListener("click", onZoomIn);
    zoomOutBtn?.addEventListener("click", onZoomOut);
    resetBtn?.addEventListener("click", onReset);

    return () => {
      zoomInBtn?.removeEventListener("click", onZoomIn);
      zoomOutBtn?.removeEventListener("click", onZoomOut);
      resetBtn?.removeEventListener("click", onReset);
      d3.select(container).selectAll("*").remove();
    };
  }, [
    controlIds,
    data,
    series,
    yAxisLabel,
    yAxisRightLabel,
    yMaxPadding,
    minY,
  ]);

  return (
    <div className="relative w-full h-[300px] md:h-[300px] xl:h-[500px]">
      <svg ref={chartRef} className="w-full h-full" />
      <div
        ref={tooltipRef}
        className="absolute hidden bg-white text-sm text-slate-800 py-2 px-3 rounded shadow-lg pointer-events-none"
        style={{ border: "1px solid #E2E8F0" }}
      />
    </div>
  );
}

export type MacroChartWrapperProps = Pick<
  MacroLineChartProps,
  "datasetUrl" | "controlIds"
>;
