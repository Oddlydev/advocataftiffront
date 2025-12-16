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
              <div className="absolute -top-4 right-0 flex gap-2 z-10 hidden">
                <button
                  id={controlIds.zoomInId}
                  aria-label="Zoom in"
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  +
                </button>
                <button
                  id={controlIds.zoomOutId}
                  aria-label="Zoom out"
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  -
                </button>
                <button
                  id={controlIds.resetId}
                  aria-label="Reset zoom"
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  Reset
                </button>
              </div>

              <div className="relative w-full h-[300px] md:h-[320px] xl:h-[420px]">
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
