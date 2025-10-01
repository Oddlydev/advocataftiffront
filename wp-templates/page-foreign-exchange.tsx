"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import "tiny-slider/dist/tiny-slider.css";
import * as d3 from "d3";

// ---- Chart Component ----
const ForeignExchangeChart: React.FC = () => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const data = [
      { year: 2010, BOP: 0 },
      { year: 2011, BOP: 1 },
      { year: 2012, BOP: 3.1 },
      { year: 2013, BOP: 13.0 },
      { year: 2014, BOP: 5.1 },
      { year: 2015, BOP: 8.6 },
      { year: 2016, BOP: 4.0 },
      { year: 2017, BOP: 6.6 },
      { year: 2018, BOP: 4.3 },
      { year: 2019, BOP: 3.5 },
      { year: 2020, BOP: 4.6 },
      { year: 2021, BOP: 6.0 },
      { year: 2022, BOP: 10.2 },
      { year: 2023, BOP: 8.0 },
      { year: 2024, BOP: 5.5 },
    ];

    const color = "#CF1244"; // single line color

    const container = chartRef.current;
    const tooltipSel = d3.select(tooltipRef.current);

    if (!container) return;

    // Clear any existing svg content
    d3.select(container).selectAll("*").remove();

    const margin = { top: 40, right: 40, bottom: 60, left: 70 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = container.clientHeight - margin.top - margin.bottom;

    const g = d3
      .select(container)
      .attr(
        "viewBox",
        `0 0 ${width + margin.left + margin.right} ${
          height + margin.top + margin.bottom
        }`
      )
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X & Y scales
    const x = d3
      .scalePoint<number>()
      .domain(data.map((d) => d.year))
      .range([0, width])
      .padding(0.5);

    const yMax = d3.max(data, (d) => d.BOP) ?? 0;
    const y = d3
      .scaleLinear()
      .domain([0, yMax + 2])
      .range([height, 0]);

    // X-axis
    g.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    // Y-axis
    g.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .selectAll("text")
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal");

    // Y-axis label
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${-50},${height / 2})rotate(-90)`)
      .attr("class", "font-sourcecodepro text-slate-600 text-lg font-normal")
      .text("Balance of Payments (USD Mn.)");

    // Horizontal grid lines
    const grid = g
      .append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .tickSize(-width)
          .tickFormat(() => "")
      );

    grid
      .selectAll("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");
    grid.selectAll("path").remove();

    // Line generator
    const lineGen = d3
      .line<{ year: number; BOP: number }>()
      .x((d) => x(d.year) as number)
      .y((d) => y(d.BOP))
      .curve(d3.curveMonotoneX);

    // Draw line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2.5)
      .attr("d", lineGen);

    // Dots & Tooltip
    data.forEach((d) => {
      g.append("circle")
        .attr("cx", x(d.year) as number)
        .attr("cy", y(d.BOP))
        .attr("r", 4)
        .attr("fill", color)
        .on("mouseover", () => {
          tooltipSel.style("display", "block").html(`
              <div class="flex flex-col gap-1">
                <div class="font-bold text-slate-800">Year: ${d.year}</div>
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-1">
                    <span style="width:10px;height:10px;background:${color};border-radius:50%;display:inline-block;"></span>
                    <span class="text-slate-600">BOP:</span>
                  </div>
                  <span style="color:${color}; font-weight: 600;">${d.BOP}</span>
                </div>
              </div>
            `);
        })
        .on("mousemove", (event: MouseEvent) => {
          const rect = container.getBoundingClientRect();
          tooltipSel
            .style("left", event.clientX - rect.left + 15 + "px")
            .style("top", event.clientY - rect.top - 50 + "px");
        })
        .on("mouseout", () => tooltipSel.style("display", "none"));
    });

    // -------------------
    // Zoom buttons
    // -------------------
    let currentScale = 1;
    const scaleStep = 1.2;

    const applyZoom = () => {
      g.attr(
        "transform",
        `translate(${margin.left},${margin.top}) scale(${currentScale})`
      );
    };

    const zoomInBtn = document.querySelector<HTMLButtonElement>("#zoomInBtn");
    const zoomOutBtn = document.querySelector<HTMLButtonElement>("#zoomOutBtn");
    const resetZoomBtn =
      document.querySelector<HTMLButtonElement>("#resetZoomBtn");

    const onZoomIn = () => {
      currentScale *= scaleStep;
      applyZoom();
    };
    const onZoomOut = () => {
      currentScale /= scaleStep;
      applyZoom();
    };
    const onReset = () => {
      currentScale = 1;
      applyZoom();
    };

    zoomInBtn?.addEventListener("click", onZoomIn);
    zoomOutBtn?.addEventListener("click", onZoomOut);
    resetZoomBtn?.addEventListener("click", onReset);

    // Cleanup
    return () => {
      zoomInBtn?.removeEventListener("click", onZoomIn);
      zoomOutBtn?.removeEventListener("click", onZoomOut);
      resetZoomBtn?.removeEventListener("click", onReset);
      d3.select(container).selectAll("*").remove();
    };
  }, []);

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
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const sliderRef = useRef<any>(null);

  useEffect(() => {
    if (trackRef.current && typeof window !== "undefined") {
      (async () => {
        const mod = await import("tiny-slider/src/tiny-slider");
        sliderRef.current = mod.tns({
          container: trackRef.current!,
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

        const prevBtn = document.querySelector<HTMLButtonElement>(
          ".macro-filter-prev-arrow"
        );
        const nextBtn = document.querySelector<HTMLButtonElement>(
          ".macro-filter-next-arrow"
        );

        const goPrev = () => sliderRef.current?.goTo("prev");
        const goNext = () => sliderRef.current?.goTo("next");

        prevBtn?.addEventListener("click", goPrev);
        nextBtn?.addEventListener("click", goNext);

        // Cleanup listeners when unmounting
        return () => {
          prevBtn?.removeEventListener("click", goPrev);
          nextBtn?.removeEventListener("click", goNext);
          try {
            sliderRef.current?.destroy();
          } catch {
            /* noop */
          }
        };
      })();
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
            strokeMiterlimit={10}
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
              className={`slider-btn w-full text-sm xl:text-base px-3 py-2 rounded-lg uppercase text-slate-800 border border-gray-400 bg-white font-semibold font-sourcecodepro text-center transition-colors duration-200 ${
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
            strokeMiterlimit={10}
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
export default function PageForeignExchange(): JSX.Element {
  const [industry] = useState<string | null>(null);
  const [year] = useState<string | null>(null);
  const pathname = usePathname() ?? "";

  return (
    <main>
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={[
              {
                label: "Macro Economy",
                href: "/the-macro-economy-of-sri-lanka",
              },
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
          <MacroFilterSlider />
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white pt-3.5 md:pt-5 xl:pt-6">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-10 md:pb-20">
          <div className="border border-gray-200 rounded-xl py-6 px-5">
            <div className="mb-10">
              <h4 className="text-2xl/snug font-montserrat font-bold text-slate-950 mb-1.5">
                Foreign Exchange Inflows and Outflows
              </h4>
              <p className="text-base/6 font-baskervville font-normal text-slate-950">
                Balance of Payment (BOP) 2010 - 2024 (USD Millions)
              </p>
            </div>

            {/* Chart Section */}
            <div className="relative">
              {/* Zoom Buttons */}
              <div className="absolute top-2 md:top-0 right-4 md:right-10 flex gap-2 z-10">
                <button
                  id="zoomInBtn"
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                  type="button"
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
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.9996 14.3335L11.0996 11.4335"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.33398 5.66681V9.66681"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33398 7.66681H9.33398"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  id="zoomOutBtn"
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                  type="button"
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
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.9996 14.3335L11.0996 11.4335"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33398 7.66681H9.33398"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  id="resetZoomBtn"
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                  type="button"
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
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 2.3335V5.66683H5.33333"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <ForeignExchangeChart />
            </div>

            {/* Legend & Data Source */}
            <div className="mt-10">
              <div className="bg-gray-50 rounded-lg px-6 py-3.5">
                <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>Data Source: Central Bank of Sri Lanka</p>
                  </div>
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>Sri Lanka&apos;s Balance of Payment (BOP) 2010 - 2024</p>
                  </div>
                </div>
              </div>
            </div>
            {/* End Legend & Data Source */}
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
                  Understanding Foreign Exchange Metrics
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
                      Forex Inflows and Outflows represent the annual net
                      foreign exchange movement (inflows minus outflows)
                      captured under the Balance of Payments (BOP), measured in
                      millions of US dollars (USD). This indicator shows the net
                      impact of international transactions on the country&apos;s
                      foreign exchange reserves. Tracking Forex Inflows and
                      Outflows is essential to evaluate the country&apos;s
                      external financial health, sustainability of its foreign
                      currency reserves, exchange rate stability, and overall
                      economic stability. It aids policymakers in
                      decision-making regarding exchange rate management,
                      external borrowing, and investment policies.
                    </p>
                  </div>
                </div>
                <div className="mt-6 md:mt-0">
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
                    Statistical Concept and Methodology
                  </h3>
                  <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
                    <p className="text-slate-800 text-base font-baskervville font-normal">
                      The Balance of Payments (BOP) summarizes economic
                      transactions between residents and non-residents over a
                      specific period, including trade in goods and services,
                      primary and secondary income, and financial flows. Forex
                      inflows reflect the receipt of foreign currency through
                      exports, foreign investments, loans, and remittances,
                      whereas outflows represent payments made for imports, loan
                      repayments, repatriation of profits, and outward
                      investments.
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
