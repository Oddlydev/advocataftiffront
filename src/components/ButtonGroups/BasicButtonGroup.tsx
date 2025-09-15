import React from "react";

export default function BasicButtonGroup() {
  return (
    <div className="btn-group isolate relative inline-flex items-center rounded-md shadow-xs transition-all duration-500 ease-in-out cursor-pointer leading-tight">
      <button
        type="button"
        className="rounded-l-md basic-btn-group bg-brand-white px-4 py-2.5 text-sm leading-tight font-sourcecodepro font-medium text-slate-800 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        Years
      </button>
      <button
        type="button"
        className="-ml-px basic-btn-group bg-brand-white px-4 py-2.5 text-sm leading-tight font-sourcecodepro font-medium text-slate-800 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        Months
      </button>
      <button
        type="button"
        className="-ml-px rounded-r-md basic-btn-group bg-brand-white px-4 py-2.5 text-sm leading-tight font-sourcecodepro font-medium text-slate-800 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        Days
      </button>
    </div>
  );
}
