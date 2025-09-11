import React from "react";

type Props = {
  subtitle?: string;
  title: string;
  paragraphs: string[];
  className?: string;
};

export default function TextBlock({
  subtitle,
  title,
  paragraphs,
  className = "",
}: Props) {
  return (
    <div
      className={`text-block-container px-5 md:px-10 xl:px-16 py-12 md:py-16 xl:py-20 bg-white ${className}`}
    >
      <div className="text-block text-start mx-auto max-w-6xl">
        {subtitle && (
          <span className="text-sub-title mb-1 text-slate-950 text-sm/5 md:text-base/6 font-family-sourcecodepro font-medium uppercase">
            {subtitle}
          </span>
        )}

        <h3 className="text-title mb-3.5 md:mb-5 text-slate-950 text-4xl md:text-5xl xl:text-6xl leading-snug font-family-montserrat font-bold max-w-2xl">
          {title}
        </h3>

        <div className="space-y-2.5">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-paragraph text-slate-800 text-base/6 lg:text-lg/7 font-family-baskervville font-normal max-w-2xl"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
