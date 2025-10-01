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

const UNEMPLOYMENT_HEADERS = [
  "Unemployment Rate (%)",
  "Unemployment Rate",
  "UnemploymentRate",
  "Unemployment",
];

const seriesConfig: MacroSeriesConfig[] = [
  {
    key: "UnemploymentRate",
    label: "Unemployment Rate",
    color: "#CF1244",
    valueFormatter: percentFormatter,
  },
];

export function UnemploymentChart({ datasetUrl, controlIds }: MacroChartWrapperProps) {
  const series = useMemo(() => seriesConfig, []);

  const parseRow = useCallback(
    (row: DSVRowString<string>): MacroLineDatum | null => {
      const year = extractYear(row);
      if (year === null) {
        return null;
      }

      return {
        year,
        UnemploymentRate: pickNumeric(row, UNEMPLOYMENT_HEADERS),
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
      yAxisLabel="Unemployment Rate (%)"
      yMaxPadding={2}
    />
  );
}
