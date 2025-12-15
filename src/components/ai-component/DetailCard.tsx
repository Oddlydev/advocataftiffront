"use client";

import React from "react";
import MethodologyCard from "./MethodologyCard";
import TakeawaysCard from "./TakeawaysCard";

export type DetailVariant =
  | "composition"
  | "trend"
  | "ranking"
  | "dataQuality"
  | "forecast"
  | "dataset";

const compositionFirstMetrics = [
  "Food & Non-Alcoholic Beverages: CAGR of 5.8%, consistently stable with low volatility",
  "Housing, Water & Electricity: CAGR of 4.2%, moderate volatility driven by construction cycles",
  "Alcohol & Tobacco: CAGR of 12.3%, highest growth but highest volatility in the dataset",
  "Health: CAGR of 8.9%, second-fastest growing sector with improving access",
  "Education: CAGR of 7.6%, steady demand with low volatility",
  "Recreation & Culture: CAGR of 3.2%, highest measured volatility in the full period",
];

const compositionSecondMetrics = [
  "15% of data cells contain 'Data N/A' entries, concentrated in years 2002-2006.",
  "Median growth rate across all categories: 4.7% (mean: 6.1%), indicating a positive skew driven by fast-growing discretionary sectors.",
  "Correlation analysis shows a strong positive relationship between Health and Education spending (r=0.89).",
  "Three categories show declining trends post-2020: Communication (-2.3%), Restaurants (-1.8%), and Furnishings (-0.4%).",
];

const compositionRecommendations = [
  "Prioritize data completion for the 2002-2006 period to improve longitudinal accuracy.",
  "Investigate Recreation & Culture volatility for potential measurement issues or genuine instability.",
  "Cross-reference Health & Education correlation with demographic data to confirm the population-driven hypothesis.",
];

const trendLongTerm = [
  "Food & Beverages: Steady upward trajectory with minimal deviation (R^2=0.96), suggesting inelastic demand.",
  "Housing: Step-function growth pattern with 3-5 year plateaus followed by sharp increases.",
  "Health: Exponential growth curve accelerating post-2015, possibly driven by an aging population.",
  "Communication: Peaked in 2015 at Rs 1.8T, declined to Rs 1.2T by 2024 due to price competition and saturation.",
  "Restaurants & Hotels: Sharp V-shaped recovery post-2021, still 12% below the 2019 peak.",
];

const trendRecommendations = [
  "Use 2022-2024 data cautiously for forecasting - may not represent normalized conditions.",
  "Model essential vs. discretionary categories separately to account for differing volatility profiles.",
  "Monitor the Communication sector for stabilization - recent declines may be bottoming out.",
];

const rankingStability = [
  "Most Stable: Education (+/-1.4%), Food (+/-2.6%), Health (+/-9.7%)",
  "Moderate: Housing (+/-11.8%), Clothing (+/-13.5%), Transport (+/-14.2%)",
  "Highly Volatile: Recreation (+/-18.2%), Alcohol & Tobacco (+/-24.5%), Restaurants (+/-21.7%)",
];

const rankingRecommendations = [
  "Focus forecasting efforts on the top 5 categories (73% of total spending) for maximum impact",
  "Investigate why Alcohol & Tobacco is growing so rapidly - policy implications?",
  "Explore why Communication declined despite digital transformation - pricing or substitution effects?",
];

const rankingLinks = [
  "Read more about volatility measures in economic data",
  "Compare with international consumption patterns",
];

const RankingLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    className="shrink-0"
  >
    <path
      d="M7.43164 1.48633H10.4043V4.45898"
      stroke="#EA1952"
      strokeWidth="0.990885"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.9541 6.9362L10.404 1.48633"
      stroke="#EA1952"
      strokeWidth="0.990885"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.91797 6.44076V9.41341C8.91797 9.67621 8.81357 9.92825 8.62775 10.1141C8.44192 10.2999 8.18988 10.4043 7.92708 10.4043H2.47721C2.21441 10.4043 1.96238 10.2999 1.77655 10.1141C1.59072 9.92825 1.48633 9.67621 1.48633 9.41341V3.96354C1.48633 3.70074 1.59072 3.44871 1.77655 3.26288C1.96238 3.07705 2.21441 2.97266 2.47721 2.97266H5.44987"
      stroke="#EA1952"
      strokeWidth="0.990885"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const dataQualityBreakdown = [
  "Recreation & Culture: 45 missing entries (34% missing) - most affected",
  "Restaurants & Hotels: 21 missing entries (29% missing)",
  "Miscellaneous Goods & Services: 28 missing entries (21.5% missing)",
  "Clothing & Footwear: 12 missing entries (9.2% missing)",
  "Communication: 4 missing entries (3.2% missing)",
  "All other categories: Complete data",
];

