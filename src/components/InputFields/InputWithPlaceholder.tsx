"use client";

import { type JSX } from "react";

export default function InputWithPlaceholder(): JSX.Element {
  return (
    <div className="form-7 space-y-4">
      <input
        className="input-field block w-full rounded-md shadow-sm bg-brand-white px-3 py-3.5 text-base/6 text-gray-900 font-sourcecodepro font-normal border border-gray-300 hover:border-gray-300 outline-0 focus:border-brand-2-900 focus:ring-1 focus:ring-indigo-500"
        type="text"
        name="name"
        id="name-with-placeholder"
        aria-label="name"
        placeholder="Something about myself."
      />
    </div>
  );
}
