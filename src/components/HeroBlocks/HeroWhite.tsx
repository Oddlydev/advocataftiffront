"use client";
import type { JSX } from "react";
import Breadcrumb from "../Breadcrumb";
import type { Crumb } from "../Breadcrumb";

type HeroWhiteProps = {
  title: string;
  paragraph?: string;
  items?: Crumb[];
};

export default function HeroWhite({
  title,
  paragraph,
  items = [{ label: "Datasets", href: "/datasets" }],
}: HeroWhiteProps): JSX.Element {
  return (
    <section className="hero-block-container hero-white bg-white px-5 md:px-10 xl:px-16 py-12 md:py-16 xl:py-20">
      <div className="hero-block text-start mx-auto max-w-6xl">
        <div className="mb-5">
          <Breadcrumb items={items} />
        </div>

        <h1 className="hero-title mb-5 text-slate-950 text-4xl md:text-5xl xl:text-6xl leading-snug font-family-montserrat font-bold max-w-lg xl:max-w-4xl">
          {title}
        </h1>
        {paragraph && (
          <div className="space-y-2.5">
            <p className="hero-paragraph text-slate-800 text-base/6 lg:text-lg/7 font-family-baskervville font-normal max-w-2xl">
              {paragraph}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
