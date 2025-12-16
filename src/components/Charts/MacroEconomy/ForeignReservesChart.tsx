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

const ORA_HEADERS = [
  "Official Reserve Assets (USD mn)",
  "Official Reserve Assets",
  "Foreign Reserves",
  "ORA",
];

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

      return {
        year,
        ORA: pickNumeric(row, ORA_HEADERS),
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
    />
  );
}
