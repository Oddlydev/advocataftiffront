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
            <div className="hidden xl:block p-0 xl:pt-7 w-full xl:w-3/5">
              <div className="mb-3.5">
                <span className="block w-10 border-t-4 border-brand-white" />
              </div>
              <h3 className="footer-heading text-2xl/snug tracking-normal font-montserrat font-normal text-brand-white">
                Dashboards
              </h3>
              <ul role="list" className="mt-7 space-y-6 grid xl:grid-cols-2">
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
                href="#"
                className="footer-social-link text-brand-white/60"
                aria-label="Facebook"
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
                href="#"
                className="footer-social-link text-brand-white/60"
                aria-label="X"
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
                    d="M31.5437 11.0521V29.2271C31.5421 29.993 31.2376 30.7271 30.6966 31.2693C30.1556 31.8114 29.4221 32.1176 28.6562 32.1209H10.7938C10.029 32.1176 9.29641 31.8123 8.75561 31.2715C8.21481 30.7307 7.90954 29.9982 7.90625 29.2334V11.0521C7.90954 10.2873 8.21481 9.55478 8.75561 9.01398C9.29641 8.47318 10.029 8.1679 10.7938 8.16461H28.6562"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M31.575 9.59589C31.9202 9.59589 32.2 9.31606 32.2 8.97089C32.2 8.62571 31.9202 8.34589 31.575 8.34589C31.2298 8.34589 30.95 8.62571 30.95 8.97089C30.95 9.31606 31.2298 9.59589 31.575 9.59589Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.9313 20.7834C15.1748 20.5107 14.4661 20.1205 13.8313 19.6272C13.4944 19.3299 13.2202 18.9684 13.0249 18.5637C12.8296 18.1591 12.717 17.7196 12.6938 17.2709C12.6938 16.9084 12.5688 15.0834 13.1813 15.1272C13.2813 15.1272 13.3688 15.2209 13.4313 15.2959C13.5901 15.4861 13.7591 15.6677 13.9375 15.8397C14.6718 16.5496 15.5434 17.102 16.4989 17.4631C17.4543 17.8243 18.4734 17.9864 19.4938 17.9397C19.3963 17.3683 19.4617 16.7811 19.6823 16.2452C19.903 15.7093 20.27 15.2463 20.7414 14.9092C21.2129 14.5721 21.7697 14.3745 22.3481 14.339C22.9266 14.3035 23.5034 14.4315 24.0125 14.7084C24.3162 14.9196 24.6488 15.0859 25 15.2022C25.2546 15.2428 25.5141 15.2428 25.7688 15.2022L27.6438 14.9897C27.0059 15.7353 26.468 16.5611 26.0438 17.4459C25.7501 18.285 25.5551 19.1555 25.4625 20.0397C25.2712 21.0233 24.888 21.9596 24.3346 22.795C23.7812 23.6304 23.0686 24.3486 22.2375 24.9084C22.0019 25.0672 21.7555 25.2092 21.5 25.3334C21.1562 25.5262 20.7966 25.6893 20.425 25.8209L20.0813 25.9397L19.7 26.0459C17.9248 26.4445 16.0801 26.4145 14.3188 25.9584L13.5875 25.7897L12.7313 25.5522C13.7818 25.4914 14.8023 25.1784 15.7063 24.6397C15.8875 24.5334 16.075 24.3834 16.05 24.1834C16.0372 24.1117 16.0095 24.0434 15.9686 23.9831C15.9276 23.9228 15.8745 23.8718 15.8125 23.8334C15.161 23.2619 14.5985 22.5962 14.1438 21.8584"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="footer-social-link text-brand-white/60"
                aria-label="YouTube"
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
                href="#"
                className="footer-social-link text-brand-white/60"
                aria-label="Linked In"
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
                href="#"
                className="footer-social-link text-brand-white/60"
                aria-label="Instagram"
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

              {/* WhatsApp */}
              <a
                href="#"
                className="footer-social-link text-brand-white/60"
                aria-label="whatsApp"
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
                    d="M18.9376 18.0272L17.7188 16.8084L17.1751 17.3522C16.8155 17.712 16.6136 18.1998 16.6136 18.7084C16.6136 19.217 16.8155 19.7049 17.1751 20.0647L20.1626 23.0522C20.5224 23.4117 21.0102 23.6136 21.5188 23.6136C22.0274 23.6136 22.5153 23.4117 22.8751 23.0522L23.4188 22.5084L22.5001 21.5834"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27.1251 20.3334C27.1252 21.5836 26.7965 22.8118 26.1718 23.8947C25.5471 24.9776 24.6484 25.8771 23.5661 26.5028C22.4838 27.1285 21.2559 27.4584 20.0057 27.4594C18.7555 27.4604 17.5271 27.1324 16.4438 26.5084L14.8251 26.9397L12.8751 27.4584L13.3938 25.5084L13.8251 23.8897C13.2801 22.9429 12.9601 21.8835 12.8898 20.7933C12.8196 19.7031 13.0009 18.6114 13.4199 17.6025C13.8389 16.5936 14.4842 15.6946 15.3061 14.9749C16.1279 14.2552 17.1042 13.7341 18.1596 13.4519C19.2149 13.1697 20.3211 13.134 21.3924 13.3475C22.4638 13.5609 23.4717 14.0179 24.3383 14.6831C25.2049 15.3482 25.9069 16.2037 26.3901 17.1835C26.8734 18.1632 27.1248 19.241 27.1251 20.3334Z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
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
                    href="/privacy-policy"
                    className="footer-link text-sm/5 text-brand-white/60 hover:underline font-normal font-sourcecodepro transform transition-all duration-300 ease-in-out hover:decoration-[6px_solid_currentColor] hover:decoration-from-font hover:underline-offset-[40%]"
                  >
                    Privacy Policy
                  </a>
                </li>
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
