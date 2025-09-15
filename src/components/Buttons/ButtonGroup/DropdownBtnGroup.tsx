"use client";

import React, { useEffect, useRef, useState, type JSX } from "react";

type Item = {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

type Props = {
  label?: React.ReactNode; // main button label
  items?: Item[];
  onMainClick?: () => void;
  className?: string;
};

export default function DropdownBtnGroup({
  label = "Save changes",
  items = [
    { label: "Save and schedule" },
    { label: "Save and publish" },
    { label: "Export PDF" },
  ],
  onMainClick,
  className = "",
}: Props): JSX.Element {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        wrapRef.current &&
        !wrapRef.current.contains(t) &&
        menuRef.current &&
        !menuRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className={[
        "dropdown-btn-group relative inline-flex rounded-md shadow-xs leading-tight",
        className,
      ].join(" ")}
      ref={wrapRef}
    >
      {/* Main action button */}
      <button
        type="button"
        className="main-action-btn-group relative inline-flex items-center rounded-l-md bg-brand-white px-4 py-2 text-sm leading-tight font-sourcecodepro font-medium text-slate-800 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
        onClick={onMainClick}
        ref={mainBtnRef}
      >
        {label}
      </button>

      {/* Dropdown toggle button */}
      <button
        type="button"
        className="relative inline-flex items-center rounded-r-md bg-brand-white px-2 py-2 text-gray-500 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <span className="sr-only">Open options</span>
        <svg className="size-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.29288 7.29289C5.6834 6.90237 6.31657 6.90237 6.70709 7.29289L9.99998 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.6834 13.0976 9.29287 12.7071L5.29288 8.70711C4.90235 8.31658 4.90235 7.68342 5.29288 7.29289Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        ref={menuRef}
        className={[
          "dropdown-menu-group-btn absolute right-0 z-10 mt-14 w-56 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black/5 focus:outline-hidden",
          open ? "" : "hidden",
        ].join(" ")}
        role="menu"
        aria-orientation="vertical"
        tabIndex={-1}
      >
        <div className="py-1 text-start" role="none">
          {items.map((it, i) =>
            it.href ? (
              <a
                key={i}
                href={it.href}
                className="dropdown-menu-group-btn-item block px-4 py-2 text-sm leading-tight text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {it.label}
              </a>
            ) : (
              <button
                key={i}
                type="button"
                className="w-full text-left block px-4 py-2 text-sm leading-tight text-gray-700 hover:bg-gray-100"
                role="menuitem"
                onClick={() => {
                  it.onClick?.();
                  setOpen(false);
                }}
              >
                {it.label}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
