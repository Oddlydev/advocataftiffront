import CardType6 from "@/src/components/Cards/CardType6";
import WhiteIconButton from "@/src/components/Buttons/WhiteIconBtn";
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
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pt-5 pb-3.5 md:pb-5 md:pt-10 lg:pt-16 lg:pb-6">
        <div className="relative w-full">
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input w-full rounded-full border border-gray-300 bg-white py-2.5 pl-12 font-sourcecodepro text-sm md:text-base text-slate-800 placeholder:text-slate-600/50 shadow-sm hover:border-brand-1-100 focus:border-brand-1-200 focus:outline-0 focus:ring-1 focus:ring-transparent focus:shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05),0px_0px_0px_1px_#9B195F]"
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
              <span className="text-lg/7 font-normal font-baskervville text-slate-600 mb-1">
                {filteredResults.length} results for
              </span>
              <p className="text-lg/7 font-medium font-sourcecodepro text-slate-800">
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
                <h1 className="text-3xl md:text-5xl leading-snug font-bold font-montserrat text-brand-black">
                  No results found
                </h1>
                <p className="text-base/6 md:text-lg/7 font-normal font-baskervville text-slate-800 max-w-xl mx-auto">
                  Looks like nothing matches your search. Try a broader keyword or
                  explore popular datasets below.
                </p>
              </div>

              {/* Popular Pages */}
              <div className="mt-12">
                <span className="text-gray-500 text-sm/tight uppercase font-semibold font-sourcecodepro mb-4">Popular Pages</span>
                
                <nav className="sidebar-fill flex flex-1 flex-col mt-6" aria-label="Sidebar">
                    <ul role="list" className="border-b border-slate-600/10 -mx-2 space-y-2">
                          <li className="border-t border-slate-600/10">
                              {/* <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" --> */}
                              <a href="#" className="sidebar-item flex gap-x-3 rounded-md px-2.5 text-sm/6 font-medium font-sourcecodepro text-slate-800 hover:text-slate-800 hover:bg-brand-1-50 focus:bg-brand-1-950 focus:text-white focus:outline-0 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent items-start group my-4 py-4 relative">
                                  <div className="bg-brand-1-50 group-hover:bg-white group rounded-lg p-3">
                                      <svg className="sidebar-item-icon size-6 shrink-0 text-brand-1-700 " xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <path d="M12.37 2.15009L21.37 5.75006C21.72 5.89006 22 6.31006 22 6.68006V10.0001C22 10.5501 21.55 11.0001 21 11.0001H3C2.45 11.0001 2 10.5501 2 10.0001V6.68006C2 6.31006 2.28 5.89006 2.63 5.75006L11.63 2.15009C11.83 2.07009 12.17 2.07009 12.37 2.15009Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M22 22H2V19C2 18.45 2.45 18 3 18H21C21.55 18 22 18.45 22 19V22Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M4 18V11" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M8 18V11" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M12 18V11" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M16 18V11" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M20 18V11" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M1 22H23" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </div>
                                  <div>
                                      <h3 className="text-slate-950 text-lg leading-snug font-semibold font-montserrat">Government Fiscal Operations</h3>
                                      <p className="text-slate-600 text-base/6 font-normal font-baskervville max-w-md">A detailed overview of government revenue, expenditure, and fiscal performance.</p>
                                  </div>
                                  <span className="idebar-item-arrow absolute top-2/5 right-2" aria-hidden="true">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 15.2071C6.90237 14.8166 6.90237 14.1834 7.29289 13.7929L10.5858 10.5L7.29289 7.20711C6.90237 6.81658 6.90237 6.18342 7.29289 5.79289C7.68342 5.40237 8.31658 5.40237 8.70711 5.79289L12.7071 9.79289C13.0976 10.1834 13.0976 10.8166 12.7071 11.2071L8.70711 15.2071C8.31658 15.5976 7.68342 15.5976 7.29289 15.2071Z" fill="currentColor"/>
                                      </svg>
                                  </span>
                              </a>
                          </li>
                          <li className="border-t border-slate-600/10">
                              {/* <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" --> */}
                              <a href="#" className="sidebar-item flex gap-x-3 rounded-md px-2.5 text-sm/6 font-medium font-sourcecodepro text-slate-800 hover:text-slate-800 hover:bg-brand-1-50 focus:bg-brand-1-950 focus:text-white focus:outline-0 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent items-start group my-4 py-4 relative">
                                  <div className="bg-brand-1-50 group-hover:bg-white group rounded-lg p-3">
                                      <svg className="sidebar-item-icon size-6 shrink-0 text-brand-1-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <path d="M17.5401 8.30989C18.8987 8.30989 20.0001 7.20851 20.0001 5.84989C20.0001 4.49127 18.8987 3.38989 17.5401 3.38989C16.1814 3.38989 15.0801 4.49127 15.0801 5.84989C15.0801 7.20851 16.1814 8.30989 17.5401 8.30989Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M6.46001 8.30989C7.81863 8.30989 8.92 7.20851 8.92 5.84989C8.92 4.49127 7.81863 3.38989 6.46001 3.38989C5.10139 3.38989 4 4.49127 4 5.84989C4 7.20851 5.10139 8.30989 6.46001 8.30989Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M17.5401 20.6099C18.8987 20.6099 20.0001 19.5086 20.0001 18.1499C20.0001 16.7913 18.8987 15.6899 17.5401 15.6899C16.1814 15.6899 15.0801 16.7913 15.0801 18.1499C15.0801 19.5086 16.1814 20.6099 17.5401 20.6099Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M6.46001 20.6099C7.81863 20.6099 8.92 19.5086 8.92 18.1499C8.92 16.7913 7.81863 15.6899 6.46001 15.6899C5.10139 15.6899 4 16.7913 4 18.1499C4 19.5086 5.10139 20.6099 6.46001 20.6099Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </div>
                                  <div>
                                      <h3 className="text-slate-950 text-lg leading-snug font-semibold font-montserrat">The Macro Economy of Sri Lanka</h3>
                                      <p className="text-slate-600 text-base/6 font-normal font-baskervville max-w-md">Key indicators and trends shaping Sri Lanka’s economic landscape.</p>
                                  </div>
                                  <span className="idebar-item-arrow absolute top-2/5 right-2" aria-hidden="true">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 15.2071C6.90237 14.8166 6.90237 14.1834 7.29289 13.7929L10.5858 10.5L7.29289 7.20711C6.90237 6.81658 6.90237 6.18342 7.29289 5.79289C7.68342 5.40237 8.31658 5.40237 8.70711 5.79289L12.7071 9.79289C13.0976 10.1834 13.0976 10.8166 12.7071 11.2071L8.70711 15.2071C8.31658 15.5976 7.68342 15.5976 7.29289 15.2071Z" fill="currentColor"/>
                                      </svg>
                                  </span>
                              </a>
                          </li>
                          <li className="border-t border-slate-600/10">
                              {/* <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" --> */}
                              <a href="#" className="sidebar-item flex gap-x-3 rounded-md px-2.5 text-sm/6 font-medium font-sourcecodepro text-slate-800 hover:text-slate-800 hover:bg-brand-1-50 focus:bg-brand-1-950 focus:text-white focus:outline-0 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent items-start group my-4 py-4 relative">
                                  <div className="bg-brand-1-50 group-hover:bg-white group rounded-lg p-3">
                                      <svg className="sidebar-item-icon size-6 shrink-0 text-brand-1-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <path d="M8.16004 22C3.98004 22 3.14004 19.47 4.50004 16.39L8.75004 6.74H8.45004C7.80004 6.74 7.20004 6.48 6.77004 6.05C6.33004 5.62 6.07004 5.02 6.07004 4.37C6.07004 3.07 7.13004 2 8.44004 2H15.55C16.21 2 16.8 2.27 17.23 2.7C17.79 3.26 18.07 4.08 17.86 4.95C17.59 6.03 16.55 6.74 15.44 6.74H15.28L19.5 16.4C20.85 19.48 19.97 22 15.83 22H8.16004Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M5.93994 13.1201C5.93994 13.1201 8.99994 13.0001 11.9999 14.0001C14.9999 15.0001 17.8299 13.1101 17.8299 13.1101" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </div>
                                  <div>
                                      <h3 className="text-slate-950 text-lg leading-snug font-semibold font-montserrat">Transparency in Government Institutions</h3>
                                      <p className="text-slate-600 text-base/6 font-normal font-baskervville max-w-md">Data and insights that promote accountability in public institutions.</p>
                                  </div>
                                  <span className="idebar-item-arrow absolute top-2/5 right-2" aria-hidden="true">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 15.2071C6.90237 14.8166 6.90237 14.1834 7.29289 13.7929L10.5858 10.5L7.29289 7.20711C6.90237 6.81658 6.90237 6.18342 7.29289 5.79289C7.68342 5.40237 8.31658 5.40237 8.70711 5.79289L12.7071 9.79289C13.0976 10.1834 13.0976 10.8166 12.7071 11.2071L8.70711 15.2071C8.31658 15.5976 7.68342 15.5976 7.29289 15.2071Z" fill="currentColor"/>
                                      </svg>
                                  </span>
                              </a>
                          </li>
                          <li className="border-t border-slate-600/10">
                              {/* <!-- Current: "bg-gray-50 text-indigo-600", Default: "text-gray-700 hover:text-indigo-600 hover:bg-gray-50" --> */}
                              <a href="#" className="sidebar-item flex gap-x-3 rounded-md px-2.5 text-sm/6 font-medium font-sourcecodepro text-slate-800 hover:text-slate-800 hover:bg-brand-1-50 focus:bg-brand-1-950 focus:text-white focus:outline-0 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent items-start group my-4 py-4 relative">
                                  <div className="bg-brand-1-50 group-hover:bg-white group rounded-lg p-3">
                                      <svg className="sidebar-item-icon size-6 shrink-0 text-brand-1-700" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                          <path d="M13 22H5C3 22 2 21 2 19V11C2 9 3 8 5 8H10V19C10 21 11 22 13 22Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M10.11 4C10.03 4.3 10 4.63 10 5V8H5V6C5 4.9 5.9 4 7 4H10.11Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M14 8V13" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M18 8V13" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M17 17H15C14.45 17 14 17.45 14 18V22H18V18C18 17.45 17.55 17 17 17Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M6 13V17" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M10 19V5C10 3 11 2 13 2H19C21 2 22 3 22 5V19C22 21 21 22 19 22H13C11 22 10 21 10 19Z" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </div>
                                  <div>
                                      <h3 className="text-slate-950 text-lg leading-snug font-semibold font-montserrat">The Finances of SOE</h3>
                                      <p className="text-slate-600 text-base/6 font-normal font-baskervville max-w-md">Data and insights that promote accountability in public institutions.</p>
                                  </div>
                                  <span className="idebar-item-arrow absolute top-2/5 right-2" aria-hidden="true">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.29289 15.2071C6.90237 14.8166 6.90237 14.1834 7.29289 13.7929L10.5858 10.5L7.29289 7.20711C6.90237 6.81658 6.90237 6.18342 7.29289 5.79289C7.68342 5.40237 8.31658 5.40237 8.70711 5.79289L12.7071 9.79289C13.0976 10.1834 13.0976 10.8166 12.7071 11.2071L8.70711 15.2071C8.31658 15.5976 7.68342 15.5976 7.29289 15.2071Z" fill="currentColor"/>
                                      </svg>
                                  </span>
                              </a>
                          </li>
                      </ul>
                </nav>

                <div className="mt-8">
                      {/* <!-- Button --> */}
                                    <WhiteIconButton
                                      text="Go back home"
                                      link="/"
                                      icon={
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          viewBox="0 0 20 20"
                                          fill="none"
                                        >
                                          <path
                                            d="M12.025 4.94168L17.0834 10L12.025 15.0583"
                                            stroke="#4B5563"
                                            stroke-width="1.8"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M2.91669 10H16.9417"
                                            stroke="#4B5563"
                                            stroke-width="1.8"
                                            stroke-miterlimit="10"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      }
                                    />
                </div>

              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchAndResults;
