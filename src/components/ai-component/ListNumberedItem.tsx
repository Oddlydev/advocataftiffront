import React from "react";

export type ListNumberedItemProps = {
  number: number;
  text: string;
};

export default function ListNumberedItem({
  number,
  text,
}: ListNumberedItemProps) {
  return (
    <article className="flex items-start gap-3 rounded-xl bg-white">
      {/* Number label */}
      <span
        className="
          mt-[2px]
          min-w-[16px]
          shrink-0
          text-xs
          font-medium
          text-[var(--brand-1-500)]
        "
        style={{ fontFamily: '"Source Code Pro"' }}
        aria-hidden="true"
      >
        {number}.
      </span>

      <p
        className="text-xs leading-5 text-slate-600"
        style={{
          fontFamily: '"Source Code Pro"',
          letterSpacing: "0",
        }}
      >
        {text}
      </p>
    </article>
  );
}
