"use client";
import type { JSX } from "react";
import Breadcrumb from "../Breadcrumb";

type HeroCoverImageProps = {
  bgUrl?: string;
  title?: string;
  dateText?: string;
};

export default function HeroCoverImage({
  bgUrl = "/assets/images/hero-cover-img.jpg",
  title = "U.S. Population Projected to Reach 341,145,670 at Midnight EST on January 1",
  dateText = "August 24th, 2025",
}: HeroCoverImageProps): JSX.Element {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-black/50 z-10" />
      <section
        className="hero-block-container hero-cover-img text-center px-5 md:px-10 xl:px-16 py-12 md:py-16 xl:py-20 relative"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(235, 26, 82, 0.16) 0%, rgba(235, 26, 82, 0.16) 100%),
            linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%),
            url(${bgUrl})
          `,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="hero-block relative z-20 text-center mx-auto max-w-6xl grid justify-center">
          <div className="mb-5 hero-breadcrumb text-slate-200 flex justify-center">
            <Breadcrumb light items={[{ label: "Datasets", href: "#" }]} />
          </div>

          <h1 className="hero-title mb-5 text-slate-50 text-4xl md:text-5xl xl:text-6xl leading-snug font-montserrat font-bold max-w-6xl">
            {title}
          </h1>
          <p className="hero-date text-slate-50 text-sm/snug md:text-base/6 xl:text-lg/7 font-sourcecodepro font-medium">
            {dateText}
          </p>
        </div>
      </section>
    </div>
  );
}
