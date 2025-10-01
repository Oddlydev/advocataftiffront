"use client";

import React, { useEffect, useId, useRef, useState, type JSX } from "react";

type DropdownItem = {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  as?: "a" | "button";
  target?: string;
  rel?: string;
};

type DashboardDropdownProps = {
  label: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
  buttonClassName?: string;
  idKey?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

function useClickOutside(
  elements: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = elements.some((r) => r.current && r.current.contains(target));
      if (!inside) onOutside();
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [elements, onOutside]);
}

export default function DashboardDropdown({
  label,
  items,
  align = "right",
  className = "",
  menuClassName = "",
  buttonClassName = "",
  idKey,
  open,
  onOpenChange,
}: DashboardDropdownProps): JSX.Element {
  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? (open as boolean) : internalOpen;
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const btnId = idKey ? `default-dropdown-btn-${idKey}` : `default-dropdown-btn-${reactId}`;
  const menuId = idKey ? `default-dropdown-menu-btn-${idKey}` : `default-dropdown-menu-${reactId}`;

  const setOpenState = (v: boolean) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };

  useClickOutside([btnRef, menuRef], () => setOpenState(false));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenState(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={[
        "default-dropdown-btn-wrapper relative inline-block text-left",
        className,
      ].join(" ")}
    >
      <div>
        <button
          ref={btnRef}
          type="button"
          id={btnId}
          className={[
            "default-dropdown-btn inline-flex w-full justify-center gap-x-1.5 rounded-md bg-brand-white px-4 py-2 text-lg/7 font-sourcecodepro font-normal text-slate-600 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 items-center gap-1",
            buttonClassName,
          ].join(" ")}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={menuId}
          onClick={(e) => {
            e.stopPropagation();
            setOpenState(!isOpen);
          }}
        >
          {label}
          <svg
            className="-mr-1 size-5 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.7071 7.29289L9.99999 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68341 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      <div
        ref={menuRef}
        id={menuId}
        className={[
          "default-dropdown-menu absolute right-0 z-10 mt-2 w-48 md:w-64 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black/5 focus:outline-none transition ease-out duration-100 transform scale-95",
          align === "right" ? "right-0" : "left-0",
          "transform transition-all duration-200 ease-out z-30",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none",
          menuClassName,
        ].join(" ")}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={btnId}
        tabIndex={-1}
      >
        <div className="py-1" role="none">
          {["Option 1", "Option 2", "Option 3"].map((opt, i) => (
            <a
              href="#"
              key={i}
              className="default-dropdown-item block px-4 py-2.5 text-sm/5 lg:text-base/6 text-slate-600 hover:bg-slate-100 font-sourcecodepro font-normal"
              role="menuitem"
            >
              <div className="flex gap-3 items-center">
                {/* Custom Checkbox */}
                <div className="flex h-6 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1">
                    <input
                      id={`option-${i + 1}`}
                      type="checkbox"
                      name={`option-${i + 1}`}
                      defaultChecked={i === 1} // Example: Option 2 is checked
                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-slate-600 bg-white
                        checked:border-slate-600 checked:bg-white
                        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600
                        disabled:border-slate-600 disabled:bg-gray-100 disabled:checked:bg-gray-100
                        forced-colors:appearance-auto"
                    />
                    {/* Checkmark SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 8 6"
                      fill="none"
                      className="pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center stroke-slate-600 opacity-0 group-has-checked:opacity-100"
                    >
                      <path
                        d="M1.5 3L3 4.5L6.5 1.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Label */}
                <div>
                  <label
                    htmlFor={`option-${i + 1}`}
                    className="font-normal text-slate-600"
                  >
                    {opt}
                  </label>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
