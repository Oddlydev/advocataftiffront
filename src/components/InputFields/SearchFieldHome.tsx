"use client";

import searchClient from "@/src/lib/algolia";
import { type JSX, FormEvent, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchFieldHomeProps {
  setIsSearchVisible?: (visible: boolean) => void;
  onSearch?: (query: string) => void;
}

export default function SearchFieldHome({ setIsSearchVisible, onSearch }: SearchFieldHomeProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const router = useRouter();

  const sanitizeInput = useCallback((value: string) => {
    // Remove potentially dangerous characters and control chars
    return value.replace(/[<>]/g, "").replace(/[\u0000-\u001F\u007F]/g, "");
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const cleaned = sanitizeInput(query).trim();
    if (cleaned.length === 0) return;
    // Call optional onSearch with cleaned value
    onSearch?.(cleaned);
    router.push(`/search-result?query=${encodeURIComponent(cleaned)}`);
  }

  useEffect(() => {
    const hasResults = query.trim().length > 0 && results.length > 0;
    if (setIsSearchVisible) setIsSearchVisible(query.trim().length > 0 || hasResults);

    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { hits } = await searchClient.searchSingleIndex({
          indexName: "wp_searchable_posts",
          searchParams: {
            // query is already sanitized in onChange below
            query,
            hitsPerPage: 5,
            filters: 'post_type_label:"Data Sets" OR post_type_label:"Insights"',
            attributesToHighlight: ["post_title", "post_excerpt", "post_content", "taxonomies.categories", "taxonomies.tags"],
            enableReRanking: true,
            attributesToSnippet: ["post_excerpt:20", "post_content:30"],
          },
        });
        setResults(hits as any[]);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, results.length, setIsSearchVisible]);

  return (
    <div className="relative w-full">
      <form className="relative w-full z-[9999]" onSubmit={handleSubmit}>
        <input
          type="text"
          id="search-home"
          name="search"
          placeholder="Search Eg: Budget, Debt and Loans"
          value={query}
          onChange={(e) => {
            const cleaned = sanitizeInput(e.target.value);
            setQuery(cleaned);
          }}
          className="search-input w-full rounded-full border border-white/25 bg-brand-black py-5 px-6 md:pl-12 md:pr-28 font-sourcecodepro text-sm md:text-base text-slate-50/70 placeholder:text-slate-50 shadow-sm focus:border-brand-1-200 focus:outline-0 focus:ring-1 focus:ring-transparent"
        />
        <div className="search-icon hidden md:block absolute left-5 top-1/2 -translate-y-1/2 text-slate-50">
          <svg
            className="size-5 text-slate-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="none"
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
        <button
          type="submit"
          aria-label="Search"
          className="search-btn btn absolute right-2 top-1/2 -translate-y-1/2 font-semibold font-sourcecodepro px-3.5 py-3.5 sm:px-3.5 sm:py-2.5 md:px-4 md:py-3 lg:py-3.5 xl:px-6 xl:py-3.5 text-xs/4 sm:text-sm/tight lg:text-base/6 gap-2 lg:gap-3 transition-all duration-500 ease-in-out cursor-pointer uppercase bg-brand-white border border-slate-200 text-gray-600 rounded-full shadow-sm hover:bg-slate-100 focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-transparent"
        >
          <span className="hidden md:block">Search</span>
          <span className="block md:hidden">
            <svg
              className="size-5 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 22L20 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      </form>

      {query.trim().length > 0 && results.length === 0 && (
        <div className="absolute top-full left-0 mt-2 py-20 px-3.5 w-full bg-brand-black border border-brand-white/25 rounded-2xl z-50">
          <div className="grid items-center gap-3 text-slate-200/40 text-base font-sourcecodepro font-normal">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 48 48"
              fill="none"
              className="justify-self-center size-8 mb-2"
            >
              <g opacity="0.3">
                <path
                  d="M42 41.9999L33.32 33.3199"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 38C30.8366 38 38 30.8366 38 22C38 13.1634 30.8366 6 22 6C13.1634 6 6 13.1634 6 22C6 30.8366 13.1634 38 22 38Z"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
            <div className="flex flex-col justify-center">
              <p className="text-slate-50 font-sourcecodepro font-medium text-base/6 mb-2">
                No results found
              </p>
              <p className="text-slate-50 font-sourcecodepro font-normal text-sm/tight">
                Try refining your search with different terms or topics
              </p>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 pt-2 pb-5 px-3.5 w-full bg-brand-black border border-brand-white/25 rounded-2xl z-50">
          <p className="p-3 pb-4 text-slate-200/40 text-start text-base font-sourcecodepro font-normal uppercase">
            Search Results
          </p>
          {results.map((hit) => (
            <li
              key={hit.objectID}
              className="p-3 space-y-2 hover:bg-brand-white/12 rounded-full group"
            >
              <a
                href={hit.permalink}
                className="block text-slate-200/40 font-sourcecodepro text-start transition-colors duration-200"
              >
                <h4 className="flex items-center gap-2">
                  <span className="bg-brand-white/15 rounded-full p-2 text-slate-50 transition-colors duration-200 group-hover:bg-brand-white/30">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="size-3 opacity-80 transition-colors duration-200 group-hover:text-brand-white"
                    >
                      <g clipPath="url(#clip0_8051_2404)">
                        <path
                          d="M8 14.6666C11.6819 14.6666 14.6667 11.6819 14.6667 7.99998C14.6667 4.31808 11.6819 1.33331 8 1.33331C4.3181 1.33331 1.33333 4.31808 1.33333 7.99998C1.33333 11.6819 4.3181 14.6666 8 14.6666Z"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 4V8L9.66667 10.6667"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_8051_2404">
                          <rect width="16" height="16" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                  <span className="transition-colors duration-200 group-hover:text-white">
                    {hit.post_title}
                  </span>
                </h4>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
