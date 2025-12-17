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

      const columnKeys = Object.keys(row).filter((key) => key);
      const valueKey = columnKeys.length > 1 ? columnKeys[1] : undefined;
      const value = valueKey ? pickNumeric(row, [valueKey]) : null;

      return {
        year,
        UnemploymentRate: value,
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
      yAxisLabelColumnIndexes={{ left: 1 }}
      yMaxPadding={2}
    />
  );
}
