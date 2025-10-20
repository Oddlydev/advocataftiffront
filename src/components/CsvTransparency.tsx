"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface CsvTransparencyProps {
  csvUrl: string;
  filterQuery?: string;
}

export default function CsvTransparency({ csvUrl, filterQuery }: CsvTransparencyProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const cacheKey = `csvRows:${csvUrl}`;
  const memCache: { [key: string]: string[][] } = (globalThis as any).__csvRowsCache || ((globalThis as any).__csvRowsCache = {});

  useEffect(() => {
    if (!csvUrl) {
      setError("No CSV file URL provided.");
      return;
    }

    let hadCache = false;
    if (memCache[cacheKey]) {
      setRows(memCache[cacheKey]);
      setError(null);
      hadCache = true;
    } else {
      try {
        const raw = sessionStorage.getItem(cacheKey);
        if (raw) {
          const parsed = JSON.parse(raw) as string[][];
          memCache[cacheKey] = parsed;
          setRows(parsed);
          setError(null);
          hadCache = true;
        }
      } catch {}
    }

    const proxiedUrl = `https://corsproxy.io/?${csvUrl}`;

    fetch(proxiedUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch CSV file.");
        return res.text();
      })
      .then((text) => {
        const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
        if (result.errors.length > 0) {
          if (!hadCache) setError("Error parsing CSV.");
          console.error("CSV Parse Errors:", result.errors);
        } else {
          const data = result.data as string[][];
          memCache[cacheKey] = data;
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
          } catch {}
          setRows(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!hadCache) setError(err.message);
        console.warn("CSV fetch failed", err);
      });
  }, [csvUrl]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (rows.length === 0) return <p className="text-gray-500 pb-6 text-xl font-sourcecodepro font-medium">Loading dataset...</p>;

  const headers = rows[0];
  const dataRows = rows.slice(1);

  const norm = (s: string) => (s ?? "").toLowerCase().replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

  const tokens = norm(filterQuery ?? "").split(" ").filter(Boolean);
  const visibleRows = tokens.length
    ? dataRows.filter((row) => tokens.every((t) => row.some((cell) => norm(cell).includes(t))))
    : dataRows;

  const renderStatusCell = (value: string) => {
    const lower = value.toLowerCase();
    let color = "#9CA3AF"; // gray default
    if (lower === "yes") color = "#22C55E"; // green
    else if (lower === "no") color = "#DC2626"; // red
    else if (lower === "partially") color = "#F59E0B"; // yellow
    else if (lower.includes("qualified")) color = "#F59E0B"; // orange

    return (
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="6" cy="6" r="6" fill={color} />
        </svg>
        <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">{value}</span>
      </div>
    );
  };

  const handleScrollRight = () => {
    const tableWrapper = document.getElementById("table-wrapper");
    if (!tableWrapper) return;
    let scrollStep = window.innerWidth >= 1280 ? 288 : window.innerWidth >= 768 ? 225 : 160;
    tableWrapper.scrollBy({ left: scrollStep, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    const tableWrapper = document.getElementById("table-wrapper");
    if (!tableWrapper) return;
    let scrollStep = window.innerWidth >= 1280 ? 288 : window.innerWidth >= 768 ? 225 : 160;
    tableWrapper.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="shadow-md border p-4 border-gray-200 rounded-lg">
        <div id="table-wrapper" className="overflow-x-auto overflow-y-auto max-w-full box-content">
          <div className="w-[1200px] table-inner">
            <table className="border-collapse bg-white border-b border-gray-100 min-w-max rounded-lg">
              <thead>
                {/* First row: main subheadings */}
                <tr>
                  <th className="sticky top-0 left-0 z-20 bg-brand-1-700 px-3 py-3.5 text-left text-lg/7 font-semibold uppercase text-brand-white !w-[160px] md:!w-[225px] xl:!w-[300px]" rowSpan={2}>
                    SOE
                  </th>
                  <th className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3 text-center border-b border-brand-1-300 font-sourcecodepro text-lg/7 font-semibold uppercase text-brand-white/60" colSpan={3}>
                    Annual Report
                  </th>
                  <th className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3 text-center border-b border-brand-1-300 font-sourcecodepro text-lg/7 font-semibold uppercase text-brand-white/60" colSpan={2}>
                    Auditing Standards
                  </th>
                  <th className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3 text-center border-b border-brand-1-300 font-sourcecodepro text-lg/7 font-semibold uppercase text-brand-white/60" colSpan={2}>
                    Right to Information
                  </th>
                  <th className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3 text-center border-b border-brand-1-300 font-sourcecodepro text-lg/7 font-semibold uppercase text-brand-white/60" colSpan={3}>
                    Accessibility of Information
                  </th>
                </tr>
                {/* Second row: subheaders from CSV */}
                <tr>
                  {headers.slice(1).map((h, i) => (
                    <th
                      key={i}
                      className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3.5 text-left text-base/6 font-semibold font-sourcecodepro uppercase text-brand-white w-[160px] md:w-[155px] xl:w-[210px]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {visibleRows.length === 0 && (
                  <tr>
                    <td colSpan={headers.length} className="px-3 py-3.5 text-left text-base/6 font-medium text-gray-500">
                      {tokens.length ? "No matching results." : "No data available."}
                    </td>
                  </tr>
                )}
                {visibleRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        className={`border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-sourcecodepro font-medium ${
                          i === 0
                            ? "sticky left-0 z-20 text-brand-black !w-[160px] md:!w-[225px] xl:!w-[300px] bg-white"
                            : "text-gray-500 w-[160px] md:w-[155px] xl:w-[210px]"
                        }`}
                      >
                        {i === 0 ? cell : renderStatusCell(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floating scroll button */}
        <button
          onClick={handleScrollRight}
          className="absolute z-20 top-8 right-6 bg-brand-white border border-brand-white hover:bg-slate-100 text-brand-black p-1 rounded-full shadow-md transition-all duration-200"
        >
          <svg className="size-4" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.4248 16.6L12.8581 11.1667C13.4998 10.525 13.4998 9.47503 12.8581 8.83336L7.4248 3.40002"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
