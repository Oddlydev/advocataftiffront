"use client";

import React, { useEffect, useRef, useState } from "react";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import "tiny-slider/dist/tiny-slider.css";
import * as d3 from "d3";
import MacroEconomySliderNav from "@/src/components/MacroEconomyNav";

type InflationDatum = {
  year: number;
  all: number;
  food: number;
  nonFood: number;
};

const inflationKeys = ["all", "food", "nonFood"] as const;
type InflationKey = (typeof inflationKeys)[number];

// ---- Chart Component ----
const AverageAnnualInflationChart = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data: InflationDatum[] = [
      { year: 2015, all: 3.1, food: 4.5, nonFood: 2.2 },
      { year: 2016, all: 4.0, food: 5.2, nonFood: 3.0 },
      { year: 2017, all: 6.6, food: 7.1, nonFood: 6.2 },
      { year: 2018, all: 4.3, food: 5.0, nonFood: 3.7 },
      { year: 2019, all: 3.5, food: 4.0, nonFood: 3.1 },
      { year: 2020, all: 4.6, food: 6.3, nonFood: 3.0 },
      { year: 2021, all: 6.0, food: 7.5, nonFood: 4.8 },
      { year: 2022, all: 10.2, food: 13.5, nonFood: 8.1 },
      { year: 2023, all: 8.0, food: 9.2, nonFood: 7.1 },
      { year: 2024, all: 5.5, food: 6.4, nonFood: 4.9 },
    ];

    const colors: Record<InflationKey, string> = {
      all: "#4B0619",
      food: "#EB1A52",
      nonFood: "#F58FAA",
    };

    const container = chartRef.current;
    const tooltipEl = tooltipRef.current;

    if (!container || !tooltipEl) return;

    const tooltip = d3.select(tooltipEl);

    // Clear SVG
    d3.select(container).selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 70 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const svg = d3
      .select(container)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X & Y scales
    const x = d3
      .scalePoint<number>()
      .domain(data.map((d) => d.year))
      .range([0, width])
      .padding(0.5);

    const yMax = d3.max(data, (d) => Math.max(d.all, d.food, d.nonFood)) ?? 0;
    const y = d3
      .scaleLinear()
      .domain([0, yMax + 2])
      .range([height, 0]);

    // Axes
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

    // Y-axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal")
      .text("Inflation Rate (%)");

    // Horizontal grid lines
    const gridGroup = svg
      .append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(y).tickSize(-width).tickFormat(() => "")
      );

    gridGroup
      .selectAll("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");

    gridGroup.select(".domain").remove();

    // Line generator
    const lineGen = (key: InflationKey) =>
      d3
        .line<InflationDatum>()
        .x((d) => x(d.year)!)
        .y((d) => y(d[key]))
        .curve(d3.curveMonotoneX);

    const duration = 2000;

    // Draw & animate lines + dots together
    inflationKeys.forEach((key) => {
      const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colors[key])
        .attr("stroke-width", 2.5)
        .attr("d", lineGen(key));

      const totalLength = (path.node() as SVGPathElement).getTotalLength();

      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Animate dots along the line
      data.forEach((d, i) => {
        const dot = svg
          .append("circle")
          .attr("cx", x(d.year)!)
          .attr("cy", y(d[key]))
          .attr("r", 0)
          .attr("fill", colors[key]);

        const pointPos = (i / (data.length - 1)) * totalLength;

        dot.transition()
          .delay((pointPos / totalLength) * duration)
          .duration(300)
          .ease(d3.easeBackOut)
          .attr("r", 4);

        // Tooltip & hover highlight
        dot
          .on("mouseover", () => {
            tooltip
              .style("display", "block")
              .style("opacity", 0)
              .transition()
              .duration(200)
              .style("opacity", 1);

            tooltip.html(`
              <div class="flex flex-col gap-1">
                <div class="font-bold text-slate-800">Year: ${d.year}</div>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1">
                    <span style="width:10px;height:10px;background:${colors.all};border-radius:50%;display:inline-block;"></span>
                    <span class="text-slate-600">All Items:</span>
                  </div>
                  <span style="color:${colors.all}; font-weight:600;">${d.all}%</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1">
                    <span style="width:10px;height:10px;background:${colors.food};border-radius:50%;display:inline-block;"></span>
                    <span class="text-slate-600">Food & Non-Alcoholic Beverages:</span>
                  </div>
                  <span style="color:${colors.food}; font-weight:600;">${d.food}%</span>
                </div>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1">
                    <span style="width:10px;height:10px;background:${colors.nonFood};border-radius:50%;display:inline-block;"></span>
                    <span class="text-slate-600">Non-Food Items:</span>
                  </div>
                  <span style="color:${colors.nonFood}; font-weight:600;">${d.nonFood}%</span>
                </div>
              </div>
            `);

            svg
              .append("circle")
              .attr("class", `hover-circle-${key}-${d.year}`)
              .attr("cx", x(d.year)!)
              .attr("cy", y(d[key]))
              .attr("r", 8)
              .attr("stroke", colors[key])
              .attr("stroke-width", 2)
              .attr("fill", "none");
          })
          .on("mousemove", (event) => {
            const rect = container.getBoundingClientRect();
            tooltip
              .style("left", event.clientX - rect.left + 15 + "px")
              .style("top", event.clientY - rect.top - 50 + "px");
          })
          .on("mouseout", () => {
            tooltip.transition().duration(200).style("opacity", 0).on("end", () => {
              tooltip.style("display", "none");
            });
            svg.select(`.hover-circle-${key}-${d.year}`).remove();
          });
      });
    });

    // -------------------
    // Zoom buttons
    // -------------------
    let currentScale = 1;
    let zoomInCount = 0;
    let zoomOutCount = 0;
    const maxClicks = 2;

    const zoomInBtn = document.querySelector<HTMLButtonElement>("#zoomInBtn")!;
    const zoomOutBtn = document.querySelector<HTMLButtonElement>("#zoomOutBtn")!;
    const resetZoomBtn = document.querySelector<HTMLButtonElement>("#resetZoomBtn")!;

    const applyZoom = () => {
      svg.attr("transform", `translate(${margin.left},${margin.top}) scale(${currentScale})`);
      zoomInBtn.disabled = zoomInCount >= maxClicks;
      zoomOutBtn.disabled = zoomOutCount >= maxClicks;
    };

    const onZoomIn = () => {
      if (zoomInCount < maxClicks) {
        currentScale *= 1.2;
        zoomInCount++;
        applyZoom();
      }
    };
    const onZoomOut = () => {
      if (zoomOutCount < maxClicks) {
        currentScale /= 1.2;
        zoomOutCount++;
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
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[300px] xl:h-[500px]">
      <svg ref={chartRef} className="w-full h-full"></svg>
      <div
        ref={tooltipRef}
        className="absolute hidden bg-white text-sm text-slate-800 py-2 px-3 rounded shadow-lg pointer-events-none"
        style={{ border: "1px solid #E2E8F0" }}
      ></div>
    </div>
  );
};

