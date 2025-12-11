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
    <article className="flex w-[431px] items-start gap-[16px] rounded-[12px] border border-[#E2E8F0] bg-white px-[16px] py-[12px]">
      {/* Number label */}
      <span
        className="mt-[2px] text-[12px] font-medium text-[#EB1A52]"
        style={{ fontFamily: '"Source Code Pro", monospace' }}
      >
        {number}.
      </span>

      <p
        className="text-[12px] leading-[20px] text-[#475569]"
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
