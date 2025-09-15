import React, { useState } from "react";

/**
 * Banner.tsx
 * Replace `bg-brand-2-500` / `text-brand-2950` with your theme tokens if needed.
 */

type BannerProps = {
  /** Large (desktop) message */
  messageDesktop?: string;
  /** Compact (mobile) message */
  messageMobile?: string;
  /** Called when “Learn more” is clicked (both desktop & mobile CTAs) */
  onLearnMore?: () => void;
  /** Control visibility externally (if provided, internal state is ignored) */
  open?: boolean;
  /** Called when dismissed */
  onClose?: () => void;
};

export default function Banner({
  messageDesktop = "Big news! We’re excited to announce a brand new product.",
  messageMobile = "We announced a new product!",
  onLearnMore,
  open,
  onClose,
}: BannerProps) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = typeof open === "boolean" ? open : internalOpen;

  const handleClose = () => {
    if (onClose) onClose();
    if (typeof open !== "boolean") setInternalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="banner bg-brand-2-950 text-white p-2 md:p-3 rounded-lg shadow-lg"
      role="region"
      aria-label="Site announcement"
    >
      <div className="flex items-center">
        <div className="shrink-0 text-white bg-brand-2-500 rounded-lg p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M11 5.88218V19.2402C11 20.2121 10.2121 21 9.24018 21C8.49646 21 7.83302 20.5325 7.58288 19.8321L5.43647 13.6829M18 13C19.6569 13 21 11.6569 21 10C21 8.34315 19.6569 7 18 7M5.43647 13.6829C4.0043 13.0741 3 11.6543 3 10C3 7.79086 4.79086 6 6.99999 6H8.83208C12.9327 6 16.4569 4.7659 18 3L18 17C16.4569 15.2341 12.9327 14 8.83208 14L6.99998 14C6.44518 14 5.91677 13.887 5.43647 13.6829Z"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="ml-3.5 text-start">
          <p className="banner-title text-sm/tight md:text-base/6 font-medium font-sourcecodepro text-start">
            <span className="hidden md:block">{messageDesktop}</span>
            <span className="block md:hidden">{messageMobile}</span>
          </p>
        </div>

        <div className="ml-auto pl-4">
          <div className="ml-auto flex items-center gap-2">
            {/* Learn more (desktop) */}
            <button
              className="items-center justify-center bg-white text-slate-900 text-[10px] shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-2950 focus:ring-offset-2 rounded py-2.5 px-4 text-brand-2950 font-medium text-sm leading-tight hidden md:block"
              onClick={() => (onLearnMore ? onLearnMore() : undefined)}
            >
              Learn more
            </button>


            {/* Dismiss */}
            <button
              type="button"
              className="inline-flex p-1.5 text-brand-white"
              aria-label="Dismiss banner"
              onClick={handleClose}
            >
              <svg
                className="banner-close text-white size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.5892 4.41075C15.9147 4.73618 15.9147 5.26382 15.5892 5.58926L5.58925 15.5893C5.26381 15.9147 4.73617 15.9147 4.41073 15.5893C4.0853 15.2638 4.0853 14.7362 4.41073 14.4107L14.4107 4.41075C14.7362 4.08531 15.2638 4.08531 15.5892 4.41075Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.41073 4.41075C4.73617 4.08531 5.26381 4.08531 5.58925 4.41075L15.5892 14.4107C15.9147 14.7362 15.9147 15.2638 15.5892 15.5893C15.2638 15.9147 14.7362 15.9147 14.4107 15.5893L4.41073 5.58926C4.0853 5.26382 4.0853 4.73618 4.41073 4.41075Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="w-full md:hidden block mt-5">
        <button
          className="w-full inline-flex items-center justify-center 
          bg-brand-white border border-slate-200 text-gray-600 rounded-md shadow-sm hover:bg-slate-100 
          focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 
          focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-transparent text-brand-2950 font-medium text-sm/tight py-2.5 px-4"
          onClick={() => (onLearnMore ? onLearnMore() : undefined)}
        >
          Learn more
        </button>
      </div>
    </div>
  );
}
