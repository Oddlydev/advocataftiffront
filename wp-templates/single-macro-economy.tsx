import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import type { ReactNode } from "react";
import SEO from "@/src/components/SEO";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import MacroEconomySliderNav from "@/src/components/MacroEconomyNav";
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

type LegendItem = {
  label: string;
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
};

type MacroPageConfig = {
  component: React.ComponentType<MacroChartWrapperProps>;
  datasetSlug?: string;
  chartTitle: string;
  chartSubtitle: string;
  legendItems?: LegendItem[];
  dataSource: string;
  dataSourceNote?: string;
  infoContent: ReactNode;
};

const MACRO_PAGE_CONFIG: Record<string, MacroPageConfig> = {
  inflation: {
    component: InflationChart,
    datasetSlug: "inflation",
    chartTitle: "Average Annual Inflation",
    chartSubtitle: "Percentage change in prices for consumer goods and services (2015-2024)",
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
    infoContent: (
      <>
        <div className="mb-10">
          <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
            Understanding Inflation Metrics
          </h5>
          <p className="text-lg font-baskervville font-normal text-slate-950">
            Advanced Economic Analysis Framework
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Definition
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base font-baskervville font-normal">
                The Average Annual Inflation measures the percentage change in prices for a typical basket of consumer goods and services purchased by households nationwide, using the National Consumer Price Index (NCPI).
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Statistical Concept and Methodology
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base font-baskervville font-normal">
                The NCPI calculates inflation rates based on the price changes observed in a standard consumer basket, categorized mainly into Food & Non-Alcoholic Beverages and Non-Food items.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  "foreign-exchange": {
    component: ForeignExchangeChart,
    datasetSlug: "foreign-exchange",
    chartTitle: "Foreign Exchange Inflows and Outflows",
    chartSubtitle: "Balance of Payment (BOP) 2010 - 2024 (USD Millions)",
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Sri Lanka's Balance of Payment (BOP) 2010 - 2024",
    infoContent: (
      <>
        <div className="mb-10">
          <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
            Understanding Foreign Exchange Metrics
          </h5>
          <p className="text-lg font-baskervville font-normal text-slate-950">
            Advanced Economic Analysis Framework
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Definition
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base font-baskervville font-normal">
                Forex Inflows and Outflows represent the annual net foreign exchange movement (inflows minus outflows) captured under the Balance of Payments (BOP), measured in millions of US dollars (USD). This indicator shows the net impact of international transactions on the country's foreign exchange reserves. Tracking Forex Inflows and Outflows is essential to evaluate the country's external financial health, sustainability of its foreign currency reserves, exchange rate stability, and overall economic stability. It aids policymakers in decision-making regarding exchange rate management, external borrowing, and investment policies.
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Statistical Concept and Methodology
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base font-baskervville font-normal">
                The Balance of Payments (BOP) summarizes economic transactions between residents and non-residents over a specific period, including trade in goods and services, primary and secondary income, and financial flows. Forex inflows reflect the receipt of foreign currency through exports, foreign investments, loans, and remittances, whereas outflows represent payments made for imports, loan repayments, repatriation of profits, and outward investments.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  "foreign-reserves": {
    component: ForeignReservesChart,
    datasetSlug: "foreign-reserves",
    chartTitle: "Total Annual Foreign Reserves",
    chartSubtitle: "Official Reserve Assets in USD Millions (2013-2024)",
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Foreign Reserves 2013 - 2024",
    infoContent: (
      <>
        <div className="mb-10">
          <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
            Understanding Foreign Reserves Metrics
          </h5>
          <p className="text-lg font-baskervville font-normal text-slate-950">
            Advanced Economic Analysis Framework
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Definition
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                Total Annual Foreign Reserves represent the cumulative reserve asset position of the Central Bank of Sri Lanka as of 31st December each year, expressed in millions of US dollars. It includes international reserves held by the government and central monetary authority.
              </p>
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                Foreign reserves are critical for economic stability, exchange rate management, international trade, and confidence in national financial resilience. Adequate reserves support government capacity to meet external obligations and manage economic shocks.
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg/7 font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Statistical Concept and Methodology
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                Foreign reserves include assets such as foreign currencies, gold reserves, Special Drawing Rights (SDRs), and other reserve assets maintained by the Central Bank of Sri Lanka. The value is reported annually based on asset valuation as of the 31st December.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  unemployment: {
    component: UnemploymentChart,
    datasetSlug: "unemployment",
    chartTitle: "Annual Unemployment Rate",
    chartSubtitle: "Annual Unemployment Rate (%) (2009-2023)",
    dataSource: "Data Source: Department of Census and Statistics, Sri Lanka",
    dataSourceNote: "Annual Unemployment Rate 2009 - 2023",
    infoContent: (
      <>
        <div className="mb-10">
          <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
            Understanding Unemployment Metrics
          </h5>
          <p className="text-lg font-baskervville font-normal text-slate-950">
            Advanced Economic Analysis Framework
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Definition
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                The Annual Unemployment Rate represents the percentage of the total labor force that is unemployed and actively seeking employment within Sri Lanka, averaged annually. It reflects the proportion of individuals within the labor market who are willing and able to work but do not have employment.
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg/7 font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Statistical Concept and Methodology
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                The unemployment rate is calculated by dividing the number of unemployed persons by the total labor force and multiplying by 100. An unemployed person is defined as someone who is actively seeking and available for work but unable to find employment during the reference period of the survey.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  "gdp-growth": {
    component: GDPGrowthChart,
    datasetSlug: "gdp-growth",
    chartTitle: "Annual GDP Growth Rate",
    chartSubtitle: "Annual Unemployment Rate (%) (2009-2023)",
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "GDP Growth Rate 2010 - 2024",
    infoContent: (
      <>
        <div className="mb-10">
          <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
            Understanding GDP Growth Metrics
          </h5>
          <p className="text-lg font-baskervville font-normal text-slate-950">
            Advanced Economic Analysis Framework
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Definition
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                GDP Growth Rate (Annual) measures the yearly percentage change in the Gross Domestic Product (GDP) of Sri Lanka, reflecting the annual economic performance and output expansion or contraction of the national economy. The GDP Growth Rate provides crucial insights into the economic health and productivity of Sri Lanka. Positive growth rates indicate economic expansion, job creation, and increased standard of living, while negative growth rates highlight economic challenges, potential recessions, or downturns.
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg/7 font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Statistical Concept and Methodology
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                GDP Growth Rate indicates the annual percentage increase or decrease in the value of goods and services produced in the country. Data for 2010-2014 are computed based on the base year 2010, while data from 2015 onward use the base year 2015.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  "interest-rates": {
    component: InterestRatesChart,
    datasetSlug: "interest-rates",
    chartTitle: "Annual Average Interest Rates (Lending and Deposit)",
    chartSubtitle: "AWNFDR, AWNDR, AWNLR, AWPLR (2010-2024)",
    legendItems: [
      { indicatorClassName: "bg-brand-1-200", label: "AWNFDR" },
      { indicatorClassName: "bg-brand-1-950", label: "AWNDR" },
      { indicatorClassName: "bg-brand-1-700", label: "AWNLR" },
      { indicatorClassName: "bg-brand-1-500", label: "AWPLR" },
    ],
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Annual Average Interest Rates 2010 - 2024",
    infoContent: (
      <>
        <div className="mb-10">
          <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
            Understanding Interest Rates Metrics
          </h5>
          <p className="text-lg font-baskervville font-normal text-slate-950">
            Advanced Economic Analysis Framework
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Definition
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <div className="text-slate-800 text-base">
                <h6 className="font-sourcecodepro font-medium">
                  Average Weighted New Fixed Deposit Rates:
                </h6>
                <p className="font-baskervville font-normal">
                  The Average Weighted New Fixed Deposit Rate (AWNFDR) is calculated by the Central Bank monthly, based on interest rates pertaining to all new interest bearing rupee time deposits mobilised by LCBs during a particular month.
                </p>
              </div>
              <div className="text-slate-800 text-base">
                <h6 className="font-sourcecodepro font-medium">
                  Average Weighted New Deposit Rates :
                </h6>
                <p className="font-baskervville font-normal">
                  The Average Weighted New Deposit Rate (AWNDR) is calculated by the Central Bank monthly, based on interest rates pertaining to all new interest bearing rupee deposits mobilised by LCBs during a particular month.
                </p>
              </div>
              <div className="text-slate-800 text-base">
                <h6 className="font-sourcecodepro font-medium">
                  Average Weighted New Lending Rates :
                </h6>
                <p className="font-baskervville font-normal">
                  The Average Weighted New Lending Rate (AWNLR) is calculated by the Central Bank monthly, based on interest rates pertaining to all new rupee loans and advances extended by LCBs during a particular month.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Statistical Concept and Methodology
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base font-baskervville font-normal">
                The Central Bank of Sri Lanka calculates weighted average interest rates. These averages are derived from the interest rates offered by commercial banks, weighted by the volume of deposits (for deposit rates) and the volume of loans (for lending rates).
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
  "national-debt": {
    component: NationalDebtChart,
    datasetSlug: "national-debt",
    chartTitle: "Total Government Debt Per Person",
    chartSubtitle: "Government Debt Owed by Each Individual in Rs. (2010-2024)",
    legendItems: [
      {
        indicatorClassName: "bg-brand-1-900 inset-shadow-brand-1-950",
        label: "Total Debt (Rs. Mn)",
      },
      { indicatorClassName: "bg-brand-1-500", label: "Debt Per Person (Rs.)" },
    ],
    dataSource: "Data Source: Central Bank of Sri Lanka",
    dataSourceNote: "Government Debt 2010 - 2024",
    infoContent: (
      <>
        <div className="mb-10">
          <h5 className="text-2xl font-montserrat font-bold text-slate-950 mb-1.5">
            Understanding National Debt Metrics
          </h5>
          <p className="text-lg font-baskervville font-normal text-slate-950">
            Advanced Economic Analysis Framework
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-b border-brand-1-100 pb-4 md:border-b-0 md:border-r md:pr-4">
            <h3 className="text-lg font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Definition
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                Total Government Debt Per Person represents the amount of government debt owed by each individual within the country, calculated by dividing the Total Government Debt (expressed in millions of Rupees) by the total population for each year. Total Government Debt reflects the cumulative amount of outstanding debt obligations incurred by the national government as of the end of each respective year, expressed in millions of Sri Lankan Rupees.
              </p>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <h3 className="text-lg/7 font-sourcecodepro font-semibold text-slate-600 uppercase mb-3">
              Statistical Concept and Methodology
            </h3>
            <div className="space-y-5 text-slate-800 text-base/6 font-baskervville font-normal">
              <p className="text-slate-800 text-base/6 font-baskervville font-normal">
                Total Government Debt comprises total outstanding financial obligations incurred by the central government, including domestic and external borrowing, as officially reported at the close of each calendar year. Debt per person is computed annually by dividing total government debt (converted from millions of Rupees to actual Rupees by multiplying by 1,000,000) by the total population for that year, providing a per capita measure of debt burden.
              </p>
            </div>
          </div>
        </div>
      </>
    ),
  },
};

const FALLBACK_SLUG = "inflation";

export const SINGLE_MACRO_ECONOMY_QUERY = gql`
  query GetMacroEconomy($slug: ID!, $datasetSlug: ID!) {
    macroEconomy(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      uri
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
    dataSet(id: $datasetSlug, idType: SLUG) {
      dataSetFields {
        dataSetFile {
          node {
            mediaItemUrl
          }
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
      seo?: Record<string, unknown> | null;
    } | null;
    dataSet?: {
      dataSetFields?: {
        dataSetFile?: {
          node?: {
            mediaItemUrl?: string | null;
          } | null;
        } | null;
      } | null;
    } | null;
  };
};

const SingleMacroEconomy: React.FC<MacroEconomyPageProps> = ({ data }) => {
  const macroEconomy = data?.macroEconomy;
  const slug = macroEconomy?.slug ?? FALLBACK_SLUG;
  const config = MACRO_PAGE_CONFIG[slug] ?? MACRO_PAGE_CONFIG[FALLBACK_SLUG];
  const datasetUrl =
    data?.dataSet?.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? undefined;

  const ChartComponent = config.component;
  const controlIds = {
    zoomInId: `macro-chart-${slug}-zoom-in`,
    zoomOutId: `macro-chart-${slug}-zoom-out`,
    resetId: `macro-chart-${slug}-reset`,
  };

  const secondaryNavItems = [
    { label: "Macro Economy", href: "#" },
    { label: "Government Fiscal Operations", href: "#" },
    {
      label: "Transparency in government Institutions",
      href: "/transparency-dashboard",
    },
    { label: "State Owned Enterprises", href: "/state-owned-dashboard" },
  ];

  return (
    <main>
      <SEO
        yoast={(macroEconomy as any)?.seo}
        title={macroEconomy?.title ?? "Macro Economy Dashboard"}
      />

      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={secondaryNavItems}
            activePath={macroEconomy?.uri ?? ""}
          />
        </div>
      </div>

      <HeroWhite
        title="Macro Economy Dashboards"
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "Macro Economy" },
        ]}
      />

      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-3.5 md:pb-7">
          <MacroEconomySliderNav />
        </div>
      </div>

      <div className="bg-white pt-3.5 md:pt-5 xl:pt-6">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-10 md:pb-20">
          <div className="border border-gray-200 rounded-xl py-6 px-5">
            <div className="mb-10">
              <h4 className="text-2xl/snug font-montserrat font-bold text-slate-950 mb-1.5">
                {config.chartTitle}
              </h4>
              <p className="text-base/6 font-baskervville font-normal text-slate-950">
                {config.chartSubtitle}
              </p>
            </div>

            <div className="relative">
              <div className="absolute top-2 md:top-0 right-4 md:right-10 flex gap-2 z-10">
                <button
                  id={controlIds.zoomInId}
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
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
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
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
                  className="px-2.5 py-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-brand-white text-slate-700 font-semibold"
                >
                  <svg
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
              <ChartComponent datasetUrl={datasetUrl} controlIds={controlIds} />
            </div>

            {config.legendItems && config.legendItems.length > 0 ? (
              <div className="mt-5">
                <div className="grid md:flex items-center justify-center gap-2 md:gap-6">
                  {config.legendItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <span
                        className={`w-1.5 h-1.5 rounded-full inline-block ${
                          item.indicatorClassName ?? ""
                        }`}
                        style={item.indicatorStyle}
                      ></span>
                      <span className="text-base/6 font-normal font-baskervville text-slate-600">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-10">
              <div className="bg-gray-50 rounded-lg px-6 py-3.5">
                <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                  <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                    <p>{config.dataSource}</p>
                  </div>
                  {config.dataSourceNote ? (
                    <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                      <p>{config.dataSourceNote}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="border border-gray-200 bg-gray-50 rounded-xl">
            <div className="px-6 py-7">{config.infoContent}</div>
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
      : ctx.params?.slug) || seedNode?.slug || FALLBACK_SLUG;
  const config = MACRO_PAGE_CONFIG[slug] ?? MACRO_PAGE_CONFIG[FALLBACK_SLUG];
  const datasetSlug = config.datasetSlug ?? slug;

  return { slug, datasetSlug };
};
