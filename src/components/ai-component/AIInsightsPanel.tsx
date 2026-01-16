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
import React, { useEffect, useState } from "react";

import InsightsDisclaimerCard from "./InsightsDisclaimerCard";
import KeyInsightsCard from "./KeyInsightsCard";
import LoadingIcon from "./LoadingIcon";
import SuggestedActionCard from "./SuggestedActionCard";
import TitleCard from "./TitleCard";

export const detailContentByVariant: {
  [K in Exclude<DetailVariant, "keyInsights">]: DetailContentMap[K];
} = {
  composition: {
    introParagraphs: [
      "The dataset reveals consistent category momentum with a notable lean toward essential services.",
      "Food spending accounts for the largest share and is still growing faster than the broader average.",
    ],
    growthSummary:
      "Aggregate annual growth averages 5.3%, with Food, Alcohol & Tobacco, and Personal Care leading the surge.",
    firstMetrics: [
      "Food: +5.8% CAGR, 38% of total spend",
      "Housing: +4.2% CAGR with low volatility",
      "Alcohol & Tobacco: +12.3% YoY but higher variance",
    ],
    secondMetrics: [
      "Transport: -0.4% YoY, reflects higher fuel efficiency",
      "Health: +3.1% YoY, stable despite policy changes",
      "Education: +2.7% YoY, driven by online services",
    ],
    recommendations: [
      "Double down on resilience programs for Food and Housing.",
      "Monitor Alcohol & Tobacco for emerging volatility risks.",
      "Consider automation investments in Transportation to arrest decline.",
    ],
  },
  trend: {
    intro:
      "The 26-year trend analysis highlights cyclical recoveries, with 2018 and 2021 standing out as growth pivots.",
    disruptionParagraph:
      "Pandemic-era stimulus created steep spikes that are now normalizing but still influence recent averages.",
    longTermTrends: [
      "Housing demand has eased since 2019 but remains above pre-2008 averages.",
      "Technology spending accelerated after 2020, yet stabilization is visible in the past 3 years.",
      "Agriculture & utilities hold steady due to regulation-backed contracts.",
    ],
    emergingPattern:
      "Health & Education are converging patterns, suggesting bundling opportunities for policy planning.",
    recommendations: [
      "Update scenarios to isolate post-pandemic normalization signals.",
      "Prioritize trend monitoring on sectors where volatility exceeds 8%.",
      "Share insights with portfolio teams to align on emerging service bundling.",
    ],
  },
  ranking: {
    intro:
      "Category ranking surfaces stability leaders alongside growth champions across spending buckets.",
    stabilityRanking: [
      "Housing: 92% stability index, minimal monthly drift",
      "Food: 89% stability, dependable but moderately sensitive to seasonality",
      "Healthcare: 84% stability, steady but capital-intensive",
      "Entertainment: 61% stability, highest volatility paired with high growth",
    ],
    linkTexts: [
      "Export ranking report",
      "Send ranking snapshot to CEO",
      "View ranking change log",
    ],
    recommendations: [
      "Lean into Housing and Food for baseline budgeting.",
      "Guard Entertainment exposure because of the volatility premium.",
      "Encourage stakeholders to review the ranking report monthly.",
    ],
  },
  dataQuality: {
    intro:
      "Data integrity checks flagged a few gaps that are common in long-tailed public datasets.",
    missingDataSummary:
      "2% of category-month entries were missing post-2005, focused in cross-border transfers.",
    breakdown: [
      "Housing Q1-Q2 2012 lacks state-level breakdown; estimates imputed.",
      "Entertainment 1999 had 18% missing due to filing delay; forward-fill applied.",
      "Alcohol & Tobacco 2004 uses aggregate totals for 3 states only.",
    ],
    timeline: [
      "Anomaly window: 2008-2009 shows manual overrides tied to recession adjustments.",
      "2016 has duplicate entries in Transportation resolved by deduplication.",
      "2023 exhibits latency gaps, likely from a reporting API migration.",
    ],
    outliers: [
      "July 2014 Food spike is +48% above average; flagged for manual review.",
      "Oct 2020 Entertainment dip exceeds 3 standard deviations; related to platform outage.",
    ],
    checks: [
      "Passed schema validation for 99.7% of rows.",
      "Nulls limited to supplementary notes fields.",
      "All forecasts cross-validated with rolling 6-month bias checks.",
    ],
    recommendations: [
      "Automate alerts for >4% drop in completion rate per month.",
      "Revisit the imputation strategy for long-tail categories before forecasting.",
      "Audit the July 2014 Food spike with the finance team.",
    ],
  },
  forecast: {
    intro:
      "Short-term forecasts pair seasonal smoothing with the latest volatility estimates.",
    forecastSummary:
      "2025-2027 projections assume gradual recovery in Transport and steady growth in Food & Healthcare.",
    categoryProjections: [
      "Food: +5.4% CAGR (2025-2027), inflation-adjusted",
      "Housing: +3.9% CAGR, supported by rent control stability",
      "Entertainment: +8.7% CAGR, fueled by digital subscriptions",
    ],
    validationNotes: [
      "Backtest 2021-2023 horizon shows 1.8% MAPE after bias correction.",
      "Ensembled ARIMA + Prophet models reduced variance by 12%.",
    ],
    riskFactors: [
      "Energy price shocks could reverse Transport gains.",
      "Policy shifts impacting Healthcare reimbursements.",
      "Supply chain disruptions mainly hit Education services.",
    ],
    recommendations: [
      "Update assumptions after quarterly CPI release.",
      "Embed scenario toggles for energy costs in dashboards.",
      "Share risk factors with procurement before contracting.",
    ],
  },
  dataset: {
    intro:
      "The cleaned dataset pairs calculated metrics with audit-ready provenance tags for easy reuse.",
    enhancements: [
      "Normalized currency to 2024 USD using CPI base 2024.",
      "Imputed missing category-months via k-nearest neighbors.",
      "Flagged anomalies with a severity score for each row.",
    ],
    fileFormats: ["CSV", "Parquet", "Excel"],
    newColumns: [
      "Rolling 12-month growth",
      "Volatility index (12M stdev)",
      "Data quality score",
    ],
    qaChecks: [
      "Checksum validation for every nightly ingest.",
      "Cross-reference with ERP exports on a sample of 5% rows.",
      "Automated schema drift alerts via CI/CD pipelines.",
    ],
    recommendations: [
      "Use the Parquet export for analytics jobs; CSV for quick downloads.",
      "Share the anomaly flags with data governance before publishing.",
      "Refresh the dataset after each quarterly close to keep forecasts relevant.",
    ],
  },
};

