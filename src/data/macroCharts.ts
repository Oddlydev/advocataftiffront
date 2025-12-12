import type { CSSProperties } from "react";

export type MacroLegendItem = {
  label: string;
  indicatorClassName?: string;
  indicatorStyle?: CSSProperties;
};

export type MacroChartMetadata = {
  chartTitle: string;
  chartSubtitle: string;
  legendItems?: MacroLegendItem[];
  dataSource: string;
  dataSourceNote?: string;
};

export const MACRO_FALLBACK_SLUG = "inflation";

export const MACRO_CHART_METADATA: Record<string, MacroChartMetadata> = {
  inflation: {
    chartTitle: "Average Annual Inflation",
    chartSubtitle:
      "Percentage change in prices for consumer goods and services (2015-2024)",
    legendItems: [
      {
        indicatorClassName: "bg-brand-1-900 inset-shadow-brand-1-950",
        label: "All Items",
      },
      {
        indicatorClassName: "bg-brand-1-500",
        label: "Food & Non-Alcoholic Beverages",
      },
      {
        indicatorClassName: "bg-brand-1-200",
        label: "Non - Food Items",
      },
    ],
    dataSource: "Data Source: Department of Census and Statistics, Sri Lanka",
    dataSourceNote: "Average Annual Inflation 2015 - 2024",
  },
  "foreign-exchange": {
    chartTitle: "Foreign Exchange Inflows and Outflows",
    chartSubtitle: "Balance of Payment (BOP) 2010 - 2024 (USD Millions)",
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Sri Lanka's Balance of Payment (BOP) 2010 - 2024",
  },
  "foreign-reserves": {
    chartTitle: "Total Annual Foreign Reserves",
    chartSubtitle: "Official Reserve Assets in USD Millions (2013-2024)",
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Foreign Reserves 2013 - 2024",
  },
  unemployment: {
    chartTitle: "Annual Unemployment Rate",
    chartSubtitle: "Annual Unemployment Rate (%) (2009-2023)",
    dataSource: "Data Source: Department of Census and Statistics, Sri Lanka",
    dataSourceNote: "Annual Unemployment Rate 2009 - 2023",
  },
  "gdp-growth": {
    chartTitle: "Annual GDP Growth Rate",
    chartSubtitle: "GDP Growth Rate (%) (2010-2024)",
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "GDP Growth Rate 2010 - 2024",
  },
  "interest-rates": {
    chartTitle: "Annual Average Interest Rates (Lending and Deposit)",
    chartSubtitle: "AWNFDR, AWNDR, AWNLR, AWPLR (2010-2024)",
    legendItems: [
      { indicatorClassName: "bg-brand-1-200", label: "AWNFDR" },
      { indicatorClassName: "bg-brand-1-950", label: "AWNDR" },
      { indicatorClassName: "bg-brand-1-700", label: "AWNLR" },
      // { indicatorClassName: "bg-brand-1-500", label: "AWPLR" },
    ],
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Annual Average Interest Rates 2010 - 2024",
  },
  "national-debt": {
    chartTitle: "Total Government Debt Per Person",
    chartSubtitle: "Government Debt Owed by Each Individual in Rs. (2010-2024)",
    legendItems: [
      {
        indicatorClassName: "bg-brand-1-900 inset-shadow-brand-1-950",
        label: "Debt as a % of GDP",
      },
      {
        indicatorClassName: "bg-brand-1-500",
        label: "Debt Per Person (Rs. '000)",
      },
    ],
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Government Debt 2010 - 2024",
  },
};
