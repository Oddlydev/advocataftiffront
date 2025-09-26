"use client";

import React, { useEffect, useRef, useState } from "react";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";

import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import CardType7 from "@/src/components/Cards/CardType7";
import CardType6 from "@/src/components/Cards/CardType6";

export default function PageFiscalDashboard() {
  const sankeyRef = useRef<SVGSVGElement | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!sankeyRef.current) return;

    // ---- Strong types for d3-sankey (prevents SankeyNodeMinimal<{}, {}> issues)
    type NodeDatum = { name: string };
    type LinkDatum = { source: number; target: number; value: number };

    const sankeyData = {
      nodes: [
        { name: "Revenue" },
        { name: "Recurrent Expenditure" },
        { name: "Net Revenue" },
        { name: "Capital Expenditure" },
        { name: "Available Budget" },
        { name: "Ministry Allocations" },
        { name: "Budget Balance" },
        { name: "Interest Payments" },
        { name: "Infrastructure & Development" },
        { name: "General Administration" },
        { name: "Budget Surplus" },
        { name: "Reserves" },
      ] as NodeDatum[],
      links: [
        { source: 0, target: 2, value: 20 },
        { source: 1, target: 3, value: 36 },
        { source: 2, target: 4, value: 27 },
        { source: 2, target: 5, value: 18 },
        { source: 4, target: 6, value: 10 },
        { source: 6, target: 7, value: 16 },
        { source: 6, target: 10, value: 3 },
        { source: 6, target: 11, value: 2 },
        // (kept your data/content; duplicate link left as-is if intentional)
        { source: 4, target: 7, value: 10 },
        { source: 5, target: 8, value: 6 },
        { source: 5, target: 9, value: 9 },
      ] as LinkDatum[],
    };

    const nodeValues: Record<string, string> = {
      Revenue: "₨3.2T",
      "Recurrent Expenditure": "₨2.8T",
      "Net Revenue": "₨400B",
      "Capital Expenditure": "₨750B",
      "Available Budget": "₨1.9T",
      "Ministry Allocations": "₨850B",
      "Budget Balance": "₨1.05T",
      "Interest Payments": "₨150B",
      "Infrastructure & Development": "₨420B",
      "General Administration": "₨280B",
      "Budget Surplus": "₨200B",
      Reserves: "₨250B",
    };

    const svg = d3.select(sankeyRef.current);
    const width = 650;
    const height = 550;
    const margin = { top: 35, right: 20, bottom: 20, left: 20 };

    svg.selectAll("*").remove();

    // IMPORTANT: add generics so nodes have .name and computed x0/x1/y0/y1
    const sankeyGenerator = d3Sankey<NodeDatum, LinkDatum>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    const graph = sankeyGenerator({
      nodes: sankeyData.nodes.map((d) => ({ ...d })), // fresh copies
      links: sankeyData.links.map((d) => ({ ...d })),
    });

    const color = d3
      .scaleOrdinal<string>()
      .domain(graph.nodes.map((d) => d.name))
      .range([
        "#4B0619",
        "#4B0619",
        "#A90E38",
        "#7A0A28",
        "#A90E38",
        "#F16087",
        "#F16087",
        "#1C0209",
        "#F58FAA",
        "#ED3A6A",
        "#EB1A52",
        "#ED3A6A",
      ]);

    // Links
    svg
      .append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d) => {
        // d.source is a node after layout; assert and read its name safely
        const src = d.source as (typeof graph.nodes)[number];
        return color(src.name);
      })
      .attr("stroke-width", (d) => Math.max(1, d.width ?? 1)) // ensure number (no undefined)
      .attr("stroke-opacity", 0.3);

    // Nodes
    svg
      .append("g")
      .selectAll("rect")
      .data(graph.nodes)
      .enter()
      .append("rect")
      .attr("x", (d) => d.x0!) // computed by layout; non-null assertion
      .attr("y", (d) => d.y0!)
      .attr("height", (d) => Math.max(1, d.y1! - d.y0!)) // avoid undefined
      .attr("width", (d) => Math.max(1, d.x1! - d.x0!))
      .attr("fill", (d) => color(d.name))
      .attr("stroke", "none");

    // Labels
    const labels = svg
      .append("g")
      .selectAll(".value-label")
      .data(graph.nodes)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", (d) => d.x1! + 5)
      .attr("y", (d) => (d.y0! + d.y1!) / 2 - 6)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .style("font-size", "10px")
      .style("font", "Source Code Pro")
      .style("fill", "#1A1A1A");

    labels
      .append("tspan")
      .attr("x", (d) => d.x1! + 5)
      .attr("dy", "0em")
      .style("font-weight", "600")
      .text((d) => d.name);

    labels
      .append("tspan")
      .attr("x", (d) => d.x1! + 5)
      .attr("dy", "1.2em")
      .style("font-weight", "400")
      .style("fill", "#475569")
      .text((d) => nodeValues[d.name] ?? "");

    // Responsive viewBox update (kept your behavior)
    const handleResize = () => {
      const container = sankeyRef.current?.parentElement;
      const cw = container?.clientWidth ?? width;
      const ch = container?.clientHeight ?? height;
      svg.attr("viewBox", `0 0 ${cw} ${ch}`);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------------------- PAGE MARKUP (unchanged styles) ----------------------------
  const industry = "";
  const year = "";
  const pathname = "";

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

      {/* Hero */}
      <HeroWhite
        title="Government Fiscal Operations"
        paragraph={` 
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum consequat mi. Maecenas congue enim non dui iaculis condimentum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur lobortis, mi et facilisis euismod, lacus ligula suscipit nibh, vitae blandit dui dolor vitae sapien. Fusce iaculis urna ligula, nec aliquet nisi consectetur euismod. Nunc dapibus dignissim nulla at tincidunt.`}
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "Government Fiscal Operations" },
        ]}
      />

      {/* Sankey Section */}
      <div className="bg-white py-3.5 md:py-5 xl:pt-6 xl:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {/* Chip-box & Dropdown-Button */}
          <div className="lg:flex gap-2 items-center justify-between pb-16">
            {/* Chip-box */}
            <div className="relative w-full xl:w-2/3">
              <div className="grid xl:grid-cols-4 md:flex xl:items-center gap-2.5 md:gap-1.5">
                {[
                  "Government Expenditure",
                  "Government Revenue",
                  "Government Debt",
                ].map((label, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap xl:justify-center gap-4"
                  >
                    <a
                      href="#"
                      className="text-sm/tight xl:text-base/6 py-2 px-3 text-slate-800 border border-gray-400 bg-white rounded-lg font-semibold font-sourcecodepro uppercase hover:bg-brand-2-50 hover:text-slate-800  focus:bg-brand-2-950 focus:text-brand-white focus:border-brand-2-950 w-full text-center xl:w-auto transition-colors duration-200"
                    >
                      {label}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Dropdown */}
            <div className="grid md:flex gap-3 items-center xl:justify-end w-full lg:w-1/3 mt-4 xl:mt-0">
              <span className="text-slate-800 font-medium text-lg/7 font-sourcecodepro md:flex md:justify-items-end mt-3 md:mt-0">
                Filter by :
              </span>
              <div className="default-dropdown-btn-wapper relative inline-block text-left">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen((o) => !o);
                  }}
                  className="default-dropdown-btn flex items-center gap-1"
                  aria-expanded={dropdownOpen}
                >
                  Year
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.7071 7.29289L9.99999 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68341 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black/50 z-30">
                    <div className="py-1">
                      {["2024", "2025", "2026"].map((y, i) => (
                        <a
                          key={i}
                          href="#"
                          className="default-dropdown-item block px-4 py-2.5 text-slate-600 hover:bg-slate-100"
                        >
                          {y}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sankey Chart */}
          <div
            className="relative w-full pb-20 pt-6 min-h-auto md:min-h-[550px] xl:min-h-[550px]"
            style={{ paddingBottom: "66.67%" }}
          >
            <div id="sankeyChartContainer" className="absolute inset-0">
              <svg
                ref={sankeyRef}
                className="w-full h-full"
                viewBox="0 0 650 550"
                preserveAspectRatio="xMinYMin meet"
              ></svg>
            </div>
          </div>

          {/* Card Section */}
          <div className="bg-pink-100 py-12 md:py-16 xl:py-20">
            <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
              {/* Title */}
              <div className="max-w-2xl text-left">
                <span className="page-sub-title">Advocata ai suggestions</span>
                <h2 className="inner-page-title">Related datasets</h2>
              </div>

              {/* Cards */}
              <div className="mt-11 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <CardType6
                  title={"Sri Lanka - Food Security and Nutrition Indicators"}
                  excerpt={
                    "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second."
                  }
                  fileUrl={"#"}
                />
                <CardType6
                  title={
                    "Effective crisis management leads Sri Lanka’s tourism."
                  }
                  excerpt={
                    "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second."
                  }
                  fileUrl={"#"}
                />
                <CardType6
                  title={"TESLA Stock Data 2024"}
                  excerpt={
                    "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second."
                  }
                  fileUrl={"#"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
