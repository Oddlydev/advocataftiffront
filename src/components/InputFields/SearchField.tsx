"use client";

import { type JSX, useCallback, useMemo, useRef, useState } from "react";

type SearchFieldProps = {
  value?: string; // controlled value
  defaultValue?: string; // for uncontrolled usage
  onChange?: (query: string) => void; // fires on each keystroke (or when clear on focus)
  onSubmit?: (query: string) => void; // fires on Enter or submit
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  clearOnFocus?: boolean; // optional: clear input when focused
  showSubmitButton?: boolean; // optional: render a trailing submit button
  submitLabel?: string; // label for the submit button
};

export default function SearchField({
  value,
  defaultValue,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className,
  autoFocus,
  clearOnFocus = false,
  showSubmitButton = false,
  submitLabel = "Search",
}: SearchFieldProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const isControlled = useMemo(() => typeof value === "string", [value]);
  const [internal, setInternal] = useState<string>(defaultValue ?? "");
  const query = isControlled ? (value as string) : internal;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value;
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") onSubmit?.(query);
    },
    [onSubmit, query]
  );

  const handleFocus = useCallback(() => {
    if (!clearOnFocus) return;
    // Optionally auto-clear previous keyword, while preserving focus
    if (query && query.length > 0) {
      if (!isControlled) setInternal("");
      onChange?.("");
      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (el) {
          el.focus({ preventScroll: true });
          el.setSelectionRange(0, 0);
        }
      });
    }
  }, [clearOnFocus, isControlled, onChange, query]);

  const handleBlur = useCallback(() => {
    // noop
  }, []);

  return (
    <div className={"relative w-full " + (className || "")}>
      <input
        ref={inputRef}
        type="text"
        id="search-plain"
        name="search"
        placeholder={placeholder}
        className={`search-input w-full rounded-full border border-gray-300 bg-white py-2.5 pl-12 pr-2.5 font-baskervville text-sm/tight md:text-base/6 text-slate-800 placeholder:text-slate-600/50 shadow-sm hover:border-brand-1-100 focus:border-brand-1-200 focus:outline-0 focus:outline-brand-1-200 focus:ring-1 focus:ring-transparent focus:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_#9B195F] ${showSubmitButton ? "pr-28" : "pr-2.5"} font-baskervville text-sm md:text-base text-slate-800 placeholder:text-slate-600/50 shadow-sm hover:border-brand-1-100 focus:border-brand-1-200 focus:outline-0 focus:ring-1 focus:ring-transparent`}
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoFocus={autoFocus}
        aria-label="Search"
        role="searchbox"
      />
      <div className="search-icon pointer-events-none absolute inset-y-0 left-2 flex items-center pl-2 text-slate-600/80">
        <svg
          className="size-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9.583 17.5A7.917 7.917 0 1 0 1.667 9.583 7.917 7.917 0 0 0 9.583 17.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m18.333 18.333-1.667-1.667"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {showSubmitButton && (
        <button
          type="button"
          className="absolute inset-y-0 right-1 my-1 px-4 rounded-full bg-brand-1-700 text-white text-sm font-medium shadow-sm hover:bg-brand-1-600 focus:outline-none focus:ring-2 focus:ring-brand-1-200"
          onClick={() => onSubmit?.(query)}
          aria-label={submitLabel}
        >
          {submitLabel}
        </button>
      )}
    </div>
  );
}
