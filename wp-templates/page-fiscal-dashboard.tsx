"use client";

import React, { useEffect, useRef, useState } from "react";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";

import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import CardType7 from "@/src/components/Cards/CardType7";
import CardType6 from "@/src/components/Cards/CardType6";
import DefaultDropdown from "@/src/components/Dropdowns/DefaultDropdown";
import { usePathname } from "next/navigation";

export default function PageFiscalDashboard() {
  const sankeyRef = useRef<SVGSVGElement | null>(null);
  const [year, setYear] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const pathname = usePathname();

useEffect(() => {
  if (!sankeyRef.current) return;

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

  const color = d3
    .scaleOrdinal<string>()
    .domain(sankeyData.nodes.map((d) => d.name))
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

  function renderChart() {
    const container = sankeyRef.current?.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;

    const margin = {
      top: 35,
      right: isMobile ? 120 : isTablet ? 150 : 200, // enough space for labels
      bottom: 20,
      left: 10,
    };

    svg.selectAll("*").remove();

    const sankeyGenerator = d3Sankey<NodeDatum, LinkDatum>()
      .nodeWidth(15)
      .nodePadding(14)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    const graph = sankeyGenerator({
      nodes: sankeyData.nodes.map((d) => ({ ...d })),
      links: sankeyData.links.map((d) => ({ ...d })),
    });

    // Draw links
    svg
      .append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(graph.links)
      .enter()
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d) => {
        const src = d.source as (typeof graph.nodes)[number];
        return color(src.name);
      })
      .attr("stroke-width", (d) => Math.max(1, d.width ?? 1))
      .attr("stroke-opacity", 0.35);

    // Draw nodes
    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(graph.nodes)
      .enter()
      .append("g");

    nodeGroup
      .append("rect")
      .attr("x", (d) => d.x0!)
      .attr("y", (d) => d.y0!)
      .attr("height", (d) => Math.max(1, d.y1! - d.y0!))
      .attr("width", (d) => Math.max(1, d.x1! - d.x0!))
      .attr("fill", (d) => color(d.name))
      .attr("stroke", "none");

    // Add right-side labels
    const fontSize = isMobile ? 7 : isTablet ? 10 : 12;
    nodeGroup
      .append("text")
      .attr("x", (d) => d.x1! + 8) // always right side
      .attr("y", (d) => (d.y0! + d.y1!) / 2)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .style("font-size", `${fontSize}px`)
      .style("font-weight", "600")
      .style("font-family", "Source Code Pro, monospace")
      .style("fill", "#1A1A1A")
      .text((d) => d.name)
      .append("tspan")
      .attr("x", (d) => d.x1! + 8)
      .attr("dy", "1.2em")
      .style("font-weight", "400")
      .style("fill", "#475569")
      .text((d) => nodeValues[d.name] ?? "");
  }

  renderChart();
  window.addEventListener("resize", renderChart);
  return () => window.removeEventListener("resize", renderChart);
}, []);

  // Dropdown year options
  const yearOptions = [
    { slug: "2024", name: "2024" },
    { slug: "2025", name: "2025" },
    { slug: "2026", name: "2026" },
  ];

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
                      className="text-sm/tight xl:text-base/6 py-2 px-3 text-slate-800 border border-gray-400 bg-white rounded-lg font-semibold font-sourcecodepro uppercase hover:bg-brand-2-50 hover:text-slate-800 focus:bg-brand-2-950 focus:text-brand-white focus:border-brand-2-950 w-full text-center xl:w-auto transition-colors duration-200"
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
              <DefaultDropdown
                idKey="two"
                label={
                  year
                    ? (yearOptions.find((y) => y.slug === year)?.name ?? "Year")
                    : "Year"
                }
                items={yearOptions.map((y) => ({
                  label: y.name,
                  onClick: () => setYear(y.slug),
                }))}
                align="right"
                open={openId === "two"}
                onOpenChange={(v: boolean) => setOpenId(v ? "two" : null)}
              />
            </div>
          </div>

          {/* Sankey Chart */}
          <div className="relative w-full">
            <div
              id="sankeyChartContainer"
              className="relative w-full h-[500px] sm:h-[600px] md:h-[700px] xl:h-[500px] overflow-visible"
            >
              <svg
                ref={sankeyRef}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="xMinYMin meet"
              ></svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card Section */}
      <div className="bg-pink-100 py-12 md:py-16 xl:py-20">
            <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
              {/* Title */}
              <div className="max-w-2xl text-left">
                <span className="mb-2 text-sm/8 md:text-base/6 font-medium font-sourcecodepro text-slate-900 uppercase">Advocata ai suggestions</span>
                <h2 className="text-2xl md:text-3xl leading-snug xl:text-4xl text-slate-900 font-montserrat font-bold mb-8">Related datasets</h2>
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
    </main>
  );
}
