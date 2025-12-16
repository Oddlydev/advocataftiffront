import React from "react";
import type { DSVRowString } from "d3-dsv";
import {
  MacroBarChart,
  type MacroBarDatum,
  type MacroSeriesConfig,
} from "@/src/components/Charts/MacroEconomy/MacroBarChart";
import { extractYear, pickNumeric } from "@/src/components/Charts/MacroEconomy/utils";

const SERIES: MacroSeriesConfig[] = [
  {
    key: "seriesA",
    label: "Series A",
    color: "#4B0619",
  },
  {
    key: "seriesB",
    label: "Series B",
    color: "#EB1A52",
  },
];

function parseRow(row: DSVRowString<string>): MacroBarDatum | null {
  const year = extractYear(row);
  if (year == null) return null;

  const seriesA = pickNumeric(row, ["SeriesA", "Series A"]);
  const seriesB = pickNumeric(row, ["SeriesB", "Series B"]);

  return {
    year,
    seriesA,
    seriesB,
  };
}

export default function PageBarChartTest() {
  const controlIds = {
    zoomInId: "bar-chart-test-zoom-in",
    zoomOutId: "bar-chart-test-zoom-out",
    resetId: "bar-chart-test-reset",
  };

  return (
    <main>
      <div className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <h1 className="text-2xl font-montserrat font-bold text-slate-950">
            Macro Bar Chart Test
          </h1>

          <div className="mt-6 border border-gray-200 rounded-xl py-6 px-5">
            <div className="relative">
              <div className="absolute -top-4 right-0 flex gap-2 z-10">
                <button
                  id={controlIds.zoomInId}
                  aria-label="Zoom in"
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  
                  <svg
                    className="size-2 md:size-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M7.33333 13.0002C10.2789 13.0002 12.6667 10.6123 12.6667 7.66683C12.6667 4.72131 10.2789 2.3335 7.33333 2.3335C4.38781 2.3335 2 4.72131 2 7.66683C2 10.6123 4.38781 13.0002 7.33333 13.0002Z"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.9996 14.3335L11.0996 11.4335"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.33398 5.66681V9.66681"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33398 7.66681H9.33398"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  id={controlIds.zoomOutId}
                  aria-label="Zoom out"
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    className="size-2 md:size-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M7.33333 13.0002C10.2789 13.0002 12.6667 10.6123 12.6667 7.66683C12.6667 4.72131 10.2789 2.3335 7.33333 2.3335C4.38781 2.3335 2 4.72131 2 7.66683C2 10.6123 4.38781 13.0002 7.33333 13.0002Z"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.9996 14.3335L11.0996 11.4335"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.33398 7.66681H9.33398"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  id={controlIds.resetId}
                  aria-label="Reset zoom"
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    className="size-2 md:size-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M2 8.3335C2 9.52018 2.35189 10.6802 3.01118 11.6669C3.67047 12.6536 4.60754 13.4226 5.7039 13.8768C6.80026 14.3309 8.00666 14.4497 9.17054 14.2182C10.3344 13.9867 11.4035 13.4153 12.2426 12.5761C13.0818 11.737 13.6532 10.6679 13.8847 9.50404C14.1162 8.34015 13.9974 7.13375 13.5433 6.0374C13.0892 4.94104 12.3201 4.00397 11.3334 3.34468C10.3467 2.68539 9.18669 2.3335 8 2.3335C6.32263 2.33981 4.71265 2.99431 3.50667 4.16016L2 5.66683"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 2.3335V5.66683H5.33333"
                      stroke="#374151"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative w-full">
                <MacroBarChart
                  datasetUrl="/test-bar-chart.csv"
                  parseRow={parseRow}
                  series={SERIES}
                  yAxisLabel="Value"
                  controlIds={controlIds}
                  yMaxPadding={2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
