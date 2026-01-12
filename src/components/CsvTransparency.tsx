"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";

const normalize = (value: string) =>
  (value ?? "")
    .toString()
    .toLowerCase()
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const findColumnIndexByKeyword = (
  arr: string[] | undefined,
  keyword: string
): number => {
  if (!arr?.length) return -1;
  const target = keyword.toLowerCase();
  for (let i = 0; i < arr.length; i++) {
    if (normalize(arr[i]).includes(target)) return i;
  }
  return -1;
};

const parseNumber = (raw: string): number => {
  const sanitized = (raw ?? "").toString().replace(/[%\s,]/g, "");
  const num = parseFloat(sanitized);
  return Number.isFinite(num) ? num : NaN;
};

const isNA = (raw: string) => {
  const value = normalize(raw);
  if (!value) return true;
  if (value === "-" || /^-+$/.test(value)) return true;
  if (
    value === "n/a" ||
    value === "na" ||
    value === "not applicable" ||
    value === "not available" ||
    value.includes("data n/a")
  )
    return true;
  return false;
};

interface CsvTransparencyProps {
  csvUrl: string;
  filterQuery?: string;
  ministryFilters?: string[];
  onMinistriesLoaded?: (ministries: string[]) => void;
}

type Group = { label: string; rows: string[][] };
type RenderItem =
  | { type: "ministry"; label: string }
  | { type: "data"; row: string[] };

