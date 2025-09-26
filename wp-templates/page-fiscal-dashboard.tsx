import React, { useEffect, useRef, useState } from "react";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";

import * as d3 from "d3";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";

const SankeySection = () => {
  const sankeyRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // ---------------------------
    // Sankey chart code
    // ---------------------------    
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
        { name: "Reserves" }
      ],
      links: [
        { source: 0, target: 2, value: 20 },
        { source: 1, target: 3, value: 36 },
        { source: 2, target: 4, value: 27 },
        { source: 2, target: 5, value: 18 },
        { source: 4, target: 6, value: 10 },
        { source: 6, target: 7, value: 16 },
        { source: 6, target: 10, value: 3 },
        { source: 6, target: 11, value: 2 },
        { source: 6, target: 10, value: 3 },
        { source: 4, target: 7, value: 10 },
        { source: 5, target: 8, value: 6 },
        { source: 5, target: 9, value: 9 }
      ]
    };

    const nodeValues = {
      "Revenue": "₨3.2T",
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
      "Reserves": "₨250B"
    };

    const svg = d3.select(sankeyRef.current);
    const width = 650;
    const height = 550;
    const margin = { top: 35, right: 20, bottom: 20, left: 20 };

    const sankeyGenerator = d3Sankey()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

    const { nodes, links } = sankeyGenerator({
      nodes: sankeyData.nodes.map(d => Object.assign({}, d)),
      links: sankeyData.links.map(d => Object.assign({}, d))
    });

    svg.selectAll("*").remove();

    const color = d3.scaleOrdinal()
      .domain(nodes.map(d => d.name))
      .range([
        "#4B0619", "#4B0619", "#A90E38", "#7A0A28",
        "#A90E38", "#F16087", "#F16087", "#1C0209",
        "#F58FAA", "#ED3A6A", "#EB1A52", "#ED3A6A"
      ]);

    // Draw links
    svg.append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(links)
      .enter()
      .append("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", d => color(d.source.name))
      .attr("stroke-width", d => Math.max(1, d.width))
      .attr("stroke-opacity", 0.3);

    // Draw nodes
    svg.append("g")
      .selectAll("rect")
      .data(nodes)
      .enter()
      .append("rect")
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("height", d => d.y1 - d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("fill", d => color(d.name))
      .attr("stroke", "none");

    // Add labels to the right
    svg.append("g")
      .selectAll(".value-label")
      .data(nodes)
      .enter()
      .append("text")
      .attr("class", "value-label")
      .attr("x", d => d.x1 + 5)
      .attr("y", d => (d.y0 + d.y1) / 2 - 6)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "middle")
      .style("font-size", "10px")
      .style("font", "Source Code Pro")
      .style("fill", "#1A1A1A")
      .each(function(d) {
        d3.select(this)
          .append("tspan")
          .attr("x", d.x1 + 5)
          .attr("dy", "0em")
          .style("font-weight", "600")
          .text(d.name);

        d3.select(this)
          .append("tspan")
          .attr("x", d.x1 + 5)
          .attr("dy", "1.2em")
          .style("font-weight", "400")
          .style("fill", "#475569")
          .text(nodeValues[d.name]);
      });

    // Responsive
    const handleResize = () => {
      const container = sankeyRef.current.parentNode;
      const width = container.clientWidth;
      const height = container.clientHeight;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return null; // Or your intended JSX for SankeySection
}

