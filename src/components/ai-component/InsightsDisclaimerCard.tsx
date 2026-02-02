import React, { useId } from "react";

type InsightsDisclaimerCardProps = {
  title?: string;
  description?: string;
  items?: string[];
  className?: string;
};

export default function InsightsDisclaimerCard({
  title = "AI-Generated Insights Disclaimer",
  description = "These insights are AI-generated and may contain errors. Always verify critical findings with source data. Your data is analyzed locally and not shared or stored beyond this session.",
  items,
  className = "",
}: InsightsDisclaimerCardProps) {
  const clipPathId = useId();
  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <article
      className={`w-full rounded-[16px] border border-[#BFDBFE] bg-gradient-to-r from-[#EFF6FF] to-[#EEF2FF] p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] ${className}`.trim()}
    >
      <div className="flex gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#DBEAFE]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <g clipPath={`url(#${clipPathId})`}>
              <path
                d="M7.99992 14.6667C11.6818 14.6667 14.6666 11.6819 14.6666 8.00004C14.6666 4.31814 11.6818 1.33337 7.99992 1.33337C4.31802 1.33337 1.33325 4.31814 1.33325 8.00004C1.33325 11.6819 4.31802 14.6667 7.99992 14.6667Z"
                stroke="#2563EB"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.33337V8.00004"
                stroke="#2563EB"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 10.6666H8.00667"
                stroke="#2563EB"
                strokeWidth="1.33333"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id={clipPathId}>
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <p
            className="text-[#1E3A8A] text-xs font-semibold leading-4"
            style={{ fontFamily: "Montserrat" }}
          >
            {title}
          </p>
          {hasItems ? (
            <ul
              className="list-disc space-y-1 pl-4 text-[#1E40AF] text-xs font-normal leading-5 mb-0"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              {items.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p
              className="text-[#1E40AF] text-xs leading-5"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
