import React, { useEffect, useState } from "react";
import MethodologyCard from "./MethodologyCard";
import TakeawaysCard from "./TakeawaysCard";

const firstMetrics = [
  "Food & Non-Alcoholic Beverages: CAGR of 5.8%, consistently stable with \u03C3=6.2%",
  "Housing, Water & Electricity: CAGR of 4.2%, moderate volatility \u03C3=11.8%",
  "Alcohol & Tobacco: CAGR of 12.3%, highest growth but high volatility \u03C3=24.5%",
  "Health: CAGR of 8.9%, second-fastest growing sector \u03C3=9.7%",
  "Education: CAGR of 7.6%, stable growth pattern \u03C3=4.1%",
  "Recreation & Culture: CAGR of 3.2%, highest volatility \u03C3=18.2%",
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

const ThinkingIcon = () => (
  <svg
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className="h-[16px] w-[16.466px] flex-shrink-0 overflow-hidden rounded-[4px]"
    aria-hidden="true"
  >
    <rect width="16.466" height="16" fill="url(#pattern0_8574_1866)" />
    <defs>
      <pattern
        id="pattern0_8574_1866"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#image0_8574_1866"
          transform="matrix(0.00943396 0 0 0.00970874 -0.443396 -0.485437)"
        />
      </pattern>
      <image
        id="image0_8574_1866"
        width="200"
        height="200"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

export default function DetailCard({
  activePanel,
  onPanelSelect,
}: DetailCardProps) {
  const [openPanel, setOpenPanel] = useState<PanelKey | null>(null);

  useEffect(() => {
    if (activePanel) setOpenPanel(activePanel);
  }, [activePanel]);

  return (
    <section className="flex w-[431px] flex-col gap-[8px]">
      {/* Thinking row (separate from card) */}
      <div className="flex items-center gap-[10px] px-[2px]">
        <ThinkingIcon />
        <span
          className="text-[12px] font-semibold"
          style={{
            fontFamily: "Montserrat",
            background: "linear-gradient(90deg,#64748B,#CBD5E1)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Thinking...
        </span>
      </div>

      {/* Main white card */}
      <article className="flex flex-col gap-[16px] rounded-[18px] border border-[#E2E8F0] bg-white px-[24px] py-[20px] drop-shadow-[0_30px_60px_-40px_rgba(15,23,42,0.9)]">
        <div className="space-y-[10px]">
          <p
            className="text-[14px] leading-[20px] text-[#334155]"
            style={{ fontFamily: "Montserrat" }}
          >
            We've analyzed 26 years of consumption data (1998-2024) across all
            12 categories. This comprehensive statistical report reveals
            significant patterns in household spending behavior and identifies
            key opportunities for deeper investigation.
          </p>

          {/* Overall Growth Patterns */}
          <p
            className="text-[14px] font-semibold text-[#334155]"
            style={{ fontFamily: "Montserrat" }}
          >
            Overall Growth Patterns
          </p>
          <p
            className="text-[12px] leading-[20px] text-[#475569]"
            style={{ fontFamily: '"Source Code Pro", monospace' }}
          >
            The total private consumption expenditure has grown from Rs 8.2T in
            1998 to Rs 24.7T in 2024, representing a compound annual growth rate
            (CAGR) of 4.3%. Growth has been uneven across categories, with some
            sectors experiencing exponential expansion while others remain
            stagnant.
          </p>

          {/* Category Performance Metrics – List 1 */}
          <p
            className="text-[14px] font-semibold text-[#334155]"
            style={{ fontFamily: "Montserrat" }}
          >
            Category Performance Metrics
          </p>

          <div className="space-y-[6px] pl-[6px]">
            {firstMetrics.map((line) => (
              <div key={line} className="flex items-start gap-[10px]">
                <span className="mt-[6px] h-[8px] w-[8px] flex-shrink-0 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p
                  className="text-[12px] leading-[20px] text-[#475569]"
                  style={{ fontFamily: '"Source Code Pro", monospace' }}
                >
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Category Performance Metrics – List 2 (stats list) */}
          <p
            className="pt-[10px] text-[14px] font-semibold text-[#334155]"
            style={{ fontFamily: "Montserrat" }}
          >
            Category Performance Metrics
          </p>

          <div className="space-y-[6px] pl-[6px]">
            {secondMetrics.map((line) => (
              <div key={line} className="flex items-start gap-[10px]">
                <span className="mt-[6px] h-[8px] w-[8px] flex-shrink-0 rounded-full bg-gradient-to-b from-[#EA1952] to-[#AA1E58]" />
                <p
                  className="text-[12px] leading-[20px] text-[#475569]"
                  style={{ fontFamily: '"Source Code Pro", monospace' }}
                >
                  {line}
                </p>
              </div>
            ))}
          </div>

          {/* Links to other panels */}
          <div className="space-y-[4px] border-t border-[#E2E8F0] pt-[16px]">
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
                className={`block text-[14px] font-medium underline decoration-solid underline-offset-[20.5%] ${
                  activePanel === key ? "text-[#CF1244]" : "text-[#CF1244]/70"
                }`}
                style={{ fontFamily: "Montserrat" }}
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
          <div className="pt-[16px]">
            <p
              className="text-[14px] font-semibold text-[#334155]"
              style={{ fontFamily: "Montserrat" }}
            >
              Recommendations
            </p>
            <div className="mt-2 space-y-[4px]">
              {recommendations.map((line, idx) => (
                <div key={line} className="flex items-start gap-[8px]">
                  <span
                    className="mt-[2px] w-[12px] text-[12px] font-medium text-[#EB1A52]"
                    style={{ fontFamily: '"Source Code Pro", monospace' }}
                  >
                    {idx + 1}.
                  </span>
                  <p
                    className="flex-1 text-[12px] leading-[20px] text-[#475569]"
                    style={{ fontFamily: '"Source Code Pro", monospace' }}
                  >
                    {line}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider + button + caption */}
          <div className="mt-[18px] border-t border-[#E2E8F0] pt-[16px]">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-[8px] rounded-[8px] bg-gradient-to-r from-[#EA1952] to-[#AA1E58] px-[10px] py-[12px] text-[14px] font-semibold text-white shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
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
              <span
                className="text-[14px]"
                style={{ fontFamily: "Montserrat" }}
              >
                Download Full Analysis Report
              </span>
            </button>

            <p
              className="mt-[8px] text-center text-[10px] leading-[16px] text-[#64748B]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              Formatted .txt file • Ready for sharing
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}
