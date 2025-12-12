import React, { useState } from "react";

export default function SuggestedActionCard() {
  const [active, setActive] = useState(false);

  return (
    <article
      onClick={() => setActive((prev) => !prev)}
      className={`group flex w-full items-start gap-[16px] rounded-2xl border px-5 py-4 transition-all duration-200 ${
        active
          ? "border-[rgba(234,25,82,0.3)] bg-[linear-gradient(135deg,rgba(234,25,82,0.05)_0%,rgba(227,63,255,0.05)_100%)]"
          : "border-slate-200 bg-white hover:border-[rgba(234,25,82,0.2)] hover:bg-[#F8FAFC] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
      }`}
    >
      <span
        className={`flex h-[44px] w-[44px] min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[10px] p-4 transition duration-200 ${
          active
            ? "bg-[linear-gradient(270deg,#EA1952_0%,#AA1E58_100%)] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] text-white"
            : "bg-slate-100 text-[#64748B] group-hover:text-[var(--brand-1-500)] group-hover:bg-[linear-gradient(135deg,rgba(234,25,82,0.1)_0%,rgba(227,63,255,0.1)_100%)]"
        }`}
      >
        {active ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="7"
            viewBox="0 0 12 7"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0.833374 0.833344L5.83337 5.83334L10.8334 0.833344"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="7"
            height="12"
            viewBox="0 0 7 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M0.833374 10.8333L5.83337 5.83333L0.833374 0.833328"
              stroke="currentColor"
              strokeWidth="1.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <div className="space-y-1">
        <h3
          className={`text-sm font-semibold leading-5 transition-colors duration-200 ${
            active
              ? "text-[var(--brand-1-500)]"
              : "text-slate-900 group-hover:text-[var(--brand-1-500)]"
          }`}
          style={{ fontFamily: "Montserrat" }}
        >
          Generate Summary Statistics Report
        </h3>

        <p
          className="text-xs leading-4 text-slate-600 tracking-normal"
          style={{ fontFamily: '"Source Code Pro"' }}
        >
          Get mean, median, growth rates & volatility for all 12 categories
        </p>
      </div>
    </article>
  );
}
