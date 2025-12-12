"use client";

import React from "react";
import MethodologyCard from "./MethodologyCard";
import TakeawaysCard from "./TakeawaysCard";

const firstMetrics = [
  "Food & Non-Alcoholic Beverages: CAGR of 5.8%, consistently stable with IŸ=6.2%",
  "Housing, Water & Electricity: CAGR of 4.2%, moderate volatility IŸ=11.8%",
  "Alcohol & Tobacco: CAGR of 12.3%, highest growth but high volatility IŸ=24.5%",
  "Health: CAGR of 8.9%, second-fastest growing sector IŸ=9.7%",
  "Education: CAGR of 7.6%, stable growth pattern IŸ=4.1%",
  "Recreation & Culture: CAGR of 3.2%, highest volatility IŸ=18.2%",
];

const secondMetrics = [
  "15% of data cells contain 'Data N/A' entries, concentrated in years 2002-2006.",
  "Median growth rate across all categories: 4.7% (mean: 6.1%, indicating positive skew).",
  "Correlation analysis shows strong positive relationship between Health and Education spending (r=0.89).",
  "Three categories show declining trends post-2020: Communication (-2.3%), Restaurants (-1.8%), and Furnishings (-0.4%).",
];

const recommendations = [
  "Prioritize data completion for the 2002-2006 period to improve longitudinal analysis accuracy",
  "Investigate Recreation & Culture volatility – may indicate measurement issues or genuine market instability",
  "Cross-reference Health & Education correlation with demographic data to confirm the population-driven growth hypothesis",
];

export default function DetailCard() {
  return (
    <section className="flex w-full flex-col gap-3.5">
      {/* Main card */}
      <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white p-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
        <div className="space-y-2.5">
          <p className="text-sm leading-5 text-slate-700 font-[Montserrat]">
            We've analyzed 26 years of consumption data (1998–2024) across all
            12 categories. This comprehensive statistical report reveals
            significant patterns in household spending behavior and identifies
            key opportunities for deeper investigation.
          </p>

          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Overall Growth Patterns
          </p>

          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
            The total private consumption expenditure has grown from Rs 8.2T in
            1998 to Rs 24.7T in 2024, representing a compound annual growth rate
            (CAGR) of 4.3%.
          </p>

          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Category Performance Metrics
          </p>

          <div className="space-y-1.5 pl-1.5">
            {firstMetrics.map((line) => (
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
            {secondMetrics.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro']">
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Embedded Takeaways */}
          <div className="mt-5 border-t border-slate-200 pt-4">
            <TakeawaysCard />
          </div>

          {/* Embedded Methodology */}
          <div className="mt-4">
            <MethodologyCard />
          </div>

          {/* Recommendations */}
          <div className="pt-5 mt-3.5 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
              Recommendations
            </p>

            <div className="mt-2 space-y-1">
              {recommendations.map((line, idx) => (
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

          {/* Download */}
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
        </div>
      </article>
    </section>
  );
}
