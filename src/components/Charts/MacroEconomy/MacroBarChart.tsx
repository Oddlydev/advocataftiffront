"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export type MacroBarDatum = {
  year: number;
} & Record<string, number | null>;

export type MacroSeriesConfig = {
  key: string;
  label: string;
  color: string;
  valueFormatter?: (value: number | null) => string;
  axis?: "left" | "right";
  tooltipUseRawValue?: boolean;
};

export type MacroBarChartProps = {
  datasetUrl?: string | null;
  parseRow: (row: d3.DSVRowString<string>) => MacroBarDatum | null;
  series: MacroSeriesConfig[];
  yAxisLabel: string;
  yAxisRightLabel?: string;
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
};

const MARGIN = { top: 40, right: 40, bottom: 60, left: 70 };
const SCALE_STEP = 1.2;
const DURATION = 2000;

export function MacroBarChart({
  datasetUrl,
  parseRow,
  series,
  yAxisLabel,
  yAxisRightLabel,
  controlIds,
  yMaxPadding = 2,
}: MacroBarChartProps) {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<MacroBarDatum[]>([]);

  // ----------------
  // Load CSV
  // ----------------
  useEffect(() => {
    if (!datasetUrl) return;
    d3.csv(datasetUrl).then((raw) => {
      const parsed = raw
        .map((r) => parseRow(r as d3.DSVRowString<string>))
        .filter(Boolean) as MacroBarDatum[];
      setData(parsed);
    });
  }, [datasetUrl, parseRow]);

  // ----------------
  // Render chart
  // ----------------
  useEffect(() => {
    if (!chartRef.current || !tooltipRef.current || !data.length) return;

    const svgRoot = d3.select(chartRef.current);
    svgRoot.selectAll("*").remove();

    const tooltip = d3
      .select(tooltipRef.current)
      .style("display", "none")
      .style("pointer-events", "none");

    const viewBoxWidth = 1200;
    const viewBoxHeight = 500;
    const width = viewBoxWidth - MARGIN.left - MARGIN.right;
    const height = viewBoxHeight - MARGIN.top - MARGIN.bottom;

    const svg = svgRoot
      .attr("viewBox", `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
      .append("g")
      .attr("transform", `translate(${MARGIN.left},${MARGIN.top})`);

    const years = data.map((d) => d.year);

    // -------- X SCALE (grouped bars)
    const x0 = d3
      .scaleBand<number>()
      .domain(years)
      .range([0, width])
      .padding(0.25);

    const x1 = d3
      .scaleBand<string>()
      .domain(series.map((s) => s.key))
      .range([0, x0.bandwidth()])
      .padding(0.15);

    // -------- Y SCALE
    const allValues: number[] = [];
    data.forEach((d) => {
      series.forEach((s) => {
        if (typeof d[s.key] === "number") allValues.push(d[s.key]!);
      });
    });

    const maxVal = d3.max(allValues) ?? 0;
    const minVal = d3.min(allValues) ?? 0;

    const y = d3
      .scaleLinear()
      .domain([
        Math.min(0, minVal - yMaxPadding),
        Math.max(0, maxVal + yMaxPadding),
      ])
      .range([height, 0]);

    // -------- AXES
    svg
      .append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-xs md:text-base font-semibold");

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x0).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-xs md:text-base font-semibold");

    // -------- GRID + ZERO LINE
    svg
      .append("g")
      .call(d3.axisLeft(y).tickSize(-width).tickFormat(() => ""))
      .call((g) => g.select(".domain").remove())
      .selectAll("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-dasharray", "4,4");

    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "#475569")
      .attr("stroke-dasharray", "4,4");

    // -------- BARS
    const groups = svg
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${x0(d.year)},0)`);

    groups
      .selectAll("rect")
      .data((d) =>
        series.map((s) => ({
          key: s.key,
          value: d[s.key],
          color: s.color,
          label: s.label,
          year: d.year,
        }))
      )
      .enter()
      .append("rect")
      .attr("x", (d) => x1(d.key)!)
      .attr("width", x1.bandwidth())
      .attr("y", y(0))
      .attr("height", 0)
      .attr("fill", (d) => d.color)
      .on("mouseover", (event, d) => {
        tooltip
          .style("display", "block")
          .html(`
            <div class='font-semibold text-slate-600 text-[10px] md:text-xs mb-1'>Year: ${d.year}</div>
            <div class='flex items-center gap-1'>
              <span style='width:6px;height:6px;background:${d.color};border-radius:50%'></span>
              <span class='text-[10px] md:text-xs'>${d.label}:</span>
              <strong class='text-[10px] md:text-xs'>${d.value ?? "N/A"}</strong>
            </div>
          `);
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.offsetX + 12}px`)
          .style("top", `${event.offsetY - 28}px`);
      })
      .on("mouseout", () => tooltip.style("display", "none"))
      .transition()
      .duration(DURATION)
      .attr("y", (d) => (d.value != null ? y(Math.max(0, d.value)) : y(0)))
      .attr("height", (d) =>
        d.value != null ? Math.abs(y(d.value) - y(0)) : 0
      );

    // -------- ZOOM (same behavior)
    let currentScale = 1;
    const zoomInBtn = document.getElementById(controlIds.zoomInId)!;
    const zoomOutBtn = document.getElementById(controlIds.zoomOutId)!;
    const resetBtn = document.getElementById(controlIds.resetId)!;

    const applyZoom = () => {
      const midX = width / 2;
      const tx = midX - midX * currentScale;
      svg
        .transition()
        .duration(300)
        .attr("transform", `translate(${MARGIN.left + tx},${MARGIN.top}) scale(${currentScale},1)`);
    };

    zoomInBtn.onclick = () => {
      currentScale *= SCALE_STEP;
      applyZoom();
    };

    zoomOutBtn.onclick = () => {
      currentScale /= SCALE_STEP;
      applyZoom();
    };

    resetBtn.onclick = () => {
      currentScale = 1;
      applyZoom();
    };
  }, [data, series, yAxisLabel, yAxisRightLabel, controlIds, yMaxPadding]);

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
