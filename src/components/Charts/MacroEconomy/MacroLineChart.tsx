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
};

export type MacroLineChartProps = {
  datasetUrl?: string | null;
  parseRow: (row: d3.DSVRowString<string>) => MacroLineDatum | null;
  series: MacroSeriesConfig[];
  yAxisLabel: string;
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

function coerceNumber(value: string | number | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
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
  controlIds,
  yMaxPadding = 2,
  minY = 0,
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
        const response = await fetch(datasetUrl, { cache: "no-cache" });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const text = await response.text();
        const parsed = d3
          .csvParse(text, (row) => {
            const parsedRow = parseRow(row);
            if (!parsedRow) return null;
            const sanitized: MacroLineDatum = { year: parsedRow.year };
            series.forEach(({ key }) => {
              sanitized[key] = coerceNumber(parsedRow[key]) ?? null;
            });
            return sanitized;
          })
          .filter((item): item is MacroLineDatum => item !== null);

        if (!parsed.length) {
          throw new Error("Dataset did not contain any rows");
        }

        if (isMounted) {
          setData(parsed);
        }
      } catch (error) {
        console.error(
          `[MacroLineChart] Failed to load dataset ${datasetUrl} ::`,
          error
        );
        if (isMounted) {
          setData([]);
        }
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

    if (!container || !tooltipEl || !data.length) {
      return;
    }

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
        `0 0 ${width + MARGIN.left + MARGIN.right} ${
          height + MARGIN.top + MARGIN.bottom
        }`
      )
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const years = data.map((d) => d.year);
    const x = d3
      .scalePoint<number>()
      .domain(years)
      .range([0, width])
      .padding(0.5);

    const maxValue = d3.max(data, (d) =>
      d3.max(series, ({ key }) => d[key] ?? Number.NEGATIVE_INFINITY)
    );
    const safeMax = Number.isFinite(maxValue ?? NaN)
      ? (maxValue as number)
      : 0;

    const y = d3
      .scaleLinear()
      .domain([minY, safeMax + yMaxPadding])
      .range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal")
      .text(yAxisLabel);

    const gridGroup = svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => "")
      );

    gridGroup
      .selectAll("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");

    gridGroup.select(".domain").remove();

    const formatValue = (
      value: number | null,
      formatter?: (v: number | null) => string
    ) => {
      if (formatter) return formatter(value);
      if (value === null || Number.isNaN(value)) return "N/A";
      return `${value}`;
    };

    series.forEach(({ key, color }) => {
      const line = d3
        .line<MacroLineDatum>()
        .defined((d) => {
          const value = d[key];
          return typeof value === "number" && Number.isFinite(value);
        })
        .x((d) => x(d.year)!)
        .y((d) => y((d[key] as number) ?? 0))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2.5)
        .attr("d", line);
    });

    data.forEach((datum) => {
      series.forEach((serie) => {
        const value = datum[serie.key];
        if (value === null || !Number.isFinite(value)) {
          return;
        }

        svg
          .append("circle")
          .attr("cx", x(datum.year)!)
          .attr("cy", y(value))
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
                    <span style="color:${cfg.color}; font-weight: 600;">${formatValue(
                      typeof v === "number" ? Number(v.toFixed(2)) : v,
                      cfg.valueFormatter
                    )}</span>
                  </div>`;
              })
              .join("");

            tooltip
              .style("display", "block")
              .html(`
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
  }, [controlIds, data, series, yAxisLabel, yMaxPadding, minY]);

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

export type MacroChartWrapperProps = Pick<MacroLineChartProps, "datasetUrl" | "controlIds">;
