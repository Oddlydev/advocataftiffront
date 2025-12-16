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
    <article className="flex items-start gap-3 rounded-xl mb-2 last:mb-0 pl-1.5 bg-white">
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
        className="text-xs leading-5 text-slate-600 tracking-normal"
        style={{
          fontFamily: '"Source Code Pro"',
        }}
      >
        {text}
      </p>
    </article>
  );
}
