"use client";

import { type JSX } from "react";

export default function InputNoPlaceholder(): JSX.Element {
  return (
    <div className="form-7 space-y-4">
      <input
        className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400 focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
        type="text"
        name="name"
        id="name-no-placeholder"
        aria-label="name"
      />
    </div>
  );
}
