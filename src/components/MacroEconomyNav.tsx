"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter, usePathname } from "next/navigation";

const MACRO_ECONOMY_POSTS = gql`
  query MacroEconomyPosts {
    macroEconomies {
      nodes {
        title
        slug
        uri
      }
    }
  }
`;

type PostNode = {
  title: string;
  slug?: string;
  uri?: string;
};

function normalizePath(input?: string) {
  if (!input) return "";
  try {
    // Keep it robust if a full URL leaks in
    const u = input.startsWith("http") ? new URL(input).pathname : input;
    return u.replace(/\/+$/g, ""); // strip trailing slash
  } catch {
    return input.replace(/\/+$/g, "");
  }
}

export default function MacroEconomySliderNav({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const trackRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<any>(null);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const { data, loading, error } = useQuery(MACRO_ECONOMY_POSTS);

  const posts: PostNode[] = data?.macroEconomies?.nodes ?? [];
  const items = useMemo(() => posts.map((p) => p.title), [posts]);

  // Sync active tab with current route
  useEffect(() => {
    if (!posts.length) return;

    const current = normalizePath(pathname);
    let idx = posts.findIndex((p) => {
      const wp = normalizePath(p.uri);
      const next = p.slug ? normalizePath(`/macro/${p.slug}`) : "";
      return wp === current || next === current;
    });

    if (idx < 0) idx = 0;
    setActiveIndex(idx);

    // Center the active slide in view if slider is ready
    if (sliderRef.current && typeof sliderRef.current.goTo === "function") {
      sliderRef.current.goTo(idx);
    }
  }, [pathname, posts]);

  // Initialize Tiny Slider once items are ready
  useEffect(() => {
    if (!trackRef.current || !items.length) return;

    // lazy-require tiny-slider in client
    // @ts-ignore
    const { tns } = require("tiny-slider/src/tiny-slider");
    sliderRef.current = tns({
      container: trackRef.current,
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
        1024: { items: 5 },
      },
    });

    // Hook up external arrows
    const prevEl = document.querySelector<HTMLButtonElement>(
      ".macro-filter-prev-arrow"
    );
    const nextEl = document.querySelector<HTMLButtonElement>(
      ".macro-filter-next-arrow"
    );
    prevBtnRef.current = prevEl ?? null;
    nextBtnRef.current = nextEl ?? null;

    const goPrev = () => sliderRef.current?.goTo("prev");
    const goNext = () => sliderRef.current?.goTo("next");

    prevBtnRef.current?.addEventListener("click", goPrev);
    nextBtnRef.current?.addEventListener("click", goNext);

    // Ensure the current active is in view on init
    if (typeof sliderRef.current.goTo === "function") {
      sliderRef.current.goTo(activeIndex);
    }

    // Cleanup on unmount
    return () => {
      prevBtnRef.current?.removeEventListener("click", goPrev);
      nextBtnRef.current?.removeEventListener("click", goNext);
      try {
        sliderRef.current?.destroy?.();
      } catch {}
      sliderRef.current = null;
    };
    // re-init only when items length changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const handleSelect = (index: number) => {
    setActiveIndex(index);
    const selected = posts[index];
    if (selected?.uri) {
      router.push(normalizePath(selected.uri) || "/");
    } else if (selected?.slug) {
      router.push(`/macro/${selected.slug}`);
    }
    // Keep the chosen one in view if staying on page
    if (sliderRef.current?.goTo) sliderRef.current.goTo(index);
  };

  if (loading) return <p>Loading slider...</p>;
  if (error) return <p>Failed to load posts.</p>;

  return (
    <div className={`macro-filter-slider w-full relative ${className}`}>
      {/* Prev button (kept exactly as provided) */}
      <button
        type="button"
        aria-label="Previous"
        className="macro-filter-prev-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 pl-0 pr-2 xl:pl-0 xl:pr-3.5 bg-gradient-to-l from-[#F3F4F6] via-white to-white text-brand-1-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.26 15.53 9.74 12l3.52-3.53"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Slider track (styles unchanged) */}
      <div ref={trackRef} className="w-full flex gap-2">
        {items.map((label, index) => (
          <div key={`${label}-${index}`} className="slider-item">
            <button
              aria-current={index === activeIndex ? "page" : undefined}
              className={`slider-btn w-full text-sm xl:text-base px-3 py-2 rounded-lg uppercase border font-semibold font-sourcecodepro text-center transition-colors duration-200
    ${
      index === activeIndex
        ? "bg-brand-1-950 text-brand-white border-brand-1-950 hover:bg-brand-2-50 hover:text-slate-800"
        : "bg-white text-slate-800 border-gray-400 hover:bg-gray-100 hover:text-black"
    }`}
              onClick={() => handleSelect(index)}
            >
              {label}
            </button>
          </div>
        ))}
      </div>

      {/* Next button (kept exactly as provided) */}
      <button
        type="button"
        aria-label="Next"
        className="macro-filter-next-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full backdrop-blur-sm py-1 xl:py-2 pr-0 pl-2 xl:pr-0 xl:pl-3.5 bg-gradient-to-r from-white via-white to-[#F3F4F6] text-brand-1-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
        >
          <path
            d="M12 22C17.5 22 22 17.5 22 12S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m10.74 15.53 3.52-3.53-3.52-3.53"
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
