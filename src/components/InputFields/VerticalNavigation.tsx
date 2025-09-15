"use client";

import { type JSX } from "react";

export default function VerticalNavigation(): JSX.Element {
  const items = ["Team 1", "Team 2", "Link 1", "Link 2", "Link 3", "Link 4"];

  return (
    <nav className="sidebar-fill flex flex-1 flex-col" aria-label="Sidebar">
      <ul role="list" className="-mx-2 space-y-2">
        {["Team 1", "Team 2", "Link 1", "Link 2", "link 3", "link 4"].map(
          (label, i) => (
            <li key={label}>
              <a
                href="#"
                className="sidebar-item group items-center flex gap-x-3 rounded-md py-2 px-2.5 text-sm/6 font-medium font-sourcecodepro text-slate-800 hover:text-slate-800 hover:bg-brand-1-50 focus:bg-brand-1-950 focus:text-white focus:outline-0 focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-transparent"
              >
                <svg
                  className="sidebar-item-icon size-6 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M8.02 1.84L2.63 6.04C1.73 6.74 1 8.23 1 9.36V16.77C1 19.09 2.89 20.99 5.21 20.99H16.79C19.11 20.99 21 19.09 21 16.78V9.5C21 8.29 20.19 6.74 19.2 6.05L13.02 1.72C11.62 0.74 9.37 0.79 8.02 1.84Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {label}
                <span
                  className="sidebar-item-arrow ml-auto w-9 min-w-max px-2.5 py-0.5 text-center text-base/6 font-medium whitespace-nowrap"
                  aria-hidden="true"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="14"
                    viewBox="0 0 8 14"
                    fill="none"
                  >
                    <path
                      d="M1.6825 12.94L6.5725 8.05C7.15 7.4725 7.15 6.5275 6.5725 5.95L1.6825 1.06"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </a>
            </li>
          )
        )}
      </ul>
    </nav>
  );
}
