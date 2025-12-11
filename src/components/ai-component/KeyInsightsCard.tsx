import React, { useState } from "react";

const ConfidenceIcon = ({ active }: { active: boolean }) => {
  const fillColor = active ? "#475569" : "none";
  const strokeColor = active ? "#334155" : "#475569";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className="inline-flex"
    >
      <path
        d="M1 6.25C1 5.6977 1.44771 5.25 2 5.25C2.82842 5.25 3.5 5.92155 3.5 6.75V8.75C3.5 9.57845 2.82842 10.25 2 10.25C1.44771 10.25 1 9.8023 1 9.25V6.25Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.73935 3.90313L7.6062 4.33317C7.4971 4.68556 7.44255 4.86175 7.4845 5.0009C7.51845 5.11345 7.59295 5.2105 7.6945 5.27435C7.82 5.35325 8.00985 5.35325 8.38955 5.35325H8.59155C9.8766 5.35325 10.5191 5.35325 10.8226 5.73365C10.8573 5.7771 10.8881 5.82335 10.9148 5.87185C11.1482 6.29605 10.8829 6.86755 10.352 8.01055C9.86485 9.05945 9.62125 9.5839 9.169 9.8926C9.12525 9.92245 9.08025 9.95065 9.03415 9.97705C8.558 10.25 7.9681 10.25 6.7882 10.25H6.5323C5.10285 10.25 4.38814 10.25 3.94407 9.81975C3.5 9.38945 3.5 8.69695 3.5 7.31195V6.82515C3.5 6.0973 3.5 5.7334 3.62917 5.4003C3.75834 5.0672 4.00568 4.79332 4.50035 4.24556L6.54605 1.98028C6.59735 1.92347 6.623 1.89506 6.64565 1.87538C6.85675 1.69164 7.1826 1.71232 7.3672 1.92118C7.387 1.94355 7.4086 1.97496 7.4518 2.03777C7.5194 2.13603 7.5532 2.18516 7.5827 2.23383C7.8464 2.66957 7.9262 3.18718 7.8054 3.67858C7.7919 3.73346 7.7744 3.79005 7.73935 3.90313Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const HelpfulIcon = ({ active }: { active: boolean }) => {
  const fillColor = active ? "#475569" : "none";
  const strokeColor = active ? "#334155" : "#475569";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 5.75C1 6.3023 1.44771 6.75 2 6.75C2.82842 6.75 3.5 6.07845 3.5 5.25V3.25C3.5 2.42158 2.82842 1.75 2 1.75C1.44771 1.75 1 2.19771 1 2.75V5.75Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.73935 8.09685L7.6062 7.66685C7.4971 7.31445 7.44255 7.13825 7.4845 6.9991C7.51845 6.88655 7.59295 6.7895 7.6945 6.72565C7.82 6.64675 8.00985 6.64675 8.38955 6.64675H8.59155C9.8766 6.64675 10.5191 6.64675 10.8226 6.26635C10.8573 6.2229 10.8881 6.17665 10.9148 6.12815C11.1482 5.70395 10.8829 5.13245 10.352 3.98945C9.86485 2.94055 9.62125 2.41611 9.169 2.10742C9.12525 2.07754 9.08025 2.04935 9.03415 2.02293C8.558 1.75 7.9681 1.75 6.7882 1.75H6.5323C5.10285 1.75 4.38814 1.75 3.94407 2.18026C3.5 2.61053 3.5 3.30304 3.5 4.68804V5.17485C3.5 5.9027 3.5 6.2666 3.62917 6.5997C3.75834 6.9328 4.00568 7.2067 4.50035 7.75445L6.54605 10.0197C6.59735 10.0766 6.623 10.105 6.64565 10.1247C6.85675 10.3083 7.1826 10.2877 7.3672 10.0788C7.387 10.0564 7.4086 10.025 7.4518 9.96225C7.5194 9.864 7.5532 9.81485 7.5827 9.76615C7.8464 9.33045 7.9262 8.8128 7.8054 8.32145C7.7919 8.26655 7.7744 8.20995 7.73935 8.09685Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const CardIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M15.8333 8.01725C15.8333 10.1666 14.7751 11.821 13.1652 12.9098C12.7902 13.1633 12.6027 13.2902 12.5101 13.4343C12.4176 13.5785 12.3861 13.7678 12.323 14.1464L12.2739 14.4407C12.1631 15.1058 12.1076 15.4383 11.8745 15.6358C11.6414 15.8333 11.3042 15.8333 10.6299 15.8333H8.45365C7.77938 15.8333 7.44222 15.8333 7.2091 15.6358C6.97598 15.4383 6.92055 15.1058 6.8097 14.4407L6.76065 14.1464C6.69776 13.7691 6.66632 13.5804 6.57471 13.4369C6.48311 13.2934 6.29521 13.165 5.91941 12.9081C4.32656 11.8193 3.33331 10.1655 3.33331 8.01725C3.33331 4.50992 6.13153 1.66667 9.58331 1.66667C10.0114 1.66667 10.4294 1.71041 10.8333 1.79371"
      stroke="#EB1A52"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.75 1.66667L13.9649 2.24753C14.2467 3.00919 14.3876 3.39002 14.6655 3.66783C14.9433 3.94565 15.3241 4.08656 16.0858 4.36841L16.6666 4.58334L16.0858 4.79827C15.3241 5.08011 14.9433 5.22104 14.6655 5.49885C14.3876 5.77666 14.2467 6.15749 13.9649 6.91915L13.75 7.50001L13.5351 6.91915C13.2532 6.15749 13.1123 5.77666 12.8345 5.49885C12.5566 5.22104 12.1758 5.08011 11.4141 4.79827L10.8333 4.58334L11.4141 4.36841C12.1758 4.08656 12.5566 3.94565 12.8345 3.66783C13.1123 3.39002 13.2532 3.00919 13.5351 2.24753L13.75 1.66667Z"
      stroke="#EB1A52"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
    <path
      d="M11.25 15.8333V16.6667C11.25 17.4523 11.25 17.8452 11.0059 18.0892C10.7619 18.3333 10.369 18.3333 9.58335 18.3333C8.79769 18.3333 8.40485 18.3333 8.16076 18.0892C7.91669 17.8452 7.91669 17.4523 7.91669 16.6667V15.8333"
      stroke="#EB1A52"
      strokeWidth="1.25"
      strokeLinejoin="round"
    />
  </svg>
);

