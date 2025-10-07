"use client";

import { useMemo } from "react";
import type { ComponentType } from "react";
import FeaturedFiscalSankeyChart from "@/src/components/Charts/Fiscal/FeaturedFiscalSankeyChart";
import {
  ForeignExchangeChart,
  ForeignReservesChart,
  GDPGrowthChart,
  InflationChart,
  InterestRatesChart,
  MacroChartWrapperProps,
  NationalDebtChart,
  UnemploymentChart,
} from "@/src/components/Charts/MacroEconomy";
import {
  MACRO_CHART_METADATA,
  MACRO_FALLBACK_SLUG,
} from "@/src/data/macroCharts";

interface MacroDashboardProps {
  kind: "macro";
  slug?: string | null;
  datasetUrl?: string | null;
  databaseId?: number | null;
  title?: string | null;
}

interface FiscalDashboardProps {
  kind: "fiscal";
  datasetUrl?: string | null;
  databaseId?: number | null;
  title?: string | null;
}

export type FeaturedDashboardChartProps =
  | MacroDashboardProps
  | FiscalDashboardProps;

const MACRO_CHART_COMPONENTS: Record<
  string,
  ComponentType<MacroChartWrapperProps>
> = {
  inflation: InflationChart,
  "foreign-exchange": ForeignExchangeChart,
  "foreign-reserves": ForeignReservesChart,
  unemployment: UnemploymentChart,
  "gdp-growth": GDPGrowthChart,
  "interest-rates": InterestRatesChart,
  "national-debt": NationalDebtChart,
};

function resolveMacroSlug(rawSlug?: string | null): string {
  const slug = (rawSlug ?? "").trim().toLowerCase();
  return slug && slug in MACRO_CHART_METADATA ? slug : MACRO_FALLBACK_SLUG;
}

export default function FeaturedDashboardChart(
  props: FeaturedDashboardChartProps
) {
  if (props.kind === "macro") {
    const slug = resolveMacroSlug(props.slug);
    const metadata =
      MACRO_CHART_METADATA[slug] ?? MACRO_CHART_METADATA[MACRO_FALLBACK_SLUG];
    const ChartComponent =
      MACRO_CHART_COMPONENTS[slug] ??
      MACRO_CHART_COMPONENTS[MACRO_FALLBACK_SLUG];

    const idSuffix = useMemo(() => {
      if (props.databaseId) {
        return String(props.databaseId);
      }
      return slug;
    }, [props.databaseId, slug]);

    const controlIds = useMemo(
      () => ({
        zoomInId: `featured-macro-zoom-in-${idSuffix}`,
        zoomOutId: `featured-macro-zoom-out-${idSuffix}`,
        resetId: `featured-macro-reset-${idSuffix}`,
      }),
      [idSuffix]
    );

    const datasetUrl = props.datasetUrl ?? undefined;
    const hasDataset = Boolean(datasetUrl);

    return (
      <div className="mt-6 bg-white rounded-3xl p-6">
        <div className="flex flex-col gap-1">
          <h4 className="text-lg md:text-2xl font-montserrat font-bold text-slate-950">
            {metadata.chartTitle}
          </h4>
          <p className="text-sm md:text-base font-baskervville text-slate-600">
            {metadata.chartSubtitle}
          </p>
        </div>
        <div className="relative mt-6">
          <div className="absolute -top-4 right-0 flex gap-2 z-10">
            <button
              id={controlIds.zoomInId}
              aria-label="Zoom in"
              className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
            >
              <svg
                className="size-3 md:size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M7.33333 13.0002C10.2789 13.0002 12.6667 10.6123 12.6667 7.66683C12.6667 4.72131 10.2789 2.3335 7.33333 2.3335C4.38781 2.3335 2 4.72131 2 7.66683C2 10.6123 4.38781 13.0002 7.33333 13.0002Z"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.9996 14.3335L11.0996 11.4335"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.33398 5.66681V9.66681"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33398 7.66681H9.33398"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              id={controlIds.zoomOutId}
              aria-label="Zoom out"
              className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
            >
              <svg
                className="size-3 md:size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M7.33333 13.0002C10.2789 13.0002 12.6667 10.6123 12.6667 7.66683C12.6667 4.72131 10.2789 2.3335 7.33333 2.3335C4.38781 2.3335 2 4.72131 2 7.66683C2 10.6123 4.38781 13.0002 7.33333 13.0002Z"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.9996 14.3335L11.0996 11.4335"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33398 7.66681H9.33398"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              id={controlIds.resetId}
              aria-label="Reset zoom"
              className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
            >
              <svg
                className="size-3 md:size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M2 8.3335C2 9.52018 2.35189 10.6802 3.01118 11.6669C3.67047 12.6536 4.60754 13.4226 5.7039 13.8768C6.80026 14.3309 8.00666 14.4497 9.17054 14.2182C10.3344 13.9867 11.4035 13.4153 12.2426 12.5761C13.0818 11.737 13.6532 10.6679 13.8847 9.50404C14.1162 8.34015 13.9974 7.13375 13.5433 6.0374C13.0892 4.94104 12.3201 4.00397 11.3334 3.34468C10.3467 2.68539 9.18669 2.3335 8 2.3335C6.32263 2.33981 4.71265 2.99431 3.50667 4.16016L2 5.66683"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 2.3335V5.66683H5.33333"
                  stroke="#374151"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          {hasDataset ? (
            <ChartComponent datasetUrl={datasetUrl} controlIds={controlIds} />
          ) : (
            <div className="flex h-[200px] md:h-[280px] items-center justify-center rounded-3xl bg-slate-100 text-sm font-sourcecodepro text-slate-600">
              Dataset not available.
            </div>
          )}
        </div>
        {metadata.legendItems && metadata.legendItems.length > 0 ? (
          <div className="mb-2">
            <div className="grid md:flex items-center md:justify-center gap-2 md:gap-6">
              {metadata.legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full inline-block ${
                        item.indicatorClassName ?? "bg-brand-1-500"
                      }`}
                      style={item.indicatorStyle}
                    />
                  </div>
                  <span className="text-sm/tight md:text-base/6 font-normal font-baskervville text-slate-600">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}{" "}
        <div className="mt-2 md:mt-6 xl:mt-10">
          <div className="bg-gray-50 rounded-lg px-6 py-3.5">
            <div className="flex md:justify-between gap-4 text-xs/4 text-slate-600 flex-col md:flex-row md:items-center">
              <div className="md:flex-1">{metadata.dataSource}</div>
              {metadata.dataSourceNote ? (
                <div className="md:flex-1 text-left md:text-right">
                  {metadata.dataSourceNote}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const datasetUrl = props.datasetUrl ?? undefined;
  return (
    <div className="mt-6 bg-white rounded-3xl p-6">
      <div className="flex flex-col gap-1">
        <h4 className="text-lg md:text-2xl font-montserrat font-bold text-slate-950">
          {props.title ?? "Government Fiscal Operations"}
        </h4>
      </div>
      <div className="mt-6">
        <FeaturedFiscalSankeyChart
          datasetUrl={datasetUrl}
          rootLabel={props.title ?? undefined}
        />
      </div>
    </div>
  );
}
