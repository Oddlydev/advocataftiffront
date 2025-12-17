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
  "Balance of Payment (BOP) (USD million)",
  "Balance of Payment (BOP) (USD mn)",
  "Balance of Payment (BOP) (US$ mn)",
  "Balance of Payment (BOP) (US dollars)",
  "Balance of Payment (BOP) USD million",
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

      const columnKeys = Object.keys(row).filter(Boolean);
      const valueKey = columnKeys.length > 1 ? columnKeys[1] : undefined;
      const value = valueKey ? pickNumeric(row, [valueKey]) : null;

      return {
        year,
        BOP: value,
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
      yAxisLabelColumnIndex={1}
    />
  );
}