type ThumbFeedback = "up" | "down" | null;

export default function KeyInsightsCard() {
  const [thumbFeedback, setThumbFeedback] = useState<ThumbFeedback>(null);

  return (
    <article className="flex w-[431px] flex-col rounded-[16px] border border-[#E2E8F0] bg-white px-[16px] py-[20px]">
      <div className="grid grid-cols-[auto,1fr] gap-[12px]">
        <div className="row-span-2 flex h-[40px] w-[40px] items-center justify-center rounded-[12px] bg-[rgba(234,25,82,0.08)] p-3">
          <CardIcon />
        </div>

        <div className="space-y-2">
          <h3
            className="text-[14px] font-semibold leading-[20px] text-[#0F172A]"
            style={{ fontFamily: "Montserrat" }}
          >
            Significant Growth in Food Consumption
          </h3>
          <p
            className="text-[12px] leading-[20px] text-[#475569]"
            style={{ fontFamily: '"Source Code Pro", monospace' }}
          >
            Food spending rose from Rs 5.38T (2022) to Rs 6.13T (2024), driven
            by 9.2% growth in 2023 and 4.4% in 2024.
          </p>
        </div>

        <div className="col-start-2 border-t border-[#F1F5F9] pt-[12px]">
          <div className="flex items-center justify-between text-[10px] leading-[16px] text-[#64748B]">
            <div
              className="flex items-center gap-[6px]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              <span className="text-[#64748B]">Confidence:</span>
              <span className="text-[#475569]">High (85%)</span>
            </div>

            <div
              className="flex items-center gap-[6px]"
              style={{ fontFamily: '"Source Code Pro", monospace' }}
            >
              <span className="text-[#64748B]">Helpful?</span>
              <div className="flex items-center gap-[4px] rounded-full px-[8px] py-[4px] text-[10px] text-[#64748B]">
                {/* THUMB UP */}
                <button
                  type="button"
                  onClick={() =>
                    setThumbFeedback(thumbFeedback === "up" ? null : "up")
                  }
                  aria-pressed={thumbFeedback === "up"}
                  className="rounded-full p-[2px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CF1244]"
                >
                  <ConfidenceIcon active={thumbFeedback === "up"} />
                </button>

                {/* THUMB DOWN */}
                <button
                  type="button"
                  onClick={() =>
                    setThumbFeedback(thumbFeedback === "down" ? null : "down")
                  }
                  aria-pressed={thumbFeedback === "down"}
                  className="rounded-full p-[2px] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CF1244]"
                >
                  <HelpfulIcon active={thumbFeedback === "down"} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
