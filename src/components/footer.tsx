"use client";

import { useState, JSX } from "react";
import { useQuery } from "@apollo/client";
import { FOOTER_MENU_QUERY } from "@/queries/MenuQueries";
import NewsletterForm from "./NewsletterForm";
import { usePathname } from "next/navigation";

type FooterMenuItem = {
  id: string;
  label: string;
  uri?: string | null;
  parentId?: string | null;
};
export default function Footer(): JSX.Element {
  const [openQuick, setOpenQuick] = useState(false);
  const [openDashboards, setOpenDashboards] = useState(false);
  const pathname = usePathname();

  const { data } = useQuery(FOOTER_MENU_QUERY);
  const allItems: FooterMenuItem[] = data?.menu?.menuItems?.nodes ?? [];

  // Find top-level grouping items by label
  const quickLinksParent = allItems.find(
    (n) => !n.parentId && n.label?.toLowerCase?.().includes("quick")
  );
  const dashboardsParent = allItems.find(
    (n) => !n.parentId && n.label?.toLowerCase?.().includes("dashboard")
  );

  const quickLinks = quickLinksParent
    ? allItems.filter((n) => n.parentId === quickLinksParent.id)
    : [];
  const dashboards = dashboardsParent
    ? allItems.filter((n) => n.parentId === dashboardsParent.id)
    : [];

  return (
    <footer
      className="footer bg-brand-black font-sourcecodepro"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-12 sm:py-14 md:py-16">
        {/* Footer Menu Items */}
        <div>
          <div className="grid grid-cols-1 xl:grid-cols-2 xl:flex gap-6 xl:mt-0">
            {/* column 1 (desktop) */}
            <div className="mt-0 hidden xl:block p-0 xl:pl-7 xl:pt-7 w-full xl:w-2/5">
              <div className="mb-3.5">
                <span className="block w-10 border-t-4 border-brand-white" />
              </div>
              <h3 className="footer-heading text-2xl/snug tracking-normal font-montserrat font-normal text-brand-white">
                Quick Links
              </h3>
              <ul role="list" className="mt-6 space-y-4">
                {quickLinks.map((item) => {
                  const isActive = pathname === item.uri; // exact match
                  return (
                    <li key={item.id}>
                      <a
                        href={item.uri ?? "#"}
                        className={[
                          "footer-link text-base/6 font-normal font-sourcecodepro transform transition-all duration-300 ease-in-out hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline",
                          isActive
                            ? "text-brand-white font-medium hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline" // Active link style
                            : "text-brand-white/80",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* column 2 (desktop) */}
            <div className="hidden xl:block p-0 xl:pt-7 w-full xl:w-full">
              <div className="mb-3.5">
                <span className="block w-10 border-t-4 border-brand-white" />
              </div>
              <h3 className="footer-heading text-2xl/snug tracking-normal font-montserrat font-normal text-brand-white">
                Dashboards
              </h3>
              <ul
                role="list"
                className="mt-7 space-y-6 grid xl:grid-cols-2 gao-1.5"
              >
                {dashboards.map((item) => {
                  const isActive = pathname === item.uri;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.uri ?? "#"}
                        className={[
                          "footer-link text-base/6 font-normal font-sourcecodepro transform transition-all duration-300 ease-in-out hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline",
                          isActive
                            ? "text-brand-white font-medium hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline" // Active link style
                            : "text-brand-white/80",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* column 3 (desktop newsletter card) */}
            <div className="hidden xl:block">
              <NewsletterForm variant="desktop" />
            </div>

            {/* mobile dropdown menu - column 1 */}
            <div className="xl:hidden">
              <button
                type="button"
                onClick={() => setOpenQuick((v) => !v)}
                className="footer-toggle w-full text-left flex justify-between items-center border-b border-white/60 pb-7 text-2xl/snug tracking-normal font-montserrat font-normal text-brand-white"
              >
                <div className="flex gap-3.5 items-center">
                  <span className="block w-8 border-t-4 border-brand-white" />
                  <span>Quick Links</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 transform ${openQuick ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul
                className={`mt-7 space-y-6 grid xl:grid-cols-2 ${openQuick ? "block" : "hidden"}`}
              >
                {quickLinks.map((item) => {
                  const isActive = pathname === item.uri;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.uri ?? "#"}
                        className={[
                          "footer-link text-base/6 font-normal font-sourcecodepro transform transition-all duration-300 ease-in-out hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline",
                          isActive
                            ? "text-brand-white font-medium hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline" // Active link style
                            : "text-brand-white/80",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* mobile dropdown menu - column 2 */}
            <div className="xl:hidden">
              <button
                type="button"
                onClick={() => setOpenDashboards((v) => !v)}
                className="footer-toggle w-full text-left flex justify-between items-center border-b border-white/60 pb-7 text-2xl/snug tracking-normal font-montserrat font-normal text-brand-white"
              >
                <div className="flex gap-3.5 items-center">
                  <span className="block w-8 border-t-4 border-brand-white" />
                  <span>Dashboards</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform duration-300 transform ${openDashboards ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <ul
                className={`mt-7 space-y-6 grid xl:grid-cols-2 ${openDashboards ? "block" : "hidden"}`}
              >
                {dashboards.map((item) => {
                  const isActive = pathname === item.uri;
                  return (
                    <li key={item.id}>
                      <a
                        href={item.uri ?? "#"}
                        className={[
                          "footer-link text-base/6 font-normal font-sourcecodepro transform transition-all duration-300 ease-in-out hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline",
                          isActive
                            ? "text-brand-white font-medium hover:underline hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%] focus:no-underline"
                            : "text-brand-white/80",
                        ].join(" ")}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* mobile-only newsletter card */}
            <div className="xl:hidden">
              <NewsletterForm variant="mobile" />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="mt-16 border-t border-white pt-11 sm:mt-20 xl:mt-24 xl:flex xl:items-center xl:justify-between">
          <div className="pl-3 mt-3 mb-11 md:mb-12 xl:my-0">
            <div className="flex justify-center xl:justify-start gap-x-5 md:gap-x-8">
              {/* Facebook */}
              <a
                href="https://web.facebook.com/advocatainstitute"
                className="footer-social-link text-brand-white/60"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="size-10"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                >
                  <path
                    d="M19.0875 32.2084H10.7625C9.99662 32.2068 9.26249 31.9022 8.72034 31.3613C8.17819 30.8203 7.87206 30.0868 7.86876 29.3209V11.1334C7.87041 10.3665 8.17582 9.6314 8.71814 9.08907C9.26047 8.54674 9.99555 8.24134 10.7625 8.23969H28.625"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.5187 11.1334V29.3084C31.5187 30.0764 31.2141 30.8131 30.6716 31.3568C30.1291 31.9004 29.393 32.2067 28.625 32.2084H23"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.55 9.67712C31.8952 9.67712 32.175 9.3973 32.175 9.05212C32.175 8.70695 31.8952 8.42712 31.55 8.42712C31.2048 8.42712 30.925 8.70695 30.925 9.05212C30.925 9.3973 31.2048 9.67712 31.55 9.67712Z"
                    fill="currentColor"
                  />
                  <path
                    d="M19.0875 32.2084V24.4021H16.3375V20.6896H19.0875V17.1084C19.0875 16.1138 19.4826 15.16 20.1859 14.4567C20.8891 13.7535 21.8429 13.3584 22.8375 13.3584H26.7313V16.8896H23.8813C23.7585 16.8896 23.6369 16.9142 23.5238 16.9619C23.4107 17.0096 23.3083 17.0795 23.2226 17.1675C23.137 17.2555 23.0698 17.3598 23.0251 17.4741C22.9805 17.5885 22.9592 17.7107 22.9625 17.8334V20.6709H26.7125V24.4209H22.9625V32.2084"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* X */}
              <a
                href="https://x.com/advocatalk"
                className="footer-social-link text-brand-white/60"
                aria-label="X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                >
                  <path
                    d="M31.4938 11.2459V29.4209C31.4921 30.1867 31.1876 30.9209 30.6466 31.463C30.1056 32.0052 29.3722 32.3113 28.6063 32.3146H10.7375C9.97274 32.3113 9.2402 32.006 8.6994 31.4652C8.1586 30.9244 7.85333 30.1919 7.85004 29.4271V11.2459C7.85168 10.48 8.15623 9.74584 8.6972 9.20369C9.23818 8.66155 9.97166 8.35541 10.7375 8.35211H28.6063"
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M31.5249 9.78967C31.8701 9.78967 32.1499 9.50985 32.1499 9.16467C32.1499 8.81949 31.8701 8.53967 31.5249 8.53967C31.1797 8.53967 30.8999 8.81949 30.8999 9.16467C30.8999 9.50985 31.1797 9.78967 31.5249 9.78967Z"
                    fill="currentColor"
                  />
                  <path
                    d="M20.6945 18.8723L25.4687 13.0161M13.7499 27.3911L18.9585 21.0022M13.7499 13.0161H16.8749L26.2499 27.3911H23.1249L13.7499 13.0161Z"
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@advocatainstitute"
                className="footer-social-link text-brand-white/60"
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="size-10"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                >
                  <path
                    d="M31.5437 11.0521V29.2271C31.5421 29.993 31.2376 30.7271 30.6966 31.2693C30.1556 31.8114 29.4221 32.1176 28.6562 32.1209H10.7875C10.0227 32.1176 9.29016 31.8123 8.74936 31.2715C8.20856 30.7307 7.90328 29.9982 7.89999 29.2334V11.0521C7.90328 10.2873 8.20856 9.55478 8.74936 9.01398C9.29016 8.47318 10.0227 8.1679 10.7875 8.16461H28.6562"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.575 9.59589C31.9201 9.59589 32.2 9.31606 32.2 8.97089C32.2 8.62571 31.9201 8.34589 31.575 8.34589C31.2298 8.34589 30.95 8.62571 30.95 8.97089C30.95 9.31606 31.2298 9.59589 31.575 9.59589Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.7625 15.3334C15.0101 15.4447 14.322 15.8204 13.8215 16.393C13.321 16.9657 13.0408 17.6979 13.0312 18.4584V22.2084C13.0378 23.0571 13.3801 23.8688 13.9831 24.466C14.5862 25.0633 15.4012 25.3976 16.25 25.3959H19.2125"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M24.0188 15.2709H16.25C16.0927 15.2694 15.9356 15.284 15.7812 15.3147"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19.1937 25.3959H24.0187C24.8643 25.3926 25.6744 25.0561 26.2735 24.4594C26.8725 23.8627 27.2122 23.0539 27.2187 22.2084V18.4584C27.2185 17.6663 26.9246 16.9025 26.3937 16.3146"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.4813 19.2459L22.3688 20.3334L20.4813 21.4209L18.5938 22.5146V20.3334V18.1584"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://lk.linkedin.com/company/advocata-institute"
                className="footer-social-link text-brand-white/60"
                aria-label="Linked In"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="size-10"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                >
                  <path
                    d="M31.5188 11.1521V29.3271C31.5138 30.0908 31.2078 30.8218 30.6672 31.3612C30.1266 31.9007 29.395 32.2051 28.6312 32.2084H10.7625C9.9977 32.2051 9.26516 31.8998 8.72436 31.359C8.18356 30.8182 7.87829 30.0857 7.875 29.3209V11.1521C7.87665 10.3851 8.18206 9.65007 8.72438 9.10775C9.26671 8.56542 10.0018 8.26001 10.7687 8.25836H28.6312"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.55 9.69586C31.8952 9.69586 32.175 9.41604 32.175 9.07086C32.175 8.72568 31.8952 8.44586 31.55 8.44586C31.2048 8.44586 30.925 8.72568 30.925 9.07086C30.925 9.41604 31.2048 9.69586 31.55 9.69586Z"
                    fill="currentColor"
                  />
                  <path
                    d="M18.075 17.8834H21.2V18.9084H21.2625C21.6625 18.2834 22.325 17.6584 23.9563 17.6584C25.975 17.6584 27.4813 18.9896 27.4813 21.8896V27.7334H24.4188V22.2771C24.4188 21.0271 23.975 20.1396 22.8688 20.1396C22.5219 20.1424 22.1849 20.2553 21.9063 20.462C21.6278 20.6687 21.422 20.9585 21.3188 21.2896C21.2512 21.5378 21.2279 21.7959 21.25 22.0521V27.7396H18.1875V20.3334"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.75 20.3834V27.8209H12.6937V17.8834H15.75"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.95 14.5521C15.9525 14.8951 15.8531 15.231 15.6643 15.5173C15.4756 15.8037 15.2061 16.0275 14.89 16.1605C14.5739 16.2934 14.2254 16.3295 13.8887 16.2641C13.5521 16.1987 13.2424 16.0348 12.9991 15.7932C12.7557 15.5516 12.5896 15.2432 12.5217 14.907C12.4539 14.5708 12.4875 14.2221 12.6181 13.905C12.7488 13.5879 12.9707 13.3168 13.2556 13.126C13.5406 12.9352 13.8758 12.8334 14.2188 12.8334"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/advocatalk/"
                className="footer-social-link text-brand-white/60"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="size-10"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                >
                  <path
                    d="M31.4938 11.2459V29.4209C31.4921 30.1868 31.1876 30.9209 30.6466 31.4631C30.1056 32.0052 29.3722 32.3114 28.6063 32.3147H10.7375C9.97274 32.3114 9.2402 32.0061 8.6994 31.4653C8.1586 30.9245 7.85333 30.192 7.85004 29.4272V11.2459C7.85168 10.48 8.15623 9.7459 8.6972 9.20375C9.23818 8.66161 9.97166 8.35547 10.7375 8.35217H28.6063"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.5251 9.78967C31.8703 9.78967 32.1501 9.50985 32.1501 9.16467C32.1501 8.81949 31.8703 8.53967 31.5251 8.53967C31.1799 8.53967 30.9001 8.81949 30.9001 9.16467C30.9001 9.50985 31.1799 9.78967 31.5251 9.78967Z"
                    fill="currentColor"
                  />
                  <path
                    d="M24.3938 16.5834C24.739 16.5834 25.0188 16.3036 25.0188 15.9584C25.0188 15.6132 24.739 15.3334 24.3938 15.3334C24.0486 15.3334 23.7688 15.6132 23.7688 15.9584C23.7688 16.3036 24.0486 16.5834 24.3938 16.5834Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14.8563 13.0334C14.2666 13.0775 13.7154 13.343 13.3132 13.7765C12.911 14.21 12.6875 14.7795 12.6876 15.3709V25.2959C12.6892 25.9186 12.9373 26.5154 13.3777 26.9558C13.818 27.3961 14.4148 27.6442 15.0376 27.6459H20.4063"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.4063 27.6459H24.9625C25.5853 27.6442 26.182 27.3961 26.6224 26.9557C27.0627 26.5154 27.3109 25.9186 27.3125 25.2959V15.3709C27.3109 14.7481 27.0627 14.1513 26.6224 13.711C26.182 13.2706 25.5853 13.0225 24.9625 13.0209H15.0375C14.9773 13.0144 14.9165 13.0144 14.8563 13.0209"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.25 17.0459C20.5469 16.7792 19.7768 16.7444 19.0525 16.9466C18.3281 17.1487 17.6874 17.5773 17.2239 18.1696C16.7605 18.7618 16.4986 19.4868 16.4766 20.2385C16.4545 20.9902 16.6735 21.7293 17.1014 22.3477C17.5294 22.9661 18.1439 23.4315 18.8552 23.6757C19.5664 23.92 20.3372 23.9304 21.0548 23.7053C21.7724 23.4803 22.3992 23.0317 22.8436 22.425C23.2881 21.8184 23.5268 21.0854 23.525 20.3334"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* Tiktok */}
              <a
                href="https://www.tiktok.com/@advocatalk?_t=ZS-90X4fbBZm8j&_r=1"
                className="footer-social-link text-brand-white/60"
                aria-label="tik-tok"
              >
                <svg
                  width="40"
                  height="41"
                  viewBox="0 0 40 41"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M31.7687 11.3521V29.5271C31.7671 30.293 31.4626 31.0271 30.9216 31.5693C30.3806 32.1114 29.6471 32.4176 28.8812 32.4209H11.0125C10.2477 32.4176 9.51516 32.1123 8.97436 31.5715C8.43356 31.0307 8.12829 30.2982 8.125 29.5334V11.3521C8.12664 10.5862 8.43119 9.8521 8.97217 9.30996C9.51315 8.76781 10.2466 8.46167 11.0125 8.45837H28.8812"
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M31.525 9.78961C31.8702 9.78961 32.15 9.50979 32.15 9.16461C32.15 8.81943 31.8702 8.53961 31.525 8.53961C31.1798 8.53961 30.9 8.81943 30.9 9.16461C30.9 9.50979 31.1798 9.78961 31.525 9.78961Z"
                    fill="currentColor"
                  />
                  <path
                    d="M13.8399 23.4353C13.7376 22.7696 13.7818 21.9146 14.1941 21.059C14.9192 19.5555 16.5711 18.1464 18.9374 18.4994V20.9904C18.9374 20.9904 17.4016 20.5471 16.6166 21.7068C15.9166 22.7419 16.1733 24.9486 18.4255 24.9486C20.4046 24.9486 20.371 22.7643 20.371 22.7643V16.5743"
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20.3709 14.7931V13.2098H22.8283C22.8283 13.2098 22.6918 16.3836 26.2067 16.6224V19.0455C26.2067 19.0455 24.1933 19.0455 22.8283 17.9537V23.073C22.8283 23.073 22.7201 26.9758 18.5963 27.4409C17.5632 27.5577 16.2075 27.1335 15.1837 26.1439C14.8162 25.7883 14.5583 25.4281 14.3723 25.0844"
                    stroke="currentColor"
                    stroke-width="1.25"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="pr-3">
            <div className="flex justify-center xl:justify-start text-center xl:text-start">
              <ul className="grid xl:flex gap-3.5 xl:gap-12">
                <li>
                  <a
                    href="/terms-and-conditions"
                    className="footer-link text-sm/5 text-brand-white/60 hover:underline font-normal font-sourcecodepro transform transition-all duration-300 ease-in-out hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%]"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* site built details */}
        <div className="footer-bottom mt-10 md:mt-11 border-t border-white/50 pt-6 xl:pt-8 xl:flex xl:items-center xl:justify-between text-center xl:text-left">
          <div>
            <p className="footer-bottom-text text-sm/tight font-sourcecodepro font-normal text-brand-white">
              &copy; {new Date().getFullYear()} Advocata, Inc. All rights
              reserved.
            </p>
          </div>
          <div>
            <p className="text-sm/tight font-sourcecodepro font-normal text-brand-white/60 mt-3.5 xl:mt-0">
              Built by{" "}
              <a
                href="https://oddly.lk"
                target="_blank"
                rel="noopener noreferrer"
              >
                ODDLY
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
