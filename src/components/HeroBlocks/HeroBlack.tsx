"use client";
import type { JSX } from "react";
import Breadcrumb from "../Breadcrumb";
import type { Crumb } from "../Breadcrumb";

type HeroBlackProps = {
  bgUrl?: string;
  title?: string;
  dateText?: string;
  items?: Crumb[];
  homeHref?: string;
  showDate?: boolean;
};

export default function HeroBlack({
  bgUrl = "/assets/images/hero-black-bg.jpg",
  title = "U.S. Population Projected to Reach 341,145,670 at Midnight EST on January 1",
  dateText = "August 24th, 2025",
  items,
  homeHref,
  showDate = true,
}: HeroBlackProps): JSX.Element {
  return (
    <section
      className="hero-block-container hero-black text-center px-5 md:px-10 xl:px-16 py-12 md:py-16 xl:py-20"
      style={{
        backgroundImage: `url(${bgUrl})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="hero-block text-center mx-auto max-w-6xl grid justify-center">
        <div className="mb-5 hero-breadcrumb text-slate-200 flex justify-center">
          <Breadcrumb
            light
            homeHref={homeHref}
            items={
              items && items.length ? items : [{ label: "Datasets", href: "#" }]
            }
          />
        </div>

        <h1 className="hero-title mb-5 text-slate-50 text-4xl md:text-5xl xl:text-6xl leading-snug font-montserrat font-bold max-w-6xl">
          {title}
        </h1>
        {showDate && dateText ? (
          <p className="hero-date text-slate-50 text-sm/snug md:text-base/6 xl:text-lg/7 font-sourcecodepro font-medium">
            {dateText}
          </p>
        ) : null}
      </div>
    </section>
  );
}

