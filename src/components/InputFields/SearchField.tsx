"use client";

import { type JSX, useCallback, useMemo, useRef, useState } from "react";

type SearchFieldProps = {
  value?: string; // controlled value
  defaultValue?: string; // for uncontrolled usage
  onChange?: (query: string) => void; // fires on each keystroke
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
    if (query && query.length > 0) {
      if (!isControlled) setInternal("");
      onChange?.("");
      requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
        inputRef.current?.setSelectionRange(0, 0);
      });
    }
  }, [clearOnFocus, isControlled, onChange, query]);

  return (
    <div className="bg-white">
      <div className="relative w-full">
        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          id="search"
          name="search"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          autoFocus={autoFocus}
          className={`search-input w-full rounded-full border border-gray-300 bg-white py-2.5 pl-12 font-sourcecodepro text-sm md:text-base text-slate-800 placeholder:text-slate-600/50 shadow-sm hover:border-brand-1-100 focus:border-brand-1-200 focus:outline-0 focus:ring-1 focus:ring-transparent focus:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_#9B195F] ${
            showSubmitButton ? "pr-28" : "pr-12"
          } ${className ?? ""}`}
        />

        {/* Search Icon */}
        <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center pl-2 text-slate-600/80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              d="M9.583 17.5a7.917 7.917 0 1 0 0-15.833 7.917 7.917 0 0 0 0 15.833zM18.333 18.333 16.667 16.667"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Right side controls */}
        <div className="absolute inset-y-0 right-2 pr-2 flex items-center space-x-2">
          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                if (!isControlled) setInternal("");
                onChange?.("");
              }}
              className="flex items-center text-slate-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  d="M9 0.667a8.333 8.333 0 1 0 0 16.667A8.333 8.333 0 0 0 9 0.667zM11.8 10.917a.667.667 0 0 1-.942.942L9 9.883l-1.917 1.976a.667.667 0 0 1-.942-.942L8.117 9 6.14 7.083a.667.667 0 0 1 .942-.942L9 8.117l1.917-1.976a.667.667 0 0 1 .942.942L9.883 9l1.917 1.917z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}

          {/* Submit Button */}
          {showSubmitButton && (
            <button
              type="button"
              onClick={() => onSubmit?.(query)}
              className="rounded-full bg-brand-1-600 px-4 py-1.5 text-white text-sm font-medium hover:bg-brand-1-700"
            >
              {submitLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