export default function PageFiscalDashboard() {
  // Define industry and year, possibly from query params or set to default values
  const industry = ""; // Set to appropriate value or fetch from context/router
  const year = ""; // Set to appropriate value or fetch from context/router
  const pathname = ""; // Set to appropriate value or fetch from context/router

  return (
    <>
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
              paragraph="
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum consequat mi. Maecenas congue enim non dui iaculis condimentum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur lobortis, mi et facilisis euismod, lacus ligula suscipit nibh, vitae blandit dui dolor vitae sapien. Fusce iaculis urna ligula, nec aliquet nisi consectetur euismod. Nunc dapibus dignissim nulla at tincidunt."
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
                            {["Government Expenditure","Government Revenue","Government Debt"].map((label, i) => (
                                <div key={i} className="flex flex-wrap xl:justify-center gap-4">
                                    <a href="#" className="text-sm/tight xl:text-base/6 py-2 px-3 text-slate-800 border border-gray-400 bg-white rounded-lg font-semibold font-sourcecodepro uppercase hover:bg-brand-2-50 hover:text-slate-800  focus:bg-brand-2-950 focus:text-brand-white focus:border-brand-2-950 w-full text-center xl:w-auto transition-colors duration-200">
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
                            onClick={e => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                            className="default-dropdown-btn flex items-center gap-1"
                            aria-expanded={dropdownOpen}
                        >
                            Year
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 20 20" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd"
                                d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.7071 7.29289L9.99999 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68341 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                                fill="currentColor" />
                            </svg>
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black/50 z-30">
                            <div className="py-1">
                                {["2024","2025","2026"].map((year,i) => (
                                <a key={i} href="#" className="default-dropdown-item block px-4 py-2.5 text-slate-600 hover:bg-slate-100">
                                    {year}
                                </a>
                                ))}
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
                    </div>

                    {/* Sankey Chart */}
                    <div className="relative w-full pb-20 pt-6 min-h-auto md:min-h-[550px] xl:min-h-[550px]" style={{paddingBottom: "66.67%"}}>
                    <div id="sankeyChartContainer" className="absolute inset-0">
                        <svg ref={sankeyRef} className="w-full h-full" viewBox="0 0 650 550" preserveAspectRatio="xMinYMin meet"></svg>
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
                        {[
                            { title: "Sri Lanka - Food Security and Nutrition Indicators", desc: "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second." },
                            { title: "TESLA Stock Data 2024", desc: "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second." },
                            { title: "Effective crisis management leads Sri Lanka’s tourism.", desc: "By comparison, just before the nation’s independence nearly 250 years ago, the 13 colonies had about 2.5 million residents. The projected world population on January 1, 2025, is 8,092,034,511, up 71,178,087 (0.89%) from New Year’s Day 2024. During January 2025, 4.2 births and 2.0 deaths are expected worldwide every second." }
                        ].map((card,i) => (
                            <div key={i}>
                            <a href="#" className="card card-type-6">
                                <div className="card-body">
                                <div className="flex-1">
                                    <div>
                                    <h2>{card.title}</h2>
                                    <p>{card.desc}</p>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <div className="date-info">
                                    <div className="pdf-btn">
                                        <svg className="pdf-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M9.04039 17.5885H14.9719C15.1626 17.5885 15.3264 17.5201 15.4634 17.3832C15.6006 17.2464 15.6691 17.0817 15.6691 16.889C15.6691 16.6963 15.6006 16.5316 15.4634 16.3947C15.3264 16.2579 15.1626 16.1895 14.9719 16.1895H9.04039C8.84606 16.1895 8.68131 16.2582 8.54614 16.3957C8.41081 16.5332 8.34314 16.6977 8.34314 16.889C8.34314 17.0802 8.41081 17.2445 8.54614 17.382C8.68131 17.5197 8.84606 17.5885 9.04039 17.5885ZM9.04039 13.6287H14.9719C15.1626 13.6287 15.3264 13.5603 15.4634 13.4235C15.6006 13.2867 15.6691 13.1219 15.6691 12.9292C15.6691 12.7367 15.6006 12.572 15.4634 12.435C15.3264 12.2982 15.1626 12.2297 14.9719 12.2297H9.04039C8.84606 12.2297 8.68131 12.2986 8.54614 12.4362C8.41081 12.5737 8.34314 12.7381 8.34314 12.9292C8.34314 13.1206 8.41081 13.285 8.54614 13.4225C8.68131 13.56 8.84606 13.6287 9.04039 13.6287ZM6.38639 21.298C5.91372 21.298 5.51147 21.1321 5.17964 20.8002C4.84764 20.4682 4.68164 20.066 4.68164 19.5935V4.4065C4.68164 3.934 4.84764 3.53175 5.17964 3.19975C5.51147 2.86791 5.91439 2.702 6.38839 2.702H13.5421C13.7688 2.702 13.9869 2.74541 14.1964 2.83224C14.4057 2.91908 14.5909 3.04116 14.7519 3.1985L18.8084 7.24875C18.9694 7.40925 19.0946 7.595 19.1839 7.806C19.2734 8.01716 19.3181 8.23691 19.3181 8.46525V19.5912C19.3181 20.0652 19.1521 20.4682 18.8201 20.8002C18.4883 21.1321 18.0861 21.298 17.6134 21.298H6.38639ZM13.5604 7.60375V4.10099H6.38839C6.31139 4.10099 6.24089 4.133 6.17689 4.197C6.11272 4.26116 6.08064 4.33174 6.08064 4.40874V19.5912C6.08064 19.6682 6.11272 19.7388 6.17689 19.803C6.24089 19.867 6.31139 19.899 6.38839 19.899H17.6114C17.6884 19.899 17.7589 19.867 17.8229 19.803C17.8871 19.7388 17.9191 19.6682 17.9191 19.5912V8.4595H14.4164C14.1772 8.4595 13.9748 8.37666 13.8091 8.211C13.6433 8.04533 13.5604 7.84291 13.5604 7.60375Z" fill="currentColor"/>
                                        </svg>
                                        <span>csv,json,xml,excel</span>
                                    </div>
                                    <time>2024-08-18</time>
                                    </div>
                                </div>
                                </div>
                            </a>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>

                </div>
            </div>
    </>
  );