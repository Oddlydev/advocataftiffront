"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface CsvTableProps {
  csvUrl: string;
  filterQuery?: string;
  pageSize?: number; // default rows per page
}

export default function CsvTable({ csvUrl, filterQuery, pageSize = 10 }: CsvTableProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const cacheKey = `csvRows:${csvUrl}`;
  const memCache: { [key: string]: string[][] } =
    (globalThis as any).__csvRowsCache || ((globalThis as any).__csvRowsCache = {});

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

  const visibleRows = tokens.length
    ? dataRows.filter((row) =>
        tokens.every((t) => row.some((cell) => norm(cell).includes(t)))
      )
    : dataRows;

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
    if (!value || value.trim() === "" || value.toLowerCase().includes("data n/a")) {
      return <span className="text-brand-1-600 font-medium">Data N/A</span>;
    }
    const num = Number(value);
    if (!isNaN(num)) return num.toLocaleString("en-US");
    return value;
  };

return (
  <div className="bg-white py-3.5 md:py-5 xl:py-6">
    <div className="mx-auto max-w-7xl">
      <div className="shadow-md border p-4 border-gray-200 rounded-lg">
        <div
          id="table-wrapper"
          className="overflow-x-auto overflow-y-auto max-w-full box-content"
        >
          <div className="w-[1200px] table-inner">
            <table className="border-collapse bg-white border-b border-gray-100 min-w-max rounded-lg">
              <thead className="rounded-t-lg">
                <tr>
                  {headers.map((header, i) => (
                    <th
                      key={i}
                      className={`px-3 py-3.5 text-left text-lg/7 font-semibold font-sourcecodepro uppercase text-brand-white bg-brand-1-700
                        ${i === 0 ? "sticky top-0 left-0 z-20 rounded-tl-lg" : ""}
                        ${i === headers.length - 1 ? "rounded-tr-lg" : ""}
                        w-[160px] md:w-[225px] xl:w-[288px]`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-300">
                {/* Sector row example */}
                <tr className="border-gray-100">
                  <td className="sector sticky top-0 left-0 z-20 bg-brand-white text-brand-1-700 px-3 py-3.5 text-left text-base/6 font-sourcecodepro font-semibold w-[160px] md:whitespace-nowrap">
                    Aviation
                  </td>
                  {Array(headers.length - 1)
                    .fill(null)
                    .map((_, idx) => (
                      <td
                        key={idx}
                        className="bg-brand-white border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-medium font-sourcecodepro text-gray-500 w-[160px]"
                      ></td>
                    ))}
                </tr>

                {/* No data row */}
                {visibleRows.length === 0 && (
                  <tr>
                    {headers.map((_, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="bg-white border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-medium font-sourcecodepro text-gray-500 w-[160px] md:w-[225px] xl:w-[288px]"
                      >
                        <span className="text-brand-1-600">Data N/A</span>
                      </td>
                    ))}
                  </tr>
                )}

                {visibleRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className={`bg-white border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-medium text-gray-500 font-sourcecodepro 
                          ${cellIndex === 0 ? "sticky left-0 text-brand-black md:whitespace-nowrap" : "text-gray-500"}
                          w-[160px] md:w-[225px] xl:w-[288px]`}
                      >
                        {formatCell(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Button Section Start */}
      <div className="mx-auto max-w-7xl pt-6 md:pt-9 pb-16">
        <div>
          <div className="grid md:flex gap-7 items-center justify-start md:justify-end w-full">
            <div>
              <p className="text-base/6 font-medium font-sourcecodepro text-slate-600">
                Interpretation of the indicators :
              </p>
            </div>
            <div className="flex items-center gap-3 md:gap-5">
              {/* Good */}
              <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                  Good
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
                  <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
                    1
                  </span>
                </div>
              </div>

              {/* Average */}
              <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                  Average
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
                  <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
                    0.5
                  </span>
                </div>
              </div>

              {/* Poor */}
              <div className="flex items-center gap-3">
                <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                  Poor
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
                  <span className="text-gray-500 font-sourcecodepro text-base/6 font-medium">
                    0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Button Section End */}
    </div>
  </div>
);

}
