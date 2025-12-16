import React, { useState } from "react";

export default function TitleCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="
        w-full
        rounded-lg
        border border-slate-200
        bg-slate-50
        p-4
        duration-200
      "
    >
      {/* Header Area */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        className="flex w-full flex-col gap-[6px] text-left"
      >
        <div className="flex items-center gap-2">
          <p
            className="text-xs uppercase tracking-[0.3px] text-slate-500 leading-4"
            style={{ fontFamily: '"Source Code Pro"' }}
          >
            AI-generated analysis
          </p>

          {/* Info icon + tooltip */}
          <span className="relative inline-flex items-center justify-center group">
            {/* Icon */}
            <span
              className="
                inline-flex items-center justify-center
                text-[#64748B]
                transition-colors
                group-hover:text-[var(--brand-1-500)]
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <g clipPath="url(#clip0_8707_3265)">
                  <path
                    d="M7.99998 14.6667C11.6819 14.6667 14.6666 11.6819 14.6666 8.00001C14.6666 4.31811 11.6819 1.33334 7.99998 1.33334C4.31808 1.33334 1.33331 4.31811 1.33331 8.00001C1.33331 11.6819 4.31808 14.6667 7.99998 14.6667Z"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 10.6667V8"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 5.33334H8.00667"
                    stroke="currentColor"
                    strokeWidth="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_8707_3265">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </span>

            {/* Tooltip */}
            <span
              className="
                pointer-events-none absolute left-1/2 top-full hidden
                min-w-[200px] bg-[#1A1A1A] px-1.5 py-1 leading-4
                text-[8px] font-['Source_Code_Pro'] text-white
                rounded-sm shadow-lg
                group-hover:flex
              "
            >
              Show methodology, Source &amp; Limitations
            </span>
          </span>
        </div>

        {/* Title */}
        <p
          className="text-sm font-medium leading-5 text-slate-900a"
          style={{ fontFamily: "Montserrat" }}
        >
          Composition of Private Consumption Expenditure at Current Market
          Prices
        </p>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <>
          <section className="mt-4 border-t border-slate-300 pt-3">
            <p
              className="text-xs font-semibold tracking-[0.4px] text-slate-700 mb-1"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              How Insights are Generated:
            </p>

            <p
              className="text-xs leading-5 text-slate-600 mb-2 font-normal"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              AI analyzes 26 years (1998–2024) of Central Bank data using
              statistical methods including trend analysis (linear regression,
              CAGR), anomaly detection (z-score analysis), and volatility
              measurement (standard deviation). Confidence scores are calculated
              based on data quality, statistical significance, pattern strength,
              and model agreement.
            </p>

            <p
              className="text-xs font-semibold tracking-[0.4px] text-slate-700 mb-1"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              Dataset Coverage:
            </p>

            <p
              className="text-xs leading-5 text-slate-600 mb-2 font-normal"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              Private Consumption Expenditure across 12 categories: Food,
              Alcohol &amp; Tobacco, Clothing, Housing, Furnishings, Health,
              Transport, Communication, Recreation, Education, Restaurants &amp;
              Hotels, and Miscellaneous Goods &amp; Services. All values are at
              current market prices in Sri Lankan Rupees (Rs).
            </p>

            <p
              className="text-xs font-semibold tracking-[0.4px] text-slate-700 mb-[4px]"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              Limitations:
            </p>

            <ul
              className="text-xs leading-5 text-slate-600 list-disc pl-3.5"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              <li
                className="text-xs leading-5 text-slate-600 list-disc"
                style={{ fontFamily: '"Source Code Pro"' }}
              >
                Historical analysis only – does not predict future trends
              </li>
              <li
                className="text-xs leading-5 text-slate-600 list-disc"
                style={{ fontFamily: '"Source Code Pro"' }}
              >
                Nominal values not adjusted for inflation
              </li>
              <li
                className="text-xs leading-5 text-slate-600 list-disc"
                style={{ fontFamily: '"Source Code Pro"' }}
              >
                Cannot identify causation, only correlations
              </li>
            </ul>
          </section>

          <div
            className="mt-4 pt-1.5 text-xs leading-5 text-slate-500 border-t border-slate-300"
            style={{
              fontFamily: '"Source Code Pro"',
            }}
          >
            Analysis generated: Dec 8, 2024 · Data version: CBSL Q4 2024 Release
          </div>
        </>
      )}
    </article>
  );
}