const dataQualityTimeline = [
  "1998-2001: 48% missing rate",
  "2002-2004: 36% missing rate - critical coverage gap",
  "2005-2012: 24% missing rate - requires validation",
  "2013-2024: 12% missing rate",
];

const dataQualityOutliers = [
  "18 negative values flagged (especially 2010-2014) requiring verification",
  "6 suspicious spikes in Restaurants & Hotels hiding data entry errors",
  "4 duplication blocks during the 2007 demonetization release",
];

const dataQualityChecks = [
  "No duplicate year entries detected",
  "All numerical values fall within plausible ranges (Rs 0.7T - Rs 24T)",
  "3 categories report near-zero growth values; flagged for stability review",
];

const dataQualityRecommendations = [
  "URGENT: investigate 2022-2024 data collection process - missing rate suggests systemic gaps",
  "Contact source agency to verify negative outlier entries before modeling",
  "For forecasting, consider interpolation or backfilling only after documenting assumptions",
  "Flag exceptional inflation-driven 2024 values for manual review to preserve accuracy",
  "Record all data quality decisions in the methodology log for traceability",
];

const forecastCategories = [
  "Food: +5.4% annually, expected to reach Rs 1.92T by 2027 driven by urban demand",
  "Housing: +4.9% annually, supported by ongoing construction stimulus",
  "Health: +6.3% annually, reflecting an aging population and higher per-capita spend",
  "Communication: +3.5% annually, but with tightening margins due to price competition",
  "Alcohol & Tobacco: +5.9% annually, led by premiumization trends",
  "Education: +5.1% annually, aligned with private tuition growth",
];

const forecastValidation = [
  "Primary model: 4.2% RMSE with seasonal adjustment",
  "Secondary ensemble: 3.1% MAE across all categories",
  "Trend + ARIMA blend was preferred to capture cyclic shifts",
];

const forecastRisks = [
  "Policy shocks (tax changes) could shift spending trajectories by ±6%",
  "Global commodity inflation may raise household costs faster than projected",
  "Data quality gaps in 2022-2024 may force wider forecast bands",
];

const forecastRecommendations = [
  "Use forecast ranges (±15%) rather than point estimates",
  "Update models quarterly to capture fast-moving discretionary spending",
  "Complement forecasts with scenario analyses (pessimistic, baseline, optimistic)",
];

const datasetEnhancements = [
  "Calculated year-over-year (%) growth rates for all categories",
  "Added category share of total spending (percentage columns)",
  "Normalized 3-year and 5-year moving averages for trend smoothing",
  "Generated data quality flags (Missing, Outlier, Negative)",
  "Imputed missing values (linear interpolation) with provenance tracing",
];

const datasetFiles = [
  "Enhanced CSV (headers + calculated fields + quality flags)",
  "Excel workbook with pivots, charts, and summary dashboards",
  "JSON file capturing structured data for programmatic access",
  "Data dictionary describing every field, unit, and flag",
];

const datasetColumns = [
  "YoY_Growth_%: year-over-year percentage change for each category",
  "Category_Share: proportion of total spending per category",
  "MA_3y, MA_5y: 3- and 5-year moving averages (smoothed trend)",
  "QA_Flag: flag column describing quality issues (Missing, Outlier, Negative)",
  "Inflation_Adjusted: CPI-indexed spending (2024 constant prices)",
];

const datasetQA = [
  "All data validated through automated integrity checks",
  "Cross-tabulation (2022-2024) reconciliation ensures compatibility",
  "Versioning metadata includes source, timestamp, and change notes",
  "Format validation for downstream tools (Tableau, Python, Excel)",
];

const datasetRecommendations = [
  "Start with the Enhanced CSV for quick analysis, then re-export to your BI tool",
  "Review the data dictionary before sharing with partners to avoid misinterpretation",
  "Use quality flags during forecasting to mask unreliable cells",
  "Share this dataset with your analyst team to keep everyone working from the same baseline",
];

type DetailCardProps = {
  variant?: DetailVariant;
};

