"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { HEADER_MENU_QUERY } from "@/queries/MenuQueries";
import searchClient from "../lib/algolia";
import { usePathname } from "next/navigation";

export type HeaderNavProps = {
  logoSrc: string;
  navDropdownImage: string;
  onSearch?: (query: string) => void;
  className?: string;
  siteUrl?: string;
};

const SidebarItem: React.FC<{
  href?: string;
  label: string;
  isActive?: boolean;
}> = ({ href = "#", label, isActive = false }) => (
  <a
    href={href}
    className={`sidebar-item group flex items-center gap-x-3 rounded-md py-2 px-2.5 text-sm/6 font-medium font-sourcecodepro 
      ${
        isActive
          ? "bg-brand-1-950 text-white"
          : "text-slate-800 hover:text-slate-800 hover:bg-brand-1-50"
      }`}
  >
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

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, []);

  // Algolia search
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
    <div ref={ref} className="relative w-full hidden">
      <button
        aria-expanded={open}
        aria-controls={id}
        className="search-btn"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {/* 🔍 icon */}
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

// Normalize paths
const normalizePath = (p?: string | null) => {
  if (!p) return "";
  if (p === "/") return "/";
  return String(p).replace(/\/+$/, "");
};

const pathMatches = (current?: string | null, target?: string | null) => {
  const c = normalizePath(current);
  const t = normalizePath(target);
  if (!t) return false;
  if (t === "/") return c === "/";
  return c === t || c.startsWith(t + "/");
};

