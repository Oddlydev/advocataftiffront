import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import type { GetStaticPropsContext } from "next";
import SEO from "@/src/components/SEO";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import MacroEconomySliderNav from "@/src/components/MacroEconomyNav";
import type { ComponentType } from "react";
import {
  MACRO_CHART_METADATA,
  MACRO_FALLBACK_SLUG,
  type MacroChartMetadata,
} from "@/src/data/macroCharts";
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

type MacroPageConfig = MacroChartMetadata & {
  component: ComponentType<MacroChartWrapperProps>;
};

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

const MACRO_PAGE_CONFIG: Record<string, MacroPageConfig> = Object.fromEntries(
  Object.entries(MACRO_CHART_METADATA).map(([slug, meta]) => [
    slug,
    {
      ...meta,
      component:
        MACRO_CHART_COMPONENTS[slug] ??
        MACRO_CHART_COMPONENTS[MACRO_FALLBACK_SLUG],
    },
  ])
) as Record<string, MacroPageConfig>;

const FALLBACK_SLUG = MACRO_FALLBACK_SLUG;

export const SINGLE_MACRO_ECONOMY_QUERY = gql`
  query GetMacroEconomy($slug: ID!) {
    macroEconomy(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      uri
      featuredImage {
        node {
          mediaItemUrl
        }
      }
      dataSetFields {
        dataSetFile {
          node {
            mediaItemUrl
          }
        }
      }
      macroDashboardMetricsSection {
        definition
        statisticalConceptAndMethodology
      }
      macroChartDetailsSection {
        chartTitle
        chartSubtitle
        dataSource
        chartLabel
      }
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphSiteName
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
        schema {
          raw
        }
      }
    }
  }
`;
type MacroEconomyPageProps = {
  data?: {
    macroEconomy?: {
      id: string;
      slug?: string | null;
      title?: string | null;
      excerpt?: string | null;
      content?: string | null;
      uri?: string | null;
      featuredImage?: {
        node?: {
          mediaItemUrl?: string | null;
        } | null;
      } | null;
      dataSetFields?: {
        dataSetFile?: {
          node?: {
            mediaItemUrl?: string | null;
          } | null;
        } | null;
      } | null;
      macroDashboardMetricsSection?: {
        definition?: string | null;
        statisticalConceptAndMethodology?: string | null;
      } | null;
      macroChartDetailsSection?: {
        chartTitle?: string | null;
        chartSubtitle?: string | null;
        dataSource?: string | null;
        chartLabel?: string | null;
      } | null;
      seo?: Record<string, unknown> | null;
    } | null;
  };
};
const SingleMacroEconomy: React.FC<MacroEconomyPageProps> = ({ data }) => {
  const router = useRouter();
  const initialMacro = data?.macroEconomy;
  const initialSlug = initialMacro?.slug ?? FALLBACK_SLUG;

  // Derive slug from URL so shallow route changes can update just the chart area
  const asPath = (router?.asPath || "").split("?")[0];
  const pathSegments = asPath.split("/").filter(Boolean);
  const routeSlug = pathSegments[pathSegments.length - 1] || initialSlug;

  // Fetch new macro entry client-side if URL slug changes via shallow routing
  const { data: clientSwap, loading: swapLoading } = useQuery(
    SINGLE_MACRO_ECONOMY_QUERY,
    {
      variables: { slug: routeSlug },
      skip: !routeSlug || routeSlug === initialSlug,
      // Prefer cache when available (prefetched by nav) and avoid extra flicker
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-first",
      returnPartialData: true,
      notifyOnNetworkStatusChange: true,
    }
  );

  const macroEconomy = clientSwap?.macroEconomy ?? initialMacro;
  const slug = macroEconomy?.slug ?? FALLBACK_SLUG;
  const config = MACRO_PAGE_CONFIG[slug] ?? MACRO_PAGE_CONFIG[FALLBACK_SLUG];
  const datasetUrl =
    macroEconomy?.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? undefined;

  const metrics = macroEconomy?.macroDashboardMetricsSection;
  const definitionHtml = metrics?.definition ?? null;
  const methodologyHtml = metrics?.statisticalConceptAndMethodology ?? null;
  const overviewHtml = macroEconomy?.content ?? macroEconomy?.excerpt ?? null;
  const displayTitle = macroEconomy?.title ?? config.chartTitle;
  const chartDetails = macroEconomy?.macroChartDetailsSection;

  const ChartComponent = config.component;
  const controlIds = {
    zoomInId: `macro-chart-${slug}-zoom-in`,
    zoomOutId: `macro-chart-${slug}-zoom-out`,
    resetId: `macro-chart-${slug}-reset`,
  };

  const secondaryNavItems = [
    { label: "Macro Economy", href: "/the-macro-economy-of-sri-lanka" },
    {
      label: "Government Fiscal Operations",
      href: "/government-fiscal-operations",
    },
    {
      label: "Transparency in government Institutions",
      href: "/transparency-in-government-institutions",
    },
    {
      label: "The Finances of SOEs",
      href: "/the-finances-of-state-owned-enterprises",
    },
  ];

  // Force a remount when the entry changes so any client charts reset properly
  const remountKey = macroEconomy?.id || slug;

  const isSwapping =
    routeSlug !== (clientSwap?.macroEconomy?.slug ?? initialSlug) &&
    swapLoading;

  return (
    <main>
      <SEO yoast={(macroEconomy as any)?.seo} title={displayTitle} />

      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-0 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={secondaryNavItems}
            activePath={"/the-macro-economy-of-sri-lanka"}
          />
        </div>
      </div>

      <HeroWhite
        title="Macro Economy Dashboards"
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "Macro Economy", href: "/the-macro-economy-of-sri-lanka" },
        ]}
      />

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-3.5 md:pb-7">
          <MacroEconomySliderNav />
        </div>
      </div>

      <div className="bg-white pt-3.5 md:pt-5 xl:pt-6">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-10 md:pb-20">
          <div
            key={remountKey}
            className="border border-gray-200 rounded-xl py-6 px-5"
          >
            <div className="mb-10">
              <h2 className="text-xl/snug md:text-2xl/snug font-montserrat font-bold text-slate-950 mb-1.5">
                {chartDetails?.chartTitle}
              </h2>
              <p className="text-sm/5 md:text-base/6 font-baskervville font-normal text-slate-950">
                {chartDetails?.chartSubtitle}
              </p>
            </div>

            <div className="relative">
              <div
                className={`absolute z-20 -top-3 md:-top-6 lg:top-0 right-4 md:right-10 flex gap-2 ${
                  isSwapping ? "hidden" : "hidden"
                }`}
              >
                <button
                  id={controlIds.zoomInId}
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    className="size-2 md:size-auto"
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
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    className="size-2 md:size-auto"
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
                  className="px-1.5 py-1 md:px-2.5 md:py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
                    className="size-2 md:size-auto"
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
              {isSwapping ? (
                <div className="relative w-full h-[300px] md:h-[300px] xl:h-[500px]">
                  <div className="animate-pulse w-full h-full bg-gray-100 rounded-lg" />
                </div>
              ) : datasetUrl ? (
                <ChartComponent
                  key={`${slug}:${datasetUrl}`}
                  datasetUrl={datasetUrl}
                  controlIds={controlIds}
                />
              ) : (
                <div className="relative w-full h-[300px] md:h-[300px] xl:h-[500px] flex items-center justify-center text-sm font-sourcecodepro text-brand-1-700">
                  {`Dataset for ${displayTitle} is unavailable.`}
                </div>
              )}
            </div>

            {config.legendItems && config.legendItems.length > 0 ? (
              <div className="mb-2 mt-0">
                <div className="grid md:flex items-center md:justify-center gap-2 md:gap-6">
                  {config.legendItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full inline-block ${
                            item.indicatorClassName ?? ""
                          }`}
                          style={item.indicatorStyle}
                        ></span>
                      </div>
                      <span className="text-sm/tight md:text-base/6 font-normal font-baskervville text-slate-600">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div
              className={`mt-2 md:mt-6 xl:mt-10 ${isSwapping ? "opacity-50" : ""}`}
            >
              <div className="bg-gray-50 rounded-lg px-6 py-3.5">
                <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>Data Source: {chartDetails?.dataSource}</p>
                  </div>
                  {chartDetails?.chartLabel ? (
                    <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                      <p>{chartDetails?.chartLabel}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            {!isSwapping ? null : null}
          </div>
        </div>
      </div>

      <div className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="border border-gray-200 bg-gray-50 rounded-xl">
            <div className="px-6 py-7">
              <div className="mb-5">
                <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
                  {/* {`Understanding ${displayTitle} Metrics`} */}
                  Notes
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
                    Definition and Statistical Concept
                  </h3>
                  <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
                    {definitionHtml ? (
                      <div
                        className="text-slate-800 text-base/6 font-baskervville font-normal"
                        dangerouslySetInnerHTML={{ __html: definitionHtml }}
                      />
                    ) : (
                      <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                        Definition content will be added soon.
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 md:mt-0">
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
                    {/* Statistical Concept and Methodology */}
                    Special Notes (if any)
                  </h3>
                  <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal break-all">
                    {methodologyHtml ? (
                      <div
                        className="text-slate-800 text-base/6 font-baskervville font-normal break-all"
                        dangerouslySetInnerHTML={{ __html: methodologyHtml }}
                      />
                    ) : (
                      <p className="text-slate-800 text-base/6 font-baskervville font-normal break-all"></p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SingleMacroEconomy;

(SingleMacroEconomy as any).query = SINGLE_MACRO_ECONOMY_QUERY;
(SingleMacroEconomy as any).variables = (
  seedNode: { slug?: string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!ctx.params?.slug && !seedNode?.slug) {
    throw new Error(
      "SingleMacroEconomy.variables: missing slug from params/seedNode."
    );
  }

  const slug =
    (Array.isArray(ctx.params?.slug)
      ? ctx.params?.slug[0]
      : ctx.params?.slug) ||
    seedNode?.slug ||
    FALLBACK_SLUG;

  return { slug };
};
