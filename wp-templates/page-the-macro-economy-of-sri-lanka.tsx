"use client";

import React from "react";
import { gql, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";

// GraphQL Query
const MACRO_QUERY = gql`
  query GetMacroEconomy {
    macroEconomies(first: 100) {
      nodes {
        id
        title
        excerpt
        uri
        macroDashboardsCardIcon
      }
    }
  }
`;

// Type for macro post
interface MacroPost {
  id: string;
  title: string;
  excerpt: string;
  uri: string;
  macroDashboardsCardIcon?: string | null;
}

// MacroCard Component
function MacroCard({ post }: { post: MacroPost }) {
  return (
    <div className="relative">
      {/* Background / Overlay */}
      <div
        className="absolute inset-0 rounded-lg shadow-lg"
        style={{
          background:
            "linear-gradient(0deg, rgba(0,0,0,0.5), rgba(0,0,0,0.5)), " +
            "linear-gradient(0deg, rgba(235,26,82,0.5), rgba(235,26,82,0.5)), " +
            "url('/assets/images/card-imgs/mid-1.jpg') center/cover no-repeat",
        }}
      ></div>

      {/* Card Content */}
      <div className="relative flex h-full flex-col overflow-hidden z-10 rounded-lg">
        <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0">
          <div
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 
            bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner
            text-sm xl:text-base font-semibold font-montserrat tracking-tight"
          >
            {/* Dynamic Icon only */}
            {post.macroDashboardsCardIcon && (
              <img
                src={post.macroDashboardsCardIcon}
                alt=""
                className="w-6 h-6 object-contain"
              />
            )}

            <span>{post.title}</span>
          </div>

          {/* Excerpt */}
          <p
            className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-sourcecodepro"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        </div>

        {/* Button */}
        <div className="px-6 py-8 sm:px-6 sm:py-10 flex items-start gap-2">
          <a
            href={post.uri}
            className="flex items-center gap-2 text-white font-medium hover:underline uppercase"
          >
            <span>Open Dashboard</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                d="M12.025 4.942 17.084 10l-5.059 5.058M2.917 10h14.025"
                stroke="#F8FAFC"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5"></div>
    </div>
  );
}

// Page Component
export default function PageMacroEconomyLanding() {
  const pathname = usePathname();
  const { data, loading, error } = useQuery(MACRO_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading macro economy posts.</p>;

  const posts: MacroPost[] = data?.macroEconomies?.nodes ?? [];

  // Split into columns like original layout
  const col1 = posts.slice(0, 2);
  const col2 = posts.slice(2, 5);
  const col3 = posts.slice(5, 7);

  return (
    <main>
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={[
              { label: "Macro Economy", href: "#" },
              { label: "Government Fiscal Operations", href: "#" },
              {
                label: "Transparency in Government Institutions",
                href: "/transparency-dashboard",
              },
              {
                label: "State Owned Enterprises",
                href: "/state-owned-dashboard",
              },
            ]}
            activePath={pathname}
          />
        </div>
      </div>

      {/* Hero */}
      <HeroWhite
        title="The Macro Economy of Sri Lanka"
        paragraph={`Explore Sri Lanka’s key macroeconomic indicators with live dashboards.`}
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "The Macro Economy of Sri Lanka" },
        ]}
      />

      {/* Card Grid */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-16 bg-white pb-12 md:pb-16 xl:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Column 1 */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {col1.map((post) => (
              <MacroCard key={post.id} post={post} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {col2.map((post) => (
              <MacroCard key={post.id} post={post} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="lg:col-span-3 flex flex-col gap-5">
            {col3.map((post) => (
              <MacroCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
