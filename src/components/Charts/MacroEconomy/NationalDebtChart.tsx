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

const POPULATION_HEADERS = [
  "Total Mid Year Population",
  "Mid Year Population",
  "Total Population",
  "Population",
];

const DPP_RS_HEADERS = ["Debt Per Person (Rs.)", "Debt Per Person", "DPP"];

// Formatters
const fmt0 = (v: number | null) =>
  v === null ? "N/A" : v.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmt3 = (v: number | null) =>
  v === null ? "N/A" : v.toLocaleString("en-US", { maximumFractionDigits: 3 });

const seriesConfig: MacroSeriesConfig[] = [
  {
    key: "TD",
    label: "Total Debt (Rs. Mn)",
    color: "#4B0619",
    valueFormatter: fmt0,
    axis: "left",
    formatInMillions: true,
  },
  {
    key: "DPP_MN",
    label: "Debt Per Person (Rs. Mn)",
    color: "var(--brand-1-500)",
    valueFormatter: fmt3,
    axis: "right",
  },
];

export function NationalDebtChart({
  datasetUrl,
  controlIds,
}: MacroChartWrapperProps) {
  const series = useMemo(() => seriesConfig, []);

  const parseRow = useCallback(
    (row: DSVRowString<string>): MacroLineDatum | null => {
      const year = extractYear(row);
      if (year === null) return null;

      // Total Govt Debt in Rs. Mn (3rd column)
      const totalDebtMn = pickNumeric(row, TOTAL_DEBT_HEADERS);

      // Population (4th column)
      const population = pickNumeric(row, POPULATION_HEADERS);

      // Derived Debt Per Person in Rs. Mn = (Total Debt Rs. Mn) / Population
      let dppMn: number | null = null;
      if (totalDebtMn !== null && population !== null && population !== 0) {
        dppMn = totalDebtMn / population;
      } else {
        // Fallback: if dataset already includes "Debt Per Person (Rs.)", convert to Rs. Mn
        const dppRs = pickNumeric(row, DPP_RS_HEADERS);
        if (dppRs !== null) dppMn = dppRs / 1_000_000;
      }

      return {
        year,
        TD: totalDebtMn,
        DPP_MN: dppMn,
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
      yAxisRightLabel="Debt Per Person (Rs. Mn.)" // dual axis enabled here only
      yMaxPadding={2}
    />
  );
}
