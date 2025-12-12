import React, { useState } from "react";

export default function TitleCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className="
        w-[431px]
        rounded-lg
        border border-slate-200
        bg-slate-50
        p-4
        shadow-[0_10px_30px_-25px_rgba(15,23,42,0.1)]
        transition-shadow
        duration-200
        hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]
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
            style={{ fontFamily: '"Source Code Pro", monospace' }}
          >
            AI-generated analysis
          </p>

          {/* Info icon */}
          <span className="group relative inline-flex h-[18px] w-[18px] items-center justify-center text-[#94A3B8] transition-colors hover:text-[#EB1A52] group-hover:text-[#EB1A52]">
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

            {/* Tooltip */}
            <span
              className="
              pointer-events-none absolute left-full ml-2 top-1/2 hidden 
              h-5 min-w-[200px] -translate-y-1/2 items-center rounded-[4px] 
              bg-black px-1.5 py-1 text-xs leading-2 text-[8px] font-['Source_Code_Pro'] 
              text-white group-hover:flex
            "
            >
              Show methodology, Source & Limitations
            </span>
          </span>
        </div>

        {/* Title */}
        <p
          className="text-sm font-medium leading-5 text-slate-900"
          style={{ fontFamily: "Montserrat" }}
        >
          Composition of Private Consumption Expenditure at Current Market
          Prices
        </p>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <>
          <section className="mt-[14px] border-t border-[#E2E8F0] pt-[14px]">
            <p
              className="text-xs font-semibold uppercase tracking-[0.4px] text-[#334155] mb-[4px]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              How Insights are Generated:
            </p>

            <p
              className="text-xs leading-4 text-[#475569] mb-[8px]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              AI analyzes 26 years (1998–2024) of Central Bank data using
              statistical methods including trend analysis (linear regression,
              CAGR), anomaly detection (z-score analysis), and volatility
              measurement (standard deviation). Confidence scores are calculated
              based on data quality, statistical significance, pattern strength,
              and model agreement.
            </p>

            <p
              className="text-xs leading-4 text-[#475569] mb-[8px]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              <strong>Dataset Coverage:</strong> Private Consumption Expenditure
              across 12 categories: Food, Alcohol & Tobacco, Clothing, Housing,
              Furnishings, Health, Transport, Communication, Recreation,
              Education, Restaurants & Hotels, and Miscellaneous Goods &
              Services. All values are at current market prices in Sri Lankan
              Rupees (Rs).
            </p>

            <p
              className="text-xs font-semibold uppercase tracking-[0.4px] text-[#334155] mb-[4px]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              Limitations:
            </p>

            <ul
              className="text-xs leading-4 text-[#475569] list-disc pl-4 mb-[10px]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              <li>Historical analysis only – does not predict future trends</li>
              <li>Nominal values not adjusted for inflation</li>
              <li>Cannot identify causation, only correlations</li>
            </ul>
          </section>

          {/* Footer Divider — matches screenshot */}
          <div
            className="mt-[14px] pt-[10px] text-xs uppercase tracking-[0.4px] text-[#64748B]"
            style={{
              fontFamily: '"Source Code Pro", monospace',
              borderTop: "1px solid var(--slate-300, #CBD5E1)",
            }}
          >
            Analysis generated: Dec 8, 2024 · Data version: CBSL Q4 2024 Release
          </div>
        </>
      )}
    </article>
  );
}
