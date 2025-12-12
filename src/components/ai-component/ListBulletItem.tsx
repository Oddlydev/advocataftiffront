import React from "react";

export type ListBulletItemProps = {
  text: string;
};

export default function ListBulletItem({ text }: ListBulletItemProps) {
  return (
    <article className="flex items-start gap-3 rounded-[12px] bg-white">
      {/* Gradient bullet */}
      <span
        className="
          mt-[6px]
          h-[8px]
          w-[8px]
          min-h-[8px]
          min-w-[8px]
          shrink-0
          rounded-full
          bg-[linear-gradient(270deg,#EA1952_0%,#AA1E58_100%)]
          shadow-[0_1px_3px_rgba(0,0,0,0.10),0_1px_2px_-1px_rgba(0,0,0,0.10)]
        "
        aria-hidden="true"
      />

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
