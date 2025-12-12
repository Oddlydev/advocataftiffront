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

const GDP_HEADERS = [
  "GDP Growth Rate (%)",
  "GDP Growth Rate",
  "GDP Growth",
  "GDP",
];

const seriesConfig: MacroSeriesConfig[] = [
  {
    key: "GDP",
    label: "GDP Growth Rate",
    color: "#CF1244",
    valueFormatter: percentFormatter,
  },
];

export function GDPGrowthChart({ datasetUrl, controlIds }: MacroChartWrapperProps) {
  const series = useMemo(() => seriesConfig, []);

  const parseRow = useCallback(
    (row: DSVRowString<string>): MacroLineDatum | null => {
      const year = extractYear(row);
      if (year === null) {
        return null;
      }

      return {
        year,
        GDP: pickNumeric(row, GDP_HEADERS),
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
      yAxisLabel="GDP Growth Rate (%)"
      axisLabelsFromCsv
      yMaxPadding={2}
    />
  );
}
