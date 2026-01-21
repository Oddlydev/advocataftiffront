export type KeyInsightContent = {
  title: string;
  content: string;
  confidence: string;
};

export type InsightSection = {
  title: string;
  body?: string;
  bullets?: string[];
};

export type MoreInsightDetailContent = {
  summary?: string;
  sections?: InsightSection[];
};

export type MoreInsightDetail = {
  title: string;
  description: string;
  detail?: MoreInsightDetailContent;
};

export type AIInsightsResponse = {
  keyInsights: KeyInsightContent[];
  moreInsights?: MoreInsightDetail[];
};
