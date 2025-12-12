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

// Formatters
const fmt0 = (v: number | null) =>
  v === null ? "N/A" : v.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmt3 = (v: number | null) =>
  v === null ? "N/A" : v.toLocaleString("en-US", { maximumFractionDigits: 3 });

const seriesConfig: MacroSeriesConfig[] = [
  {
    key: "TD",
    label: "Debt as a % of GDP",
    color: "#4B0619",
    valueFormatter: fmt0,
    axis: "left",
    tooltipUseRawValue: true,
  },
  {
    key: "DPP_MN",
    label: "Debt Per Person (Rs.)",
    color: "#EB1A52",
    valueFormatter: fmt3,
    axis: "right",
    tooltipUseRawValue: true,
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

      const columnKeys = Object.keys(row).filter((key) => key);

      // 2nd column (index 1) -> Total Debt (left axis)
      const totalDebtKey = columnKeys[1];
      const totalDebtMn =
        totalDebtKey != null ? pickNumeric(row, [totalDebtKey]) : null;

      // 5th column (index 4) -> Debt Per Person (right axis)
      const dppKey = columnKeys[4];
      const dppMn = dppKey != null ? pickNumeric(row, [dppKey]) : null;

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
      yAxisLabelColumnIndexes={{ left: 1, right: 4 }}
      yMaxPadding={2}
    />
  );
}
