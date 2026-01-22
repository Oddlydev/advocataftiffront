import { useRef, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import type { GetStaticPropsContext } from "next";
import SEO from "@/src/components/SEO";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import MacroEconomySliderNav from "@/src/components/MacroEconomyNav";
import PrimaryButton from "@/src/components/Buttons/PrimaryBtn";
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
  ]),
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
    },
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
  const zoomLabelRef = useRef<HTMLSpanElement>(null!);
  const controlIds = {
    zoomInId: `macro-chart-${slug}-zoom-in`,
    zoomOutId: `macro-chart-${slug}-zoom-out`,
    resetId: `macro-chart-${slug}-reset`,
    zoomLabelRef,
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

  // --------------------------------------------------------------------------------------
  // FULLSCREEN LOGIC — FIXED
  // --------------------------------------------------------------------------------------
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = () => {
    const el = fullscreenRef.current;
    if (el?.requestFullscreen) {
      el.requestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  useEffect(() => {
    const handler = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

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

      <div
        ref={fullscreenRef}
        className={`relative w-full  ${
          isFullscreen ? "inset-0 z-50 px-8 pt-12 bg-black/70 rounded-lg" : ""
        }`}
      >
        <div
          className={`bg-white rounded-lg ${isFullscreen ? "pt-0" : "pt-3.5 md:pt-5 xl:pt-6"}`}
        >
          <div
            className={`mx-auto ${isFullscreen ? "max-w-full p-0" : "mx-auto max-w-7xl px-5 md:px-10 pb-10 md:pb-20 xl:px-16"}`}
          >
            <div
              key={remountKey}
              className={`border border-gray-200 rounded-xl ${isFullscreen ? "py-6 px-0 pt-0 pb-0 border-transparent" : "py-6 px-5"}`}
            >
              {/* Chart Title & Subtitle — show ONLY when NOT fullscreen */}
              <div className="md:flex justify-between items-center">
                {!isFullscreen && (
                  <div className="mb-4 md:mb-10 md:w-1/2 lg:w-3/4">
                    <h2 className="text-xl/snug md:text-2xl/snug font-sourcecodepro font-bold text-slate-950 mb-1.5">
                      {chartDetails?.chartTitle}
                    </h2>
                    <p className="text-sm/5 md:text-base/6 font-sourcecodepro font-normal text-slate-600 leading-6">
                      {chartDetails?.chartSubtitle}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex gap-2">
                    {/* Fullscreen button */}
                    {!isFullscreen && (
                      <PrimaryButton
                        onClick={
                          isFullscreen ? exitFullscreen : enterFullscreen
                        }
                        // className="flex items-center px-2.5 py-2 md:px-4 md:py-3 bg-brand-1-900 rounded-md uppercase shadow-sm text-brand-white font-normal text-xs md:text-sm font-sourcecodepro"
                        // title={isFullscreen ? "Exit Full Screen" : "Full Screen"}
                      >
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M15 5L5 15"
                              stroke="#F1F2F2"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 8.33333V5H11.6666"
                              stroke="#F1F2F2"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 11.6667V15H8.33333"
                              stroke="#F1F2F2"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 5L15 15"
                              stroke="#F1F2F2"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5 8.33333V5H8.33333"
                              stroke="#F1F2F2"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15 11.6667V15H11.6666"
                              stroke="#F1F2F2"
                              strokeWidth="1.25"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        {isFullscreen ? "Exit" : "Full Screen"}
                      </PrimaryButton>
                    )}
                  </div>
                </div>
              </div>

              {/* Zoom Function */}
              <div className="relative">
                {/* Zoom Buttons — visible ONLY in fullscreen */}
                {isFullscreen && (
                  <div className="bg-gray-100 rounded-t-lg py-4 px-8">
                    <div className="md:flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        {/* Exit full sreen button */}
                        <span
                          onClick={exitFullscreen}
                          className="cursor-pointer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M15 5L5.00068 14.9993M14.9993 15L5 5.00071"
                              stroke="#4B5563"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                        <span
                          className="pl-4 border-l border-gray-400 text-base
                        text-gray-600 font-medium font-montserrat"
                        >
                          {chartDetails?.chartTitle} - Full Screen Mode
                        </span>
                      </div>
                      {/* Zoom function hidden */}
                      <div className="hidden">
                        <div
                          className={`inline-flex gap-2 rounded-lg border border-gray-300 p-2.5
                            ${isSwapping ? "block" : "block"}`}
                        >
                          <button id={controlIds.zoomOutId} className="">
                            <svg
                              className="size-2 md:size-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                            >
                              <path
                                d="M12.75 12.75L15.75 15.75"
                                stroke="#374151"
                                stroke-width="1.125"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25Z"
                                stroke="#374151"
                                stroke-width="1.125"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M5.625 8.25H10.875"
                                stroke="#374151"
                                stroke-width="1.125"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </button>

                          <span className="text-sm md:text-base font-medium font-sourcecodepro text-gray-600">
                            {/* Dynamic Zoom Label */}
                            <span ref={zoomLabelRef}>100%</span>
                          </span>

                          <button id={controlIds.zoomInId} className="">
                            <svg
                              className="size-2 md:size-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                            >
                              <path
                                d="M12.75 12.75L15.75 15.75"
                                stroke="#374151"
                                stroke-width="1.125"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M14.25 8.25C14.25 4.93629 11.5637 2.25 8.25 2.25C4.93629 2.25 2.25 4.93629 2.25 8.25C2.25 11.5637 4.93629 14.25 8.25 14.25C11.5637 14.25 14.25 11.5637 14.25 8.25Z"
                                stroke="#374151"
                                stroke-width="1.125"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M5.625 8.25H10.875M8.25 5.625V10.875"
                                stroke="#374151"
                                stroke-width="1.125"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </button>

                          <button
                            id={controlIds.resetId}
                            className="border-l border-gray-400 pl-3.5"
                          >
                            <svg
                              className="size-2 md:size-auto"
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                            >
                              <path
                                d="M3.29652 9.00046C3.29683 9.31111 3.54892 9.56266 3.85958 9.56236C4.17024 9.56206 4.42183 9.30999 4.42152 8.99934L3.29652 9.00046ZM7.00152 4.14961L6.77995 3.63259L6.77925 3.63289L7.00152 4.14961ZM9.94225 3.84961L10.0566 3.29887L10.0549 3.2985L9.94225 3.84961ZM13.2859 7.65526C13.3717 7.95384 13.6833 8.12626 13.9819 8.04046C14.2805 7.95466 14.453 7.64304 14.3671 7.34448L13.2859 7.65526ZM13.2821 7.35838C13.2039 7.65909 13.3844 7.96614 13.6851 8.04429C13.9857 8.12244 14.2928 7.94199 14.3709 7.64131L13.2821 7.35838ZM14.9034 5.59235C14.9816 5.29168 14.8012 4.98459 14.5005 4.90645C14.1999 4.82831 13.8927 5.00871 13.8146 5.30938L14.9034 5.59235ZM13.6767 8.04204C13.9761 8.12476 14.286 7.94911 14.3687 7.64971C14.4515 7.35025 14.2758 7.04043 13.9764 6.95769L13.6767 8.04204ZM11.9896 6.40869C11.6901 6.32594 11.3803 6.50161 11.2976 6.80104C11.2149 7.10048 11.3905 7.41031 11.69 7.49305L11.9896 6.40869ZM14.9215 8.99934C14.9212 8.68861 14.6691 8.43706 14.3585 8.43736C14.0478 8.43766 13.7962 8.68974 13.7965 9.00046L14.9215 8.99934ZM8.27575 14.1501L8.16138 14.7008L8.16318 14.7012L8.27575 14.1501ZM4.93213 10.3445C4.84631 10.0459 4.5347 9.87346 4.23613 9.95926C3.93756 10.0451 3.76509 10.3567 3.85091 10.6553L4.93213 10.3445ZM4.93594 10.6413C5.01408 10.3407 4.83368 10.0336 4.53301 9.95544C4.23233 9.87729 3.92524 10.0577 3.84711 10.3584L4.93594 10.6413ZM3.31461 12.4074C3.23647 12.7081 3.41686 13.0151 3.71754 13.0933C4.01821 13.1714 4.32529 12.991 4.40344 12.6903L3.31461 12.4074ZM4.54134 9.95769C4.2419 9.87496 3.93208 10.0506 3.84934 10.35C3.7666 10.6495 3.94226 10.9593 4.2417 11.042L4.54134 9.95769ZM6.22845 11.591C6.52789 11.6738 6.83771 11.4981 6.92045 11.1987C7.0032 10.8992 6.82753 10.5894 6.52809 10.5067L6.22845 11.591ZM4.42152 8.99934C4.4206 8.07309 4.68733 7.16635 5.18962 6.38817L4.24442 5.77807C3.62455 6.7384 3.29538 7.85739 3.29652 9.00046L4.42152 8.99934ZM5.18962 6.38817C5.68133 5.62488 6.38974 5.02512 7.2238 4.66633L6.77925 3.63289C5.73965 4.08009 4.85729 4.82668 4.24442 5.77807L5.18962 6.38817ZM7.22309 4.66664C8.0446 4.31458 8.95398 4.22181 9.82968 4.40073L10.0549 3.2985C8.95465 3.07371 7.8121 3.19027 6.77995 3.63259L7.22309 4.66664ZM9.82788 4.40036C10.7105 4.58365 11.5172 5.02884 12.1428 5.67777L12.9528 4.89696C12.1701 4.08512 11.1608 3.52818 10.0566 3.29887L9.82788 4.40036ZM12.1428 5.67777C12.6797 6.23339 13.0725 6.9127 13.2859 7.65526L14.3671 7.34448C14.1029 6.42504 13.6175 5.58493 12.9528 4.89696L12.1428 5.67777ZM14.3709 7.64131L14.9034 5.59235L13.8146 5.30938L13.2821 7.35838L14.3709 7.64131ZM13.9764 6.95769L11.9896 6.40869L11.69 7.49305L13.6767 8.04204L13.9764 6.95769ZM13.7965 9.00046C13.7975 9.92664 13.5307 10.8334 13.0284 11.6116L13.9737 12.2216C14.5935 11.2613 14.9226 10.1423 14.9215 8.99934L13.7965 9.00046ZM13.0284 11.6116C12.5367 12.3749 11.8283 12.9746 10.9943 13.3334L11.4381 14.3672C12.4777 13.9199 13.3608 13.173 13.9737 12.2216L13.0284 11.6116ZM10.9943 13.3334C10.1728 13.6854 9.26403 13.7779 8.3884 13.599L8.16318 14.7012C9.26335 14.926 10.406 14.8094 11.4381 14.3672L10.9943 13.3334ZM8.39013 13.5994C7.5076 13.4161 6.70084 12.9709 6.07523 12.322L5.26531 13.1027C6.04798 13.9146 7.05727 14.4716 8.16138 14.7008L8.39013 13.5994ZM6.07523 12.322C5.53836 11.7663 5.14557 11.087 4.93213 10.3445L3.85091 10.6553C4.11519 11.5747 4.60056 12.4148 5.26531 13.1027L6.07523 12.322ZM3.84711 10.3584L3.31461 12.4074L4.40344 12.6903L4.93594 10.6413L3.84711 10.3584ZM4.2417 11.042L6.22845 11.591L6.52809 10.5067L4.54134 9.95769L4.2417 11.042Z"
                                fill="#4B5563"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                        <span className="text-sm/tight md:text-sm font-normal font-sourcecodepro text-slate-600">
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
                  <div className="grid grid-cols-1 md:flex md:justify-between gap-4 xl:gap-26 text-xs/4 text-slate-600 font-sourcecodepro leading-4">
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
      </div>

      <div className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="border border-gray-200 bg-gray-50 rounded-xl">
            <div className="px-6 py-7">
              <div className="mb-5">
                <h5 className="text-xs font-sourcecodepro font-semibold text-slate-600 leading-3 mb-1.5">
                  {/* {`Understanding ${displayTitle} Metrics`} */}
                  Notes:
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="border-b border-brand-1-100 pb-0 md:border-b-0 md:border-r md:pr-4">
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3 leading-7">
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
                  <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3 leading-7">
                    {/* Statistical Concept and Methodology */}
                    Special Notes (if any)
                  </h3>
                  <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal break-words">
                    {methodologyHtml ? (
                      <div
                        className="text-slate-800 text-base/6 font-baskervville font-normal break-words"
                        dangerouslySetInnerHTML={{ __html: methodologyHtml }}
                      />
                    ) : (
                      <p className="text-slate-800 text-base/6 font-baskervville font-normal break-words"></p>
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
  ctx: GetStaticPropsContext,
) => {
  if (!ctx.params?.slug && !seedNode?.slug) {
    throw new Error(
      "SingleMacroEconomy.variables: missing slug from params/seedNode.",
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
