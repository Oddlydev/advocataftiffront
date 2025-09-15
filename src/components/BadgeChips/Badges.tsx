"use client";
import type { JSX } from "react";

export default function Badges(): JSX.Element {
  return (
    <div className="bg-white text-center p-6">
      <div className="flex flex-wrap justify-center gap-4">
        {/* GRAY */}
        <span
          className={[
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
            "inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm leading-4 xl:leading-tight font-sourcecodepro uppercase font-medium",
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
    </div>
  );
}
