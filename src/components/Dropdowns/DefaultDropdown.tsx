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

type DefaultDropdownProps = {
  label: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
  buttonClassName?: string;
  idKey?: string; // optional stable id suffix (e.g., "one", "two")
  open?: boolean; // controlled open state
  onOpenChange?: (open: boolean) => void; // controlled state setter
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

export default function DefaultDropdown({
  label,
  items,
  align = "right",
  className = "",
  menuClassName = "",
  buttonClassName = "",
  idKey,
  open,
  onOpenChange,
}: DefaultDropdownProps): JSX.Element {
  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? (open as boolean) : internalOpen;
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const key = idKey ?? reactId;
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
    <div className={["default-dropdown-btn-wrapper relative inline-block text-left", className].join(" ")}>
      <div>
        <button
          ref={btnRef}
          type="button"
          id={btnId}
          className={["default-dropdown-btn flex items-center gap-1", buttonClassName].join(" ")}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-controls={menuId}
          onClick={(e) => {
            e.stopPropagation();
            setOpenState(!isOpen);
          }}
        >
          {label}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
          "default-dropdown-menu absolute mt-2 w-56 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black/50",
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
          {items.map((it, idx) => {
            const common = {
              className:
                "default-dropdown-item block w-full text-left px-4 py-2.5 text-base/6 text-slate-600 hover:bg-slate-100 font-family-sourcecodepro font-normal",
              role: "menuitem" as const,
              key: idx,
            };
            if (it.href || it.as === "a") {
              return (
                <a
                  {...common}
                  href={it.href || "#"}
                  target={it.target}
                  rel={it.rel}
                  onClick={() => setOpenState(false)}
                >
                  {it.label}
                </a>
              );
            }
            return (
              <button
                {...common}
                type="button"
                onClick={() => {
                  it.onClick?.();
                  setOpenState(false);
                }}
              >
                {it.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