const DashboardDropdown: React.FC<{
  imageUrl: string;
  items?: MenuItem[];
  parentItem?: MenuItem | null;
  currentPathname?: string;
}> = ({ imageUrl, items = [], parentItem = null, currentPathname }) => {
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

  const isDashActive = (() => {
    const current =
      currentPathname ??
      (typeof window !== "undefined" ? window.location.pathname : "");
    const parentActive = pathMatches(current, parentItem?.uri);
    const childActive = items.some((child: any) =>
      pathMatches(current, child.uri)
    );
    const implied =
      /dashboard/i.test(parentItem?.label ?? "") &&
      /dashboard/i.test(current ?? "");
    return parentActive || childActive || implied;
  })();

  return (
    <div ref={containerRef} className="relative">
      <button
        className={`dropdown-btn nav-link text-lg leading-snug font-sourcecodepro uppercase py-2.5 px-3.5 rounded-md transition flex items-center
          ${
            isDashActive
              ? "bg-transparent text-brand-white font-medium hover:bg-white/10 hover:text-brand-white"
              : "text-slate-50/60 font-normal hover:bg-white/10 hover:text-brand-white hover:font-medium"
          }`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (parentItem?.uri) {
              window.location.href = parentItem.uri;
            }
          }}
        >
          {parentItem?.label ?? "Dashboard"}
        </span>
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
            <span className="text-slate-800 font-medium font-montserrat text-sm/5 uppercase">
              dashboards
            </span>
            <nav className="sidebar-fill pt-4" aria-label="Sidebar">
              <ul role="list" className="space-y-1">
                {items.map((item) => {
                  const isActive =
                    typeof window !== "undefined" &&
                    window.location.pathname === item.uri;
                  return (
                    <li key={item.id}>
                      <SidebarItem
                        href={item.uri ?? "#"}
                        label={item.label}
                        isActive={isActive}
                      />
                    </li>
                  );
                })}
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
  parentDashboardItem?: MenuItem | null;
  currentPathname?: string;
}> = ({
  imageUrl,
  topLevelItems = [],
  dashboardItems = [],
  parentDashboardItem = null,
  currentPathname,
}) => {
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

  const isDashActive = (() => {
    const current =
      currentPathname ??
      (typeof window !== "undefined" ? window.location.pathname : "");
    const parentActive = pathMatches(current, parentDashboardItem?.uri);
    const childActive = dashboardItems.some((child) =>
      pathMatches(current, child.uri)
    );
    const implied =
      /dashboard/i.test(parentDashboardItem?.label ?? "") &&
      /dashboard/i.test(current ?? "");
    return parentActive || childActive || implied;
  })();

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
        className="mobile-menu-toggle text-slate-50 p-3 focus:outline-none focus:ring-0 focus:ring-transparent hover:bg-slate-700/30"
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {/* Hamburger */}
        <svg className={`icon-hamburger h-5 w-5 ${open ? "hidden" : "block"}`} xmlns="http://www.w3.org/2000/svg" width="22" height="14" viewBox="0 0 22 14" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 1C0 0.447715 0.447715 0 1 0H21C21.5523 0 22 0.447715 22 1C22 1.55228 21.5523 2 21 2H1C0.447715 2 0 1.55228 0 1Z" fill="currentColor"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 7C0 6.44772 0.447715 6 1 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H1C0.447715 8 0 7.55228 0 7Z" fill="currentColor"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M0 13C0 12.4477 0.447715 12 1 12H21C21.5523 12 22 12.4477 22 13C22 13.5523 21.5523 14 21 14H1C0.447715 14 0 13.5523 0 13Z" fill="currentColor"/>
        </svg>

        {/* Close */}
        <svg className={`icon-close h-5 w-5 ${open ? "block" : "hidden"}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M15.5892 4.41073C15.9147 4.73617 15.9147 5.26381 15.5892 5.58925L5.58921 15.5892C5.26378 15.9147 4.73614 15.9147 4.4107 15.5892C4.08527 15.2638 4.08527 14.7362 4.4107 14.4107L14.4107 4.41073C14.7361 4.0853 15.2638 4.0853 15.5892 4.41073Z" fill="currentColor"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.4107 4.41073C4.73614 4.0853 5.26378 4.0853 5.58921 4.41073L15.5892 14.4107C15.9147 14.7362 15.9147 15.2638 15.5892 15.5892C15.2638 15.9147 14.7361 15.9147 14.4107 15.5892L4.4107 5.58925C4.08527 5.26381 4.08527 4.73617 4.4107 4.41073Z" fill="currentColor"/>
        </svg>
      </button>

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu-panel"
        ref={ref}
        className={`mobile-menu lg:hidden absolute inset-0 top-18 h-screen w-full bg-brand-black border-t border-gray-300 z-50 flex flex-col gap-4 md:gap-4 px-6 py-6 overflow-y-scroll ${
          open ? "" : "hidden"
        }`}
      >
        {(() => {
          const filteredTop = parentDashboardItem
            ? topLevelItems.filter((it) => it.id !== parentDashboardItem.id)
            : topLevelItems;
          const firstRow = filteredTop.slice(0, 1);
          const restRows = filteredTop.slice(1);
          return (
            <>
              {firstRow.map((item) => {
                const isActive =
                  typeof window !== "undefined" &&
                  window.location.pathname === item.uri;
                return (
                  <a
                    key={item.id}
                    href={item.uri ?? "#"}
                    className={`nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase py-2.5 px-3.5 rounded-md transition
                      ${
                        isActive
                          ? "bg-transparent text-brand-white font-medium hover:bg-white/10 hover:text-brand-white"
                          : "text-slate-50/60 hover:bg-white/10 hover:text-brand-white hover:font-medium"
                      }`}
                  >
                    {item.label}
                  </a>
                );
              })}

              {/* Dropdown */}
              {parentDashboardItem && (
                <div
                  className="relative"
                  key={parentDashboardItem.id + "-dropdown"}
                >
                  <button
                    className={`dropdown-btn nav-link text-lg leading-snug font-sourcecodepro uppercase py-2.5 px-3.5 rounded-md transition flex items-center
                      ${
                        isDashActive
                          ? "bg-transparent text-brand-white font-medium hover:bg-white/10 hover:text-brand-white"
                          : "text-slate-50/60 font-normal hover:bg-white/10 hover:text-brand-white hover:font-medium"
                      }`}
                    aria-expanded={dropdownOpen}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen((v) => !v);
                    }}
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (parentDashboardItem?.uri) {
                          window.location.href = parentDashboardItem.uri;
                        }
                      }}
                    >
                      {parentDashboardItem?.label ?? "Dashboard"}
                    </span>
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
                    className={`${
                      dropdownOpen ? "" : "hidden"
                    } dropdown-menu space-y-2 grid ml-10 px-4 py-2 left-0 mt-2 w-[90%] xl:w-full bg-white border-0 rounded-md shadow-lg`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                      <div>
                        <span className="text-slate-800 uppercase font-medium font-montserrat text-sm/5">
                          dashboards
                        </span>
                        <nav
                          className="sidebar-fill flex flex-1 flex-col pt-4"
                          aria-label="Sidebar"
                        >
                          <ul role="list" className="space-y-1">
                            {dashboardItems.map((item) => {
                              const isActive =
                                typeof window !== "undefined" &&
                                window.location.pathname === item.uri;
                              return (
                                <li key={item.id}>
                                  <SidebarItem
                                    href={item.uri ?? "#"}
                                    label={item.label}
                                    isActive={isActive}
                                  />
                                </li>
                              );
                            })}
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
                          <p>
                            Discover
                            <br />
                            Meaningful Connections
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {restRows.map((item) => {
                const isActive =
                  typeof window !== "undefined" &&
                  window.location.pathname === item.uri;
                return (
                  <a
                    key={item.id}
                    href={item.uri ?? "#"}
                    className={`nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase py-2.5 px-3.5 rounded-md transition
                      ${
                        isActive
                          ? "bg-transparent text-brand-white font-medium hover:bg-white/10 hover:text-brand-white"
                          : "text-slate-50/60 hover:bg-white/10 hover:text-brand-white hover:font-medium"
                      }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </>
          );
        })()}
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
  const pathname = usePathname();

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
      <div className="max-w-full mx-auto px-6 md:px-6 lg:px-8 flex items-center justify-between py-4 lg:py-3">
        {/* Logo */}
        <a
          href={baseUrl}
          className="inline-flex items-center p-2 md:p-3 brand-logo text-2xl leading-snug font-bold text-gray-800 w-full sm:w-40 md:w-52 lg:w-64"
          aria-label="Homepage"
        >
          <div className="flex space-x-3 text-white text-sm font-normal font-sourcecodepro items-center">
            <span>
              <img src={logoSrc} alt="brand-logo" height={44} width={107} />
            </span>
          </div>
        </a>

        <div className="flex items-center gap-10">
          {/* Desktop Nav */}
          <nav className="nav hidden lg:flex items-center space-x-2">
            {itemsBeforeDashboard.map((item) => {
              const isActive = pathname === item.uri;
              return (
                <a
                  key={item.id}
                  href={item.uri ?? "#"}
                  className={`nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase py-2.5 px-3.5 rounded-md transition
                    ${
                      isActive
                        ? "bg-transparent text-brand-white font-medium hover:bg-white/10 hover:text-brand-white"
                        : "text-slate-50/60 hover:bg-white/10 hover:text-brand-white hover:font-medium"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}

            {dashboardsItem && (
              <DashboardDropdown
                imageUrl={navDropdownImage}
                items={dashboardChildren}
                parentItem={dashboardsItem}
                currentPathname={pathname}
              />
            )}

            {itemsAfterDashboard.map((item) => {
              const isActive = pathname === item.uri;
              return (
                <a
                  key={item.id}
                  href={item.uri ?? "#"}
                  className={`nav-link text-lg leading-snug font-sourcecodepro font-normal uppercase py-2.5 px-3.5 rounded-md transition
                    ${
                      isActive
                        ? "bg-transparent text-brand-white font-medium hover:bg-white/10 hover:text-brand-white"
                        : "text-slate-50/60 hover:bg-white/10 hover:text-brand-white hover:font-medium"
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
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
          parentDashboardItem={dashboardsItem}
          currentPathname={pathname}
        />
      </div>
    </header>
  );
};

export default HeaderNav;