export type MoreInsightDetail = {
  title: string;
  description: string;
  detailVariant: DetailVariant;
  detailContent: DetailContentMap[DetailVariant];
};

export type AIInsightsResponse = DetailContentMap & {
  moreInsights?: MoreInsightDetail[];
  takeaways?: string[];
  methodology?: string;
};

function normalizeStringArray(items?: string[] | string | null): string[] {
  if (!items) {
    return [];
  }
  if (Array.isArray(items)) {
    return items;
  }
  if (typeof items === "string") {
    const trimmed = items.trim();
    return trimmed ? [trimmed] : [];
  }
  return [];
}

function formatList(items?: string[] | string | null, prefix = "- ") {
  const normalized = normalizeStringArray(items);
  if (normalized.length === 0) {
    return "";
  }
  return normalized.map((item) => `${prefix}${item}`).join("\n");
}

function formatNumberedList(items?: string[] | string | null) {
  const normalized = normalizeStringArray(items);
  if (normalized.length === 0) {
    return "";
  }
  return normalized.map((item, index) => `${index + 1}. ${item}`).join("\n");
}

function formatParagraphs(items?: string[] | string | null) {
  const normalized = normalizeStringArray(items);
  if (normalized.length === 0) {
    return "";
  }
  return normalized.join("\n");
}

function formatKeyInsights(insights?: AIInsightsResponse["keyInsights"]) {
  if (!insights || insights.length === 0) {
    return "";
  }
  return insights
    .map(
      (insight, index) =>
        `${index + 1}. ${insight.title}: ${insight.content} (Confidence: ${insight.confidence})`
    )
    .join("\n");
}

