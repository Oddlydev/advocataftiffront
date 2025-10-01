"use client";

import { useCallback, useMemo } from "react";
import type { DSVRowString } from "d3-dsv";
import {
  MacroChartWrapperProps,
  MacroLineChart,
  MacroLineDatum,
  MacroSeriesConfig,
} from "./MacroLineChart";
import { extractYear, pickNumeric } from "./utils";

const TOTAL_DEBT_HEADERS = [
  "Total Govt Debt (Rs. Mn)",
  "Total Government Debt (Rs. Mn)",
  "Total Debt",
  "TD",
];

const DEBT_PER_PERSON_HEADERS = [
  "Debt Per Person (Rs.)",
  "Debt Per Person",
  "DPP",
];

const formatCurrency = (value: number | null) =>
  value === null ? "N/A" : Number(value).toLocaleString("en-US");

const seriesConfig: MacroSeriesConfig[] = [
  { key: "TD", label: "Total Debt (Rs. Mn)", color: "#4B0619", valueFormatter: formatCurrency },
  { key: "DPP", label: "Debt Per Person (Rs.)", color: "#EB1A52", valueFormatter: formatCurrency },
];

export function NationalDebtChart({ datasetUrl, controlIds }: MacroChartWrapperProps) {
  const series = useMemo(() => seriesConfig, []);

  const parseRow = useCallback(
    (row: DSVRowString<string>): MacroLineDatum | null => {
      const year = extractYear(row);
      if (year === null) {
        return null;
      }

      return {
        year,
        TD: pickNumeric(row, TOTAL_DEBT_HEADERS),
        DPP: pickNumeric(row, DEBT_PER_PERSON_HEADERS),
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
      yAxisLabel="Total Debt (Rs. Mn.)"
      yMaxPadding={2}
    />
  );
}
