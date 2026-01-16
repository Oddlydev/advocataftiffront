import React from "react";

export type TitleCardProps = {
  headline?: string;
};

export default function TitleCard({ headline }: TitleCardProps) {
  const headlineText =
    headline ??
    "Composition of Private Consumption Expenditure at Current Market Prices";
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
      {/* Native details element removes the need for client-only state */}
      <details className="space-y-4">
        <summary className="title-card-summary flex w-full flex-col gap-1 text-left cursor-pointer">
          <div className="flex items-center gap-2">
            <p
              className="text-xs uppercase tracking-[0.3px] text-slate-500 leading-4"
              style={{ fontFamily: '"Source Code Pro"' }}
            >
              AI-generated analysis
            </p>
          </div>

          {/* Title */}
          <p
            className="text-sm font-medium leading-5 text-slate-900a"
            style={{ fontFamily: "Montserrat" }}
          >
            {headlineText}
          </p>
        </summary>
      </details>
    </article>
  );
}

