import React, { useState } from "react";

export default function SuggestedActionCard() {
  const [active, setActive] = useState(false);

  return (
    <article
      onClick={() => setActive((prev) => !prev)}
      className={`group flex w-[431px] items-start gap-[16px] rounded-[16px] border px-5 py-4 transition-all duration-200 ${
        active
          ? "border-[rgba(234,25,82,0.3)] bg-[linear-gradient(135deg,rgba(234,25,82,0.05)_0%,rgba(227,63,255,0.05)_100%)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
          : "border-[#E2E8F0] bg-white hover:border-[rgba(234,25,82,0.2)] hover:bg-[#F8FAFC] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
      }`}
    >
      <span
        className={`flex h-[44px] w-[44px] p-3 items-center justify-center rounded-[10px] text-[#475569] transition duration-200 ${
          active
            ? "bg-[linear-gradient(270deg,#EA1952_0%,#AA1E58_100%)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] text-white"
            : "bg-[#F1F5F9] group-hover:text-[#EB1A52] group-hover:bg-[linear-gradient(135deg,rgba(234,25,82,0.1)_0%,rgba(227,63,255,0.1)_100%)]"
        }`}
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
            d={active ? "M5 10L10 15L15 10" : "M7.5 15L12.5 10L7.5 5"}
            stroke="currentColor"
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <div className="space-y-[4px]">
        <h3
          className={`text-sm font-semibold leading-5 transition-colors duration-200 ${
            active
              ? "text-[#EB1A52]"
              : "text-[#0F172A] group-hover:text-[#EB1A52]"
          }`}
          style={{ fontFamily: "Montserrat" }}
        >
          Generate Summary Statistics Report
        </h3>
        <p
          className="text-xs leading-4 text-[#475569]"
          style={{
            fontFamily: '"Source Code Pro", monospace',
            letterSpacing: "0",
          }}
        >
          Get mean, median, growth rates & volatility for all 12 categories
        </p>
      </div>
    </article>
  );
}