export default function CsvTransparency({
  csvUrl,
  filterQuery,
  ministryFilters = [],
  onMinistriesLoaded,
}: CsvTransparencyProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const theadRef = useRef<HTMLTableSectionElement | null>(null);
  const topHeaderRowRef = useRef<HTMLTableRowElement | null>(null);
  const [headerOffset, setHeaderOffset] = useState(0);
  const [topHeaderHeight, setTopHeaderHeight] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

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
      const topRow = topHeaderRowRef.current;
      const rh = topRow
        ? topRow.offsetHeight || topRow.getBoundingClientRect().height || 0
        : 0;
      setTopHeaderHeight(rh);
    };
    updateOffset();
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [rows.length]);

  const headers = rows[0] || [];
  const subHeaders = rows[1] || [];
  const dataRows = rows.slice(2);

  const subMinistryIndex = findColumnIndexByKeyword(subHeaders, "ministry");
  const headerMinistryIndex = findColumnIndexByKeyword(headers, "ministry");
  const ministryIndex =
    subMinistryIndex >= 0 ? subMinistryIndex : headerMinistryIndex;

  const headerLength = Math.max(headers.length, subHeaders.length);
  const columnIndices = Array.from(
    { length: headerLength },
    (_, idx) => idx
  ).filter((idx) => idx !== ministryIndex);
  const effectiveColumnIndices = columnIndices.length ? columnIndices : [0];
  const displayHeaders = effectiveColumnIndices.map(
    (idx) => subHeaders[idx] ?? headers[idx] ?? ""
  );
  const totalColumns = Math.max(displayHeaders.length, 1);
  const remainingColumns = Math.max(totalColumns - 1, 0);
  const firstColumnLabel = displayHeaders[0] || headers[0] || "Department";
  const secondaryHeaders = displayHeaders.slice(1);

  const firstRowValues = effectiveColumnIndices.map(
    (idx) => headers[idx] ?? ""
  );
  type FirstRowGroup = { label: string; colSpan: number; key: string };
  const firstRowGroups: FirstRowGroup[] = (() => {
    const groups: FirstRowGroup[] = [];
    let current: FirstRowGroup | null = null;
    for (let i = 1; i < firstRowValues.length; i++) {
      const label = (firstRowValues[i] ?? "").toString();
      if (!current || current.label !== label) {
        current = {
          label: label || " ",
          colSpan: 1,
          key: `${label}-${i}`,
        };
        groups.push(current);
      } else {
        current.colSpan += 1;
      }
    }
    return groups;
  })();
  const firstRowFirstColumnLabel =
    (firstRowValues[0] ?? "").toString().toUpperCase() || " ";

  const compositeIndex = useMemo(() => {
    const findIn = (arr?: string[]): number => {
      if (!arr) return -1;
      for (let i = 0; i < arr.length; i++) {
        const label = normalize(arr[i]);
        if (!label) continue;
        if (label.includes("composite") && label.includes("score")) return i;
        if (label === "composite score") return i;
      }
      return -1;
    };
    let idx = findIn(subHeaders);
    if (idx >= 0) return idx;
    idx = findIn(headers);
    return idx;
  }, [headers, subHeaders]);

  const compositeDisplayIndex =
    compositeIndex >= 0
      ? effectiveColumnIndices.findIndex((idx) => idx === compositeIndex)
      : -1;

  const groups = useMemo(() => {
    if (!dataRows.length) return [];
    if (ministryIndex < 0) {
      return [{ label: "", rows: dataRows }];
    }
    const map = new Map<string, Group>();
    const order: string[] = [];
    const fallbackKey = "__NO_MINISTRY__";
    for (const row of dataRows) {
      const raw = (row[ministryIndex] ?? "").toString();
      const label = raw.trim() || "Unknown Ministry";
      const key = normalize(label) || fallbackKey;
      if (!map.has(key)) {
        map.set(key, { label, rows: [] });
        order.push(key);
      }
      map.get(key)!.rows.push(row);
    }
    return order.map((key) => map.get(key)!);
  }, [dataRows, ministryIndex]);

  useEffect(() => {
    if (!onMinistriesLoaded) return;
    if (ministryIndex < 0) {
      onMinistriesLoaded([]);
      return;
    }
    onMinistriesLoaded(groups.map((g) => g.label));
  }, [groups, ministryIndex, onMinistriesLoaded]);

  const tokens = normalize(filterQuery ?? "")
    .split(" ")
    .filter(Boolean);
  const hasMinistryFilter =
    Array.isArray(ministryFilters) && ministryFilters.length > 0;
  const ministrySet = new Set(ministryFilters.map((value) => normalize(value)));

  const sortEnabled = Boolean(sortOrder && compositeIndex >= 0);
  const compareRows = (a: string[], b: string[]) => {
    if (!sortOrder || compositeIndex < 0) return 0;
    const av = parseNumber(a[compositeIndex] ?? "");
    const bv = parseNumber(b[compositeIndex] ?? "");
    const aNa = Number.isNaN(av);
    const bNa = Number.isNaN(bv);
    if (aNa && bNa) return 0;
    if (aNa) return 1;
    if (bNa) return -1;
    return sortOrder === "asc" ? av - bv : bv - av;
  };
  const matchesTokensInRow = (row: string[]) =>
    tokens.every((token) =>
      row.some((cell) => normalize(cell).includes(token))
    );

  const filteredRowsWithLabel = (() => {
    const list: { label: string; row: string[] }[] = [];
    for (const group of groups) {
      const normalizedGroupLabel = normalize(group.label);
      if (hasMinistryFilter && !ministrySet.has(normalizedGroupLabel)) {
        continue;
      }
      let rowsForGroup = group.rows;
      if (tokens.length) {
        const headerMatches = tokens.every((token) =>
          normalizedGroupLabel.includes(token)
        );
        const rowMatches = rowsForGroup.filter(matchesTokensInRow);
        rowsForGroup = headerMatches ? rowsForGroup : rowMatches;
      }
      if (!rowsForGroup.length) continue;
      for (const row of rowsForGroup) {
        list.push({ label: group.label, row });
      }
    }
    return list;
  })();

  const sortedRowsWithLabel = sortEnabled
    ? [...filteredRowsWithLabel].sort((a, b) => compareRows(a.row, b.row))
    : filteredRowsWithLabel;

  const renderItems: RenderItem[] = (() => {
    const items: RenderItem[] = [];
    let lastNormalizedLabel: string | null = null;
    for (const entry of sortedRowsWithLabel) {
      const normalizedLabel = normalize(entry.label);
      if (entry.label && normalizedLabel !== lastNormalizedLabel) {
        items.push({ type: "ministry", label: entry.label });
        lastNormalizedLabel = normalizedLabel;
      } else if (!entry.label) {
        lastNormalizedLabel = null;
      }
      items.push({ type: "data", row: entry.row });
    }
    return items;
  })();

  const hasDataRows = renderItems.some((item) => item.type === "data");

  const renderCompositeCell = (
    cell: string,
    quartiles: { q1: number; q2: number; q3: number }
  ) => {
    const value = parseNumber(cell);
    const COLORS = {
      green: "#22C55E",
      yellow: "#F59E0B",
      orange: "#F97316",
      red: "#DC2626",
    } as const;
    let color: (typeof COLORS)[keyof typeof COLORS] = COLORS.red;
    if (!Number.isNaN(value) && !Number.isNaN(quartiles.q1)) {
      if (value <= quartiles.q1) color = COLORS.red;
      else if (value <= quartiles.q2) color = COLORS.orange;
      else if (value <= quartiles.q3) color = COLORS.yellow;
      else color = COLORS.green;
    }
    return (
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <circle cx="6" cy="6" r="6" fill={color} />
        </svg>
        <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
          {cell}
        </span>
      </div>
    );
  };

  const renderStatusCell = (value: string) => {
    const raw = (value ?? "").toString();
    if (isNA(raw)) {
      return <span>Data N/A</span>;
    }
    const normalized = normalize(raw);
    let color: string | null = null;
    if (
      normalized === "yes" ||
      normalized === "available" ||
      normalized === "clean"
    )
      color = "#22C55E";
    else if (
      normalized === "no" ||
      normalized === "unqualified" ||
      normalized === "not available" ||
      normalized === "disclaimer"
    )
      color = "#DC2626";
    else if (
      normalized === "partially" ||
      normalized === "partial" ||
      normalized === "partly" ||
      normalized === "qualified"
    )
      color = "#F59E0B";

    return (
      <div className="flex items-center gap-2">
        {color && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-label="status"
          >
            <circle cx="6" cy="6" r="6" fill={color} />
          </svg>
        )}
        <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
          {raw}
        </span>
      </div>
    );
  };

  const quartiles = useMemo(() => {
    if (compositeIndex < 0) return { q1: NaN, q2: NaN, q3: NaN };
    const values: number[] = [];
    for (const row of dataRows) {
      const first = (row?.[0] ?? "").toString();
      if (/^\s*ministry\b/i.test(first)) continue;
      const value = parseNumber(row?.[compositeIndex] ?? "");
      if (!Number.isNaN(value)) values.push(value);
    }
    if (values.length === 0) return { q1: NaN, q2: NaN, q3: NaN };
    values.sort((a, b) => a - b);
    const idx = (p: number) => Math.floor(p * (values.length - 1));
    return {
      q1: values[idx(0.25)],
      q2: values[idx(0.5)],
      q3: values[idx(0.75)],
    };
  }, [dataRows, compositeIndex]);

  const handleScrollRight = () => {
    const tableWrapper = document.getElementById("table-wrapper");
    if (!tableWrapper) return;
    let scrollStep =
      window.innerWidth >= 1280 ? 288 : window.innerWidth >= 768 ? 225 : 160;
    tableWrapper.scrollBy({ left: scrollStep, behavior: "smooth" });
  };

  const handleScrollLeft = () => {
    const tableWrapper = document.getElementById("table-wrapper");
    if (!tableWrapper) return;
    let scrollStep =
      window.innerWidth >= 1280 ? 288 : window.innerWidth >= 768 ? 225 : 160;
    tableWrapper.scrollBy({ left: -scrollStep, behavior: "smooth" });
  };

  if (error) return <p className="text-red-500">{error}</p>;
  if (rows.length === 0)
    return (
      <p className="text-gray-500 pb-6 text-xl font-sourcecodepro font-medium">
        Loading dataset...
      </p>
    );

  return (
    <div className="relative">
      <div className="shadow-md border p-4 border-gray-200 rounded-lg">
        <div
          id="table-wrapper"
          className="overflow-x-auto overflow-y-auto max-w-full box-content"
        >
          <div className="w-[1200px] table-inner">
            <table className="border-collapse bg-white border-b border-gray-100 min-w-max rounded-lg">
              <thead ref={theadRef}>
                {(() => {
                  const onToggle = () => {
                    setSortOrder((prev) =>
                      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
                    );
                  };
                  const sortIcon = (
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
                      {sortOrder === "asc" ? (
                        <path d="M6 15l6-6 6 6" />
                      ) : sortOrder === "desc" ? (
                        <path d="M18 9l-6 6-6-6" />
                      ) : (
                        <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                      )}
                    </svg>
                  );
                  return (
                    <>
                      <tr ref={topHeaderRowRef}>
                        <th className="sticky top-0 left-0 z-20 bg-brand-1-700 px-3 py-3.5 text-left text-lg/7 font-sourcecodepro font-semibold uppercase text-brand-white !w-[160px] md:!w-[225px] xl:!w-[300px]">
                          {firstRowFirstColumnLabel}
                        </th>
                        {firstRowGroups.map((group) => (
                          <th
                            key={group.key}
                            className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3 text-center border-b border-brand-1-300 font-sourcecodepro text-lg/7 font-semibold uppercase text-brand-white/60"
                            colSpan={group.colSpan}
                          >
                            {(group.label ?? " ").toString().toUpperCase() ||
                              " "}
                          </th>
                        ))}
                      </tr>
                      <tr>
                        <th
                          className="sticky left-0 z-20 bg-brand-1-700 px-3 py-3.5 text-left text-base font-sourcecodepro font-semibold text-brand-white !w-[160px] md:!w-[225px] xl:!w-[300px]"
                          style={{ top: topHeaderHeight }}
                        >
                          {firstColumnLabel.toString()}
                        </th>
                        {secondaryHeaders.map((label, i) => {
                          const originalIndex = effectiveColumnIndices[i + 1];
                          const isComposite =
                            compositeIndex >= 0 &&
                            originalIndex === compositeIndex;
                          const clickable = isComposite && compositeIndex >= 0;
                          const sharedFirstRowClass =
                            "sticky top-0 z-10 bg-brand-1-700 px-3 py-3 text-center border-b border-brand-1-300 font-sourcecodepro text-lg/7 font-semibold uppercase text-brand-white/60";
                          const defaultSecondRowClass =
                            "sticky z-10 bg-brand-1-700 px-3 py-3.5 text-left text-sm md:text-base font-sourcecodepro font-medium text-brand-white w-[160px] md:w-[155px] xl:w-[210px] border-b border-brand-1-300";
                          const className = isComposite
                            ? sharedFirstRowClass
                            : defaultSecondRowClass;
                          return (
                            <th
                              key={`sub-${i}`}
                              className={className}
                              style={{
                                top: topHeaderHeight,
                                cursor: clickable ? "pointer" : undefined,
                              }}
                              onClick={clickable ? onToggle : undefined}
                            >
                              {isComposite ? (
                                <span className="inline-flex items-center gap-1 select-none">
                                  {label}
                                  {sortIcon}
                                </span>
                              ) : (
                                label
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    </>
                  );
                })()}
              </thead>
              <tbody className="divide-y divide-gray-300">
                {!hasDataRows && (
                  <tr>
                    <td
                      colSpan={Math.max(totalColumns, 1)}
                      className="px-3 py-3.5 text-left text-base/6 font-medium text-gray-500"
                    >
                      {tokens.length
                        ? "No matching results."
                        : "No data available."}
                    </td>
                  </tr>
                )}
                {renderItems.map((item, idx) => {
                  if (item.type === "ministry") {
                    return (
                      <tr key={`min-${item.label}-${idx}`}>
                        {remainingColumns > 0 && (
                          <td
                            colSpan={remainingColumns}
                          className="sticky left-0 z-20 !w-[160px] border-b border-gray-100 bg-gray-50 px-3 py-3.5 text-left text-base/6 font-sourcecodepro font-semibold text-brand-1-700 md:!w-[225px] xl:!w-[300px]"
                          style={{ top: headerOffset }}
                        >
                          {item.label}
                        </td>
                        )}
                        {/* {remainingColumns > 0 && (
                          <td
                            colSpan={remainingColumns}
                            className="border-b border-gray-100 bg-gray-50"
                          />
                        )} */}
                      </tr>
                    );
                  }
                  const displayRow = effectiveColumnIndices.map(
                    (colIdx) => item.row[colIdx] ?? ""
                  );
                  return (
                    <tr key={`row-${idx}`}>
                      {displayRow.map((cell, cellIndex) => {
                        const isComposite = cellIndex === compositeDisplayIndex;
                        const isFirstColumn = cellIndex === 0;
                        return (
                          <td
                            key={cellIndex}
                            className={`border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-sourcecodepro font-medium ${
                              isFirstColumn
                                ? "sticky left-0 z-20 text-brand-black !w-[160px] md:!w-[225px] xl:!w-[300px] bg-white"
                                : "text-gray-500 w-[160px] md:w-[155px] xl:w-[210px]"
                            }`}
                          >
                            {isFirstColumn
                              ? cell
                              : isComposite
                                ? renderCompositeCell(cell, quartiles)
                                : renderStatusCell(cell)}
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
          className="absolute z-20 top-8 right-6 bg-brand-white border border-brand-white hover:bg-slate-100 text-brand-black p-1 rounded-full shadow-md transition-all duration-200"
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
  );
}
