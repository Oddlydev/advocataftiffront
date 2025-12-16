"use client";

import { useCallback, useMemo } from "react";
import type { DSVRowString } from "d3-dsv";
import { MacroChartWrapperProps } from "./MacroLineChart";
import {
  MacroBarChart,
  type MacroBarDatum,
  type MacroSeriesConfig,
} from "./MacroBarChart";
import { extractYear, pickNumeric } from "./utils";

const BOP_HEADERS = [
  "Balance of Payment (BOP) USD mn",
  "Balance of Payments (BOP) USD mn",
  "Balance of Payments",
  "Balance of Payment",
  "BOP",
];

const seriesConfig: MacroSeriesConfig[] = [
  {
    key: "BOP",
    label: "Balance of Payments",
    color: "#CF1244",
    valueFormatter: (value) =>
      value === null ? "N/A" : Number(value).toLocaleString("en-US"),
  },
];

export function ForeignExchangeChart({
  datasetUrl,
  controlIds,
}: MacroChartWrapperProps) {
  const series = useMemo(() => seriesConfig, []);

  const parseRow = useCallback(
    (row: DSVRowString<string>): MacroBarDatum | null => {
      const year = extractYear(row);
      if (year === null) {
        return null;
      }

      return {
        year,
        BOP: pickNumeric(row, BOP_HEADERS),
      };
    },
    []
  );

  return (
    <MacroBarChart
      datasetUrl={datasetUrl}
      controlIds={controlIds}
      parseRow={parseRow}
      series={series}
      yAxisLabel="Balance of Payments (USD Mn.)"
      yMaxPadding={2}
    />
  );
}