const CTA_SECTION = (
  <div className="mt-5 border-t border-slate-200 pt-3.5">
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#EA1952] to-[#AA1E58] px-2.5 py-3 text-xs font-semibold text-white shadow"
    >
      <span className="text-sm font-[Montserrat]">
        Download Full Analysis Report
      </span>
    </button>

    <p className="mt-2 text-center text-xs text-slate-500 font-['Source_Code_Pro']">
      Formatted .txt file • Ready for sharing
    </p>
  </div>
);

//   One consistent “two links” block everywhere.
function DetailRevealLinks() {
  return (
    <div className="space-y-2">
      <TakeawaysCard />
      <MethodologyCard />
    </div>
  );
}

function CompositionDetail() {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-2.5">
        <p className="text-sm leading-5 text-slate-700 font-[Montserrat]">
          We've analyzed 26 years of consumption data (1998-2024) across all 12
          categories. This comprehensive statistical report reveals significant
          patterns in household spending behavior and identifies key
          opportunities for deeper investigation.
        </p>

        <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
          Overall Growth Patterns
        </p>

        <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
          The total private consumption expenditure has grown from Rs 8.2T in
          1998 to Rs 24.7T in 2024, representing a compound annual growth rate
          (CAGR) of 4.3%.
        </p>

        <p className="text-sm font-semibold text-slate-700 font-['Montserrat']">
          Category Performance Metrics
        </p>

        <div className="space-y-1.5 pl-1.5">
          {compositionFirstMetrics.map((line) => (
            <div key={line} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
              <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                {line}
              </p>
            </div>
          ))}
        </div>

        <p className="pt-2.5 text-sm font-semibold text-slate-700 font-[Montserrat]">
          Data Quality &amp; Trend Insights
        </p>

        <div className="space-y-1.5 pl-1.5">
          {compositionSecondMetrics.map((line) => (
            <div key={line} className="flex items-start gap-2.5">
              <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
              <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                {line}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <DetailRevealLinks />
        </div>

        <div className="pt-5 mt-3.5 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>

          <div className="mt-2 space-y-1">
            {compositionRecommendations.map((line, idx) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-0.5 w-3 text-xs font-medium text-[var(--brand-1-500)] font-['Source_Code_Pro']">
                  {idx + 1}.
                </span>
                <p className="flex-1 text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {CTA_SECTION}
      </div>
    </article>
  );
}

function TrendDetail() {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          Trend visualization across 26 years reveals distinct consumption
          patterns shaped by economic cycles, technological disruption, and
          societal shifts. Our analysis identifies three major inflection points
          that fundamentally altered spending behavior.
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            The Three Major Disruption Periods
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            Three distinct events created lasting changes in consumption
            patterns: (1) The 2008 Global Financial Crisis, which suppressed
            discretionary spending for 3-4 years; (2) The 2016 Demonetization
            event, which temporarily disrupted all categories; (3) The 2020-2021
            COVID-19 pandemic, which permanently reshaped Restaurants,
            Recreation, and Communication spending.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Long-term Structural Trends
          </p>

          <div className="space-y-1 pl-1.5">
            {trendLongTerm.map((trend) => (
              <div key={trend} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {trend}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Emerging Patterns (2020-2024)
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            Recent data shows bifurcation: essential categories (Food, Health,
            Education) maintaining or accelerating growth, while discretionary
            categories (Recreation, Furnishings, Alcohol) showing increased
            volatility and uncertain recovery trajectories.
          </p>
        </div>

        {/* wo-link reveal back for trend detail */}
        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>

          <div className="mt-2 space-y-1">
            {trendRecommendations.map((line, idx) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-0.5 w-3 text-xs font-medium text-[var(--brand-1-500)] font-['Source_Code_Pro']">
                  {idx + 1}.
                </span>
                <p className="flex-1 text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {CTA_SECTION}
      </div>
    </article>
  );
}

function RankingDetail() {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          Performance ranking helps prioritize analysis and resource allocation.
          This stability-focused breakdown highlights the most resilient and
          volatile consumption categories.
        </p>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Ranking by Stability (Lowest Volatility)
          </p>
          <div className="space-y-1 pl-1.5">
            {rankingStability.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs text-[var(--brand-1-500)] font-normal font-['Source_Code_Pro'] mt-2.5 mb-8">
          {rankingLinks.map((text) => (
            <div key={text} className="flex items-center gap-1.5">
              <RankingLinkIcon />
              <span className="cursor-pointer">{text}</span>
            </div>
          ))}
        </div>

        {/*   only reveal the key takeaways link on the ranking card */}
        <TakeawaysCard />

        <div className="pt-5 mt-3.5 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {rankingRecommendations.map((line, idx) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-0.5 w-3 text-xs font-medium text-[var(--brand-1-500)] font-['Source_Code_Pro']">
                  {idx + 1}.
                </span>
                <p className="flex-1 text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {CTA_SECTION}
      </div>
    </article>
  );
}

function DataQualityDetail() {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          Data quality assessment is critical before any advanced analysis. We
          performed comprehensive validation checks across all 312 data points
          (12 categories × 26 years) and surfaced issues that need attention
          before downstream modeling.
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Missing Data Analysis
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            A total of 127 cells contain "Data N/A" entries, representing 40.7%
            of the dataset. This missing rate raises concerns about systematic
            collection gaps during earlier periods.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Missing Data Breakdown by Category
          </p>
          <div className="space-y-1 pl-1.5">
            {dataQualityBreakdown.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Missing Data by Time Period
          </p>
          <div className="space-y-1 pl-1.5">
            {dataQualityTimeline.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Outliers &amp; Anomalies Detected
          </p>
          <div className="space-y-1 pl-1.5">
            {dataQualityOutliers.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Data Consistency Checks
          </p>
          <div className="space-y-1 pl-1.5">
            {dataQualityChecks.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*   same exact two-link UI */}
        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {dataQualityRecommendations.map((line, idx) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-0.5 w-3 text-xs font-medium text-[var(--brand-1-500)] font-['Source_Code_Pro']">
                  {idx + 1}.
                </span>
                <p className="flex-1 text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {CTA_SECTION}
      </div>
    </article>
  );
}

function ForecastDetail() {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          Using multiple forecasting models trained on 26 years of historical
          data, we project consumption patterns for 2025-2027. These forecasts
          incorporate trend analysis, seasonal decomposition, and ensemble
          weighting so every category starts from a realistic baseline.
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Overall Consumption Forecast
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            Total private consumption is projected to grow at a 4.7% CAGR from
            Rs 24.7T in 2024 to Rs 28.5T in 2027 with the fastest growth in
            essential categories.
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Category-Specific Projections (2025-2027)
          </p>
          <div className="space-y-1 pl-1.5">
            {forecastCategories.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Model Performance &amp; Validation
          </p>
          <div className="space-y-1 pl-1.5">
            {forecastValidation.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Risk Factors &amp; Uncertainty
          </p>
          <div className="space-y-1 pl-1.5">
            {forecastRisks.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*   same exact two-link UI */}
        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {forecastRecommendations.map((line, idx) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-0.5 w-3 text-xs font-medium text-[var(--brand-1-500)] font-['Source_Code_Pro']">
                  {idx + 1}.
                </span>
                <p className="flex-1 text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {CTA_SECTION}
      </div>
    </article>
  );
}

function DatasetDetail() {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          We prepared an enhanced, analysis-ready version of your dataset that
          includes cleaned data, calculated fields, quality flags, and richer
          metadata so it can plug straight into business intelligence tools or
          statistical software.
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Enhancements &amp; Transformations Applied
          </p>
          <div className="space-y-1 pl-1.5">
            {datasetEnhancements.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            File Formats Available
          </p>
          <div className="space-y-1 pl-1.5">
            {datasetFiles.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            New Columns Added
          </p>
          <div className="space-y-1 pl-1.5">
            {datasetColumns.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Quality Assurance
          </p>
          <div className="space-y-1 pl-1.5">
            {datasetQA.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/*   same exact two-link UI */}
        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {datasetRecommendations.map((line, idx) => (
              <div key={line} className="flex items-start gap-2">
                <span className="mt-0.5 w-3 text-xs font-medium text-[var(--brand-1-500)] font-['Source_Code_Pro']">
                  {idx + 1}.
                </span>
                <p className="flex-1 text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        {CTA_SECTION}
      </div>
    </article>
  );
}

export default function DetailCard({
  variant = "composition",
}: DetailCardProps) {
  return (
    <section className="flex w-full flex-col gap-3.5">
      {variant === "trend" ? (
        <TrendDetail />
      ) : variant === "ranking" ? (
        <RankingDetail />
      ) : variant === "dataQuality" ? (
        <DataQualityDetail />
      ) : variant === "forecast" ? (
        <ForecastDetail />
      ) : variant === "dataset" ? (
        <DatasetDetail />
      ) : (
        <CompositionDetail />
      )}
    </section>
  );
}
