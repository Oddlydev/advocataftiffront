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

const AWNFDR_HEADERS = ["AWNFDR (%)", "AWNFDR %", "AWNFDR"];

const AWNDR_HEADERS = ["AWNDR (%)", "AWNDR %", "AWNDR"];

const AWNLR_HEADERS = ["AWNLR (%)", "AWNLR %", "AWNLR"];

const AWPLR_HEADERS = [
  "AWPLR (%)",
  "AWPLR %",
  "AWPLR",
  "Average Weighted Prime Lending Rate (AWPLR) (%)",
];

const seriesConfig: MacroSeriesConfig[] = [
  {
    key: "AWNFDR",
    label: "AWNFDR",
    color: "#F58FAA",
    valueFormatter: percentFormatter,
  },
  {
    key: "AWNDR",
    label: "AWNDR",
    color: "#1C0209",
    valueFormatter: percentFormatter,
  },
  {
    key: "AWNLR",
    label: "AWNLR",
    color: "#A90E38",
    valueFormatter: percentFormatter,
  },
  {
    key: "AWPLR",
    label: "AWPLR",
    color: "#EA1A52",
    valueFormatter: percentFormatter,
  },
];

export function InterestRatesChart({
  datasetUrl,
  controlIds,
}: MacroChartWrapperProps) {
  const series = useMemo(() => seriesConfig, []);

  const parseRow = useCallback(
    (row: DSVRowString<string>): MacroLineDatum | null => {
      const year = extractYear(row);
      if (year === null) {
        return null;
      }

      return {
        year,
        AWNFDR: pickNumeric(row, AWNFDR_HEADERS),
        AWNDR: pickNumeric(row, AWNDR_HEADERS),
        AWNLR: pickNumeric(row, AWNLR_HEADERS),
        AWPLR: pickNumeric(row, AWPLR_HEADERS),
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
      yAxisLabel="Average Weighted Rates (%)"
      yMaxPadding={2}
    />
  );
}