function appendDetailContent(
  lines: string[],
  variant: DetailVariant,
  detailContent: DetailContentMap[DetailVariant]
) {
  if (variant === "composition") {
    const content = detailContent as CompositionDetailContent;
    const introParagraphs = formatParagraphs(content.introParagraphs);
    if (introParagraphs) {
      lines.push("Composition Summary");
      lines.push(introParagraphs);
      lines.push("");
    }
    if (content.growthSummary) {
      lines.push("Growth Summary");
      lines.push(content.growthSummary);
      lines.push("");
    }
    const firstMetrics = formatList(content.firstMetrics);
    if (firstMetrics) {
      lines.push("Category Performance Metrics:");
      lines.push(firstMetrics);
      lines.push("");
    }
    const secondMetrics = formatList(content.secondMetrics);
    if (secondMetrics) {
      lines.push("Data Quality and Trend Insights:");
      lines.push(secondMetrics);
      lines.push("");
    }
    const recommendations = formatNumberedList(content.recommendations);
    if (recommendations) {
      lines.push("Recommendations:");
      lines.push(recommendations);
    }
    return;
  }

  if (variant === "trend") {
    const content = detailContent as TrendDetailContent;
    let hasSection = false;
    if (content.intro) {
      lines.push("Trend Summary");
      lines.push("Intro");
      lines.push(content.intro);
      lines.push("");
      hasSection = true;
    }
    if (content.disruptionParagraph) {
      if (!hasSection) {
        lines.push("Trend Summary");
        hasSection = true;
      }
      lines.push("Disruption Periods");
      lines.push(content.disruptionParagraph);
      lines.push("");
    }
    const longTermTrends = formatList(content.longTermTrends);
    if (longTermTrends) {
      if (!hasSection) {
        lines.push("Trend Summary");
        hasSection = true;
      }
      lines.push("Long-term Structural Trends:");
      lines.push(longTermTrends);
      lines.push("");
    }
    if (content.emergingPattern) {
      if (!hasSection) {
        lines.push("Trend Summary");
        hasSection = true;
      }
      lines.push("Emerging Patterns");
      lines.push(content.emergingPattern);
      lines.push("");
    }
    const recommendations = formatNumberedList(content.recommendations);
    if (recommendations) {
      if (!hasSection) {
        lines.push("Trend Summary");
      }
      lines.push("Recommendations:");
      lines.push(recommendations);
    }
    return;
  }

  if (variant === "ranking") {
    const content = detailContent as RankingDetailContent;
    let hasSection = false;
    if (content.intro) {
      lines.push("Ranking Summary");
      lines.push("Intro");
      lines.push(content.intro);
      lines.push("");
      hasSection = true;
    }
    const stabilityRanking = formatList(content.stabilityRanking);
    if (stabilityRanking) {
      if (!hasSection) {
        lines.push("Ranking Summary");
        hasSection = true;
      }
      lines.push("Stability Ranking:");
      lines.push(stabilityRanking);
      lines.push("");
    }
    const linkTexts = formatList(content.linkTexts);
    if (linkTexts) {
      if (!hasSection) {
        lines.push("Ranking Summary");
        hasSection = true;
      }
      lines.push("Reference Links:");
      lines.push(linkTexts);
      lines.push("");
    }
    const recommendations = formatNumberedList(content.recommendations);
    if (recommendations) {
      if (!hasSection) {
        lines.push("Ranking Summary");
      }
      lines.push("Recommendations:");
      lines.push(recommendations);
    }
    return;
  }

  if (variant === "dataQuality") {
    const content = detailContent as DataQualityDetailContent;
    let hasSection = false;
    if (content.intro) {
      lines.push("Data Quality Summary");
      lines.push("Intro");
      lines.push(content.intro);
      lines.push("");
      hasSection = true;
    }
    if (content.missingDataSummary) {
      if (!hasSection) {
        lines.push("Data Quality Summary");
        hasSection = true;
      }
      lines.push("Missing Data Summary");
      lines.push(content.missingDataSummary);
      lines.push("");
    }
    const breakdown = formatList(content.breakdown);
    if (breakdown) {
      if (!hasSection) {
        lines.push("Data Quality Summary");
        hasSection = true;
      }
      lines.push("Missing Data Breakdown:");
      lines.push(breakdown);
      lines.push("");
    }
    const timeline = formatList(content.timeline);
    if (timeline) {
      if (!hasSection) {
        lines.push("Data Quality Summary");
        hasSection = true;
      }
      lines.push("Missing Data Timeline:");
      lines.push(timeline);
      lines.push("");
    }
    const outliers = formatList(content.outliers);
    if (outliers) {
      if (!hasSection) {
        lines.push("Data Quality Summary");
        hasSection = true;
      }
      lines.push("Outliers and Anomalies:");
      lines.push(outliers);
      lines.push("");
    }
    const checks = formatList(content.checks);
    if (checks) {
      if (!hasSection) {
        lines.push("Data Quality Summary");
        hasSection = true;
      }
      lines.push("Data Consistency Checks:");
      lines.push(checks);
      lines.push("");
    }
    const recommendations = formatNumberedList(content.recommendations);
    if (recommendations) {
      if (!hasSection) {
        lines.push("Data Quality Summary");
      }
      lines.push("Recommendations:");
      lines.push(recommendations);
    }
    return;
  }

  if (variant === "forecast") {
    const content = detailContent as ForecastDetailContent;
    let hasSection = false;
    if (content.intro) {
      lines.push("Forecast Summary");
      lines.push("Intro");
      lines.push(content.intro);
      lines.push("");
      hasSection = true;
    }
    if (content.forecastSummary) {
      if (!hasSection) {
        lines.push("Forecast Summary");
        hasSection = true;
      }
      lines.push("Forecast Summary");
      lines.push(content.forecastSummary);
      lines.push("");
    }
    const categoryProjections = formatList(content.categoryProjections);
    if (categoryProjections) {
      if (!hasSection) {
        lines.push("Forecast Summary");
        hasSection = true;
      }
      lines.push("Category Projections:");
      lines.push(categoryProjections);
      lines.push("");
    }
    const validationNotes = formatList(content.validationNotes);
    if (validationNotes) {
      if (!hasSection) {
        lines.push("Forecast Summary");
        hasSection = true;
      }
      lines.push("Validation Notes:");
      lines.push(validationNotes);
      lines.push("");
    }
    const riskFactors = formatList(content.riskFactors);
    if (riskFactors) {
      if (!hasSection) {
        lines.push("Forecast Summary");
        hasSection = true;
      }
      lines.push("Risk Factors:");
      lines.push(riskFactors);
      lines.push("");
    }
    const recommendations = formatNumberedList(content.recommendations);
    if (recommendations) {
      if (!hasSection) {
        lines.push("Forecast Summary");
      }
      lines.push("Recommendations:");
      lines.push(recommendations);
    }
    return;
  }

  if (variant === "dataset") {
    const content = detailContent as DatasetDetailContent;
    if (content.intro) {
      lines.push(content.intro);
      lines.push("");
    }
    const enhancements = formatList(content.enhancements);
    if (enhancements) {
      lines.push("Enhancements:");
      lines.push(enhancements);
      lines.push("");
    }
    const fileFormats = formatList(content.fileFormats);
    if (fileFormats) {
      lines.push("File Formats:");
      lines.push(fileFormats);
      lines.push("");
    }
    const newColumns = formatList(content.newColumns);
    if (newColumns) {
      lines.push("New Columns:");
      lines.push(newColumns);
      lines.push("");
    }
    const qaChecks = formatList(content.qaChecks);
    if (qaChecks) {
      lines.push("Quality Assurance Checks:");
      lines.push(qaChecks);
      lines.push("");
    }
    const recommendations = formatNumberedList(content.recommendations);
    if (recommendations) {
      lines.push("Recommendations:");
      lines.push(recommendations);
    }
  }
}

