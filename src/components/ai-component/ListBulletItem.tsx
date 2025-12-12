import React from "react";

export type ListBulletItemProps = {
  text: string;
};

export default function ListBulletItem({ text }: ListBulletItemProps) {
  return (
    <article className="flex w-[431px] items-start gap-[16px] rounded-[12px] border border-[#E2E8F0] bg-white px-4 py-3">
      {/* Gradient bullet */}
      <span
        className="
          mt-[6px]
          p-1
          rounded-full
          bg-[linear-gradient(270deg,#EA1952_0%,#AA1E58_100%)]
          shadow-[0_1px_3px_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]
        "
      />

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
