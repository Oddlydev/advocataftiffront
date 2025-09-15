import React, { useState } from "react";

/**
 * ComponentAlerts.tsx
 * Replace `bg-brand-2-500` / `text-brand-2950` with your theme tokens if needed.
 */

export default function Alerts() {
  const [alertOpen, setAlertOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(true);
  const [toastOpen, setToastOpen] = useState(true);
  const [bannerOpen, setBannerOpen] = useState(true);

  const BtnPrimary =
    "inline-flex items-center justify-center rounded bg-brand-1-900 text-white px-3 py-2 text-[10px] leading-4 font-medium hover:bg-brand-2950/90 focus:outline-none focus:ring-2 focus:ring-brand-2950 focus:ring-offset-2";
  const BtnWhite =
    "inline-flex items-center justify-center rounded bg-white text-slate-900 px-3 py-2 text-[10px] leading-4 font-medium shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-2950 focus:ring-offset-2";

  return (
    <div className="bg-gray-300 text-center">
      <div className="pb-20">
        <h1 className="text-3xl font-bold text-black text-center py-10 mb-14 border-b border-b-black px-6">
          Alert, Notification &amp; Toast
        </h1>

        <div className="max-w-md mx-auto px-6">
          <h2 className="text-2xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
            Alert
          </h2>

          {/* Alert */}
          {alertOpen && (
            <div
              className="alert bg-white px-4 py-4 shadow-lg rounded-lg"
              role="alert"
              aria-live="polite"
            >
              <div className="flex">
                <div className="shrink-0">
                  <svg
                    className="tick-circle size-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.75 12L10.58 14.83L16.25 9.17"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="ml-3.5 text-start">
                  <p className="alert-title text-sm font-medium leading-tight font-family-montserrat text-slate-950 text-start">
                    Successfully uploaded
                  </p>
                  <p className="alert-text mt-1 text-sm leading-tight font-family-baskervville text-slate-600 text-start">
                    Anyone with a link can now view this file.
                  </p>
                </div>

                <div className="ml-auto pl-4">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                    type="button"
                    className="inline-flex p-1.5 text-brand-white"
                    aria-label="Dismiss alert"
                    onClick={() => setAlertOpen(false)}
                  >
                    <svg
                      className="alert-close size-5 text-gray-400"
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
          )}

          <h2 className="text-2xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
            Notification
          </h2>

          {/* Notification */}
          {notificationOpen && (
            <div
              className="notification bg-white px-4 py-4 shadow-lg rounded-lg"
              role="status"
              aria-live="polite"
            >
              <div className="flex items-center">
                <div className="text-start">
                  <p className="notification-title text-sm font-normal leading-tight font-family-baskervville text-slate-950 text-start">
                    Discussion archived
                  </p>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  {/* Undo */}
                  <button
                    className= {`${BtnPrimary} rounded py-2 px-3 text-xs leading-4`}
                    onClick={() => alert("Undo clicked")}
                  >
                    Undo
                  </button>

                  {/* Dismiss */}
                  <button
                    type="button"
                    className="inline-flex p-1.5 text-brand-white"
                    aria-label="Dismiss notification"
                    onClick={() => setNotificationOpen(false)}
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
          )}

          <h2 className="text-2xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
            Toast
          </h2>

          {/* Toast */}
          {toastOpen && (
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
                      d="M7.23947 3H16.7605C17.3187 3.0003 17.8656 3.15628 18.34 3.45042C18.8138 3.74428 19.1964 4.16439 19.4448 4.66359C19.4451 4.66406 19.4453 4.66453 19.4455 4.665L22.8942 11.5523C22.9638 11.6913 23 11.8446 23 12V18C23 18.7957 22.6839 19.5587 22.1213 20.1213C21.5587 20.6839 20.7957 21 20 21H4C3.20435 21 2.44129 20.6839 1.87868 20.1213C1.31607 19.5587 1 18.7956 1 18V12C1 11.8446 1.03624 11.6913 1.10583 11.5523L4.55447 4.665C4.55471 4.66451 4.55496 4.66401 4.55521 4.66352C4.80359 4.16435 5.18618 3.74427 5.66004 3.45042C6.13437 3.15628 6.68134 3.0003 7.23947 3ZM7.24029 5C7.05433 5.00014 6.8721 5.05213 6.71405 5.15014C6.55594 5.24819 6.42832 5.38839 6.34553 5.555C6.34508 5.55591 6.34462 5.55682 6.34417 5.55773L3 12.2364V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H20C20.2652 19 20.5196 18.8946 20.7071 18.7071C20.8946 18.5196 21 18.2652 21 18V12.2364L17.6558 5.55773L17.6545 5.555C17.5717 5.38839 17.4441 5.24818 17.2859 5.15014C17.1279 5.05214 16.9457 5.00014 16.7597 5H7.24029Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>

                <div className="ml-3.5 text-start">
                  <p className="toast-title text-sm font-medium leading-tight font-family-montserrat text-slate-950 text-start">
                    Discussion moved
                  </p>
                  <p className="toast-text mt-1 text-sm leading-tight font-family-baskervville text-slate-600 text-start">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit
                    oluptatum tenetur.
                  </p>

                  <div className="md:flex md:items-center md:gap-2 mt-2.5 text-start">
                    <button
                      className={`${BtnPrimary} rounded py-2 px-3 text-xs leading-4`}
                      onClick={() => alert("Undo clicked")}
                    >
                      Undo
                    </button>
                    <button
                      className={`${BtnWhite} rounded py-2 px-3 text-xs leading-4`}
                      onClick={() => setToastOpen(false)}
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
                    onClick={() => setToastOpen(false)}
                  >
                    <svg
                      className="size-5"
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
          )}
        </div>

        {/* Banner */}
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-black text-center py-10 mb-14 border-b border-b-black">
            banner
          </h2>

          {bannerOpen && (
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
                  <p className="banner-title text-sm/tight md:text-base/6 font-medium font-family-sourcecodepro text-start">
                    <span className="hidden md:block">
                      Big news! We&apos;re excited to announce a brand new
                      product.
                    </span>
                    <span className="block md:hidden">
                      We announced a new product!
                    </span>
                  </p>
                </div>

                <div className="ml-auto pl-4">
                  <div className="ml-auto flex items-center gap-2">
                    {/* Learn more (desktop) */}
                    <button
                      className="items-center justify-center bg-white text-slate-900 text-[10px] shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-2950 focus:ring-offset-2 rounded py-2.5 px-4 text-brand-2950 font-medium text-sm leading-tight hidden md:block"
                    >
                      Learn more
                    </button>
                    {/* Dismiss */}
                    <button
                      type="button"
                      className="inline-flex p-1.5 text-brand-white"
                      aria-label="Dismiss banner"
                      onClick={() => setBannerOpen(false)}
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
                >
                  Learn more
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
