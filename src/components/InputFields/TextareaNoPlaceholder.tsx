"use client";

import { type JSX } from "react";

export default function TextareaNoPlaceholder(): JSX.Element {
  return (
    <div className="form-7 space-y-4">
      <label
        htmlFor="comment-no-placeholder"
        className="input-label block text-sm leading-snug font-medium text-gray-900"
      >
        Add your comment
      </label>
      <textarea
        rows={4}
        name="comment"
        id="comment-no-placeholder"
        className="block w-full rounded-md shadow-sm bg-brand-white px-3 py-3.5 text-base/6 text-gray-900 font-sourcecodepro font-normal outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-0 focus:border-brand-2-900 focus:ring-1 focus:ring-indigo-500"
      />
    </div>
  );
}
