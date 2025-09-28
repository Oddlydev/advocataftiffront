"use client";

import React, { useRef, useState } from "react";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import FilterCarousel from "../src/components/FilterCarousel";
import { usePathname } from "next/navigation";
// import { LineChart } from "./LineChart"; // import your chart component

export default function PageFiscalDashboard() {
  const sankeyRef = useRef<SVGSVGElement | null>(null);
  const [year, setYear] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pathname = usePathname();

  const categories: string[] = [];
  const initialIndex = 0;

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
        title="Macro Economy Dashboards"
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "Government Fiscal Operations" },
        ]}
      />

      {/* Filter Section */}
      {categories.length > 0 && (
        <FilterCarousel
          key={`fc-${activeCategory}`}
          items={categories}
          initialActiveIndex={initialIndex}
          onChangeActive={(label) => {
            setActiveCategory(label);
            setCurrentPage(1);
          }}
        />
      )}

      {/* --- Place the Line Chart here --- */}
      <div className="bg-white py-3.5 md:py-5 xl:pt-6 xl:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {/* Chart Header */}
          <div className="mb-10">
            <h5 className="text-2xl font-bold text-slate-950 mb-1.5">Average Annual Inflation</h5>
            <p className="text-base text-slate-950">
              Percentage change in prices for consumer goods and services (2015-2024)
            </p>
          </div>

          {/* Render the LineChart component */}
          <LineChart />
        </div>
      </div>
    </main>
  );
}
