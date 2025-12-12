import React, { useEffect, useState } from "react";
import LoadingIcon from "./LoadingIcon";
import MethodologyCard from "./MethodologyCard";
import TakeawaysCard from "./TakeawaysCard";

const firstMetrics = [
  "Food & Non-Alcoholic Beverages: CAGR of 5.8%, consistently stable with σ=6.2%",
  "Housing, Water & Electricity: CAGR of 4.2%, moderate volatility σ=11.8%",
  "Alcohol & Tobacco: CAGR of 12.3%, highest growth but high volatility σ=24.5%",
  "Health: CAGR of 8.9%, second-fastest growing sector σ=9.7%",
  "Education: CAGR of 7.6%, stable growth pattern σ=4.1%",
  "Recreation & Culture: CAGR of 3.2%, highest volatility σ=18.2%",
];

const secondMetrics = [
  "15% of data cells contain 'Data N/A' entries, concentrated in years 2002-2006.",
  "Median growth rate across all categories: 4.7% (mean: 6.1%, indicating positive skew).",
  "Correlation analysis shows strong positive relationship between Health and Education spending (r=0.89).",
  "Three categories show declining trends post-2020: Communication (-2.3%), Restaurants (-1.8%), and Furnishings (-0.4%).",
];

const recommendations = [
  "Prioritize data completion for 2002–2006 period to improve longitudinal analysis accuracy",
  "Investigate Recreation & Culture volatility – may indicate measurement issues or genuine market instability",
  "Cross-reference Health & Education correlation with demographic data to confirm population-driven growth hypothesis",
];

type PanelKey = "takeaways" | "methodology";

type DetailCardProps = {
  activePanel: PanelKey | null;
  onPanelSelect: (panel: PanelKey) => void;
};

export default function DetailCard({
  activePanel,
  onPanelSelect,
}: DetailCardProps) {
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);

  useEffect(() => {
    if (activePanel) setOpenPanel(activePanel);
  }, [activePanel]);

  return (
    <section className="flex w-[431px] flex-col gap-2">
      {/* Thinking row (text EXACT like your original) */}
      <div className="flex items-center gap-1 px-0.5">
        <LoadingIcon />
        <span
          className="text-xs font-semibold font-[Montserrat]"
          style={{
            background: "linear-gradient(90deg,#64748B,#CBD5E1)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Thinking...
        </span>
      </div>

      {/* Main white card (UNCHANGED) */}
      <article className="flex flex-col gap-4 rounded-[18px] border border-slate-200 bg-white px-6 py-5 drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
        <div className="space-y-2.5">
          <p className="text-sm leading-5 text-slate-700 font-[Montserrat]">
            We've analyzed 26 years of consumption data (1998-2024) across all
            12 categories. This comprehensive statistical report reveals
            significant patterns in household spending behavior and identifies
            key opportunities for deeper investigation.
          </p>

          {/* Overall Growth Patterns */}
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Overall Growth Patterns
          </p>
          <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro',monospace]">
            The total private consumption expenditure has grown from Rs 8.2T in
            1998 to Rs 24.7T in 2024, representing a compound annual growth rate
            (CAGR) of 4.3%. Growth has been uneven across categories, with some
            sectors experiencing exponential expansion while others remain
            stagnant.
          </p>

          {/* Category Performance Metrics – List 1 */}
          <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
            Category Performance Metrics
          </p>

          <div className="space-y-1.5 pl-1.5">
            {firstMetrics.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro',monospace]">
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Category Performance Metrics – List 2 */}
          <p className="pt-2.5 text-sm font-semibold text-slate-700 font-[Montserrat]">
            Category Performance Metrics
          </p>

          <div className="space-y-1.5 pl-1.5">
            {secondMetrics.map((line) => (
              <div key={line} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p className="text-xs leading-5 text-slate-600 font-['Source_Code_Pro',monospace]">
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Links to other panels */}
          <div className="space-y-1 border-t border-slate-200 pt-4">
            {[
              { key: "takeaways", text: "Click to see Key Takeaways" },
              { key: "methodology", text: "Click to see Methodology" },
            ].map(({ key, text }) => (
              <a
                key={text}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPanelSelect(key as PanelKey);
                  setOpenPanel(key as PanelKey);
                }}
                className={`block text-sm font-medium underline decoration-solid underline-offset-[20.5%] font-[Montserrat] ${
                  activePanel === key ? "text-[#CF1244]" : "text-[#CF1244]/70"
                }`}
              >
                {text}
              </a>
            ))}
          </div>

          {openPanel === "takeaways" && (
            <div className="mt-4">
              <TakeawaysCard autoOpen />
            </div>
          )}
          {openPanel === "methodology" && (
            <div className="mt-4">
              <MethodologyCard autoOpen />
            </div>
          )}

          {/* Recommendations – plain numbered list */}
          <div className="pt-4">
            <p className="text-sm font-semibold text-slate-700 font-[Montserrat]">
              Recommendations
            </p>
            <div className="mt-2 space-y-1">
              {recommendations.map((line, idx) => (
                <div key={line} className="flex items-start gap-2">
                  <span className="mt-0.5 w-3 text-xs font-medium text-[var(--brand-1-500)] font-['Source_Code_Pro',monospace]">
                    {idx + 1}.
                  </span>
                  <p className="flex-1 text-xs leading-5 text-slate-600 font-['Source_Code_Pro',monospace]">
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider + button + caption */}
          <div className="mt-4.5 border-t border-slate-200 pt-4">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-[#EA1952] to-[#AA1E58] px-2.5 py-3 text-sm font-semibold text-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
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

            <p className="mt-2 text-center text-xs leading-4 text-slate-500 font-['Source_Code_Pro',monospace]">
              Formatted .txt file • Ready for sharing
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
