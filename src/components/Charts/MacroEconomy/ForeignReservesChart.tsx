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

const seriesConfig: MacroSeriesConfig[] = [
  {
    key: "ORA",
    label: "Official Reserve Assets",
    color: "#CF1244",
    valueFormatter: (value) =>
      value === null ? "N/A" : Number(value).toLocaleString("en-US"),
  },
];

export function ForeignReservesChart({
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
        ORA: value,
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
      yAxisLabel="Official Reserve Assets (USD Mn.)"
      yMaxPadding={2}
      yAxisLabelColumnIndex={1}
    />
  );
}
