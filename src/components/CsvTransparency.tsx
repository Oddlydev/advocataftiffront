"use client";

import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";

interface CsvTransparencyProps {
  csvUrl: string;
  filterQuery?: string;
}

export default function CsvTransparency({ csvUrl, filterQuery }: CsvTransparencyProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const theadRef = useRef<HTMLTableSectionElement | null>(null);
  const topHeaderRowRef = useRef<HTMLTableRowElement | null>(null);
  const [headerOffset, setHeaderOffset] = useState(0);
  const [topHeaderHeight, setTopHeaderHeight] = useState(0);

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

  // measure header height so sticky section headers (ministry rows) sit below it
  useEffect(() => {
    const updateOffset = () => {
      const el = theadRef.current;
      if (!el) return;
      const h = el.offsetHeight || el.getBoundingClientRect().height || 0;
      setHeaderOffset(h);
      const topRow = topHeaderRowRef.current;
      const rh = topRow ? topRow.offsetHeight || topRow.getBoundingClientRect().height || 0 : 0;
      setTopHeaderHeight(rh);
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [rows.length]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (rows.length === 0) return <p className="text-gray-500 pb-6 text-xl font-sourcecodepro font-medium">Loading dataset...</p>;

  // CSV expected structure: first two rows are headers.
  const headers = rows[0];
  const subHeaders = rows[1] || [];
  const dataRows = rows.slice(2);
  const totalColumns = headers?.length || (subHeaders?.length || 0) || 0;

  const norm = (s: string) => (s ?? "").toLowerCase().replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

  const tokens = norm(filterQuery ?? "").split(" ").filter(Boolean);
  const matchesTokens = (row: string[]) =>
    tokens.length
      ? tokens.every((t) => row.some((cell) => norm(cell).includes(t)))
      : true;
  const visibleRows = tokens.length
    ? dataRows.filter((row) => matchesTokens(row))
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

  // Build render items so we can inject sticky row-headers for "Ministry ..." rows
  type RenderItem =
    | { type: "ministry"; label: string }
    | { type: "data"; row: string[] };

  const renderItems: RenderItem[] = (() => {
    const items: RenderItem[] = [];
    let currentHeader: string | null = null;
    let headerPrintedForCurrent = false;
    for (const row of dataRows) {
      const first = (row[0] || "").toString();
      const isHeader = /^\s*ministry\b/i.test(first);
      if (isHeader) {
        currentHeader = first;
        headerPrintedForCurrent = false;
        continue;
      }
      if (!matchesTokens(row)) continue;
      if (currentHeader && !headerPrintedForCurrent) {
        items.push({ type: "ministry", label: currentHeader });
        headerPrintedForCurrent = true;
      }
      items.push({ type: "data", row });
    }
    // If no data matched but there were ministry lines only, fall back to visibleRows mapping
    if (items.length === 0 && visibleRows.length > 0) {
      for (const row of visibleRows) {
        const first = (row[0] || "").toString();
        if (/^\s*ministry\b/i.test(first)) items.push({ type: "ministry", label: first });
        else items.push({ type: "data", row });
      }
    }
    return items;
  })();

  return (
    <div className="relative">
      <div className="shadow-md border p-4 border-gray-200 rounded-lg">
        <div id="table-wrapper" className="overflow-x-auto overflow-y-auto max-w-full box-content">
          <div className="w-[1200px] table-inner">
            <table className="border-collapse bg-white border-b border-gray-100 min-w-max rounded-lg">
              <thead ref={theadRef}>
                {/* First row: main grouped headings */}
                <tr ref={topHeaderRowRef}>
                  <th className="sticky top-0 left-0 z-20 bg-brand-1-700 px-3 py-3.5 text-left text-lg/7 font-semibold uppercase text-brand-white !w-[160px] md:!w-[225px] xl:!w-[300px]">
                    {(headers?.[0] ?? "").toString().toUpperCase() || "DEPARTMENT"}
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
                {/* Second row: detailed column headers styled like the red header */}
                <tr>
                  <th
                    className="sticky left-0 z-20 bg-brand-1-700 px-3 py-3.5 text-left text-base font-sourcecodepro font-semibold text-brand-white !w-[160px] md:!w-[225px] xl:!w-[300px]"
                    style={{ top: topHeaderHeight }}
                  >
                    {(subHeaders?.[0] ?? headers?.[0] ?? "Department").toString()}
                  </th>
                  {(subHeaders || []).slice(1).map((label, i) => (
                    <th
                      key={`sub-${i}`}
                      className="sticky z-10 bg-brand-1-700 px-3 py-3.5 text-left text-sm md:text-base font-sourcecodepro font-medium text-brand-white w-[160px] md:w-[155px] xl:w-[210px] border-b border-brand-1-300"
                      style={{ top: topHeaderHeight }}
                    >
                      {label}
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
                {renderItems.map((item, idx) => {
                  if (item.type === "ministry") {
                    return (
                      <tr key={`min-${idx}`}>
                        <td
                          className="sticky z-10 bg-gray-50 border-b border-gray-100 text-brand-1-700 px-3 py-3.5 text-left text-base/6 font-sourcecodepro font-semibold"
                          style={{ top: headerOffset }}
                          colSpan={totalColumns}
                        >
                          {item.label}
                        </td>
                      </tr>
                    );
                  }
                  const row = item.row;
                  return (
                    <tr key={`row-${idx}`}>
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
                  );
                })}
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
