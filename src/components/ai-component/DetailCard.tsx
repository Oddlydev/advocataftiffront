"use client";

import React from "react";
import MethodologyCard from "./MethodologyCard";
import TakeawaysCard from "./TakeawaysCard";
import ListBulletItem from "./ListBulletItem";
import ListNumberedItem from "./ListNumberedItem";
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

const CTA_SECTION = (onDownload: () => void) => (
  <div className="mt-5 border-t border-slate-200 pt-3.5">
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#EA1952] to-[#AA1E58] p-2.5 text-xs font-semibold text-white shadow"
      onClick={onDownload}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M8 10V2"
          stroke="white"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
          stroke="white"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.66663 6.66663L7.99996 9.99996L11.3333 6.66663"
          stroke="white"
          stroke-width="1.33333"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span className="text-sm font-[Montserrat]">
        Download Full Analysis Report
      </span>
    </button>

    <p className="mt-2 text-center text-xs text-slate-500 font-['Source_Code_Pro']">
      Formatted .txt file • Ready for sharing
    </p>
  </div>
);

function formatList(items?: string[], prefix = "- ") {
  if (!items || items.length === 0) {
    return "None provided.";
  }
  return items.map((item) => `${prefix}${item}`).join("\n");
}

function formatNumberedList(items?: string[]) {
  if (!items || items.length === 0) {
    return "None provided.";
  }
  return items.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function buildReportFilename(title?: string, variant?: DetailVariant) {
  const base = title?.trim()
    ? `${title}-${variant ?? "analysis-report"}`
    : (variant ?? "analysis-report");
  const normalized = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return `${normalized || "analysis-report"}.txt`;
}

function buildDetailReportContent(
  variant: DetailVariant,
  detailContent: DetailContentMap[DetailVariant],
  takeaways?: string[],
  methodology?: string,
  reportTitle?: string
) {
  const header = reportTitle?.trim()
    ? `${reportTitle} - ${variant} analysis`
    : `${variant} analysis`;
  const lines: string[] = [];

  lines.push(header);
  lines.push("=".repeat(header.length));
  lines.push("");

  if (takeaways && takeaways.length > 0) {
    lines.push("Key Takeaways");
    lines.push(formatList(takeaways));
    lines.push("");
  }

  if (methodology?.trim()) {
    lines.push("Methodology");
    lines.push(methodology.trim());
    lines.push("");
  }

  if (variant === "composition") {
    const content = detailContent as CompositionDetailContent;
    lines.push("Composition Summary");
    lines.push(formatList(content.introParagraphs, ""));
    lines.push("");
    lines.push(`Growth Summary: ${content.growthSummary || "None provided."}`);
    lines.push("");
    lines.push("Category Performance Metrics:");
    lines.push(formatList(content.firstMetrics));
    lines.push("");
    lines.push("Data Quality and Trend Insights:");
    lines.push(formatList(content.secondMetrics));
    lines.push("");
    lines.push("Recommendations:");
    lines.push(formatNumberedList(content.recommendations));
    return lines.join("\n");
  }

  if (variant === "trend") {
    const content = detailContent as TrendDetailContent;
    lines.push("Trend Summary");
    lines.push(`Intro: ${content.intro || "None provided."}`);
    lines.push(
      `Disruption Periods: ${content.disruptionParagraph || "None provided."}`
    );
    lines.push("Long-term Structural Trends:");
    lines.push(formatList(content.longTermTrends));
    lines.push("");
    lines.push(
      `Emerging Patterns: ${content.emergingPattern || "None provided."}`
    );
    lines.push("");
    lines.push("Recommendations:");
    lines.push(formatNumberedList(content.recommendations));
    return lines.join("\n");
  }

  if (variant === "ranking") {
    const content = detailContent as RankingDetailContent;
    lines.push("Ranking Summary");
    lines.push(`Intro: ${content.intro || "None provided."}`);
    lines.push("Stability Ranking:");
    lines.push(formatList(content.stabilityRanking));
    lines.push("");
    lines.push("Reference Links:");
    lines.push(formatList(content.linkTexts));
    lines.push("");
    lines.push("Recommendations:");
    lines.push(formatNumberedList(content.recommendations));
    return lines.join("\n");
  }

  if (variant === "dataQuality") {
    const content = detailContent as DataQualityDetailContent;
    lines.push("Data Quality Summary");
    lines.push(`Intro: ${content.intro || "None provided."}`);
    lines.push("");
    lines.push(
      `Missing Data Summary: ${content.missingDataSummary || "None provided."}`
    );
    lines.push("");
    lines.push("Missing Data Breakdown:");
    lines.push(formatList(content.breakdown));
    lines.push("");
    lines.push("Missing Data Timeline:");
    lines.push(formatList(content.timeline));
    lines.push("");
    lines.push("Outliers and Anomalies:");
    lines.push(formatList(content.outliers));
    lines.push("");
    lines.push("Data Consistency Checks:");
    lines.push(formatList(content.checks));
    lines.push("");
    lines.push("Recommendations:");
    lines.push(formatNumberedList(content.recommendations));
    return lines.join("\n");
  }

  if (variant === "forecast") {
    const content = detailContent as ForecastDetailContent;
    lines.push("Forecast Summary");
    lines.push(`Intro: ${content.intro || "None provided."}`);
    lines.push("");
    lines.push(
      `Forecast Summary: ${content.forecastSummary || "None provided."}`
    );
    lines.push("");
    lines.push("Category Projections:");
    lines.push(formatList(content.categoryProjections));
    lines.push("");
    lines.push("Validation Notes:");
    lines.push(formatList(content.validationNotes));
    lines.push("");
    lines.push("Risk Factors:");
    lines.push(formatList(content.riskFactors));
    lines.push("");
    lines.push("Recommendations:");
    lines.push(formatNumberedList(content.recommendations));
    return lines.join("\n");
  }

  if (variant === "dataset") {
    const content = detailContent as DatasetDetailContent;
    lines.push("Dataset Summary");
    lines.push(`Intro: ${content.intro || "None provided."}`);
    lines.push("");
    lines.push("Enhancements:");
    lines.push(formatList(content.enhancements));
    lines.push("");
    lines.push("File Formats:");
    lines.push(formatList(content.fileFormats));
    lines.push("");
    lines.push("New Columns:");
    lines.push(formatList(content.newColumns));
    lines.push("");
    lines.push("Quality Assurance Checks:");
    lines.push(formatList(content.qaChecks));
    lines.push("");
    lines.push("Recommendations:");
    lines.push(formatNumberedList(content.recommendations));
    return lines.join("\n");
  }

  return lines.join("\n");
}

function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function DetailRevealLinks({
  takeaways,
  methodology,
}: {
  takeaways?: string[];
  methodology?: string;
}) {
  return (
    <div className="space-y-3.5">
      {/* <TakeawaysCard takeaways={takeaways} /> */}
      {/* <MethodologyCard methodology={methodology} /> */}
    </div>
  );
}

type DetailSupportProps = {
  takeaways?: string[];
  methodology?: string;
  onDownload: () => void;
};

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

function CompositionDetail({
  content,
  takeaways,
  methodology,
  onDownload,
}: { content: CompositionDetailContent } & DetailSupportProps) {
  const introParagraphs = Array.isArray(content.introParagraphs)
    ? content.introParagraphs
    : [];
  const firstMetrics = Array.isArray(content.firstMetrics)
    ? content.firstMetrics
    : [];
  const secondMetrics = Array.isArray(content.secondMetrics)
    ? content.secondMetrics
    : [];
  const recommendations = Array.isArray(content.recommendations)
    ? content.recommendations
    : [];

  return (
    <article className="flex flex-col rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3.5">
        {introParagraphs.map((paragraph) => (
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

        <div className="mb-0">
          {firstMetrics.map((line, idx) => (
            <ListBulletItem key={`${line}-${idx}`} text={line} />
          ))}
        </div>

        <p className="pt-2.5 text-sm font-semibold text-slate-700 font-[Montserrat]">
          Data Quality &amp; Trend Insights
        </p>

        <div className="mb-0">
          {secondMetrics.map((line, idx) => (
            <ListBulletItem key={`${line}-${idx}`} text={line} />
          ))}
        </div>

        <div className="pt-3.5">
          <DetailRevealLinks />
        </div>

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>

          <div className="mt-2 space-y-3.5">
            {recommendations.map((line, idx) => (
              <ListNumberedItem
                key={`${line}-${idx}`}
                number={idx + 1}
                text={line}
              />
            ))}
          </div>
        </div>

        {CTA_SECTION(onDownload)}
      </div>
    </article>
  );
}

function TrendDetail({
  content,
  takeaways,
  methodology,
  onDownload,
}: { content: TrendDetailContent } & DetailSupportProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
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
            {content.longTermTrends.map((trend, idx) => (
              <ListBulletItem key={`${trend}-${idx}`} text={trend} />
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

        <DetailRevealLinks takeaways={takeaways} methodology={methodology} />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>

          <div className="mt-2 space-y-3.5">
            {content.recommendations.map((line, idx) => (
              <ListNumberedItem
                key={`${line}-${idx}`}
                number={idx + 1}
                text={line}
              />
            ))}
          </div>
        </div>

        {CTA_SECTION(onDownload)}
      </div>
    </article>
  );
}

function RankingDetail({
  content,
  takeaways,
  methodology,
  onDownload,
}: { content: RankingDetailContent } & DetailSupportProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {content.intro}
        </p>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Ranking by Stability (Lowest Volatility)
          </p>
          <div className="space-y-1 pl-1.5">
            {content.stabilityRanking.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1 text-xs text-[var(--brand-1-500)] font-normal font-['Source_Code_Pro'] mt-2.5 mb-8">
          {content.linkTexts.map((text) => (
            <div key={text} className="flex items-start gap-3">
              <RankingLinkIcon />
              <span className="cursor-pointer">{text}</span>
            </div>
          ))}
        </div>

        <DetailRevealLinks takeaways={takeaways} methodology={methodology} />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-3.5">
            {content.recommendations.map((line, idx) => (
              <ListNumberedItem
                key={`${line}-${idx}`}
                number={idx + 1}
                text={line}
              />
            ))}
          </div>
        </div>

        {CTA_SECTION(onDownload)}
      </div>
    </article>
  );
}

function DataQualityDetail({
  content,
  takeaways,
  methodology,
  onDownload,
}: { content: DataQualityDetailContent } & DetailSupportProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
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
            {content.breakdown.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Missing Data by Time Period
          </p>
          <div className="space-y-1 pl-1.5">
            {content.timeline.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Outliers &amp; Anomalies Detected
          </p>
          <div className="space-y-1 pl-1.5">
            {content.outliers.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Data Consistency Checks
          </p>
          <div className="space-y-1 pl-1.5">
            {content.checks.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <DetailRevealLinks takeaways={takeaways} methodology={methodology} />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-3.5">
            {content.recommendations.map((line, idx) => (
              <ListNumberedItem
                key={`${line}-${idx}`}
                number={idx + 1}
                text={line}
              />
            ))}
          </div>
        </div>

        {CTA_SECTION(onDownload)}
      </div>
    </article>
  );
}

function ForecastDetail({
  content,
  takeaways,
  methodology,
  onDownload,
}: { content: ForecastDetailContent } & DetailSupportProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
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
            {content.categoryProjections.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Model Performance &amp; Validation
          </p>
          <div className="space-y-1 pl-1.5">
            {content.validationNotes.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Risk Factors &amp; Uncertainty
          </p>
          <div className="space-y-1 pl-1.5">
            {content.riskFactors.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <DetailRevealLinks takeaways={takeaways} methodology={methodology} />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-3.5">
            {content.recommendations.map((line, idx) => (
              <ListNumberedItem
                key={`${line}-${idx}`}
                number={idx + 1}
                text={line}
              />
            ))}
          </div>
        </div>

        {CTA_SECTION(onDownload)}
      </div>
    </article>
  );
}

function DatasetDetail({
  content,
  takeaways,
  methodology,
  onDownload,
}: { content: DatasetDetailContent } & DetailSupportProps) {
  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="space-y-3">
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {content.intro}
        </p>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Enhancements &amp; Transformations Applied
          </p>
          <div className="space-y-1 pl-1.5">
            {content.enhancements.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            File Formats Available
          </p>
          <div className="space-y-1 pl-1.5">
            {content.fileFormats.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            New Columns Added
          </p>
          <div className="space-y-1 pl-1.5">
            {content.newColumns.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Quality Assurance
          </p>
          <div className="space-y-1 pl-1.5">
            {content.qaChecks.map((line, idx) => (
              <ListBulletItem key={`${line}-${idx}`} text={line} />
            ))}
          </div>
        </div>

        <DetailRevealLinks takeaways={takeaways} methodology={methodology} />

        <div className="pt-5 mt-3.5 border-t border-slate-200 mb-0">
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Recommendations
          </p>
          <div className="mt-2 space-y-3.5">
            {content.recommendations.map((line, idx) => (
              <ListNumberedItem
                key={`${line}-${idx}`}
                number={idx + 1}
                text={line}
              />
            ))}
          </div>
        </div>

        {CTA_SECTION(onDownload)}
      </div>
    </article>
  );
}

type DetailCardProps = {
  variant?: DetailVariant;
  detailContent: DetailContentMap[DetailVariant];
  takeaways?: string[];
  methodology?: string;
  reportContent?: string;
  reportTitle?: string;
};

export default function DetailCard({
  variant = "composition",
  detailContent,
  takeaways,
  methodology,
  reportContent,
  reportTitle,
}: DetailCardProps) {
  const handleDownload = () => {
    const resolvedContent =
      reportContent ??
      buildDetailReportContent(
        variant,
        detailContent,
        takeaways,
        methodology,
        reportTitle
      );
    if (!resolvedContent.trim()) return;

    const filename = buildReportFilename(reportTitle, variant);
    downloadTextFile(resolvedContent, filename);
  };

  if (variant === "trend") {
    return (
      <TrendDetail
        content={detailContent as TrendDetailContent}
        takeaways={takeaways}
        methodology={methodology}
        onDownload={handleDownload}
      />
    );
  }

  if (variant === "ranking") {
    return (
      <RankingDetail
        content={detailContent as RankingDetailContent}
        takeaways={takeaways}
        methodology={methodology}
        onDownload={handleDownload}
      />
    );
  }

  if (variant === "dataQuality") {
    return (
      <DataQualityDetail
        content={detailContent as DataQualityDetailContent}
        takeaways={takeaways}
        methodology={methodology}
        onDownload={handleDownload}
      />
    );
  }

  if (variant === "forecast") {
    return (
      <ForecastDetail
        content={detailContent as ForecastDetailContent}
        takeaways={takeaways}
        methodology={methodology}
        onDownload={handleDownload}
      />
    );
  }

  if (variant === "dataset") {
    return (
      <DatasetDetail
        content={detailContent as DatasetDetailContent}
        takeaways={takeaways}
        methodology={methodology}
        onDownload={handleDownload}
      />
    );
  }

  return (
    <CompositionDetail
      content={detailContent as CompositionDetailContent}
      takeaways={takeaways}
      methodology={methodology}
      onDownload={handleDownload}
    />
  );
}
