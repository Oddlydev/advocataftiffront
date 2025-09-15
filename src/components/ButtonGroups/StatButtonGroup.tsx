import React from "react";

export default function StatButtonGroup() {
  return (
    <div className="btn-group isolate relative inline-flex items-center rounded-md shadow-xs transition-all duration-500 ease-in-out cursor-pointer leading-tight">
      <button
        type="button"
        className="rounded-l-md stat-btn-group relative inline-flex items-center gap-x-1.5 bg-brand-white py-2 px-3 text-sm leading-tight font-sourcecodepro font-medium text-slate-800 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          className="-ml-0.5 size-5 text-gray-400"
        >
          <path
            d="M5 4C5 2.89543 5.89543 2 7 2H13C14.1046 2 15 2.89543 15 4V18L10 15.5L5 18V4Z"
            fill="currentColor"
          />
        </svg>
        Bookmark
      </button>
      <button
        type="button"
        className="-ml-px rounded-r-md py-[9px] stat-btn-group  relative inline-flex items-center gap-x-1.5 bg-brand-white px-3 text-sm leading-tight font-sourcecodepro font-medium text-slate-800 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        12k
      </button>
    </div>
  );
}