// ---- Page Component ----
export default function PageInflationDashboard(): JSX.Element {
  const [industry, setIndustry] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [pathname, setPathname] = useState<string>("");

  return (
    <main>
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={[
              { label: "Macro Economy", href: "#" },
              { label: "Government Fiscal Operations", href: "#" },
              {
                label: "Transparency in government Institutions",
                href: (() => {
                  const params = new URLSearchParams();
                  if (industry) params.set("industry", industry);
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/transparency-dashboard?${qs}`
                    : "/transparency-dashboard";
                })(),
              },
              {
                label: "State Owned Enterprises",
                href: (() => {
                  const params = new URLSearchParams();
                  if (industry) params.set("industry", industry);
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/state-owned-dashboard?${qs}`
                    : "/state-owned-dashboard";
                })(),
              },
            ]}
            activePath={pathname}
          />
        </div>
      </div>

      {/* Hero Section */}
      <HeroWhite
        title="Macro Economy Dashboards"
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "Macro Economy" },
        ]}
      />

      {/* Filter Slider */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-3.5 md:pb-7">
          <MacroEconomySliderNav />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white pt-3.5 md:pt-5 xl:pt-6">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-10 md:pb-20">
          <div className="border border-gray-200 rounded-xl py-6 px-5">
            <div className="mb-10">
              <h4 className="text-2xl/snug font-montserrat font-bold text-slate-950 mb-1.5">
                Average Annual Inflation
              </h4>
              <p className="text-base/6 font-baskervville font-normal text-slate-950">
                Percentage change in prices for consumer goods and services
                (2015-2024)
              </p>
            </div>

            {/* Chart Section */}
            <div className="relative">
              {/* <!-- Zoom Buttons --> */}
              <div className="absolute top-2 md:top-0 right-4 md:right-10 flex gap-2 z-10">
                <button
                  id="zoomInBtn"
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M7.33333 13.0002C10.2789 13.0002 12.6667 10.6123 12.6667 7.66683C12.6667 4.72131 10.2789 2.3335 7.33333 2.3335C4.38781 2.3335 2 4.72131 2 7.66683C2 10.6123 4.38781 13.0002 7.33333 13.0002Z"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.9996 14.3335L11.0996 11.4335"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M7.33398 5.66681V9.66681"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.33398 7.66681H9.33398"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  id="zoomOutBtn"
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M7.33333 13.0002C10.2789 13.0002 12.6667 10.6123 12.6667 7.66683C12.6667 4.72131 10.2789 2.3335 7.33333 2.3335C4.38781 2.3335 2 4.72131 2 7.66683C2 10.6123 4.38781 13.0002 7.33333 13.0002Z"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.9996 14.3335L11.0996 11.4335"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M5.33398 7.66681H9.33398"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
                <button
                  id="resetZoomBtn"
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M2 8.3335C2 9.52018 2.35189 10.6802 3.01118 11.6669C3.67047 12.6536 4.60754 13.4226 5.7039 13.8768C6.80026 14.3309 8.00666 14.4497 9.17054 14.2182C10.3344 13.9867 11.4035 13.4153 12.2426 12.5761C13.0818 11.737 13.6532 10.6679 13.8847 9.50404C14.1162 8.34015 13.9974 7.13375 13.5433 6.0374C13.0892 4.94104 12.3201 4.00397 11.3334 3.34468C10.3467 2.68539 9.18669 2.3335 8 2.3335C6.32263 2.33981 4.71265 2.99431 3.50667 4.16016L2 5.66683"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2 2.3335V5.66683H5.33333"
                      stroke="#374151"
                      stroke-width="1.33333"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <AverageAnnualInflationChart />
            </div>

            {/* Legend & Data Source */}
            <div className="mt-5">
              <div className="grid md:flex items-center justify-center gap-2 md:gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-1-900 inset-shadow-brand-1-950 rounded-full inline-block"></span>
                  <span className="text-base/6 font-normal font-baskervville text-slate-600">
                    All Items
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-1-500 rounded-full inline-block"></span>
                  <span className="text-base/6 font-normal font-baskervville text-slate-600">
                    Food & Non-Alcoholic Beverages
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-1-200 rounded-full inline-block"></span>
                  <span className="text-base/6 font-normal font-baskervville text-slate-600">
                    Non - Food Items
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="bg-gray-50 rounded-lg px-6 py-3.5">
                <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>
                      Data Source: Department of Census and Statistics, Sri
                      Lanka
                    </p>
                  </div>
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>Average Annual Inflation 2015 - 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Line Chart */}

      {/* Information Section */}
      <div className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="border border-gray-200 bg-gray-50 rounded-xl">
            <div className="px-6 py-7">
              <div className="mb-10">
                <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
                  Understanding Inflation Metrics
                </h5>
                <p className="text-lg font-baskervville font-normal text-slate-950">
                  Advanced Economic Analysis Framework
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
                    Definition
                  </h3>
                  <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
                    <p className="text-slate-800 text-base font-baskervville font-normal">
                      The Average Annual Inflation measures the percentage
                      change in prices for a typical basket of consumer goods
                      and services purchased by households nationwide, using the
                      National Consumer Price Index (NCPI).
                    </p>
                  </div>
                </div>
                <div className="mt-6 md:mt-0">
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
                    Statistical Concept and Methodology
                  </h3>
                  <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
                    <p className="text-slate-800 text-base font-baskervville font-normal">
                      The NCPI calculates inflation rates based on the price
                      changes observed in a standard consumer basket,
                      categorized mainly into Food & Non-Alcoholic Beverages and
                      Non-Food items.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Information Section */}
    </main>
  );
}
