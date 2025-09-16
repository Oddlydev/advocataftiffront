"use client";

import React, { useEffect, useState } from "react";
import Papa from "papaparse";

interface CsvTransparencyProps {
  csvUrl: string;
  filterQuery?: string;
}

export default function CsvTransparency({
  csvUrl,
  filterQuery,
}: CsvTransparencyProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!csvUrl) {
      setError("No CSV file URL provided.");
      return;
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
          setError("Error parsing CSV.");
          console.error("CSV Parse Errors:", result.errors);
        } else {
          setRows(result.data as string[][]);
          setError(null);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [csvUrl]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (rows.length === 0)
    return <p className="text-gray-500">Loading dataset...</p>;

  const headers = rows[0];
  const dataRows = rows.slice(1);

  // Normalize function: lowercase, collapse whitespace, replace NBSP
  const norm = (s: string) =>
    (s ?? "")
      .toLowerCase()
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  // Tokenize query by spaces; require ALL tokens to match somewhere in the row
  const tokens = norm(filterQuery ?? "")
    .split(" ")
    .filter(Boolean);
  const visibleRows = tokens.length
    ? dataRows.filter((row) =>
        tokens.every((t) => row.some((cell) => norm(cell).includes(t)))
      )
    : dataRows;

  // For cells with Yes/No/Partially etc. => return colored dot + text
  const renderStatusCell = (value: string) => {
    const lower = value.toLowerCase();
    let color = "#9CA3AF"; // gray default
    if (lower === "yes")
      color = "#22C55E"; // green
    else if (lower === "no")
      color = "#DC2626"; // red
    else if (lower === "partially")
      color = "#F59E0B"; // yellow
    else if (lower.includes("qualified")) color = "#F59E0B"; // orange for audits

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
          {value}
        </span>
      </div>
    );
  };

  return (
    <div className="shadow-md border p-4 border-gray-200 rounded-lg">
      <div
        id="table-wrapper"
        className="overflow-x-auto overflow-y-auto max-w-full box-content"
      >
        <div className="w-[1200px] table-inner">
          <table className="border-collapse bg-white border-b border-gray-100 min-w-max rounded-lg">
            <thead className="bg-brand-1-700 rounded-lg">
              {/* Header row 1 */}
              <tr>
                <th
                  className="sticky top-0 left-0 z-20 rounded-tl-lg bg-brand-1-700 px-3 py-3.5 text-left text-lg/7 font-semibold uppercase text-brand-white w-[160px]"
                  rowSpan={2}
                >
                  SOE
                </th>
                <th
                  className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3.5 text-center border-b text-lg/7 font-semibold uppercase text-brand-white/60"
                  colSpan={3}
                >
                  Annual report
                </th>
                <th
                  className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3.5 text-center border-b text-lg/7 font-semibold uppercase text-brand-white/60"
                  colSpan={2}
                >
                  Auditing Standards
                </th>
                <th
                  className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3.5 text-center border-b text-lg/7 font-semibold uppercase text-brand-white/60"
                  colSpan={2}
                >
                  Right to Information
                </th>
                <th
                  className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3.5 text-center border-b text-lg/7 font-semibold uppercase text-brand-white/60"
                  colSpan={3}
                >
                  Accessibility of Information
                </th>
              </tr>

              {/* Header row 2 (from CSV headers) */}
              <tr>
                {headers.slice(1).map((h, i) => (
                  <th
                    key={i}
                    className="sticky top-0 z-10 bg-brand-1-700 px-3 py-3.5 text-left text-base/6 font-semibold uppercase text-brand-white w-[160px]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-300">
              {visibleRows.length === 0 && (
                <tr>
                  <td
                    className="px-3 py-3.5 text-left text-base/6 font-medium text-gray-500"
                    colSpan={headers.length}
                  >
                    {tokens.length
                      ? "No matching results."
                      : "No data available."}
                  </td>
                </tr>
              )}
              {visibleRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, i) => (
                    <td
                      key={i}
                      className={`bg-white border-b border-gray-100 px-3 py-3.5 text-left text-base/6 font-medium 
            ${
              i === 0
                ? "sticky left-0 text-brand-black md:whitespace-nowrap"
                : "text-gray-500"
            } w-[160px]`}
                    >
                      {i === 0
                        ? cell // SOE name
                        : i === 1
                          ? cell // Year column → plain text only
                          : renderStatusCell(cell)}{" "}
                      {/* All other columns */}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
