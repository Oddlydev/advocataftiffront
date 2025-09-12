"use client";
import type { JSX } from "react";

type HeroBasicProps = {
  bgUrl?: string;
  title: string;
  paragraph: string;
};

export default function HeroBasic({
  // bgUrl = "/assets/images/hero-basic-bg.jpg",
  title,
  paragraph,
}: HeroBasicProps): JSX.Element {
  return (
    <section
      className="hero-block-container hero-basic mx-auto xl:px-16 py-12 md:py-16 xl:py-20 px-5 md:px-10 lg:px-16"
      style={{
        // backgroundImage: `url(${bgUrl})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="hero-block grid grid-cols-1 lg:grid-cols-2 gap-8 hero-block text-start mx-auto max-w-6xl items-center">
        <h1 className="hero-title mb-5 md:mb-0 text-slate-50 text-4xl md:text-5xl xl:text-6xl leading-snug font-family-montserrat font-bold max-w-5 xl:max-w-sm">
          {title}
        </h1>
        <div className="space-y-2.5">
          <p className="hero-paragraph text-slate-200 text-base/6 lg:text-lg/7 font-family-baskervville font-normal max-w-2xl">
            {paragraph}
          </p>
        </div>
      </div>
    </section>
  );
}
