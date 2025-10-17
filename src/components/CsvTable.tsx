"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface CsvTableProps {
  csvUrl: string;
  filterQuery?: string;
  pageSize?: number; // default rows per page
  sectorFilters?: string[]; // if provided, filter by Sector column (by name)
  showInterpretation?: boolean; // toggle legend section at the bottom
}

export default function CsvTable({
  csvUrl,
  filterQuery,
  pageSize = 10,
  sectorFilters = [],
  showInterpretation = true,
}: CsvTableProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roaSortDir, setRoaSortDir] = useState<"asc" | "desc" | null>(null);

  const cacheKey = `csvRows:${csvUrl}`;
  const memCache: { [key: string]: string[][] } =
    (globalThis as any).__csvRowsCache ||
    ((globalThis as any).__csvRowsCache = {});

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
  if (rows.length === 0)
    return (
      <p className="text-gray-500 italic animate-pulse text-base font-sourcecodepro">
        Loading dataset...
      </p>
    );

  const headers = rows[0];
  const dataRows = rows.slice(1);

  const norm = (s: string) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const tokens = norm(filterQuery ?? "")
    .split(" ")
    .filter(Boolean);

  // Determine index for Sector column; fallback to 1 (second column)
  const sectorIndex = (() => {
    const idx = headers.findIndex((h) => /sector/i.test(h ?? ""));
    if (idx >= 0) return idx;
    return Math.min(1, headers.length - 1);
  })();

  const hasSectorFilter =
    Array.isArray(sectorFilters) && sectorFilters.length > 0;
  const sectorSet = new Set(sectorFilters.map((s) => norm(s)));

  let filteredByText = tokens.length
    ? dataRows.filter((row) =>
        tokens.every((t) => row.some((cell) => norm(cell).includes(t)))
      )
    : dataRows;

  if (hasSectorFilter) {
    filteredByText = filteredByText.filter((row) => {
      const val = row[sectorIndex] ?? "";
      return sectorSet.has(norm(val));
    });
  }

  // Locate ROA column (case-insensitive)
  const roaIndex = (() => {
    const idx = headers.findIndex((h) => /\broa\b/i.test(h ?? ""));
    return idx >= 0 ? idx : -1;
  })();

  // Parse numeric strings robustly (e.g., "12.3%", "1,234", "-0.5")
  const parseNumeric = (v: string): number => {
    if (!v) return NaN;
    const cleaned = v.replace(/[^0-9.\-]/g, "");
    if (cleaned.trim() === "") return NaN;
    const n = Number(cleaned);
    return isNaN(n) ? NaN : n;
  };

  // Determine ROA indicator color based on value thresholds
  // Green: > 3.95
  // Yellow: 1 to 3.95
  // Orange: -1.5 to < 1
  // Red: < -1.5
  const getRoaColor = (num: number): string | null => {
    if (isNaN(num)) return null;
    if (num > 3.95) return "#22C55E"; // green-500
    if (num >= 1 && num <= 3.95) return "#F59E0B"; // amber-500
    if (num >= -1.5 && num < 1) return "#F97316"; // orange-500
    return "#DC2626"; // red-600
  };

  // Apply sorting by ROA if enabled
  const visibleRows = (() => {
    if (roaSortDir && roaIndex >= 0) {
      const sorted = [...filteredByText].sort((a, b) => {
        const av = parseNumeric(a[roaIndex] ?? "");
        const bv = parseNumeric(b[roaIndex] ?? "");
        const aNaN = isNaN(av);
        const bNaN = isNaN(bv);
        // Place NaN at the end regardless of direction
        if (aNaN && bNaN) return 0;
        if (aNaN) return 1;
        if (bNaN) return -1;
        return roaSortDir === "asc" ? av - bv : bv - av;
      });
      return sorted;
    }
    return filteredByText;
  })();

  // Pagination logic
  const totalItems = visibleRows.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const paginatedRows = visibleRows.slice(start - 1, end);

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // Utility: format cell values
  const formatCell = (value: string): React.ReactNode => {
    if (
      !value ||
      value.trim() === "" ||
      value.toLowerCase().includes("data n/a")
    ) {
      return <span className="text-brand-1-600 font-medium">Data N/A</span>;
    }
    const num = Number(value);
    if (!isNaN(num)) return num.toLocaleString("en-US");
    return value;
  };

  {
    /* Floating scroll button */
  }
  const handleScrollRight = () => {
    const tableWrapper = document.getElementById("table-wrapper");
    if (!tableWrapper) return;

    let scrollStep = 160; // default mobile
    if (window.innerWidth >= 1280)
      scrollStep = 288; // xl
    else if (window.innerWidth >= 768) scrollStep = 225; // md

    tableWrapper.scrollBy({ left: scrollStep, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    const tableWrapper = document.getElementById("table-wrapper");
    if (!tableWrapper) return;

    let scrollStep = 160;
    if (window.innerWidth >= 1280) scrollStep = 288;
    else if (window.innerWidth >= 768) scrollStep = 225;

    tableWrapper.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div className="bg-white py-3.5 md:py-5 xl:py-6">
        <div className="mx-auto max-w-7xl">
          <div className="shadow-md border p-4 border-gray-200 rounded-lg">
            {/**
             * Enable vertical scrolling inside the table area when there are
             * 10 or more rows. Keeps existing horizontal scroll behavior.
             */}
            <div
              id="table-wrapper"
              className={`overflow-x-auto overflow-y-auto max-w-full box-content ${
                visibleRows.length >= 10 ? "max-h-[650px]" : ""
              }`}
            >
              <div className="w-[1200px] table-inner">
                <table className="border-collapse bg-white border-b border-gray-100 min-w-max rounded-lg">
                  <thead className="rounded-t-lg">
                    <tr>
                      {headers.map((header, i) => {
                        const isROA = i === roaIndex;
                        const sortIcon = () => {
                          if (!isROA) return null;
                          if (roaSortDir === "asc") {
                            return (
                              <svg
                                className="ml-1 inline-block align-middle"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M6 15l6-6 6 6" />
                              </svg>
                            );
                          }
                          if (roaSortDir === "desc") {
                            return (
                              <svg
                                className="ml-1 inline-block align-middle"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 9l-6 6-6-6" />
                              </svg>
                            );
                          }
                          // unsorted icon
                          return (
                            <svg
                              className="ml-1 inline-block align-middle"
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                            </svg>
                          );
                        };

                        const onClickHeader = () => {
                          if (!isROA) return;
                          setCurrentPage(1);
                          setRoaSortDir((prev) =>
                            prev === "desc"
                              ? "asc"
                              : prev === "asc"
                                ? null
                                : "desc"
                          );
                        };

                        return (
                          <th
                            key={i}
                            className={`px-3 py-3.5 text-left text-lg/7 font-semibold font-sourcecodepro uppercase text-brand-white bg-brand-1-700 sticky top-0 ${
                              i === 0 ? "left-0 z-20 rounded-tl-lg" : "z-10"
                            } ${i === headers.length - 1 ? "rounded-tr-lg" : ""} w-[160px] md:w-[225px] xl:w-[280px]`}
                          >
                            {isROA ? (
                              <button
                                type="button"
                                onClick={onClickHeader}
                                className="group inline-flex items-center text-left  rounded"
                                title="Sort by ROA"
                              >
                                <span>{header}</span>
                                {sortIcon()}
                              </button>
                            ) : (
                              header
                            )}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-300">
                    {/* No data row */}
                    {visibleRows.length === 0 && (
                      <tr>
                        {headers.map((_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="bg-white border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-medium font-sourcecodepro text-gray-500 w-[160px] md:w-[225px] xl:w-[280px]"
                          >
                            <span className="text-brand-1-600">Data N/A</span>
                          </td>
                        ))}
                      </tr>
                    )}

                    {visibleRows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => {
                          const isROA = cellIndex === roaIndex;
                          const num = isROA ? parseNumeric(cell ?? "") : NaN;
                          const color = isROA ? getRoaColor(num) : null;
                          return (
                            <td
                              key={cellIndex}
                              className={`bg-white border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-medium font-sourcecodepro 
                              ${cellIndex === 0 ? "sticky left-0 text-brand-black" : "text-gray-500"}
                              w-[160px] md:w-[250px] xl:w-[315px]`}
                            >
                              {isROA ? (
                                <span className="inline-flex items-center gap-2">
                                  {color && (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      aria-label="ROA indicator"
                                    >
                                      <circle
                                        cx="6"
                                        cy="6"
                                        r="6"
                                        fill={color}
                                      />
                                    </svg>
                                  )}
                                  <span>{formatCell(cell)}</span>
                                </span>
                              ) : (
                                formatCell(cell)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Floating scroll button */}
            <button
              onClick={handleScrollRight}
              className="absolute z-20 top-14 right-6 bg-brand-white border border-brand-white hover:bg-slate-100 text-brand-black p-1 rounded-full shadow-md transition-all duration-200"
            >
              <svg
                className="size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.4248 16.6L12.8581 11.1667C13.4998 10.525 13.4998 9.47503 12.8581 8.83336L7.4248 3.40002"
                  stroke="currentColor"
                  stroke-width="2.5"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Interpretation legend (optional) */}
          {showInterpretation && (
            <>
              <div className="bg-gray-50 rounded-lg mt-3 px-6 py-3.5">
                <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>
                      Proxy measures are used for some of the financial
                      indicators where required data is unavailable. Please
                      refer to the SOE Fiscal Indicator Methodology under{" "}
                      <a href="/about-us" className="text-brand-1-600">
                        FAQs
                      </a>
                      .
                    </p>
                  </div>
                </div>
              </div>
              <div className="mx-auto max-w-7xl pt-6 md:pt-9 pb-16">
                <div>
                  <div className="grid md:flex gap-7 items-center justify-start md:justify-end w-full">
                    <div>
                      <p className="text-sm xl:text-base/6 font-medium font-sourcecodepro text-slate-600">
                        Interpretation of the indicators :
                      </p>
                    </div>
                    <div className="flex items-center gap-3 md:gap-5">
                      {/* Good */}
                      <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                        <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                          Successful
                        </span>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <circle cx="6" cy="6" r="6" fill="#22C55E" />
                          </svg>
                          {/* <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
                            1
                          </span> */}
                        </div>
                      </div>

                      {/* Marginal Success */}
                      <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                        <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                          Marginally Successful
                        </span>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <circle cx="6" cy="6" r="6" fill="#F59E0B" />
                          </svg>
                          {/* <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
                            1
                          </span> */}
                        </div>
                      </div>

                      {/* Average */}
                      <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                        <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                          Unsuccessful
                        </span>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <circle cx="6" cy="6" r="6" fill="#F97316" />
                          </svg>
                          {/* <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
                            0.5
                          </span> */}
                        </div>
                      </div>

                      {/* Poor */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                          Total Failure
                        </span>
                        <div className="flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <circle cx="6" cy="6" r="6" fill="#DC2626" />
                          </svg>
                          {/* <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
                            0
                          </span> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