function buildMoreInsightsDownloadReport(
  insights: AIInsightsResponse,
  moreInsightsDetails: MoreInsightDetail[],
  title?: string
): string {
  const lines: string[] = [];

  const reportTitle = title?.trim();
  if (reportTitle) {
    lines.push(reportTitle);
    lines.push("=".repeat(reportTitle.length));
    lines.push("");
  }

  const keyInsights = formatKeyInsights(insights.keyInsights);
  if (keyInsights) {
    lines.push("Key Insights");
    lines.push(keyInsights);
    lines.push("");
  }

  if (moreInsightsDetails.length > 0) {
    lines.push("More Insights");
    lines.push("");
  }

  moreInsightsDetails.forEach((insight, index) => {
    const sectionTitle = `${index + 1}. ${insight.title}`;
    lines.push(sectionTitle);
    lines.push("-".repeat(sectionTitle.length));
    if (insight.detailContent) {
      appendDetailContent(lines, insight.detailVariant, insight.detailContent);
    }
    lines.push("");
  });

  return lines.join("\n");
}

export type AIInsightsPanelProps = {
  onClose?: () => void;
  datasetUrl?: string;
  titleCardHeadline?: string;
  datasetDescription?: string;
  manualInsights?: AIInsightsResponse | null;
};

export default function AIInsightsPanel({
  onClose,
  datasetUrl,
  titleCardHeadline,
  datasetDescription,
  manualInsights,
}: AIInsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsightsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [isLoaderVisible, setIsLoaderVisible] = useState(true);
  const [isFadingLoader, setIsFadingLoader] = useState(false);
  const [loaderOpacity, setLoaderOpacity] = useState(1);
  const [contentVisible, setContentVisible] = useState(false);
  const LOADER_FADE_DURATION = 1400;
  const CONTENT_REVEAL_DELAY = 450;

  useEffect(() => {
    if (!datasetUrl || manualInsights) return;

    let cancelled = false;
    const controller = new AbortController();

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/generate-insights", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({ datasetUrl, datasetDescription }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch insights");
        }

        const data = await response.json();
        if (!cancelled) {
          setInsights(data);
        }
      } catch (err) {
        if ((err as Error)?.name === "AbortError") return;
        console.error(err);
        if (!cancelled) {
          setError("Failed to generate insights. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInsights();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [datasetUrl, manualInsights, datasetDescription]);

  useEffect(() => {
    if (manualInsights) {
      setInsights(manualInsights);
      setError(null);
      setLoading(false);
    }
  }, [manualInsights]);

  useEffect(() => {
    if (!loading) {
      setLoadingStepIndex(0);
      return;
    }

    const duration = loadingStepIndex === 0 ? 5000 : 4000;
    const timeout = window.setTimeout(() => {
      setLoadingStepIndex((prev) => prev + 1);
    }, duration);

    return () => window.clearTimeout(timeout);
  }, [loading, loadingStepIndex]);

  const shouldShowLoaderContent = loading || !insights;

  useEffect(() => {
    let fadeTimer: number | null = null;
    let contentTimer: number | null = null;
    if (shouldShowLoaderContent) {
      setIsLoaderVisible(true);
      setIsFadingLoader(false);
      setLoaderOpacity(1);
      setContentVisible(false);
    } else {
      setIsFadingLoader(true);
      requestAnimationFrame(() => setLoaderOpacity(0));
      contentTimer = window.setTimeout(() => {
        setContentVisible(true);
      }, CONTENT_REVEAL_DELAY);
      fadeTimer = window.setTimeout(() => {
        setIsLoaderVisible(false);
        setIsFadingLoader(false);
        setLoaderOpacity(1);
      }, LOADER_FADE_DURATION);
    }

    return () => {
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (contentTimer) window.clearTimeout(contentTimer);
    };
  }, [shouldShowLoaderContent]);

  const moreInsightsDetails = insights?.moreInsights ?? [];
  const loadingSteps = [
    "Thinking...",
    "Scanning the dataset for key signals...",
    "Identifying meaningful patterns...",
    "Evaluating trends and outliers...",
    "Ranking insights by impact...",
    "Finalizing insights and recommendations...",
  ];
  const loadingText = loadingSteps[loadingStepIndex % loadingSteps.length];
  const showSkeleton = loading && loadingStepIndex >= loadingSteps.length;

  const reportContent = insights
    ? buildMoreInsightsDownloadReport(
        insights,
        moreInsightsDetails,
        titleCardHeadline
      )
    : null;

  return (
    <div className="flex w-full flex-col gap-3">
      <article className="rounded-[14px] bg-white px-6 pb-6 pt-6">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#EA1952] to-[#AA1E58]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22.7855 15.3691C21.8551 16.754 20.7302 18.1261 19.4276 19.4271C17.5556 21.3006 15.5372 22.8091 13.5486 23.9015C10.7958 25.4128 8.08695 26.1287 5.86558 25.981C4.20513 25.8716 2.79467 25.2921 1.75081 24.2481C0.398568 22.8959 -0.178102 20.9088 0.0477441 18.5738C0.1074 17.9502 0.664195 17.49 1.28777 17.5497C1.91132 17.6093 2.37155 18.1661 2.30905 18.7911C2.15706 20.3635 2.44683 21.7299 3.35872 22.6419C4.21382 23.497 5.4737 23.8024 6.92678 23.7129C8.60003 23.6092 10.509 22.9771 12.4535 21.909C14.2688 20.9104 16.1112 19.5312 17.8213 17.8211C19.3596 16.2828 20.6309 14.638 21.5968 13.0002C20.6309 11.3625 19.3597 9.71765 17.8213 8.17927C17.4207 7.7787 17.0145 7.39806 16.6026 7.03444C16.1324 6.62111 16.0855 5.90095 16.5003 5.43079C16.9151 4.96204 17.6352 4.91517 18.104 5.32994C18.5528 5.7248 18.9946 6.13816 19.4278 6.57139C21.2999 8.44347 22.8069 10.4632 23.8993 12.4505C23.9007 12.4519 23.9007 12.4519 23.9007 12.4519C25.4134 15.206 26.1293 17.9135 25.9802 20.1349C25.8708 21.7953 25.2913 23.2072 24.2487 24.2482C22.8965 25.6018 20.9079 26.1771 18.5729 25.9527C17.9494 25.893 17.492 25.3376 17.5502 24.7126C17.6113 24.0876 18.1667 23.6289 18.7917 23.6914C20.364 23.8405 21.7319 23.5536 22.6424 22.6417C23.4989 21.7866 23.8029 20.5253 23.712 19.0736C23.6424 17.9274 23.3242 16.6717 22.7859 15.369L22.7855 15.3691ZM2.10004 13.5481C0.587289 10.794 -0.128577 8.08651 0.0205453 5.86513C0.129916 4.20468 0.708012 2.79281 1.75059 1.75037C3.10426 0.398126 5.09139 -0.177127 7.42639 0.0473018C8.05139 0.106958 8.50876 0.662335 8.4505 1.28733C8.38943 1.91233 7.83405 2.36969 7.20906 2.3086C5.63668 2.15804 4.26883 2.44496 3.35683 3.35686C2.50173 4.21337 2.19778 5.47326 2.28727 6.92633C2.35829 8.07258 2.67645 9.32825 3.21338 10.6295C4.14516 9.246 5.27011 7.8739 6.57264 6.57289C8.44472 4.69939 10.4631 3.1909 12.4517 2.0985C15.2044 0.58721 17.9133 -0.128692 20.1347 0.019012C21.7952 0.128383 23.2056 0.707897 24.248 1.75048C25.6017 3.10414 26.1769 5.09127 25.9525 7.42628C25.8914 8.04982 25.3361 8.51006 24.7125 8.45039C24.0889 8.38931 23.6287 7.83394 23.6898 7.20894C23.8432 5.63656 23.5534 4.26872 22.6415 3.35817C21.7864 2.50307 20.5251 2.1977 19.0721 2.28719C17.4002 2.39088 15.4912 3.02294 13.5468 4.09109C11.7315 5.08963 9.88802 6.46886 8.17899 8.17894C6.63926 9.71725 5.36799 11.3621 4.40348 12.9999C5.36792 14.6376 6.6406 16.2824 8.17899 17.8208C8.57814 18.2214 8.98434 18.6006 9.39771 18.9642C9.86787 19.379 9.91474 20.0977 9.49998 20.5693C9.08381 21.038 8.36507 21.0835 7.89491 20.6701C7.44747 20.2753 7.00432 19.8605 6.5711 19.4273C4.70044 17.5566 3.19336 15.5368 2.10107 13.5496C2.09965 13.5482 2.09965 13.5482 2.09965 13.5482L2.10004 13.5481ZM13.6876 9.2712C13.6876 9.2712 14.3666 10.7839 14.7884 11.2072C15.2117 11.6305 16.7301 12.3137 16.7301 12.3137C16.9957 12.4373 17.1676 12.7057 17.1662 12.9998C17.1676 13.2952 16.9957 13.5637 16.7287 13.6872C16.7287 13.6872 15.2174 14.3662 14.7913 14.7866C14.368 15.2113 13.6862 16.7297 13.6862 16.7297C13.564 16.9953 13.2942 17.1658 12.9987 17.1658C12.7061 17.1672 12.4376 16.9953 12.3141 16.7297C12.3141 16.7297 11.6309 15.2113 11.2076 14.7881C10.7843 14.3662 9.27157 13.6873 9.27157 13.6873C9.00453 13.5623 8.83267 13.2938 8.83267 12.9998C8.83409 12.7058 9.00454 12.4359 9.27157 12.3123C9.27157 12.3123 10.7829 11.6334 11.2076 11.2115C11.6323 10.7882 12.3127 9.26985 12.3127 9.26985C12.4362 9.00423 12.7061 8.83379 13.0001 8.83237C13.2941 8.83237 13.5627 9.00417 13.6876 9.2712ZM13.0002 11.2228C12.7544 11.6518 12.4874 12.0722 12.2772 12.2825C12.0684 12.4913 11.6522 12.7555 11.2232 12.9998C11.6522 13.2441 12.0684 13.5083 12.2772 13.7157C12.4874 13.9245 12.7544 14.3449 13.0002 14.7767C13.2459 14.3464 13.5129 13.9259 13.7232 13.7157C13.9305 13.5083 14.3496 13.2441 14.7757 12.9998C14.3453 12.7541 13.9249 12.487 13.716 12.2768C13.5086 12.068 13.2431 11.6503 13.0002 11.2228Z"
                  fill="white"
                />
              </svg>
            </span>

            <div className="space-y-1">
              <p
                className="text-[16px] leading-6 font-normal text-slate-900"
                style={{ fontFamily: '"Source Code Pro"' }}
              >
                AI Insights
              </p>
              <p
                className="text-sm font-normal leading-5 text-slate-600"
                style={{ fontFamily: "Montserrat" }}
              >
                Automated analysis & recommendations
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-end rounded-full  text-slate-400 transition hover:text-slate-600"
            aria-label="Close AI insights"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M15 5L5 15"
                stroke="#475569"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 5L15 15"
                stroke="#475569"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        <div className="relative min-h-[6rem]">
          {isLoaderVisible && !showSkeleton && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                pointerEvents: "none",
                opacity: loaderOpacity,
                transition: `opacity ${LOADER_FADE_DURATION}ms ease-out`,
              }}
            >
              {error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : (
                <div
                  className="flex items-center gap-2"
                  style={{
                    opacity: loaderOpacity,
                    transform: isFadingLoader
                      ? "translateY(-4px)"
                      : "translateY(0)",
                    transition: `opacity ${LOADER_FADE_DURATION}ms ease-out, transform ${LOADER_FADE_DURATION}ms ease-out`,
                  }}
                >
                  <LoadingIcon className="h-4 w-4 animate-[spin_1.4s_linear_infinite] text-[#EA1952]" />
                  <p
                    className="text-sm"
                    style={{
                      fontWeight: 500,
                      background:
                        "linear-gradient(90deg, var(--slate-500, #64748B) 0%, var(--slate-300, #CBD5E1) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {loadingText}
                  </p>
                </div>
              )}
            </div>
          )}

          {isLoaderVisible && showSkeleton && !error && (
            <div className="mt-3 flex flex-col gap-y-6 animate-pulse">
              <div className="h-14 rounded-[14px] bg-slate-100" />

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-28 rounded-full bg-slate-100" />
                    <div className="h-5 w-10 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-4 w-28 rounded-full bg-slate-100" />
                </div>
                <div className="space-y-3">
                  <div className="rounded-[14px] border border-slate-100 bg-white p-4">
                    <div className="h-4 w-40 rounded-full bg-slate-100" />
                    <div className="mt-3 h-3 w-full rounded-full bg-slate-100" />
                    <div className="mt-2 h-3 w-5/6 rounded-full bg-slate-100" />
                  </div>
                  <div className="rounded-[14px] border border-slate-100 bg-white p-4">
                    <div className="h-4 w-36 rounded-full bg-slate-100" />
                    <div className="mt-3 h-3 w-full rounded-full bg-slate-100" />
                    <div className="mt-2 h-3 w-4/6 rounded-full bg-slate-100" />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-28 rounded-full bg-slate-100" />
                    <div className="h-5 w-10 rounded-full bg-slate-100" />
                  </div>
                  <div className="h-4 w-28 rounded-full bg-slate-100" />
                </div>
                <div className="space-y-2">
                  <div className="rounded-[14px] border border-slate-100 bg-white p-4">
                    <div className="h-4 w-48 rounded-full bg-slate-100" />
                    <div className="mt-3 h-3 w-full rounded-full bg-slate-100" />
                    <div className="mt-2 h-3 w-3/5 rounded-full bg-slate-100" />
                  </div>
                  <div className="rounded-[14px] border border-slate-100 bg-white p-4">
                    <div className="h-4 w-44 rounded-full bg-slate-100" />
                    <div className="mt-3 h-3 w-full rounded-full bg-slate-100" />
                    <div className="mt-2 h-3 w-4/5 rounded-full bg-slate-100" />
                  </div>
                  <div className="rounded-[14px] border border-slate-100 bg-white p-4">
                    <div className="h-4 w-40 rounded-full bg-slate-100" />
                    <div className="mt-3 h-3 w-full rounded-full bg-slate-100" />
                    <div className="mt-2 h-3 w-2/3 rounded-full bg-slate-100" />
                  </div>
                </div>
              </section>
            </div>
          )}

          {!isLoaderVisible && insights && (
            <div
              className="mt-3 flex flex-col gap-y-6 transition-all duration-[1200ms] ease-out"
              style={{
                opacity: contentVisible ? 1 : 0,
                transform: contentVisible
                  ? "translateY(0)"
                  : "translateY(12px)",
              }}
            >
              <TitleCard headline={titleCardHeadline} />

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-base leading-6 font-semibold text-slate-900"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      Key Insights
                    </p>
                    <span
                      className="flex h-5 items-center justify-center rounded-full bg-slate-200 px-2 text-slate-700 text-[10px] font-semibold leading-3"
                      style={{ fontFamily: "Arial" }}
                    >
                      {insights.keyInsights?.length || 0}
                    </span>
                  </div>
                  <span
                    className="text-xs font-normal leading-5 text-slate-500"
                    style={{ fontFamily: '"Source Code Pro"' }}
                  >
                    AI-identified patterns
                  </span>
                </div>
                {insights.keyInsights?.map((insight, index) => (
                  <KeyInsightsCard
                    key={index}
                    title={insight.title}
                    content={insight.content}
                    confidence={insight.confidence}
                  />
                ))}
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-base leading-6 font-semibold text-slate-900"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      More Insights
                    </p>
                    <span
                      className="flex h-5 items-center justify-center rounded-full bg-slate-200 px-2 text-slate-700 text-[10px] font-semibold leading-3"
                      style={{ fontFamily: "Arial" }}
                    >
                      {moreInsightsDetails.length}
                    </span>
                  </div>
                  <span
                    className="text-[11px] text-slate-500"
                    style={{ fontFamily: '"Source Code Pro"' }}
                  >
                    Actionable recommendations
                  </span>
                </div>
                <div className="space-y-2">
                  {moreInsightsDetails.map((insight, index) => (
                    <SuggestedActionCard
                      key={`${insight.title ?? "insight"}-${index}`}
                      showDetailOnClick
                      title={insight.title}
                      description={insight.description}
                      detailVariant={insight.detailVariant}
                      detailContent={insight.detailContent!}
                      takeaways={insights?.takeaways}
                      methodology={insights?.methodology}
                      reportContent={reportContent}
                      reportTitle={titleCardHeadline}
                    />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>

        {insights && contentVisible && (
          <div className="mt-3">
            <InsightsDisclaimerCard />
          </div>
        )}
      </article>
    </div>
  );
}
