"use client";
import React, { useEffect, useRef, useState } from "react";
import "tiny-slider/dist/tiny-slider.css";
type FilterCarouselProps = {
  items?: string[];
  initialActiveIndex?: number;
  onChangeActive?: (label: string, index: number) => void;
  className?: string;
};
const DEFAULT_ITEMS = [
  "All datasets",
  "Management",
  "Budget",
  "Financing",
  "Direction",
  "Expenditure",
  "Revenue",
  "Debt",
  "Provincial Councils",
  "Provincial Councils"
];
export default function FilterCarousel({
  items = DEFAULT_ITEMS,
  initialActiveIndex = 2,
  onChangeActive,
  className,
}: FilterCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const sliderRef = useRef<any>(null);
  useEffect(() => {
    if (trackRef.current && typeof window !== "undefined") {
      // @ts-ignore
      const { tns } = require("tiny-slider/src/tiny-slider");
      sliderRef.current = tns({
        container: trackRef.current,
        items: 9,
        slideBy: 1,
        autoplay: false,
        controls: false,
        mouseDrag: true,
        nav: false,
        autoplayButtonOutput: false,
        gutter: 10,
        loop: false,
        responsive: {
          320: { items: 2 },
          768: { items: 3 },
          1024: { items: 4 },
        },
      });
      // Custom prev/next buttons
      const prevBtn = document.querySelector(".filter-carousel-prev-arrow");
      const nextBtn = document.querySelector(".filter-carousel-next-arrow");
      prevBtn?.addEventListener("click", () => sliderRef.current.goTo("prev"));
      nextBtn?.addEventListener("click", () => sliderRef.current.goTo("next"));
    }
  }, []);
  const handleSelect = (index: number) => {
    setActiveIndex(index);
    onChangeActive?.(items[index], index);
  };
  return (
    <div className={"filter-carousel w-full relative" + (className || "")}>
      {/* Prev button */}
      <button
        type="button"
        aria-label="Previous"
        className="filter-carousel-arrow filter-carousel-prev-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 pl-0 pr-2 xl:pl-0 xl:pr-3.5 bg-gradient-to-l from-[#F3F4F6] via-white to-white text-brand-1-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M13.26 15.53L9.74 12L13.26 8.47" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      {/* Slider track */}
      <div
        ref={trackRef}
        className="filter-carousel-slider w-full px-7 md:px-8 xl:px-4"
      >
        {items.map((label, index) => (
          <div className="slider-item">
            <button
              key={`${label}-${index}`}
              className={`slider-btn w-full text-sm/snug xl:text-base/6 px-3 py-2 md:px-4 rounded-full uppercase font-semibold font-sourcecodepro transition-all duration-200 border border-transparent ${
                index === activeIndex
                  ? "bg-brand-1-500 text-slate-50 hover:text-slate-800 hover:bg-brand-1-50 hover:border hover:border-brand-1-900"
                  : "text-slate-800 hover:bg-brand-1-50 hover:border hover:border-brand-1-900"
              }`}
              onClick={() => handleSelect(index)}
            >
              {label}
            </button>
          </div>
        ))}
      </div>
      {/* Next button */}
      <button
        type="button"
        aria-label="Next"
        className="filter-carousel-arrow filter-carousel-next-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 pr-0 pl-2 xl:pr-0 xl:pl-3.5 bg-gradient-to-r from-white via-white to-[#F3F4F6] text-brand-1-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.74 15.53L14.26 12L10.74 8.47" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  );
}