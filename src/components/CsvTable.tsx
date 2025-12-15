"use client";

import React, { useEffect, useRef, useState } from "react";
import Papa from "papaparse";

interface CsvTableProps {
  csvUrl: string;
  filterQuery?: string;
  pageSize?: number;
  sectorFilters?: string[];
  /** Whether to keep the second column sticky alongside the first */
  stickySecondColumn?: boolean;
}

export default function CsvTable({
  csvUrl,
  filterQuery,
  pageSize = 10,
  sectorFilters = [],
  stickySecondColumn = false,
}: CsvTableProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roaSortDir, setRoaSortDir] = useState<"asc" | "desc" | null>(null);
  const [headerOffset, setHeaderOffset] = useState(0);
  const theadRef = useRef<HTMLTableSectionElement | null>(null);

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

  useEffect(() => {
    const updateOffset = () => {
      const el = theadRef.current;
      if (!el) return;
      const h = el.offsetHeight || el.getBoundingClientRect().height || 0;
      setHeaderOffset(h);
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [rows.length]);

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

  const detectedSectorIndex = headers.findIndex((h) => /sector/i.test(h ?? ""));
  const useSectorGrouping = detectedSectorIndex >= 0;
  const sectorIndex = detectedSectorIndex;

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

  const roaIndex = headers.findIndex((h) => /\broa\b/i.test(h ?? ""));
  const displayHeaders: string[] = useSectorGrouping
    ? headers.filter((_, i) => i !== sectorIndex)
    : headers;
  const roaDisplayIndex =
    roaIndex >= 0
      ? roaIndex -
        (useSectorGrouping && sectorIndex >= 0 && sectorIndex < roaIndex
          ? 1
          : 0)
      : -1;
  // Index of the second sticky column in displayHeaders; enabled per usage
  const stickySecondIndex =
    stickySecondColumn && displayHeaders.length > 1 ? 1 : -1;

  const parseNumeric = (v: string): number => {
    if (!v) return NaN;
    const cleaned = v.replace(/[^0-9.\-]/g, "");
    if (cleaned.trim() === "") return NaN;
    const n = Number(cleaned);
    return isNaN(n) ? NaN : n;
  };

  const getRoaColor = (num: number): string | null => {
    if (isNaN(num)) return null;
    if (num > 3.95) return "#22C55E";
    if (num >= 1 && num <= 3.95) return "#F59E0B";
    if (num >= -1.5 && num < 1) return "#F97316";
    return "#DC2626";
  };

  const visibleRows = (() => {
    if (roaSortDir && roaIndex >= 0) {
      const sorted = [...filteredByText].sort((a, b) => {
        const av = parseNumeric(a[roaIndex] ?? "");
        const bv = parseNumeric(b[roaIndex] ?? "");
        const aNaN = isNaN(av);
        const bNaN = isNaN(bv);
        if (aNaN && bNaN) return 0;
        if (aNaN) return 1;
        if (bNaN) return -1;
        return roaSortDir === "asc" ? av - bv : bv - av;
      });
      return sorted;
    }
    return filteredByText;
  })();

  const totalItems = visibleRows.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const paginatedRows = visibleRows.slice(start - 1, end);

  type RenderItem =
    | { type: "sector"; sector: string }
    | { type: "data"; row: string[] };
  const renderItems: RenderItem[] = (() => {
    const base = visibleRows;
    if (!useSectorGrouping || sectorIndex < 0) {
      return base.map((row) => ({ type: "data", row }));
    }
    const items: RenderItem[] = [];
    let lastSectorKey: string | null = null;
    for (const row of base) {
      const sector = row[sectorIndex] ?? "";
      const sectorKey = norm(sector);
      if (lastSectorKey !== sectorKey) {
        items.push({ type: "sector", sector });
        lastSectorKey = sectorKey;
      }
      items.push({ type: "data", row });
    }
    return items;
  })();

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const formatCell = (value: string): React.ReactNode => {
    const raw = (value ?? "").toString();
    const trimmed = raw.trim();
    const lower = trimmed.toLowerCase();
    // Treat empty, explicit "data n/a", or lone dash placeholders as N/A
    if (!trimmed || lower.includes("data n/a") || /^-+$/.test(trimmed)) {
      return <span>Data N/A</span>; // className="text-brand-1-600 font-medium"
    }
    const num = Number(trimmed);
    if (!isNaN(num)) return num.toLocaleString("en-US");
    return trimmed;
  };

  const handleScrollRight = () => {
    const tableWrapper = document.getElementById("table-wrapper");
    if (!tableWrapper) return;
    let scrollStep = 160;
    if (window.innerWidth >= 1280) scrollStep = 288;
    else if (window.innerWidth >= 768) scrollStep = 225;
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
      <div className="py-3.5 md:py-5 xl:py-6">
        <div className="mx-auto max-w-7xl">
          <div className="shadow-md border p-4 border-gray-200 rounded-lg">
            <div
              id="table-wrapper"
              className={`overflow-x-auto overflow-y-auto max-w-full box-content ${
                visibleRows.length >= 10 ? "" : "" // max-h-[650px]
              }`}
            >
              <div className="w-[1200px] table-inner">
                <table className="border-collapse bg-white border-b border-gray-100 min-w-max rounded-lg">
                  <thead ref={theadRef} className="rounded-t-lg">
                    <tr>
                      {displayHeaders.map((header, i) => {
                        const isROA = i === roaDisplayIndex;
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

                        const isFirstCol = i === 0;
                        const isSecondCol = i === stickySecondIndex;

                        return (
                          <th
                            key={i}
                            className={`px-3 py-3.5 text-left text-lg/7 font-semibold font-sourcecodepro uppercase text-brand-white bg-brand-1-700 sticky top-0 ${
                              isFirstCol
                                ? "left-0 z-30 rounded-tl-lg !w-[160px] md:!w-[225px] xl:!w-[300px]"
                                : isSecondCol
                                  ? "left-[160px] md:left-[225px] xl:left-[300px] z-20 !w-[160px] md:!w-[155px] xl:!w-[210px]"
                                  : "z-10 w-[160px] md:w-[155px] xl:w-[210px]"
                            } ${i === displayHeaders.length - 1 ? "rounded-tr-lg" : ""}`}
                          >
                            {isROA ? (
                              <button
                                type="button"
                                onClick={onClickHeader}
                                className="group inline-flex items-center text-left rounded"
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
                    {visibleRows.length === 0 && (
                      <tr>
                        <td
                          colSpan={displayHeaders.length}
                          className="bg-white border-b border-gray-100 px-3 py-6 text-left text-base/6 font-medium font-sourcecodepro text-gray-500"
                        >
                          No data to display
                        </td>
                      </tr>
                    )}

                    {renderItems.map((item, idx) => {
                      if (item.type === "sector") {
                        return (
                          <tr key={`sector-${idx}`}>
                            <td
                              className="sector sticky left-0 z-30 bg-brand-white border-b border-gray-100 text-brand-1-700 px-3 py-3.5 text-left text-base/6 font-sourcecodepro font-semibold !w-[160px] md:!w-[225px] xl:!w-[300px]"
                              style={{ top: headerOffset }}
                            >
                              {item.sector}
                            </td>
                            {displayHeaders.slice(1).map((_, i) => {
                              const headerIndex = i + 1;
                              const isSecondCol =
                                headerIndex === stickySecondIndex;
                              return (
                                <td
                                  key={`spacer-${i}`}
                                  className={`sticky bg-brand-white border-b border-gray-100 px-3 py-3.5 w-[160px] md:w-[155px] xl:w-[210px] ${
                                    isSecondCol
                                      ? "left-[160px] md:left-[225px] xl:left-[300px] z-20"
                                      : "z-10"
                                  }`}
                                  style={{ top: headerOffset }}
                                />
                              );
                            })}
                          </tr>
                        );
                      }
                      const row = item.row;
                      const displayRow =
                        useSectorGrouping && sectorIndex >= 0
                          ? row.filter((_, i) => i !== sectorIndex)
                          : row;
                      return (
                        <tr key={`row-${idx}`}>
                          {displayRow.map((cell, cellIndex) => {
                            const isROA = cellIndex === roaDisplayIndex;
                            const num = isROA ? parseNumeric(cell ?? "") : NaN;
                            const color = isROA ? getRoaColor(num) : null;
                            const isFirstCol = cellIndex === 0;
                            const isSecondCol = cellIndex === stickySecondIndex;
                            return (
                              <td
                                key={cellIndex}
                                className={`bg-white border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-medium font-sourcecodepro ${
                                  isFirstCol
                                    ? "sticky left-0 z-30 text-brand-black !w-[160px] md:!w-[225px] xl:!w-[300px]"
                                    : isSecondCol
                                      ? "sticky left-[160px] md:left-[225px] xl:left-[300px] z-20 text-gray-500 w-[160px] md:w-[155px] xl:w-[210px]"
                                      : "text-gray-500 w-[160px] md:w-[155px] xl:w-[210px]"
                                }`}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

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
                  strokeWidth="2.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
