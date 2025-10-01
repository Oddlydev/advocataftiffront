"use client";

import { useCallback, useMemo } from "react";
import type { DSVRowString } from "d3-dsv";
import {
  MacroChartWrapperProps,
  MacroLineChart,
  MacroLineDatum,
  MacroSeriesConfig,
} from "./MacroLineChart";
import { extractYear, pickNumeric, percentFormatter } from "./utils";

const seriesConfig: MacroSeriesConfig[] = [
  { key: "all", label: "All Items", color: "#4B0619", valueFormatter: percentFormatter },
  {
    key: "food",
    label: "Food & Non-Alcoholic Beverages",
    color: "#EB1A52",
    valueFormatter: percentFormatter,
  },
  {
    key: "nonFood",
    label: "Non - Food Items",
    color: "#F58FAA",
    valueFormatter: percentFormatter,
  },
];

const ALL_HEADERS = [
  "All Items (%)",
  "All Items",
  "All",
  "All_Items",
];

const FOOD_HEADERS = [
  "Food & Non-Alchoholic Beverages (%)",
  "Food & Non-Alcoholic Beverages (%)",
  "Food & Non-Alcoholic Beverages",
  "Food",
];

const NON_FOOD_HEADERS = [
  "Non - Food Items (%)",
  "Non - Food Items",
  "Non Food",
  "nonFood",
];

export function InflationChart({ datasetUrl, controlIds }: MacroChartWrapperProps) {
  const series = useMemo(() => seriesConfig, []);

  const parseRow = useCallback(
    (row: DSVRowString<string>): MacroLineDatum | null => {
      const year = extractYear(row);
      if (year === null) {
        return null;
      }

      return {
        year,
        all: pickNumeric(row, ALL_HEADERS),
        food: pickNumeric(row, FOOD_HEADERS),
        nonFood: pickNumeric(row, NON_FOOD_HEADERS),
      };
    },
    []
  );

  return (
    <MacroLineChart
      datasetUrl={datasetUrl}
      controlIds={controlIds}
      parseRow={parseRow}
      series={series}
      yAxisLabel="Inflation Rate (%)"
      yMaxPadding={2}
    />
  );
}
