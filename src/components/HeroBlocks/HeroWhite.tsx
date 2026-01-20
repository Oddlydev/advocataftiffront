"use client";
import type { JSX } from "react";
import Breadcrumb from "../Breadcrumb";
import type { Crumb } from "../Breadcrumb";

type HeroWhiteProps = {
  title: string;
  paragraph?: string;
  paragraphHtml?: string;
  items?: Crumb[];
};

export default function HeroWhite({
  title,
  paragraph,
  paragraphHtml,
  items = [{ label: "Datasets", href: "/datasets" }],
}: HeroWhiteProps): JSX.Element {
  const hasParagraph = Boolean(paragraphHtml || paragraph);

  return (
    <section className="hero-block-container hero-white bg-white px-5 md:px-10 xl:px-16 py-12 md:py-16 xl:py-20">
      <div className="hero-block text-start mx-auto max-w-6xl">
        <div className="mb-5">
          <Breadcrumb items={items} />
        </div>

        <h1 className="hero-title mb-5 text-slate-950 text-4xl md:text-5xl xl:text-6xl leading-snug font-montserrat font-bold max-w-lg xl:max-w-3xl">
          {title}
        </h1>
        {hasParagraph && (
          <div className="space-y-2.5">
            {paragraphHtml ? (
              <div
                className="hero-paragraph text-slate-800 text-base/6 lg:text-lg/7 font-baskervville font-normal max-w-2xl [&_p]:mb-2.5 [&_p:last-child]:mb-0"
                dangerouslySetInnerHTML={{ __html: paragraphHtml }}
              />
            ) : (
              <p className="hero-paragraph text-slate-800 text-base/6 lg:text-lg/7 font-baskervville font-normal max-w-2xl">
                {paragraph}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
