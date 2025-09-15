import React from "react";

/**
 * ComponentBadgeChip.tsx
 * Tailwind classes from @layer components inlined for badges and chips.
 * Custom classes (badge-*, chip*) are kept in case you want to reuse them.
 */

export default function BadgeChip() {
  return (
    <div className="bg-white text-center">
      <div className="pb-20">
        {/* Badge */}
        <h1 className="text-3xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
          Badge
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          {/* GRAY */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-gray-300 text-slate-950",
              "badge badge-gray",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-gray-500"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>

          {/* RED */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-red-300 text-red-800",
              "badge badge-red",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-red-600"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>

          {/* YELLOW */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-amber-200 text-amber-800",
              "badge badge-yellow",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-amber-500"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>

          {/* GREEN */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-green-300 text-green-800",
              "badge badge-green",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-green-600"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>

          {/* BLUE */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-blue-100 text-blue-800",
              "badge badge-blue",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-blue-400"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>

          {/* INDIGO */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-indigo-100 text-indigo-800",
              "badge badge-indigo",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-indigo-400"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>

          {/* PURPLE */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-purple-100 text-purple-800",
              "badge badge-purple",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-purple-400"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>

          {/* PINK */}
          <span
            className={[
              "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-family-sourcecodepro uppercase font-medium",
              "bg-pink-100 text-pink-800",
              "badge badge-pink",
            ].join(" ")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 8 8"
              fill="none"
              className="size-2 text-pink-400"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="3" fill="currentColor" />
            </svg>
            Badge
          </span>
        </div>

        {/* Chip Pill */}
        <h1 className="text-3xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
          Chip Pill
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className={[
              // .chip
              "text-sm/tight xl:text-base/6 font-normal font-family-sourcecodepro text-slate-800 bg-transparent hover:bg-brand-1-50 hover:border hover:border-brand-1-700 focus:text-slate-50 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent uppercase",
              // .chip-pill
              "py-2 px-3.5 md:py-2 md:px-6 rounded-full border border-transparent focus:border-brand-1-800 focus:bg-brand-1-500",
              "chip chip-pill chip-pressed",
            ].join(" ")}
          >
            Chip pill
          </a>
        </div>

        {/* Chip Box */}
        <h1 className="text-3xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
          Chip Box
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="#"
            className={[
              // .chip
              "text-sm/tight xl:text-base/6 font-normal font-family-sourcecodepro text-slate-800 bg-transparent hover:bg-brand-1-50 hover:border hover:border-brand-1-700 focus:text-slate-50 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent uppercase",
              // .chip-box
              "py-2 px-3 md:py-2 md:px-7 rounded-lg border border-gray-400 focus:border-brand-1-950 focus:bg-brand-1-950",
              "chip chip-box chip-pressed",
            ].join(" ")}
          >
            Chip box
          </a>
        </div>
      </div>
    </div>
  );
}
