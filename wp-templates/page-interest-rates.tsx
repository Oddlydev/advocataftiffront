"use client";

import React, { useEffect, useRef, useState } from "react";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import "tiny-slider/dist/tiny-slider.css";
import * as d3 from "d3";

type InterestRateDatum = {
  year: number;
  AWNFDR: number;
  AWNDR: number;
  AWNLR: number;
  AWPLR: number;
};

const rateKeys = ["AWNFDR", "AWNDR", "AWNLR", "AWPLR"] as const;
type RateKey = (typeof rateKeys)[number];

// ---- Chart Component ----
const AverageAnnualInflationChart = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data: InterestRateDatum[] = [
      { year: 2010, AWNFDR: 3.1, AWNDR: 4.5, AWNLR: 2.2, AWPLR: 1.5 },
      { year: 2011, AWNFDR: 4.0, AWNDR: 5.2, AWNLR: 3.0, AWPLR: 2.0 },
      { year: 2012, AWNFDR: 6.6, AWNDR: 7.1, AWNLR: 6.2, AWPLR: 3.5 },
      { year: 2013, AWNFDR: 4.3, AWNDR: 5.0, AWNLR: 3.7, AWPLR: 2.8 },
      { year: 2014, AWNFDR: 3.5, AWNDR: 4.0, AWNLR: 3.1, AWPLR: 2.1 },
      { year: 2015, AWNFDR: 3.1, AWNDR: 4.5, AWNLR: 2.2, AWPLR: 1.5 },
      { year: 2016, AWNFDR: 4.0, AWNDR: 5.2, AWNLR: 3.0, AWPLR: 2.0 },
      { year: 2017, AWNFDR: 6.6, AWNDR: 7.1, AWNLR: 6.2, AWPLR: 3.5 },
      { year: 2018, AWNFDR: 4.3, AWNDR: 5.0, AWNLR: 3.7, AWPLR: 2.8 },
      { year: 2019, AWNFDR: 3.5, AWNDR: 4.0, AWNLR: 3.1, AWPLR: 2.1 },
      { year: 2020, AWNFDR: 4.6, AWNDR: 6.3, AWNLR: 3.0, AWPLR: 2.4 },
      { year: 2021, AWNFDR: 6.0, AWNDR: 7.5, AWNLR: 4.8, AWPLR: 3.0 },
      { year: 2022, AWNFDR: 10.2, AWNDR: 13.5, AWNLR: 8.1, AWPLR: 4.5 },
      { year: 2023, AWNFDR: 8.0, AWNDR: 9.2, AWNLR: 7.1, AWPLR: 5.0 },
      { year: 2024, AWNFDR: 5.5, AWNDR: 6.4, AWNLR: 4.9, AWPLR: 3.8 },
    ];

    const colors: Record<RateKey, string> = {
      AWNFDR: "#F58FAA",
      AWNDR: "#1C0209",
      AWNLR: "#A90E38",
      AWPLR: "#ea1a52",
    };

    const container = chartRef.current;
    const tooltipEl = tooltipRef.current;

    if (!container || !tooltipEl) return;

    const tooltip = d3
      .select(tooltipEl)
      .style("display", "none")
      .style("border-radius", "6px")
      .style("border", "1px solid #E2E8F0")
      .style("background", "#FFF")
      .style(
        "box-shadow",
        "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)"
      )
      .style("padding", "14px");

    // Clear svg
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

    // X scale
    const x = d3
      .scalePoint<number>()
      .domain(data.map((d) => d.year))
      .range([0, width])
      .padding(0.5);

    // Y scale (automatic)
    const yMax =
      d3.max(data, (d) => Math.max(d.AWNFDR, d.AWNDR, d.AWNLR, d.AWPLR)) ?? 0;
    const y = d3
      .scaleLinear()
      .domain([0, yMax * 1.1])
      .range([height, 0]);

    // X-axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    // Y-axis
    svg
      .append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    // Y-axis label
    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal")
      .text("Interest Rate (%)");

    // Horizontal grid lines
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

    // Animation
    const duration = 2500;

    rateKeys.forEach((key) => {
      const line = d3
        .line<InterestRateDatum>()
        .x((d) => x(d.year)!)
        .y((d) => y(d[key]))
        .curve(d3.curveMonotoneX);

      const path = svg
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", colors[key])
        .attr("stroke-width", 2.5)
        .attr("d", line);

      const totalLength = (path.node() as SVGPathElement).getTotalLength();

      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(duration)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

      // Animate dots in sync with line
      data.forEach((d, j) => {
        const dot = svg
          .append("circle")
          .attr("cx", x(d.year)!)
          .attr("cy", y(d[key]))
          .attr("r", 0)
          .attr("fill", colors[key]);

        const pointPos = (j / (data.length - 1)) * totalLength;

        dot
          .transition()
          .delay((pointPos / totalLength) * duration)
          .duration(300)
          .ease(d3.easeBackOut)
          .attr("r", 4);

        // Tooltip logic
        dot
          .on("mouseover", () => {
            tooltip
              .style("display", "block")
              .style("opacity", "0")
              .transition()
              .duration(200)
              .style("opacity", "1");

            tooltip.html(`
              <div class="flex flex-col gap-1">
                <div class="font-semibold text-slate-600 font-sourcecodepro text-xs">Year:  ${d.year}</div>
                ${rateKeys
                  .map(
                    (rk) => `
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1">
                      <div class="flex items-center gap-1"><span style="width:6px;height:6px;background:${colors[rk]};border-radius:50%;display:inline-block;"></span></div>
                      <span class="text-slate-600 font-sourcecodepro font-normal text-xs">${rk}:</span>
                    </div>
                    <span style="color:${colors[rk]};" class="text-xs font-sourcecodepro font-normal">${d[rk]}%</span>
                  </div>`
                  )
                  .join("")}
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
            tooltip
              .transition()
              .duration(200)
              .style("opacity", "0")
              .on("end", () => tooltip.style("display", "none"));
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
    const zoomOutBtn =
      document.querySelector<HTMLButtonElement>("#zoomOutBtn")!;
    const resetZoomBtn =
      document.querySelector<HTMLButtonElement>("#resetZoomBtn")!;

    const applyZoom = () => {
      svg.attr(
        "transform",
        `translate(${margin.left},${margin.top}) scale(${currentScale})`
      );
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

type MacroFilterSliderProps = {
  items?: string[];
  initialActiveIndex?: number;
  onChangeActive?: (label: string, index: number) => void;
  className?: string;
};

const DEFAULT_ITEMS = [
  "Inflation",
  "Foreign Exchange",
  "Foreign Reserves",
  "National Debt",
  "Unemployment",
  "GDP Growth",
  "Interest Rates",
];

export function MacroFilterSlider({
  items = DEFAULT_ITEMS,
  initialActiveIndex = 0,
  onChangeActive,
  className = "",
}: MacroFilterSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const sliderRef = useRef<any>(null);

  useEffect(() => {
    if (trackRef.current && typeof window !== "undefined") {
      // @ts-ignore
      const { tns } = require("tiny-slider/src/tiny-slider");
      sliderRef.current = tns({
        container: trackRef.current,
        slideBy: 1,
        autoplay: false,
        controls: false,
        mouseDrag: true,
        nav: false,
        autoplayButtonOutput: false,
        gutter: 10,
        loop: false,
        responsive: {
          320: { items: 2 },
          768: { items: 3 },
          1024: { items: 5 },
        },
      });

      const prevBtn = document.querySelector(".macro-filter-prev-arrow");
      const nextBtn = document.querySelector(".macro-filter-next-arrow");
      prevBtn?.addEventListener("click", () => sliderRef.current.goTo("prev"));
      nextBtn?.addEventListener("click", () => sliderRef.current.goTo("next"));
    }
  }, []);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    onChangeActive?.(items[index], index);
  };

  return (
    <div className={`macro-filter-slider w-full relative ${className}`}>
      {/* Prev button */}
      <button
        type="button"
        aria-label="Previous"
        className="macro-filter-prev-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 pl-0 pr-2 xl:pl-0 xl:pr-3.5 bg-gradient-to-l from-[#F3F4F6] via-white to-white text-brand-1-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.26 15.53L9.74 12L13.26 8.47"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Slider track */}
      <div ref={trackRef} className="w-full flex gap-2">
        {items.map((label, index) => (
          <div key={`${label}-${index}`} className="slider-item">
            <button
              className={`slider-btn w-full text-sm xl:text-base px-3 py-2 rounded-lg uppercase text-slate-800 border border-gray-400 bg-white font-semibold font-sourcecodepro text-center transition-colors duration-200
                  ${
                    index === activeIndex
                      ? "text-slate-50 hover:text-slate-800 hover:bg-brand-1-50 hover:border focus:bg-brand-1-950 focus:text-brand-white focus:border-brand-2-950"
                      : "hover:bg-brand-2-50 hover:text-slate-800 focus:bg-brand-1-950 focus:text-brand-white focus:border-brand-2-950"
                  }`}
              onClick={() => handleSelect(index)}
            >
              {label}
            </button>
          </div>
        ))}
      </div>

      {/* Next button */}
      <button
        type="button"
        aria-label="Next"
        className="macro-filter-next-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 pr-0 pl-2 xl:pr-0 xl:pl-3.5 bg-gradient-to-r from-white via-white to-[#F3F4F6] text-brand-1-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.74 15.53L14.26 12L10.74 8.47"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

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
                    ? `/transparency-in-government-institutions?${qs}`
                    : "/transparency-in-government-institutions";
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
                    ? `/state-owned-enterprises?${qs}`
                    : "/state-owned-enterprises";
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
          <MacroFilterSlider />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white pt-3.5 md:pt-5 xl:pt-6">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-10 md:pb-20">
          <div className="border border-gray-200 rounded-xl py-6 px-5">
            <div className="mb-10">
              <h4 className="text-2xl/snug font-montserrat font-bold text-slate-950 mb-1.5">
                Annual Average Interest Rates (Lending and Deposit)
              </h4>
              <p className="text-base/6 font-baskervville font-normal text-slate-950">
                AWNFDR, AWNDR, AWNLR, AWPLR (2010-2024)
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
                  <span className="w-1.5 h-1.5 bg-brand-1-200 rounded-full inline-block"></span>
                  <span className="text-base/6 font-normal font-baskervville text-slate-600">
                    AWNFDR
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-1-950 rounded-full inline-block"></span>
                  <span className="text-base/6 font-normal font-baskervville text-slate-600">
                    AWNDR
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-1-700 rounded-full inline-block"></span>
                  <span className="text-base/6 font-normal font-baskervville text-slate-600">
                    AWNLR
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-1-500 rounded-full inline-block"></span>
                  <span className="text-base/6 font-normal font-baskervville text-slate-600">
                    AWPLR
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <div className="bg-gray-50 rounded-lg px-6 py-3.5">
                <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>Data Source: Central Bank of Sri Lanka</p>
                  </div>
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>Annual Average Interest Rates 2010 - 2024</p>
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
                  Understanding Interest Rates Metrics
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
                    <div className="text-slate-800 text-base">
                      <h6 className="font-sourcecodepro font-medium">
                        Average Weighted New Fixed Deposit Rates:
                      </h6>
                      <p className="font-baskervville font-normal">
                        The Average Weighted New Fixed Deposit Rate (AWNFDR) is
                        calculated by the Central Bank monthly, based on
                        interest rates pertaining to all new interest bearing
                        rupee time deposits mobilised by LCBs during a
                        particular month.
                      </p>
                    </div>
                    <div className="text-slate-800 text-base">
                      <h6 className="font-sourcecodepro font-medium">
                        Average Weighted New Deposit Rates :
                      </h6>
                      <p className="font-baskervville font-normal">
                        The Average Weighted New Deposit Rate (AWNDR) is
                        calculated by the Central Bank monthly, based on
                        interest rates pertaining to all new interest bearing
                        rupee deposits mobilised by LCBs during a particular
                        month.
                      </p>
                    </div>
                    <div className="text-slate-800 text-base">
                      <h6 className="font-sourcecodepro font-medium">
                        Average Weighted New Lending Rates :
                      </h6>
                      <p className="font-baskervville font-normal">
                        The Average Weighted New Lending Rate (AWNLR) is
                        calculated by the Central Bank monthly, based on
                        interest rates pertaining to all new rupee loans and
                        advances extended by LCBs during a particular month.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 md:mt-0">
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
                    Statistical Concept and Methodology
                  </h3>
                  <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
                    <p className="text-slate-800 text-base font-baskervville font-normal">
                      The Central Bank of Sri Lanka calculates weighted average
                      interest rates. These averages are derived from the
                      interest rates offered by commercial banks, weighted by
                      the volume of deposits (for deposit rates) and the volume
                      of loans (for lending rates).
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
