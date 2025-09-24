"use client";

import searchClient from "@/src/lib/algolia";
import { type JSX, FormEvent, useState, useEffect } from "react";

export default function SearchFieldHome(): JSX.Element {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  function preventSubmit(e: FormEvent) {
    e.preventDefault();
  }

  useEffect(() => {
    if (query.trim().length === 0) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { hits } = await searchClient.searchSingleIndex({
          indexName: "wp_searchable_posts",
          searchParams: {
            query,
            hitsPerPage: 5,
            filters:
              'post_type_label:"Data Sets" OR post_type_label:"Insights"',
            attributesToHighlight: [
              "post_title",
              "post_excerpt",
              "post_content",
              "taxonomies.categories",
              "taxonomies.tags",
            ],
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
  }, [query]);

  return (
    <div className="relative w-full">
      <form className="relative w-full" onSubmit={preventSubmit}>
        {/* Your input and button markup remains unchanged */}
        <input
          type="text"
          id="search-home"
          name="search"
          placeholder="Search Eg: Budget, Debt and Loans"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input w-full rounded-full border border-white bg-brand-black py-5 px-6 md:pl-12 md:pr-28 font-sourcecodepro text-sm md:text-base text-slate-50/70 placeholder:text-brand-white/90 shadow-sm focus:border-brand-1-200 focus:outline-0 focus:ring-1 focus:ring-transparent"
        />
        <div className="search-icon hidden md:block absolute left-3 top-1/2 -translate-y-1/2 text-slate-50">
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
          className="search-btn btn absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-3 rounded-full bg-brand-white text-gray-600 border border-slate-400 hover:bg-brand-1-600 hover:text-brand-white"
        >
          <span className="hidden md:block">Search</span>
          <span className="block md:hidden">
            <svg
              className="size-6 text-gray-600"
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

                {/* <p className="text-sm text-gray-500 transition-colors duration-200 group-hover:text-gray-300">
                  {hit.post_excerpt}
                </p> */}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
