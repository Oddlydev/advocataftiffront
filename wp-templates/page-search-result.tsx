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
              {/* {filteredResults.map((item) => (
                <CardType6
                  key={item.id}
                  title={item.title}
                  excerpt={item.desc}
                  imageUrl={item.imageUrl ?? undefined} 
                  postDate={item.date}
                  uri={item.uri ?? "#"}
                  categories={item.categories ?? []}
                />

              ))} */}
                  <div className="h-full">
                    <div
                      className={[
                        "relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg bg-white border border-slate-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1.5",
                        "transition-all duration-500 ease-in-out",
                        "focus:border-gray-300 focus:bg-gray-50 focus:shadow-inner-lg",
                        "card card-type-6",
                      ].join(" ")}
                    >
                      <div className="card-body flex flex-1 flex-col justify-between bg-white px-6 py-5">
                        <div className="flex-1">
                          <div>
                            {/* Title with permalink only — mirrors CardType5 pattern */}
                            <h2 className="mt-2 text-2xl leading-snug font-semibold font-montserrat text-slate-800 transition-colors duration-500 ease-in-out">TESLA Stock Data 2024</h2>

                            <div className="mt-2 text-base/6 font-normal font-sourcecodepro text-slate-600 line-clamp-3 transition-colors duration-500 ease-in-out">
                              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi quos libero mollitia neque officia culpa quaerat quasi repellat, laudantium aperiam architecto commodi. Beatae cupiditate similique at earum dicta cum rerum.
                            </div>
                          </div>
                        </div>

                        <div className="card-footer mt-6 flex items-center justify-between">
                          <div className="date-info flex justify-between w-full items-center space-x-1 text-xs/tight font-medium font-sourcecodepro text-slate-600">

                            {/* <!-- Left section --> */}
                            <div className="pdf-btn flex items-start md:items-center space-x-1.5 text-sm leading-snug font-medium font-sourcecodepro text-slate-600">
                                  <svg className="pdf-icon mt-1 md:mt-0 size-6 fill-slate-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.04039 17.5885H14.9719C15.1626 17.5885 15.3264 17.5201 15.4634 17.3832C15.6006 17.2464 15.6691 17.0817 15.6691 16.889C15.6691 16.6963 15.6006 16.5316 15.4634 16.3947C15.3264 16.2579 15.1626 16.1895 14.9719 16.1895H9.04039C8.84606 16.1895 8.68131 16.2582 8.54614 16.3957C8.41081 16.5332 8.34314 16.6977 8.34314 16.889C8.34314 17.0802 8.41081 17.2445 8.54614 17.382C8.68131 17.5197 8.84606 17.5885 9.04039 17.5885ZM9.04039 13.6287H14.9719C15.1626 13.6287 15.3264 13.5603 15.4634 13.4235C15.6006 13.2867 15.6691 13.1219 15.6691 12.9292C15.6691 12.7367 15.6006 12.572 15.4634 12.435C15.3264 12.2982 15.1626 12.2297 14.9719 12.2297H9.04039C8.84606 12.2297 8.68131 12.2986 8.54614 12.4362C8.41081 12.5737 8.34314 12.7381 8.34314 12.9292C8.34314 13.1206 8.41081 13.285 8.54614 13.4225C8.68131 13.56 8.84606 13.6287 9.04039 13.6287ZM6.38639 21.298C5.91372 21.298 5.51147 21.1321 5.17964 20.8002C4.84764 20.4682 4.68164 20.066 4.68164 19.5935V4.4065C4.68164 3.934 4.84764 3.53175 5.17964 3.19975C5.51147 2.86791 5.91439 2.702 6.38839 2.702H13.5421C13.7688 2.702 13.9869 2.74541 14.1964 2.83224C14.4057 2.91908 14.5909 3.04116 14.7519 3.1985L18.8084 7.24875C18.9694 7.40925 19.0946 7.595 19.1839 7.806C19.2734 8.01716 19.3181 8.23691 19.3181 8.46525V19.5912C19.3181 20.0652 19.1521 20.4682 18.8201 20.8002C18.4883 21.1321 18.0861 21.298 17.6134 21.298H6.38639ZM13.5604 7.60375V4.10099H6.38839C6.31139 4.10099 6.24089 4.133 6.17689 4.197C6.11272 4.26116 6.08064 4.33174 6.08064 4.40874V19.5912C6.08064 19.6682 6.11272 19.7388 6.17689 19.803C6.24089 19.867 6.31139 19.899 6.38839 19.899H17.6114C17.6884 19.899 17.7589 19.867 17.8229 19.803C17.8871 19.7388 17.9191 19.6682 17.9191 19.5912V8.4595H14.4164C14.1772 8.4595 13.9748 8.37666 13.8091 8.211C13.6433 8.04533 13.5604 7.84291 13.5604 7.60375Z" fill="currentColor"/>
                                  </svg>
                                  <span>csv,json,xml,excel</span>
                            </div>
                          
                            {/* Right section */}
                            <time className="text-xs/tight font-medium font-sourcecodepro text-slate-600">
                              2025-08-28
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full">
                    <div
                      className={[
                        "relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg bg-white border border-slate-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1.5",
                        "transition-all duration-500 ease-in-out",
                        "focus:border-gray-300 focus:bg-gray-50 focus:shadow-inner-lg",
                        "card card-type-6",
                      ].join(" ")}
                    >
                      <div className="card-body flex flex-1 flex-col justify-between bg-white px-6 py-5">
                        <div className="flex-1">
                          <div>
                            {/* Title with permalink only — mirrors CardType5 pattern */}
                            <h2 className="mt-2 text-2xl leading-snug font-semibold font-montserrat text-slate-800 transition-colors duration-500 ease-in-out">TESLA Stock Data 2024</h2>

                            <div className="mt-2 text-base/6 font-normal font-sourcecodepro text-slate-600 line-clamp-3 transition-colors duration-500 ease-in-out">
                              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi quos libero mollitia neque officia culpa quaerat quasi repellat, laudantium aperiam architecto commodi. Beatae cupiditate similique at earum dicta cum rerum.
                            </div>
                          </div>
                        </div>

                        <div className="card-footer mt-6 flex items-center justify-between">
                          <div className="date-info flex justify-between w-full items-center space-x-1 text-xs/tight font-medium font-sourcecodepro text-slate-600">

                            {/* <!-- Left section --> */}
                            <div className="pdf-btn flex items-start md:items-center space-x-1.5 text-sm leading-snug font-medium font-sourcecodepro text-slate-600">
                                  <svg className="pdf-icon mt-1 md:mt-0 size-6 fill-slate-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.04039 17.5885H14.9719C15.1626 17.5885 15.3264 17.5201 15.4634 17.3832C15.6006 17.2464 15.6691 17.0817 15.6691 16.889C15.6691 16.6963 15.6006 16.5316 15.4634 16.3947C15.3264 16.2579 15.1626 16.1895 14.9719 16.1895H9.04039C8.84606 16.1895 8.68131 16.2582 8.54614 16.3957C8.41081 16.5332 8.34314 16.6977 8.34314 16.889C8.34314 17.0802 8.41081 17.2445 8.54614 17.382C8.68131 17.5197 8.84606 17.5885 9.04039 17.5885ZM9.04039 13.6287H14.9719C15.1626 13.6287 15.3264 13.5603 15.4634 13.4235C15.6006 13.2867 15.6691 13.1219 15.6691 12.9292C15.6691 12.7367 15.6006 12.572 15.4634 12.435C15.3264 12.2982 15.1626 12.2297 14.9719 12.2297H9.04039C8.84606 12.2297 8.68131 12.2986 8.54614 12.4362C8.41081 12.5737 8.34314 12.7381 8.34314 12.9292C8.34314 13.1206 8.41081 13.285 8.54614 13.4225C8.68131 13.56 8.84606 13.6287 9.04039 13.6287ZM6.38639 21.298C5.91372 21.298 5.51147 21.1321 5.17964 20.8002C4.84764 20.4682 4.68164 20.066 4.68164 19.5935V4.4065C4.68164 3.934 4.84764 3.53175 5.17964 3.19975C5.51147 2.86791 5.91439 2.702 6.38839 2.702H13.5421C13.7688 2.702 13.9869 2.74541 14.1964 2.83224C14.4057 2.91908 14.5909 3.04116 14.7519 3.1985L18.8084 7.24875C18.9694 7.40925 19.0946 7.595 19.1839 7.806C19.2734 8.01716 19.3181 8.23691 19.3181 8.46525V19.5912C19.3181 20.0652 19.1521 20.4682 18.8201 20.8002C18.4883 21.1321 18.0861 21.298 17.6134 21.298H6.38639ZM13.5604 7.60375V4.10099H6.38839C6.31139 4.10099 6.24089 4.133 6.17689 4.197C6.11272 4.26116 6.08064 4.33174 6.08064 4.40874V19.5912C6.08064 19.6682 6.11272 19.7388 6.17689 19.803C6.24089 19.867 6.31139 19.899 6.38839 19.899H17.6114C17.6884 19.899 17.7589 19.867 17.8229 19.803C17.8871 19.7388 17.9191 19.6682 17.9191 19.5912V8.4595H14.4164C14.1772 8.4595 13.9748 8.37666 13.8091 8.211C13.6433 8.04533 13.5604 7.84291 13.5604 7.60375Z" fill="currentColor"/>
                                  </svg>
                                  <span>csv,json,xml,excel</span>
                            </div>
                          
                            {/* Right section */}
                            <time className="text-xs/tight font-medium font-sourcecodepro text-slate-600">
                              2025-08-28
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-full">
                    <div
                      className={[
                        "relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg bg-white border border-slate-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1.5",
                        "transition-all duration-500 ease-in-out",
                        "focus:border-gray-300 focus:bg-gray-50 focus:shadow-inner-lg",
                        "card card-type-6",
                      ].join(" ")}
                    >
                      <div className="card-body flex flex-1 flex-col justify-between bg-white px-6 py-5">
                        <div className="flex-1">
                          <div>
                            {/* Title with permalink only — mirrors CardType5 pattern */}
                            <h2 className="mt-2 text-2xl leading-snug font-semibold font-montserrat text-slate-800 transition-colors duration-500 ease-in-out">TESLA Stock Data 2024</h2>

                            <div className="mt-2 text-base/6 font-normal font-sourcecodepro text-slate-600 line-clamp-3 transition-colors duration-500 ease-in-out">
                              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi quos libero mollitia neque officia culpa quaerat quasi repellat, laudantium aperiam architecto commodi. Beatae cupiditate similique at earum dicta cum rerum.
                            </div>
                          </div>
                        </div>

                        <div className="card-footer mt-6 flex items-center justify-between">
                          <div className="date-info flex justify-between w-full items-center space-x-1 text-xs/tight font-medium font-sourcecodepro text-slate-600">

                            {/* <!-- Left section --> */}
                            <div className="pdf-btn flex items-start md:items-center space-x-1.5 text-sm leading-snug font-medium font-sourcecodepro text-slate-600">
                                  <svg className="pdf-icon mt-1 md:mt-0 size-6 fill-slate-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.04039 17.5885H14.9719C15.1626 17.5885 15.3264 17.5201 15.4634 17.3832C15.6006 17.2464 15.6691 17.0817 15.6691 16.889C15.6691 16.6963 15.6006 16.5316 15.4634 16.3947C15.3264 16.2579 15.1626 16.1895 14.9719 16.1895H9.04039C8.84606 16.1895 8.68131 16.2582 8.54614 16.3957C8.41081 16.5332 8.34314 16.6977 8.34314 16.889C8.34314 17.0802 8.41081 17.2445 8.54614 17.382C8.68131 17.5197 8.84606 17.5885 9.04039 17.5885ZM9.04039 13.6287H14.9719C15.1626 13.6287 15.3264 13.5603 15.4634 13.4235C15.6006 13.2867 15.6691 13.1219 15.6691 12.9292C15.6691 12.7367 15.6006 12.572 15.4634 12.435C15.3264 12.2982 15.1626 12.2297 14.9719 12.2297H9.04039C8.84606 12.2297 8.68131 12.2986 8.54614 12.4362C8.41081 12.5737 8.34314 12.7381 8.34314 12.9292C8.34314 13.1206 8.41081 13.285 8.54614 13.4225C8.68131 13.56 8.84606 13.6287 9.04039 13.6287ZM6.38639 21.298C5.91372 21.298 5.51147 21.1321 5.17964 20.8002C4.84764 20.4682 4.68164 20.066 4.68164 19.5935V4.4065C4.68164 3.934 4.84764 3.53175 5.17964 3.19975C5.51147 2.86791 5.91439 2.702 6.38839 2.702H13.5421C13.7688 2.702 13.9869 2.74541 14.1964 2.83224C14.4057 2.91908 14.5909 3.04116 14.7519 3.1985L18.8084 7.24875C18.9694 7.40925 19.0946 7.595 19.1839 7.806C19.2734 8.01716 19.3181 8.23691 19.3181 8.46525V19.5912C19.3181 20.0652 19.1521 20.4682 18.8201 20.8002C18.4883 21.1321 18.0861 21.298 17.6134 21.298H6.38639ZM13.5604 7.60375V4.10099H6.38839C6.31139 4.10099 6.24089 4.133 6.17689 4.197C6.11272 4.26116 6.08064 4.33174 6.08064 4.40874V19.5912C6.08064 19.6682 6.11272 19.7388 6.17689 19.803C6.24089 19.867 6.31139 19.899 6.38839 19.899H17.6114C17.6884 19.899 17.7589 19.867 17.8229 19.803C17.8871 19.7388 17.9191 19.6682 17.9191 19.5912V8.4595H14.4164C14.1772 8.4595 13.9748 8.37666 13.8091 8.211C13.6433 8.04533 13.5604 7.84291 13.5604 7.60375Z" fill="currentColor"/>
                                  </svg>
                                  <span>csv,json,xml,excel</span>
                            </div>
                          
                            {/* Right section */}
                            <time className="text-xs/tight font-medium font-sourcecodepro text-slate-600">
                              2025-08-28
                            </time>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
    
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
