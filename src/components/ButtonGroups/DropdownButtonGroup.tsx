import React, { useEffect, useRef, useState } from "react";

export default function DropdownButtonGroup() {
  const [openMenu, setOpenMenu] = useState(false);
  const ddRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const closeOnOutside = (e: MouseEvent) => {
      if (!ddRef.current) return;
      if (!ddRef.current.contains(e.target as Node)) setOpenMenu(false);
    };
    document.addEventListener("click", closeOnOutside);
    return () => document.removeEventListener("click", closeOnOutside);
  }, []);

  return (
    <div
      ref={ddRef}
      className="dropdown-btn-group relative inline-flex rounded-md shadow-xs leading-tight"
    >
      <button
        type="button"
        className="main-action-btn-group relative inline-flex items-center rounded-l-md bg-brand-white px-4 py-2 text-sm leading-tight font-sourcecodepro font-medium text-slate-800 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        Save changes
      </button>
      <button
        type="button"
        aria-expanded={openMenu}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          setOpenMenu((s) => !s);
        }}
        className="dropdown-toggle relative inline-flex items-center rounded-r-md bg-brand-white px-2 py-2 text-gray-500 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
      >
        <span className="sr-only">Open options</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="size-5 text-gray-500"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.29288 7.29289C5.6834 6.90237 6.31657 6.90237 6.70709 7.29289L9.99998 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.6834 13.0976 9.29287 12.7071L5.29288 8.70711C4.90235 8.31658 4.90235 7.68342 5.29288 7.29289Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {openMenu && (
        <div className="dropdown-menu-group-btn absolute right-0 z-10 mt-14 w-56 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black/5 focus:outline-hidden">
          <div className="py-1 text-start">
            <a
              href="#"
              className="dropdown-menu-group-btn-item block px-4 py-2 text-sm leading-tight text-gray-700 hover:bg-gray-100"
            >
              Save and schedule
            </a>
            <a
              href="#"
              className="dropdown-menu-group-btn-item block px-4 py-2 text-sm leading-tight text-gray-700 hover:bg-gray-100"
            >
              Save and publish
            </a>
            <a
              href="#"
              className="dropdown-menu-group-btn-item block px-4 py-2 text-sm leading-tight text-gray-700 hover:bg-gray-100"
            >
              Export PDF
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
