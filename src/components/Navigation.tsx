import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { HEADER_MENU_QUERY } from "@/queries/MenuQueries";
import searchClient from "../lib/algolia";

export type HeaderNavProps = {
  /** Brand logo URL */
  logoSrc: string;
  /** Background image used inside the dashboard dropdown */
  navDropdownImage: string;
  /** Optional callback when a search is submitted */
  onSearch?: (query: string) => void;
  /** Optional className to style the surrounding header wrapper */
  className?: string;
  /** Optional: override site URL for logo redirect */
  siteUrl?: string;
};

const SidebarItem: React.FC<{
  href?: string;
  icon: React.ReactNode;
  label: string;
}> = ({ href = "#", icon, label }) => (
  <a
    href={href}
    className="sidebar-item items-center flex gap-x-3 rounded-md py-2 px-2.5 text-sm/6 font-medium font-sourcecodepro text-slate-800 hover:text-slate-800 hover:bg-brand-1-50 focus:bg-brand-1-950 focus:text-white focus:outline-0 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent group"
  >
    {/* <span className="sidebar-item-icon size-6 shrink-0">{icon}</span> */}
    {label}
  </a>
);

const SearchForm: React.FC<{
  id?: string;
  initialHidden?: boolean;
  widthClass?: string;
  alignClass?: string;
}> = ({ id, initialHidden = true, widthClass = "w-64", alignClass = "" }) => {
  const [open, setOpen] = useState(!initialHidden);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  const indexName = "wp_searchable_posts";

  // Close when clicking outside
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  // 🔎 Algolia search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const { hits } = await searchClient.searchSingleIndex({
          indexName,
          searchParams: { query, hitsPerPage: 5 },
        });
        setResults(hits as any[]);
      } catch (err) {
        console.error("Algolia search error:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div ref={ref} className="relative w-full">
      <button
        aria-expanded={open}
        aria-controls={id}
        className="search-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {/* Magnifier icon */}
        <svg
          className="w-4 h-4 lg:w-6 lg:h-6 text-slate-50"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M21 21L16.65 16.65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Search box */}
      <form
        id={id}
        role="search"
        className={`${alignClass} ${open ? "" : "hidden"} absolute`}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <input
            className={`${widthClass} pr-10 px-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-400 border border-gray-300 shadow-sm 
      focus:border-[#9B195F] focus:outline-none focus:ring-1 focus:ring-[#9B195F]`}
            type="search"
            name="s"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 21L16.65 16.65"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dropdown results */}
          {results.length > 0 && (
            <ul className="absolute top-full left-0 mt-2 w-full max-h-60 overflow-y-auto shadow-lg rounded-md z-50 bg-brand-black text-white">
              {results.map((hit) => (
                <li
                  key={hit.objectID}
                  className="p-3 border-b border-gray-700 hover:bg-gray-800"
                >
                  <a href={hit.permalink} className="block text-white">
                    <strong>{hit.post_title}</strong>
                    <p className="text-sm text-gray-400">{hit.post_excerpt}</p>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </div>
  );
};

type MenuItem = {
  id: string;
  label: string;
  uri?: string | null;
  path?: string | null;
  parentId?: string | null;
};

// Icons used in the dashboard dropdown, preserved from the original design
const dashboardIcons: React.ReactNode[] = [
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M12.37 2.15003L21.37 5.75C21.72 5.89 22 6.31 22 6.68V10C22 10.55 21.55 11 21 11H3C2.45 11 2 10.55 2 10V6.68C2 6.31 2.28 5.89 2.63 5.75L11.63 2.15003C11.83 2.07003 12.17 2.07003 12.37 2.15003Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 22H2V19C2 18.45 2.45 18 3 18H21C21.55 18 22 18.45 22 19V22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 18V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 18V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 18V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16 18V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 18V11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 22H23"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8.5C12.8284 8.5 13.5 7.82843 13.5 7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7C10.5 7.82843 11.1716 8.5 12 8.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M17.54 8.31001C18.8986 8.31001 20 7.20863 20 5.85001C20 4.49139 18.8986 3.39001 17.54 3.39001C16.1814 3.39001 15.08 4.49139 15.08 5.85001C15.08 7.20863 16.1814 8.31001 17.54 8.31001Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.46001 8.31001C7.81863 8.31001 8.92 7.20863 8.92 5.85001C8.92 4.49139 7.81863 3.39001 6.46001 3.39001C5.10139 3.39001 4 4.49139 4 5.85001C4 7.20863 5.10139 8.31001 6.46001 8.31001Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.54 20.61C18.8986 20.61 20 19.5086 20 18.15C20 16.7914 18.8986 15.69 17.54 15.69C16.1814 15.69 15.08 16.7914 15.08 18.15C15.08 19.5086 16.1814 20.61 17.54 20.61Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.46001 20.61C7.81863 20.61 8.92 19.5086 8.92 18.15C8.92 16.7914 7.81863 15.69 6.46001 15.69C5.10139 15.69 4 16.7914 4 18.15C4 19.5086 5.10139 20.61 6.46001 20.61Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M8.15998 22C3.97998 22 3.13998 19.47 4.49998 16.39L8.74998 6.74H8.44998C7.79998 6.74 7.19998 6.48 6.76998 6.05C6.32998 5.62 6.06998 5.02 6.06998 4.37C6.06998 3.07 7.12998 2 8.43998 2H15.55C16.21 2 16.8 2.27 17.23 2.7C17.79 3.26 18.07 4.08 17.86 4.95C17.59 6.03 16.55 6.74 15.44 6.74H15.28L19.5 16.4C20.85 19.48 19.97 22 15.83 22H8.15998Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.94 13.12C5.94 13.12 9 13 12 14C15 15 17.83 13.11 17.83 13.11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M13 22H5C3 22 2 21 2 19V11C2 9 3 8 5 8H10V19C10 21 11 22 13 22Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.11 4C10.03 4.3 10 4.63 10 5V8H5V6C5 4.9 5.9 4 7 4H10.11Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 8V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 8V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 17H15C14.45 17 14 17.45 14 18V22H18V18C18 17.45 17.55 17 17 17Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 13V17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 19V5C10 3 11 2 13 2H19C21 2 22 3 22 5V19C22 21 21 22 19 22H13C11 22 10 21 10 19Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
];

const DashboardDropdown: React.FC<{ imageUrl: string; items?: MenuItem[] }> = ({
  imageUrl,
  items = [],
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        className="dropdown-btn nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase text-slate-50 opacity-[.6] py-2.5 px-3.5 rounded-md hover:bg-white/10 hover:text-brand-white hover:font-medium focus:font-medium focus:outline-none flex items-center"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        Dashboard
        <svg
          className="ml-1 w-3 h-3 text-slate-50"
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="6"
          viewBox="0 0 12 6"
          fill="none"
        >
          <path
            d="M5.99758 4.38275L10.0506 0.329999C10.1806 0.199833 10.3398 0.133166 10.5283 0.129999C10.7168 0.126666 10.8819 0.193332 11.0236 0.329999C11.1652 0.466499 11.2382 0.628666 11.2423 0.8165C11.2465 1.00433 11.1762 1.16908 11.0313 1.31075L6.59758 5.74425C6.51224 5.83275 6.41974 5.8975 6.32008 5.9385C6.22041 5.9795 6.11291 6 5.99758 6C5.88224 6 5.77474 5.9795 5.67508 5.9385C5.57541 5.8975 5.48133 5.83275 5.39283 5.74425L0.959076 1.31075C0.823909 1.17542 0.756742 1.01225 0.757576 0.82125C0.758576 0.63025 0.829909 0.466499 0.971576 0.329999C1.11324 0.193333 1.27674 0.125 1.46208 0.125C1.64724 0.125 1.80808 0.193333 1.94458 0.329999L5.99758 4.38275Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <div
        className={`${open ? "" : "hidden"} dropdown-menu absolute space-y-2 grid px-3 py-3 -left-60 mt-2 w-2xl bg-white border-0 rounded-md shadow-lg`}
        role="menu"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-slate-600 capitalize font-medium font-montserrat text-sm/5">
              dashboards
            </span>
            <nav
              className="sidebar-fill flex flex-1 flex-col"
              aria-label="Sidebar"
            >
              <ul role="list" className="-mx-2 space-y-2">
                {items.map((item, index) => (
                  <li key={item.id}>
                    <SidebarItem
                      href={item.uri ?? "#"}
                      label={item.label}
                      icon={dashboardIcons[index % dashboardIcons.length]}
                    />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div
            className="px-3 py-5 rounded bg-no-repeat bg-center bg-cover"
            style={{
              background: `url('${imageUrl}')`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          >
            <div className="text-2xl xl:text-3xl leading-snug font-montserrat font-bold text-white">
              <p>Discover Meaningful Connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MobileMenu: React.FC<{
  imageUrl: string;
  topLevelItems?: MenuItem[];
  dashboardItems?: MenuItem[];
}> = ({ imageUrl, topLevelItems = [], dashboardItems = [] }) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
        setDropdownOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div className="lg:hidden flex items-center gap-3.5">
      {/* Mobile Search */}
      <SearchForm
        id="search-form-mobile"
        initialHidden
        widthClass="w-52"
        alignClass="absolute -right-1/2 mt-2 z-[9999]"
      />

      {/* Mobile menu toggle */}
      <button
        id="mobile-menu-toggle"
        className="mobile-menu-toggle text-slate-50"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {/* Hamburger Icon */}
        <svg
          className={`icon-hamburger h-5 w-5 ${open ? "hidden" : "block"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        {/* Close Icon */}
        <svg
          className={`icon-close h-5 w-5 ${open ? "block" : "hidden"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.5892 4.41073C15.9147 4.73617 15.9147 5.26381 15.5892 5.58925L5.58925 15.5892C5.26381 15.9147 4.73617 15.9147 4.41073 15.5892C4.0853 15.2638 4.0853 14.7362 4.41073 14.4107L14.4107 4.41073C14.7362 4.0853 15.2638 4.0853 15.5892 4.41073Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.41073 4.41073C4.73617 4.0853 5.26381 4.0853 5.58925 4.41073L15.5892 14.4107C15.9147 14.7362 15.9147 15.2638 15.5892 15.5892C15.2638 15.9147 14.7362 15.9147 14.4107 15.5892L4.41073 5.58925C4.0853 5.26381 4.0853 4.73617 4.41073 4.41073Z"
            fill="white"
          />
        </svg>
      </button>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu-panel"
        ref={ref}
        className={`mobile-menu space-y-4 overflow-y-scroll lg:hidden absolute inset-0 top-13 h-screen w-full bg-brand-black border-t border-gray-300 z-50 flex flex-col gap-4 px-6 py-6 ${open ? "" : "hidden"}`}
      >
        {topLevelItems.map((item) => (
          <a
            key={item.id}
            href={item.uri ?? "#"}
            className="nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase text-slate-50 opacity-[.6] py-2.5 px-3.5 rounded-md hover:bg-white/10 hover:text-brand-white hover:font-medium focus:font-medium focus:outline-none"
          >
            {item.label}
          </a>
        ))}

        {/* Clickable Dropdown (mobile) */}
        <div className="relative">
          <button
            className="dropdown-btn nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase text-slate-50 opacity-[.6] py-2.5 px-3.5 rounded-md hover:bg-white/10 hover:text-brand-white hover:font-medium focus:font-medium focus:outline-none flex items-center"
            aria-expanded={dropdownOpen}
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((v) => !v);
            }}
          >
            Dashboard
            <svg
              className="ml-1.5 w-3 h-3 text-slate-50"
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="6"
              viewBox="0 0 12 6"
              fill="none"
            >
              <path
                d="M5.99758 4.38275L10.0506 0.329999C10.1806 0.199833 10.3398 0.133166 10.5283 0.129999C10.7168 0.126666 10.8819 0.193332 11.0236 0.329999C11.1652 0.466499 11.2382 0.628666 11.2423 0.8165C11.2465 1.00433 11.1762 1.16908 11.0313 1.31075L6.59758 5.74425C6.51224 5.83275 6.41974 5.8975 6.32008 5.9385C6.22041 5.9795 6.11291 6 5.99758 6C5.88224 6 5.77474 5.9795 5.67508 5.9385C5.57541 5.8975 5.48133 5.83275 5.39283 5.74425L0.959076 1.31075C0.823909 1.17542 0.756742 1.01225 0.757576 0.82125C0.758576 0.63025 0.829909 0.466499 0.971576 0.329999C1.11324 0.193333 1.27674 0.125 1.46208 0.125C1.64724 0.125 1.80808 0.193333 1.94458 0.329999L5.99758 4.38275Z"
                fill="currentColor"
              />
            </svg>
          </button>
          <div
            className={`${dropdownOpen ? "" : "hidden"} dropdown-menu absolute space-y-2 grid px-3 py-3 -left-60 mt-2 w-2xl bg-white border-0 rounded-md shadow-lg`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-slate-600 capitalize font-medium font-montserrat text-sm/5">
                  dashboards
                </span>
                <nav
                  className="sidebar-fill flex flex-1 flex-col pt-4"
                  aria-label="Sidebar"
                >
                  <ul role="list" className="-mx-2 space-y-2">
                    {dashboardItems.map((item, index) => (
                      <li key={item.id}>
                        <SidebarItem
                          href={item.uri ?? "#"}
                          label={item.label}
                          icon={dashboardIcons[index % dashboardIcons.length]}
                        />
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
              <div
                className="px-3 py-5 rounded bg-no-repeat bg-center bg-cover"
                style={{
                  background: `url('${imageUrl}')`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }}
              >
                <div className="text-2xl xl:text-3xl leading-snug font-montserrat font-bold text-white">
                  <p>Discover Meaningful Connections</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/** remaining links rendered above */}
      </div>
    </div>
  );
};

const HeaderNav: React.FC<HeaderNavProps> = ({
  logoSrc,
  navDropdownImage,
  onSearch,
  className,
  siteUrl,
}) => {
  const { data } = useQuery(HEADER_MENU_QUERY);

  const baseUrl =
    siteUrl || (typeof window !== "undefined" ? window.location.origin : "/");

  const allMenuItems: MenuItem[] = data?.menu?.menuItems?.nodes ?? [];
  const dashboardsItem = allMenuItems.find(
    (n) => n.label?.toLowerCase?.().includes("dashboard") && !n.parentId
  );
  const dashboardChildren: MenuItem[] = dashboardsItem
    ? allMenuItems.filter((n) => n.parentId === dashboardsItem.id)
    : [];
  const topLevelOrdered: MenuItem[] = allMenuItems.filter((n) => !n.parentId);
  const dashboardIndex = dashboardsItem
    ? topLevelOrdered.findIndex((n) => n.id === dashboardsItem.id)
    : -1;
  const itemsBeforeDashboard: MenuItem[] =
    dashboardIndex > -1
      ? topLevelOrdered.slice(0, dashboardIndex)
      : topLevelOrdered;
  const itemsAfterDashboard: MenuItem[] =
    dashboardIndex > -1 ? topLevelOrdered.slice(dashboardIndex + 1) : [];
  return (
    <header
      className={`${className ?? ""} navbar bg-brand-black relative z-30`}
    >
      <div className="max-w-full mx-auto px-6 md:px-6 lg:px-8 flex items-center justify-between py-3 lg:py-3">
        {/* Logo */}
        <a
          href={baseUrl}
          className="brand-logo text-2xl leading-snug font-bold text-gray-800 w-full sm:w-40 md:w-52 lg:w-64"
          aria-label="Homepage"
        >
          <div className="flex space-x-3 text-white text-sm font-normal font-sourcecodepro items-center">
            <span>
              <Image src={logoSrc} alt="brand-logo" height={44} width={107} />
            </span>
          </div>
        </a>

        <div className="flex items-center gap-10">
          {/* Desktop Nav */}
          <nav className="nav hidden lg:flex items-center space-x-2">
            {itemsBeforeDashboard.map((item) => (
              <a
                key={item.id}
                href={item.uri ?? "#"}
                className="nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase text-slate-50 opacity-[.6] py-2.5 px-3.5 rounded-md hover:bg-white/10 hover:text-brand-white hover:font-medium focus:font-medium focus:outline-none"
              >
                {item.label}
              </a>
            ))}
            {dashboardsItem && (
              <DashboardDropdown
                imageUrl={navDropdownImage}
                items={dashboardChildren}
              />
            )}
            {itemsAfterDashboard.map((item) => (
              <a
                key={item.id}
                href={item.uri ?? "#"}
                className="nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase text-slate-50 opacity-[.6] py-2.5 px-3.5 rounded-md hover:bg-white/10 hover:text-brand-white hover:font-medium focus:font-medium focus:outline-none"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Search */}
          <div className="relative hidden lg:block mt-2">
            <SearchForm
              id="search-form-desktop"
              initialHidden
              alignClass="absolute -left-60 mt-2"
            />
          </div>
        </div>

        {/* Mobile */}
        <MobileMenu
          imageUrl={navDropdownImage}
          topLevelItems={topLevelOrdered}
          dashboardItems={dashboardChildren}
        />
      </div>
    </header>
  );
};

export default HeaderNav;
