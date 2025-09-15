import React, { useState } from "react";

/**
 * Notification.tsx
 * Replace `bg-brand-2-500` / `text-brand-2950` with your theme tokens if needed.
 */

type NotificationProps = {
  /** Message text (defaults to “Discussion archived”) */
  message?: string;
  /** Called when the Undo button is clicked */
  onUndo?: () => void;
  /** Control visibility externally (if provided, internal state is ignored) */
  open?: boolean;
  /** Called when dismissed */
  onClose?: () => void;
};

export default function Notification({
  message = "Discussion archived",
  onUndo,
  open,
  onClose,
}: NotificationProps) {
  const [internalOpen, setInternalOpen] = useState(true);
  const isOpen = typeof open === "boolean" ? open : internalOpen;

  const BtnPrimary =
    "inline-flex items-center justify-center rounded bg-brand-1-900 text-white px-3 py-2 text-[10px] leading-4 font-medium hover:bg-brand-2950/90 focus:outline-none focus:ring-2 focus:ring-brand-2950 focus:ring-offset-2";

  const handleClose = () => {
    if (onClose) onClose();
    if (typeof open !== "boolean") setInternalOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="notification bg-white px-4 py-4 shadow-lg rounded-lg"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center">
        <div className="text-start">
          <p className="notification-title text-sm font-normal leading-tight font-family-baskervville text-slate-950 text-start">
            {message}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* <!-- Undo Button --> */}
          <button
            className={`${BtnPrimary} rounded py-2 px-3 text-xs leading-4`}
            onClick={() => {
              if (onUndo) onUndo();
              else alert("Undo clicked");
            }}
          >
            Undo
          </button>

          {/* <!-- Dismiss Button --> */}
          <button
            type="button"
            className="inline-flex p-1.5 text-brand-white"
            aria-label="Dismiss notification"
            onClick={handleClose}
          >
            <svg
              className="alert-close size-5 text-gray-400"
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
  );
}
