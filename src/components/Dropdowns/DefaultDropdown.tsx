"use client";

import React, { useEffect, useId, useRef, useState, type JSX } from "react";

type DropdownItem = {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  as?: "a" | "button";
  target?: string;
  rel?: string;
  kind?: "checkbox"; // optional checkbox-style row
  checked?: boolean; // for kind === 'checkbox'
  itemClassName?: string;
};

type DefaultDropdownProps = {
  label: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
  menuClassName?: string;
  buttonClassName?: string;
  idKey?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnItemClick?: boolean;
  itemClassName?: string;
  footer?: React.ReactNode; //   new prop for footer content (e.g., OK / CLEAR buttons)
};

function useClickOutside(
  elements: Array<React.RefObject<HTMLElement | null>>,
  onOutside: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      const inside = elements.some(
        (r) => r.current && r.current.contains(target),
      );
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
  closeOnItemClick = true,
  footer,
}: DefaultDropdownProps): JSX.Element {
  const isControlled = typeof open === "boolean";
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? (open as boolean) : internalOpen;

  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const key = idKey ?? reactId;

  const btnId = `default-dropdown-btn-${key}`;
  const menuId = `default-dropdown-menu-${key}`;

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

  const listScrollable = items.length > 6;

  return (
    <div
      className={[
        "default-dropdown-btn-wrapper relative inline-block text-left",
        className,
      ].join(" ")}
    >
      {/* Dropdown Button */}
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
            className="-mr-1 size-5 text-gray-700 transition-transform duration-150"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
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

      {/* Dropdown Menu */}
      <div
        ref={menuRef}
        id={menuId}
        className={[
          "default-dropdown-menu absolute right-0 z-20 mt-2 origin-top-right rounded-md bg-brand-white shadow-lg ring-1 ring-black/5 focus:outline-none transition ease-out duration-100 transform scale-95",
          align === "right" ? "right-0" : "left-0",
          "transform transition-all duration-200 ease-out z-30",
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none",
          menuClassName,
        ].join(" ")}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby={btnId}
        tabIndex={-1}
        style={{ width: "max-content" }}
      >
        {/* Scrollable list of items */}
        <div
          className={[
            "py-1 px-2",
            listScrollable ? "overflow-y-auto max-h-[280px] custom-scroll" : "",
          ].join(" ")}
          role="none"
        >
          {items.map((it, idx) => {
            const common = {
              className:
                "default-dropdown-item block text-left py-2.5 text-base/6 text-slate-600 hover:text-brand-1-700 font-sourcecodepro font-normal",
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
                  onClick={(e) => {
                    e.stopPropagation();
                    it.onClick?.();
                    if (closeOnItemClick) setOpenState(false);
                  }}
                >
                  {it.label}
                </a>
              );
            }

            return (
              <button
                {...common}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  it.onClick?.();
                  if (closeOnItemClick) setOpenState(false);
                }}
              >
                {it.kind === "checkbox" ? (
                  <div className="group flex cursor-pointer items-center gap-2.5">
                    <span
                      aria-hidden
                      className="relative flex h-6 w-6 items-center justify-center text-slate-600 group-hover:text-brand-1-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                        className="absolute inset-0 h-full w-full"
                      >
                        <path
                          d="M0.833344 8.33333C0.833344 2.15708 2.15709 0.833328 8.33334 0.833328C14.5096 0.833328 15.8333 2.15708 15.8333 8.33333C15.8333 14.5096 14.5096 15.8333 8.33334 15.8333C2.15709 15.8333 0.833344 14.5096 0.833344 8.33333Z"
                          stroke="currentColor"
                          strokeWidth="1.66667"
                        />
                      </svg>
                      {it.checked ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 7 5"
                          fill="none"
                          className="absolute h-[10px] w-[12px]"
                        >
                          <path
                            d="M0.833344 2.49999L2.23568 3.90233C2.38168 4.04833 2.61834 4.04833 2.76434 3.90233L5.83334 0.833328"
                            stroke="currentColor"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : null}
                    </span>
                    <span className="font-normal text-slate-600 group-hover:text-brand-1-700">
                      {it.label}
                    </span>
                  </div>
                ) : (
                  it.label
                )}
              </button>
            );
          })}
        </div>

        {/*   Footer section (OK / CLEAR) */}
        {footer && <div className="!bg-tranparent">{footer}</div>}
      </div>
    </div>
  );
}
