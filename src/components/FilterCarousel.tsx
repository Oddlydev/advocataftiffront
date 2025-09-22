import React, { useEffect, useRef, useState } from "react";

type FilterCarouselProps = {
  items?: string[];
  initialActiveIndex?: number;
  onChangeActive?: (label: string, index: number) => void;
  className?: string;
};

const DEFAULT_ITEMS: string[] = [
  "Provincial Councils",
  "All datasets",
  "Management",
  "Budget",
  "Financing",
  "Direction",
  "Expenditure",
  "Revenue",
  "Debt",
  "Provincial Councils",
];

export default function FilterCarousel({
  items = DEFAULT_ITEMS,
  initialActiveIndex = 2,
  onChangeActive,
  className,
}: FilterCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const sliderInstance = useRef<any>(null);

  useEffect(() => {
    // Dynamic import inside useEffect (client-side only)
    const initSlider = async () => {
      if (!sliderRef.current) return;
      const { tns } = await import("tiny-slider/src/tiny-slider");
      sliderInstance.current = tns({
        container: sliderRef.current,
        items: 9,
        slideBy: 1,
        autoplay: false,
        controls: false,
        mouseDrag: true,
        nav: false,
        autoplayButtonOutput: false,
        gutter: 0,
        loop: false,
        responsive: {
          320: { items: 3 },
          768: { items: 7 },
          1024: { items: 9 },
        },
      });

      const slider = sliderInstance.current;

      // Sync active button when slider changes
      slider.events.on("indexChanged", (info: any) => {
        const index = info.displayIndex - 1;
        setActiveIndex(index);
        onChangeActive?.(items[index], index);
      });
    };

    initSlider();

    // Cleanup
    return () => sliderInstance.current?.destroy();
  }, [items, onChangeActive]);

  const goToPrev = () => sliderInstance.current?.goTo("prev");
  const goToNext = () => sliderInstance.current?.goTo("next");

  const handleClick = (index: number) => {
    sliderInstance.current?.goTo(index);
    setActiveIndex(index);
    onChangeActive?.(items[index], index);
  };

  return (
    <div className={"filter-carousel w-full relative " + (className || "")}>
      <button
        type="button"
        aria-label="Previous"
        onClick={goToPrev}
        className="filter-carousel-arrow filter-carousel-prev-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 text-brand-1-900 pl-0 pr-2 xl:pl-0 xl:pr-3.5 bg-gradient-to-l from-[#F3F4F6] via-white to-white"
      >
        ‹
      </button>

      <div
        ref={sliderRef}
        className="filter-carousel-slider flex overflow-hidden whitespace-nowrap scroll-smooth"
      >
        {items.map((item, index) => (
          <div key={index} className="slider-item inline-block px-1">
            <button
              onClick={() => handleClick(index)}
              className={`slider-btn px-3 py-2 md:px-4 rounded-full text-sm xl:text-base uppercase font-family-baskervville transition-all duration-200 ${
                index === activeIndex
                  ? "bg-brand-1-500 text-slate-50 hover:text-slate-800"
                  : "text-slate-800 hover:bg-brand-1-50 hover:border hover:border-brand-1-900"
              }`}
            >
              {item}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next"
        onClick={goToNext}
        className="filter-carousel-arrow filter-carousel-next-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 text-brand-1-900 pr-0 pl-2 xl:pr-0 xl:pl-3.5 bg-gradient-to-r from-white via-white to-[#F3F4F6]"
      >
        ›
      </button>
    </div>
  );
}
