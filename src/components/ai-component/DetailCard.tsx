"use client";

import React from "react";
import ListBulletItem from "./ListBulletItem";
import type { MoreInsightDetailContent } from "./detailContent.types";

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
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66663 6.66663L7.99996 9.99996L11.3333 6.66663"
          stroke="white"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-sm font-[Montserrat]">
        Download Full Analysis Report
      </span>
    </button>

    <p className="mt-2 text-center text-xs text-slate-500 font-['Source_Code_Pro']">
      Formatted .txt file - Ready for sharing
    </p>
  </div>
);

function formatList(items?: string[], prefix = "- ") {
  if (!items || items.length === 0) {
    return "None provided.";
  }
  return items.map((item) => `${prefix}${item}`).join("\n");
}


function buildReportFilename(title?: string) {
  const base = title?.trim() ? `${title}-analysis-report` : "analysis-report";
  const normalized = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
  return `${normalized || "analysis-report"}.txt`;
}

function buildDetailReportContent(
  detailContent: MoreInsightDetailContent,
  reportTitle?: string
) {
  const header = reportTitle?.trim()
    ? `${reportTitle} - insight detail`
    : "Insight detail";
  const lines: string[] = [];
  const summary = detailContent.summary?.trim();
  const sections = Array.isArray(detailContent.sections)
    ? detailContent.sections
    : [];

  lines.push(header);
  lines.push("=".repeat(header.length));
  lines.push("");

  if (summary) {
    lines.push("Summary");
    lines.push(summary);
    lines.push("");
  }

  if (sections.length > 0) {
    lines.push("Details");
    lines.push("");
    sections.forEach((section) => {
      const title = section.title?.trim() || "Section";
      lines.push(title);
      lines.push("-".repeat(title.length));
      if (section.body?.trim()) {
        lines.push(section.body.trim());
      }
      if (section.bullets?.length) {
        lines.push(formatList(section.bullets));
      }
      lines.push("");
    });
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

type DetailCardProps = {
  detailContent: MoreInsightDetailContent;
  reportContent?: string;
  reportTitle?: string;
};

export default function DetailCard({
  detailContent,
  reportContent,
  reportTitle,
}: DetailCardProps) {
  const handleDownload = () => {
    const resolvedContent =
      reportContent ?? buildDetailReportContent(detailContent, reportTitle);
    if (!resolvedContent.trim()) return;

    const filename = buildReportFilename(reportTitle);
    downloadTextFile(resolvedContent, filename);
  };

  const sections = Array.isArray(detailContent.sections)
    ? detailContent.sections
    : [];
  const summary = detailContent.summary?.trim();

  return (
    <article className="flex flex-col gap-4 rounded-[14px] border border-slate-200 bg-white p-5 shadow-sm">
      {summary && (
        <p className="text-sm leading-6 text-slate-700 font-[Montserrat]">
          {summary}
        </p>
      )}

      {sections.length > 0 && (
        <div className="space-y-4">
          {sections.map((section, index) => {
            const title = section.title?.trim();
            const body = section.body?.trim();
            const bullets = Array.isArray(section.bullets)
              ? section.bullets
              : [];
            return (
              <div key={`${title ?? "section"}-${index}`} className="space-y-1">
                {title && (
                  <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
                    {title}
                  </p>
                )}
                {body && (
                  <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                    {body}
                  </p>
                )}
                {bullets.length > 0 && (
                  <div className="space-y-1 pl-1.5">
                    {bullets.map((item, idx) => (
                      <ListBulletItem key={`${item}-${idx}`} text={item} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {CTA_SECTION(handleDownload)}
    </article>
  );
}
