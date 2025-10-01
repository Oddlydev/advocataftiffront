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
        className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400 focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
      />
    </div>
  );
}
