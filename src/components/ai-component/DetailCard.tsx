"use client";

import React from "react";
import MethodologyCard from "./MethodologyCard";
import TakeawaysCard from "./TakeawaysCard";
import type {
  CompositionDetailContent,
  DataQualityDetailContent,
  DatasetDetailContent,
  DetailContentMap,
  DetailVariant,
  ForecastDetailContent,
  RankingDetailContent,
  TrendDetailContent,
} from "./detailContent.types";

export type { DetailVariant } from "./detailContent.types";

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

function DetailRevealLinks() {
  return (
    <div className="space-y-2">
      <TakeawaysCard />
      <MethodologyCard />
    </div>
  );
}

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

function CompositionDetail({ content }: { content: CompositionDetailContent }) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-2.5">
        {content.introParagraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-sm leading-5 text-slate-700 font-[Montserrat]"
          >
            {paragraph}
          </p>
        ))}

        <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
          Overall Growth Patterns
        </p>

        <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
          {content.growthSummary}
        </p>

        <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
          Category Performance Metrics
        </p>

        <div className="space-y-1.5 pl-1.5">
          {content.firstMetrics.map((line) => (
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
          {content.secondMetrics.map((line) => (
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

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>

          <div className="mt-2 space-y-1">
            {content.recommendations.map((line, idx) => (
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

function TrendDetail({ content }: { content: TrendDetailContent }) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {content.intro}
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            The Three Major Disruption Periods
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            {content.disruptionParagraph}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Long-term Structural Trends
          </p>

          <div className="space-y-1 pl-1.5">
            {content.longTermTrends.map((trend) => (
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
            {content.emergingPattern}
          </p>
        </div>

        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>

          <div className="mt-2 space-y-1">
            {content.recommendations.map((line, idx) => (
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

function RankingDetail({ content }: { content: RankingDetailContent }) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {content.intro}
        </p>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Ranking by Stability (Lowest Volatility)
          </p>
          <div className="space-y-1 pl-1.5">
            {content.stabilityRanking.map((line) => (
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
          {content.linkTexts.map((text) => (
            <div key={text} className="flex items-center gap-1.5">
              <RankingLinkIcon />
              <span className="cursor-pointer">{text}</span>
            </div>
          ))}
        </div>

        <TakeawaysCard />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {content.recommendations.map((line, idx) => (
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

function DataQualityDetail({ content }: { content: DataQualityDetailContent }) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {content.intro}
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Missing Data Analysis
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            {content.missingDataSummary}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Missing Data Breakdown by Category
          </p>
          <div className="space-y-1 pl-1.5">
            {content.breakdown.map((line) => (
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
            {content.timeline.map((line) => (
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
            {content.outliers.map((line) => (
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
            {content.checks.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {content.recommendations.map((line, idx) => (
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

function ForecastDetail({ content }: { content: ForecastDetailContent }) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {content.intro}
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Overall Consumption Forecast
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            {content.forecastSummary}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Category-Specific Projections (2025-2027)
          </p>
          <div className="space-y-1 pl-1.5">
            {content.categoryProjections.map((line) => (
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
            {content.validationNotes.map((line) => (
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
            {content.riskFactors.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {content.recommendations.map((line, idx) => (
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

function DatasetDetail({ content }: { content: DatasetDetailContent }) {
  return (
    <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {content.intro}
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Enhancements &amp; Transformations Applied
          </p>
          <div className="space-y-1 pl-1.5">
            {content.enhancements.map((line) => (
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
            {content.fileFormats.map((line) => (
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
            {content.newColumns.map((line) => (
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
            {content.qaChecks.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DetailRevealLinks />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-1">
            {content.recommendations.map((line, idx) => (
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

type DetailCardProps = {
  variant?: DetailVariant;
  detailContent: DetailContentMap[DetailVariant];
};

export default function DetailCard({
  variant = "composition",
  detailContent,
}: DetailCardProps) {
  if (variant === "trend") {
    return <TrendDetail content={detailContent as TrendDetailContent} />;
  }

  if (variant === "ranking") {
    return <RankingDetail content={detailContent as RankingDetailContent} />;
  }

  if (variant === "dataQuality") {
    return (
      <DataQualityDetail content={detailContent as DataQualityDetailContent} />
    );
  }

  if (variant === "forecast") {
    return <ForecastDetail content={detailContent as ForecastDetailContent} />;
  }

  if (variant === "dataset") {
    return <DatasetDetail content={detailContent as DatasetDetailContent} />;
  }

  return (
    <CompositionDetail content={detailContent as CompositionDetailContent} />
  );
}
