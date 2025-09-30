import CardType6 from "@/src/components/Cards/CardType6";
import React, { useState } from "react";

const SearchAndResults = () => {
  const [search, setSearch] = useState("");
  const [results] = useState([
    {
      id: 1,
      title: "Sri Lanka - Food Security and Nutrition Indicators",
      desc: "By comparison, just before the nation’s independence nearly 250 years ago, ...",
      date: "2024-08-18",
    },
    {
      id: 2,
      title: "TESLA Stock Data 2024",
      desc: "By comparison, just before the nation’s independence nearly 250 years ago, ...",
      date: "2024-08-18",
    },
    {
      id: 3,
      title: "Effective crisis management leads Sri Lanka’s tourism.",
      desc: "By comparison, just before the nation’s independence nearly 250 years ago, ...",
      date: "2024-08-18",
    },
  ]);

  const filteredResults = results.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white">
      {/* Search Section */}
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pt-5 pb-5">
        <div className="relative w-full">
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input w-full rounded-full border border-gray-300 bg-white py-2.5 pl-12 pr-10 font-family-baskervville text-sm/tight md:text-base/6 text-slate-800 placeholder:text-slate-600/50 shadow-sm hover:border-brand-1-100 focus:border-brand-1-200 focus:outline-0 focus:outline-brand-1-200 focus:ring-1 focus:ring-transparent"
          />

          {/* Search Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-2 flex items-center pl-2 text-slate-600/80">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
              <path
                d="M9.583 17.5a7.917 7.917 0 1 0 0-15.833 7.917 7.917 0 0 0 0 15.833zM18.333 18.333 16.667 16.667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Clear Button */}
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-2 flex items-center pr-2 text-slate-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                <path
                  d="M9 0.667a8.333 8.333 0 1 0 0 16.667A8.333 8.333 0 0 0 9 0.667zM11.8 10.917a.667.667 0 0 1-.942.942L9 9.883l-1.917 1.976a.667.667 0 0 1-.942-.942L8.117 9 6.14 7.083a.667.667 0 0 1 .942-.942L9 8.117l1.917-1.976a.667.667 0 0 1 .942.942L9.883 9l1.917 1.917z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-10">
        {filteredResults.length > 0 ? (
          <>
            <div className="mb-6">
              <span className="text-lg/7 font-normal font-family-baskervville text-slate-600 mb-1">
                {filteredResults.length} results for
              </span>
              <p className="text-lg/7 font-medium font-family-sourcecodepro text-slate-800">
                “{search || "all"}”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredResults.map((item) => (
                <CardType6
                  key={item.id}
                  title={item.title}
                  excerpt={item.desc}
                  imageUrl={item.imageUrl ?? undefined} // placeholder until you connect real data
                  postDate={item.date}
                  uri={item.uri ?? "#"}
                  categories={item.categories ?? []}
                />

              ))}
            </div>
          </>
        ) : (
          // No Results
          <div className="bg-white">
            <div className="mx-auto max-w-4xl px-5 md:px-10 xl:px-16 pt-8 pb-10 lg:pt-12 lg:pb-20">
              <div className="text-center space-y-2">
                <h1 className="text-3xl md:text-5xl leading-snug font-bold font-family-montserrat text-brand-black">
                  No results found
                </h1>
                <p className="text-base/6 md:text-lg/7 font-normal font-family-baskervville text-slate-800 max-w-xl mx-auto">
                  Looks like nothing matches your search. Try a broader keyword or
                  explore popular datasets below.
                </p>
              </div>

              {/* Popular Pages */}
              <div className="mt-12">
                <span className="text-gray-500 text-sm uppercase font-semibold font-family-sourcecodepro mb-4 block">
                  Popular Pages
                </span>
                <ul role="list" className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="flex items-start gap-3 p-4 rounded-md hover:bg-brand-1-50 text-slate-800"
                    >
                      <div className="bg-brand-1-50 rounded-lg p-3">
                        📊
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold font-family-montserrat">
                          Government Fiscal Operations
                        </h3>
                        <p className="text-slate-600 text-base font-family-baskervville">
                          A detailed overview of government revenue, expenditure, and fiscal performance.
                        </p>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndResults;
