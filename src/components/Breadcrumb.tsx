"use client";
import type { JSX, ReactNode } from "react";

export type Crumb = { label: ReactNode; href?: string };

type BreadcrumbProps = {
  items?: Crumb[]; // ← make optional
  light?: boolean;
  homeHref?: string;
};

export default function Breadcrumb({
  items = [], // ← safe default
  light,
  homeHref = "/",
}: BreadcrumbProps): JSX.Element {
  const base = light ? "text-slate-600" : "text-slate-500";
  const current = light ? "text-slate-500" : "text-slate-700";

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol
        role="list"
        className="breadcrumb flex items-center space-x-2 text-sm/tight md:text-base/8 uppercase font-sourcecodepro font-normal text-slate-600"
      >
        <li>
          <div
            className={`breadcrumb-item flex items-center gap-x-1.5 ${base}`}
          >
            <a
              href={homeHref}
              className="text-slate-600 hover:text-slate-500"
            >
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
                className="size-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        
        <li>
            <div className="breadcrumb-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7.425 16.6L12.8583 11.1667C13.5 10.525 13.5 9.475 12.8583 8.83333L7.425 3.4" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <a href="#">Dashboards</a>
            </div>
        </li>

        {items.map((item, i) => (
          <li key={i}>
            <div
              className={`breadcrumb-item flex items-center gap-x-1.5 ${base}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="shrink-0"
              >
                <path
                  d="M7.425 16.6L12.8583 11.1667C13.5 10.525 13.5 9.475 12.8583 8.83333L7.425 3.4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {item.href ? (
                <a
                  href={item.href}
                  className={`breadcrumb-current ${current} font-medium text-slate-500 hover:text-slate-700 transition-colors`}
                  aria-current="page"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  className={`breadcrumb-current font-medium text-slate-500 hover:text-slate-700 ${current}`}
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
