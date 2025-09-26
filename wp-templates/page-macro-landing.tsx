"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
export default function PageMacroLanding() {
  const pathname = usePathname();

  return (
    <main>
          {/* Secondary Navigation */}
          <div className="bg-white border-b border-slate-300">
            <div className="bg-white border-b border-slate-300">
              <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
                <SecondaryNav
                  className="!font-baskervville"
                  items={[
                    { label: "Macro Economy", href: "#" },
                    { label: "Government Fiscal Operations", href: "#" },
                    {
                      label: "Transparency in government Institutions",
                      href: (() => {
                        const params = new URLSearchParams();
                        // Define industry and year or get them from state/props if needed
                        const industry = ""; // Set default or fetch from state/props
                        const year = "";     // Set default or fetch from state/props
                        if (industry) params.set("industry", industry);
                        if (year) params.set("year", year);
                        const qs = params.toString();
                        return qs
                          ? `/transparency-dashboard?${qs}`
                          : "/transparency-dashboard";
                      })(),
                    },
                    {
                      label: "State Owned Enterprises",
                      href: (() => {
                        const params = new URLSearchParams();
                        const industry = ""; // Set default or fetch from state/props
                        const year = "";     // Set default or fetch from state/props
                        if (industry) params.set("industry", industry);
                        if (year) params.set("year", year);
                        const qs = params.toString();
                        return qs
                          ? `/state-owned-dashboard?${qs}`
                          : "/state-owned-dashboard";
                      })(),
                    },
                  ]}
                  activePath={pathname}
                />
              </div>
            </div>
          </div>
      
            {/* Hero */}
            <HeroWhite
              title="The Macro Economy of Sri Lanka"
              paragraph={` 
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam condimentum consequat mi. Maecenas congue enim non dui iaculis condimentum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Curabitur lobortis, mi et facilisis euismod, lacus ligula suscipit nibh, vitae blandit dui dolor vitae sapien. Fusce iaculis urna ligula, nec aliquet nisi consectetur euismod. Nunc dapibus dignissim nulla at tincidunt.`}
              items={[
                { label: "Dashboards", href: "/dashboard" },
                { label: "The Macro Economy of Sri Lanka" },
              ]}
            />

            {/* <!-- Card section --> */}
                <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-16 bg-white pb-12 md:pb-16 xl:pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                        {/* <!-- Column 1: 2 cards --> */}
                        <div className="lg:col-span-3 flex flex-col gap-5">
                            {/* <!-- Left Section 1 --> */}
                            <div className="relative">
                                {/* <!-- Background / Overlay --> */}
                                <div className="absolute inset-0 rounded-lg lg:rounded-tl-4xl shadow-lg"
                                    style={{
                                        background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), " +
                                                    "linear-gradient(0deg, rgba(235,26,82,0.5) 0%, rgba(235,26,82,0.5) 100%), " +
                                                    "url('/assets/images/card-imgs/mid-1.jpg') lightgray 50% / cover no-repeat"
                                    }}>
                                </div>


                                {/* <!-- Card content --> */}
                                <div className="relative flex h-full flex-col overflow-hidden rounded-tl-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                    <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0 relative z-10">
                                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
                                                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
                                                    text-sm xl:text-base font-semibold font-family-montserrat tracking-tight max-lg:text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M21 21.5H10C6.70017 21.5 5.05025 21.5 4.02513 20.4749C3 19.4497 3 17.7998 3 14.5V3.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M7 4.5H8" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M7 7.5H11" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M5 20.5C6.07093 18.553 7.52279 13.5189 10.3063 13.5189C12.2301 13.5189 12.7283 15.9717 14.6136 15.9717C17.8572 15.9717 17.387 10.5 21 10.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>Inflation</span>
                                        </div>

                                        <p className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-family-sourcecodepro max-lg:text-center">Consumer price index and inflation trends across key sectors</p>
                                    </div>
                                    <div className="@container relative min-h-45 w-full grow max-lg:mx-auto max-lg:max-w-sm z-10">
                                        <div className="absolute bottom-0 overflow-hidden flex items-start justify-start px-6 pt-8 pb-8 sm:px-6 sm:py-10">
                                            <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline uppercase">
                                                <span>Open Dashboard</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94165L17.0837 9.99998L12.0254 15.0583" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.9165 10H16.9415" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </a>
                                        </div>

                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-tl-4xl"></div>
                            </div>

                            {/* <!-- Left Section 2 --> */}
                            <div className="relative">
                                {/* <!-- Background / Overlay --> */}
                                <div className="absolute inset-0 rounded-lg lg:rounded-bl-4xl shadow-lg"
                                    style={{
                                        background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), " +
                                                    "linear-gradient(0deg, rgba(235,26,82,0.5) 0%, rgba(235,26,82,0.5) 100%), " +
                                                    "url('/assets/images/card-imgs/mid-1.jpg') lightgray 50% / cover no-repeat"
                                    }}>
                                </div>

                                {/* <!-- Card content --> */}
                                <div className="relative flex h-full flex-col overflow-hidden rounded-tl-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                                    <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0 relative z-10">
                                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
                                                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
                                                    text-sm xl:text-base font-semibold font-family-montserrat tracking-tight max-lg:text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M14.5 11C14.5 12.3807 13.3807 13.5 12 13.5C10.6192 13.5 9.5 12.3807 9.5 11C9.5 9.61929 10.6192 8.5 12 8.5C13.3807 8.5 14.5 9.61929 14.5 11Z" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M22 11V5.92705C22 5.35889 21.6756 4.84452 21.1329 4.67632C20.1903 4.38421 18.4794 4 16 4C11.4209 4 10.1967 5.67747 3.87798 4.42361C2.92079 4.23366 2 4.94531 2 5.92116V15.9382C2 16.6265 2.47265 17.231 3.1448 17.3792C8.71199 18.6069 10.5572 17.6995 13.5 17.2859" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2 8C3.95133 8 5.70483 6.40507 5.92901 4.75417M18.5005 4.5C18.5005 6.53964 20.2655 8.46899 22 8.46899M6.00049 17.4961C6.00049 15.287 4.20963 13.4961 2.00049 13.4961" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M16 16C16 15.4477 16.4477 15 17 15H22L20.5 13M22 18C22 18.5523 21.5523 19 21 19H16L17.5 21" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>Foreign Exchange</span>
                                        </div>

                                        <p className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-family-sourcecodepro max-lg:text-center">USD/LKR exchange rates and currency market analysis</p>
                                    </div>
                                    <div className="@container relative min-h-45 w-full grow max-lg:mx-auto max-lg:max-w-sm z-10">
                                        <div className="absolute bottom-0 overflow-hidden flex items-start justify-start px-6 pt-8 pb-8 sm:px-6 sm:py-10">
                                            <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline uppercase">
                                                <span>Open Dashboard</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94165L17.0837 9.99998L12.0254 15.0583" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.9165 10H16.9415" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </a>
                                        </div>

                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-bl-4xl"></div>
                            </div>

                        </div>

                        {/* <!-- Column 2: 3 cards --> */}
                        <div className="lg:col-span-6 flex flex-col gap-5">
                            {/* <!-- Middle Section 1 --> */}
                            <div className="relative">
                                {/* <!-- Background / Overlay --> */}
                                <div className="absolute inset-0 rounded-lg shadow-lg"
                                    style={{
                                        background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), " +
                                                    "linear-gradient(0deg, rgba(235,26,82,0.5) 0%, rgba(235,26,82,0.5) 100%), " +
                                                    "url('/assets/images/card-imgs/mid-1.jpg') lightgray 50% / cover no-repeat"
                                    }}>
                                </div>

                                {/* <!-- Card content --> */}
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] z-10">
                                    <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0">
                                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
                                                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
                                                    text-sm xl:text-base font-semibold font-family-montserrat tracking-tight max-lg:text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M15.5 13.5C19.0899 13.5 22 12.6046 22 11.5C22 10.3954 19.0899 9.5 15.5 9.5C11.9101 9.5 9 10.3954 9 11.5C9 12.6046 11.9101 13.5 15.5 13.5Z" stroke="#F8FAFC" stroke-width="1.5"/>
                                                <path d="M22 16C22 17.1046 19.0899 18 15.5 18C11.9101 18 9 17.1046 9 16" stroke="#F8FAFC" stroke-width="1.5"/>
                                                <path d="M22 11.5V20.3C22 21.515 19.0899 22.5 15.5 22.5C11.9101 22.5 9 21.515 9 20.3V11.5" stroke="#F8FAFC" stroke-width="1.5"/>
                                                <path d="M8.5 6.5C12.0899 6.5 15 5.60457 15 4.5C15 3.39543 12.0899 2.5 8.5 2.5C4.91015 2.5 2 3.39543 2 4.5C2 5.60457 4.91015 6.5 8.5 6.5Z" stroke="#F8FAFC" stroke-width="1.5"/>
                                                <path d="M6 11.5C4.10819 11.2698 2.36991 10.6745 2 9.5M6 16.5C4.10819 16.2698 2.36991 15.6745 2 14.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M6 21.5C4.10819 21.2698 2.36991 20.6745 2 19.5V4.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M15 6.5V4.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                            </svg>
                                            <span>Foreign Reserves</span>
                                        </div>

                                        <p className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-family-sourcecodepro max-lg:text-center">
                                            Central bank reserves and foreign currency holdings
                                        </p>
                                    </div>

                                    <div className="px-6 py-8 sm:px-6 sm:py-10 flex items-start gap-2">
                                        <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline uppercase">
                                            <span>Open Dashboard</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94165L17.0837 9.99998L12.0254 15.0583" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.9165 10H16.9415" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl"></div>
                            </div>

                            {/* <!-- Middle Section 2--> */}
                            <div className="relative">
                                {/* <!-- Background / Overlay --> */}
                                    <div className="absolute inset-0 rounded-lg shadow-lg"
                                    style={{
                                        background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), " +
                                                    "linear-gradient(0deg, rgba(235,26,82,0.5) 0%, rgba(235,26,82,0.5) 100%), " +
                                                    "url('/assets/images/card-imgs/mid-1.jpg') lightgray 50% / cover no-repeat"
                                    }}>
                                </div>

                                {/* <!-- Card content --> */}
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] z-10">
                                    <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0">
                                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
                                                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
                                                    text-sm xl:text-base font-semibold font-family-montserrat tracking-tight max-lg:text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M8 16.5L16 8.5M10 9.5C10 10.0523 9.55228 10.5 9 10.5C8.44772 10.5 8 10.0523 8 9.5C8 8.94772 8.44772 8.5 9 8.5C9.55228 8.5 10 8.94772 10 9.5ZM16 15.3284C16 15.8807 15.5523 16.3284 15 16.3284C14.4477 16.3284 14 15.8807 14 15.3284C14 14.7761 14.4477 14.3284 15 14.3284C15.5523 14.3284 16 14.7761 16 15.3284Z" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="#F8FAFC" stroke-width="1.5"/>
                                            </svg>
                                            <span>Interest Rates</span>
                                        </div>

                                        <p className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-family-sourcecodepro max-lg:text-center">
                                            Central bank policy rates and lending benchmarks
                                        </p>
                                    </div>

                                    <div className="px-6 py-8 sm:px-6 sm:py-10 flex items-start gap-2">
                                        <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline uppercase">
                                            <span>Open Dashboard</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94165L17.0837 9.99998L12.0254 15.0583" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.9165 10H16.9415" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl"></div>
                            </div>

                            {/* <!-- Middle Section 3--> */}
                            <div className="relative">
                                {/* <!-- Background / Overlay --> */}
                                <div className="absolute inset-0 rounded-lg shadow-lg"
                                    style={{
                                        background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), " +
                                                    "linear-gradient(0deg, rgba(235,26,82,0.5) 0%, rgba(235,26,82,0.5) 100%), " +
                                                    "url('/assets/images/card-imgs/mid-1.jpg') lightgray 50% / cover no-repeat"
                                    }}>
                                </div>

                                {/* <!-- Card content --> */}
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)] z-10">
                                    <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0">
                                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
                                                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
                                                    text-sm xl:text-base font-semibold font-family-montserrat tracking-tight max-lg:text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M21 21.5H10C6.70017 21.5 5.05025 21.5 4.02513 20.4749C3 19.4497 3 17.7998 3 14.5V3.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M7.99707 17.499C11.5286 17.499 18.9122 16.0348 18.6979 6.93269M16.4886 8.54302L18.3721 6.64612C18.5656 6.45127 18.8798 6.44981 19.0751 6.64286L20.9971 8.54302" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>GDP Growth</span>
                                        </div>

                                        <p className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-family-sourcecodepro max-lg:text-center">
                                            Gross domestic product growth and economic output
                                        </p>
                                    </div>

                                    <div className="px-6 py-8 sm:px-6 sm:py-10 flex items-start gap-2">
                                        <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline uppercase">
                                            <span>Open Dashboard</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94165L17.0837 9.99998L12.0254 15.0583" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.9165 10H16.9415" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 max-lg:rounded-t-4xl"></div>
                            </div>

                        </div>

                        {/* <!-- Column 3: 2 cards --> */}
                        <div className="lg:col-span-3 flex flex-col gap-5">
                            {/* <!-- Right Section 1--> */}
                            <div className="relative">
                                {/* <!-- Background / Overlay --> */}
                                <div
                                    className="absolute inset-0 rounded-lg lg:rounded-tr-4xl shadow-lg"
                                    style={{
                                        background:
                                            "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), " +
                                            "linear-gradient(0deg, rgba(235,26,82,0.5) 0%, rgba(235,26,82,0.5) 100%), " +
                                            "url('/assets/images/card-imgs/right-1.jpg') lightgray 50% / cover no-repeat"
                                    }}
                                >
                                </div>

                                {/* <!-- Card content --> */}
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                    <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0 relative z-10">
                                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
                                                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
                                                    text-sm xl:text-base font-semibold font-family-montserrat tracking-tight max-lg:text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M2 9.06907C2 7.87289 2.48238 7.13982 3.48063 6.58428L7.58987 4.29744C9.7431 3.09915 10.8197 2.5 12 2.5C13.1803 2.5 14.2569 3.09915 16.4101 4.29744L20.5194 6.58428C21.5176 7.13982 22 7.8729 22 9.06907C22 9.39343 22 9.55561 21.9646 9.68894C21.7785 10.3895 21.1437 10.5 20.5307 10.5H3.46928C2.85627 10.5 2.22152 10.3894 2.03542 9.68894C2 9.55561 2 9.39343 2 9.06907Z" stroke="#F8FAFC" stroke-width="1.5"/>
                                                <path d="M11.9961 7.5H12.0051" stroke="#F8FAFC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M4 10.5V19M8 10.5V19" stroke="#F8FAFC" stroke-width="1.5"/>
                                                <path d="M16 10.5V19M20 10.5V19" stroke="#F8FAFC" stroke-width="1.5"/>
                                                <path d="M19 19H5C3.34315 19 2 20.3431 2 22C2 22.2761 2.22386 22.5 2.5 22.5H21.5C21.7761 22.5 22 22.2761 22 22C22 20.3431 20.6569 19 19 19Z" stroke="#F8FAFC" stroke-width="1.5"/>
                                            </svg>
                                            <span>National Debt</span>
                                        </div>

                                        <p className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-family-sourcecodepro max-lg:text-center">Government debt levels and debt-to-GDP ratios</p>
                                    </div>
                                    <div className="@container relative min-h-51 w-full grow max-lg:mx-auto max-lg:max-w-sm z-10">
                                        <div className="absolute bottom-0 overflow-hidden flex items-start justify-start px-6 pt-8 pb-8 sm:px-6 sm:py-10">
                                            <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline uppercase">
                                                <span>Open Dashboard</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94165L17.0837 9.99998L12.0254 15.0583" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.9165 10H16.9415" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </a>
                                        </div>

                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-tr-4xl"></div>
                            </div> 

                            {/* <!-- Right Section 2--> */}
                            <div className="relative">
                                {/* <!-- Background / Overlay --> */}
                                <div className="absolute inset-0 rounded-lg lg:rounded-br-4xl shadow-lg"
                                    style={{
                                        background: "linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.5) 100%), " +
                                                    "linear-gradient(0deg, rgba(235,26,82,0.5) 0%, rgba(235,26,82,0.5) 100%), " +
                                                    "url('/assets/images/card-imgs/mid-1.jpg') lightgray 50% / cover no-repeat"
                                    }}>
                                </div>

                                {/* <!-- Card content --> */}
                                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                                    <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0 relative z-10">
                                        <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
                                                    bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
                                                    text-sm xl:text-base font-semibold font-family-montserrat tracking-tight max-lg:text-center">
                                            {/* <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                                <path d="M21 21.5H10C6.70017 21.5 5.05025 21.5 4.02513 20.4749C3 19.4497 3 17.7998 3 14.5V3.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M7 4.5H8" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M7 7.5H11" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round"/>
                                                <path d="M5 20.5C6.07093 18.553 7.52279 13.5189 10.3063 13.5189C12.2301 13.5189 12.7283 15.9717 14.6136 15.9717C17.8572 15.9717 17.387 10.5 21 10.5" stroke="#F8FAFC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg> --> */}
                                            <img src="<?php echo get_template_directory_uri(); ?>/assets/images/card-imgs/briefcase.png" alt="briefcase icon" className="w-6 h-6" />
                                            <span>Unemployment</span>
                                        </div>

                                        <p className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-family-sourcecodepro max-lg:text-center">Labor market statistics and employment trends</p>
                                    </div>
                                    <div className="@container relative min-h-51 w-full grow max-lg:mx-auto max-lg:max-w-sm z-10">
                                        <div className="absolute bottom-0 overflow-hidden flex items-start justify-start px-6 pt-8 pb-8 sm:px-6 sm:py-10">
                                            <a href="#" className="flex items-center gap-2 text-white font-medium hover:underline uppercase">
                                                <span>Open Dashboard</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path d="M12.0254 4.94165L17.0837 9.99998L12.0254 15.0583" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M2.9165 10H16.9415" stroke="#F8FAFC" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                                </svg>
                                            </a>
                                        </div>

                                    </div>
                                </div>

                                <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 lg:rounded-br-4xl"></div>
                            </div> 

                        </div>

                    </div>
                </div>
            {/* Card section End */}
            </main>
  );
}     
