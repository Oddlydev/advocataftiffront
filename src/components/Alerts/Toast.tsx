import React, { useState } from "react";

/**
 * Toast.tsx
 * Replace `bg-brand-2-500` / `text-brand-2950` with your theme tokens if needed.
 */

type ToastProps = {
  /** Heading text */
  title?: string;
  /** Supporting text */
  description?: string;
  /** Called when Undo is clicked */
  onUndo?: () => void;
  /** Control visibility externally (if provided, internal state is ignored) */
  open?: boolean;
  /** Called when dismissed */
  onClose?: () => void;
};

export default function Toast({
  title = "Discussion moved",
  description = "Lorem ipsum dolor sit amet consectetur adipisicing elit oluptatum tenetur.",
  onUndo,
  open,
  onClose,
}: ToastProps) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = typeof open === "boolean" ? open : internalOpen;

  const BtnPrimary =
    "inline-flex items-center justify-center rounded bg-brand-1-900 text-white px-3 py-2 text-[10px] leading-4 font-medium hover:bg-brand-2950/90 focus:outline-none focus:ring-2 focus:ring-brand-2950 focus:ring-offset-2";
  const BtnWhite =
    "inline-flex items-center justify-center rounded bg-white text-slate-900 px-3 py-2 text-[10px] leading-4 font-medium shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-2950 focus:ring-offset-2";

  const handleClose = () => {
    if (onClose) onClose();
    if (typeof open !== "boolean") setInternalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="toast bg-white px-4 py-4 shadow-lg rounded-lg"
      role="status"
      aria-live="polite"
    >
      <div className="flex">
        <div className="shrink-0">
          <svg
            className="toast-icon size-6 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1 12C1 11.4477 1.44772 11 2 11H8C8.33435 11 8.64658 11.1671 8.83205 11.4453L10.5352 14H13.4648L15.1679 11.4453C15.3534 11.1671 15.6656 11 16 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H16.5352L14.8321 15.5547C14.6466 15.8329 14.3344 16 14 16H10C9.66565 16 9.35342 15.8329 9.16795 15.5547L7.46482 13H2C1.44772 13 1 12.5523 1 12Z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.23947 3H16.7605C17.3187 3.0003 17.8656 3.15628 18.34 3.45042C18.8138 3.74428 19.1964 4.16439 19.4448 4.66359C19.4451 4.66406 19.4453 4.66453 19.4455 4.665L22.8942 11.5523C22.9638 11.6913 23 11.8446 23 12V18C23 18.7957 22.6839 19.5587 22.1213 20.1213C21.5587 20.6839 20.7957 21 20 21H4C3.20435 21 2.44129 20.6839 1.87868 20.1213C1.31607 19.5587 1 18.7956 1 18V12C1 11.8446 1.03624 11.6913 1.10583 11.5523L4.55447 4.665C4.80359 4.16435 5.18618 3.74427 5.66004 3.45042C6.13437 3.15628 6.68134 3.0003 7.23947 3ZM7.24029 5C7.05433 5.00014 6.8721 5.05213 6.71405 5.15014C6.55594 5.24819 6.42832 5.38839 6.34553 5.555C6.34508 5.55591 6.34462 5.55682 6.34417 5.55773L3 12.2364V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V12.2364L17.6558 5.55773L17.6545 5.555C17.5717 5.38839 17.4441 5.24818 17.2859 5.15014C17.1279 5.05214 16.9457 5.00014 16.7597 5H7.24029Z"
              fill="currentColor"
            />
          </svg>
        </div>

        <div className="ml-3.5 text-start">
          <p className="toast-title text-sm font-medium leading-tight font-family-montserrat text-slate-950 text-start">
            {title}
          </p>
          <p className="toast-text mt-1 text-sm leading-tight font-family-baskervville text-slate-600 text-start">
            {description}
          </p>

          <div className="md:flex md:items-center md:gap-2 mt-2.5 text-start">
            <button
              className={`${BtnPrimary} rounded py-2 px-3 text-xs leading-4`}
              onClick={() => {
                if (onUndo) onUndo();
                else alert("Undo clicked");
              }}
            >
              Undo
            </button>

            <button
              className={`${BtnWhite} rounded py-2 px-3 text-xs leading-4`}
              onClick={handleClose}
            >
              Dismiss
            </button>
          </div>
        </div>

        <div className="ml-auto pl-4">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className="inline-flex p-1.5 text-brand-white"
              aria-label="Dismiss toast"
              onClick={handleClose}
            >
              <svg
                className="toast-close size-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
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
    </div>
  );
}
