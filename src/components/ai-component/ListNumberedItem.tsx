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
    <article className="flex w-[431px] items-start gap-[16px] rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3">
      {/* Number label */}
      <span
        className="mt-[2px] text-xs font-medium text-[#EB1A52]"
        style={{ fontFamily: '"Source Code Pro", monospace' }}
      >
        {number}.
      </span>

      <p
        className="text-xs leading-5 text-[#475569]"
        style={{
          fontFamily: '"Source Code Pro", monospace',
          letterSpacing: "0",
        }}
      >
        {text}
      </p>
    </article>
  );
}
