import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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
  const [activeIndex, setActiveIndex] = useState<number>(
    Math.min(Math.max(initialActiveIndex, 0), items.length - 1)
  );
  const trackRef = useRef<HTMLDivElement | null>(null);

  const visibleCount = useRef<number>(9);

  const computeVisibleCount = useCallback(() => {
    const width = typeof window !== "undefined" ? window.innerWidth : 1024;
    if (width < 768) return 3; // 320+
    if (width < 1024) return 7; // 768+
    return 9; // 1024+
  }, []);

  useEffect(() => {
    const update = () => {
      visibleCount.current = computeVisibleCount();
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [computeVisibleCount]);

  const scrollByItems = useCallback((direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;
    const firstChild = track.firstElementChild as HTMLElement | null;
    if (!firstChild) return;

    const itemWidth = firstChild.offsetWidth;
    const gap = 0; // we keep gap 0 to mirror original
    const step =
      itemWidth * Math.max(1, Math.floor(visibleCount.current / 3)) + gap;
    const delta = direction === "prev" ? -step : step;
    track.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIndex(index);
      onChangeActive?.(items[index], index);
    },
    [items, onChangeActive]
  );

  const buttons = useMemo(
    () =>
      items.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <div key={`${label}-${index}`} className="slider-item inline-block align-middle">
            <button
              type="button"
              onClick={() => handleSelect(index)}
              className={[
                "px-3 py-2 md:px-4 rounded-full text-slate-800 text-sm xl:text-base font-normal uppercase",
                "hover:bg-brand-1-50 hover:border hover:border-brand-1-900",
                "font-family-baskervville",
                isActive
                  ? "bg-brand-1-500 text-slate-50 hover:text-slate-800"
                  : "",
              ].join(" ")}
            >
              {label}
            </button>
          </div>
        );
      }),
    [items, activeIndex, handleSelect]
  );

  return (
    <div className={"filter-carousel w-full relative " + (className || "")}>
      <button
        type="button"
        aria-label="Previous"
        onClick={() => scrollByItems("prev")}
        className="filter-carousel-arrow filter-carousel-prev-arrow rounded-full backdrop-blur-sm py-1 xl:py-2 text-brand-1-900 absolute left-0 top-1/2 -translate-y-1/2 z-10 pl-0 pr-2 xl:pl-0 xl:pr-3.5 bg-gradient-to-l from-[#F3F4F6] via-white to-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-current"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.26 15.53L9.74 12L13.26 8.47"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        ref={trackRef}
        className="filter-carousel-slider relative overflow-hidden whitespace-nowrap scroll-smooth"
      >
        {buttons}
      </div>

      <button
        type="button"
        aria-label="Next"
        onClick={() => scrollByItems("next")}
        className="filter-carousel-arrow filter-carousel-next-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 text-brand-1-900 pr-0 pl-2 xl:pr-0 xl:pl-3.5 bg-gradient-to-r from-white via-white to-[#F3F4F6]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-current"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.74 15.53L14.26 12L10.74 8.47"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
