"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";

// GraphQL query
const MACRO_QUERY = `
  query GetMacroEconomyPosts {
    macroEconomies(first: 10) {
      nodes {
        id
        title
        excerpt
        uri
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

// Define type for posts
interface MacroPost {
  id: string;
  title: string;
  excerpt: string;
  uri: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
    };
  };
}
// Icon map
const ICONS: Record<string, JSX.Element> = {
  inflation: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M21 21.5H10C6.70017 21.5 5.05025 21.5 4.02513 20.4749C3 19.4497 3 17.7998 3 14.5V3.5"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 4.5H8"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7 7.5H11"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 20.5C6.07093 18.553 7.52279 13.5189 10.3063 13.5189C12.2301 13.5189 12.7283 15.9717 14.6136 15.9717C17.8572 15.9717 17.387 10.5 21 10.5"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "foreign-exchange": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M14.5 11C14.5 12.3807 13.3807 13.5 12 13.5C10.6192 13.5 9.5 12.3807 9.5 11C9.5 9.61929 10.6192 8.5 12 8.5C13.3807 8.5 14.5 9.61929 14.5 11Z"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 11V5.92705C22 5.35889 21.6756 4.84452 21.1329 4.67632C20.1903 4.38421 18.4794 4 16 4C11.4209 4 10.1967 5.67747 3.87798 4.42361C2.92079 4.23366 2 4.94531 2 5.92116V15.9382C2 16.6265 2.47265 17.231 3.1448 17.3792C8.71199 18.6069 10.5572 17.6995 13.5 17.2859"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8C3.95133 8 5.70483 6.40507 5.92901 4.75417M18.5005 4.5C18.5005 6.53964 20.2655 8.46899 22 8.46899M6.00049 17.4961C6.00049 15.287 4.20963 13.4961 2.00049 13.4961"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 16C16 15.4477 16.4477 15 17 15H22L20.5 13M22 18C22 18.5523 21.5523 19 21 19H16L17.5 21"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "foreign-reserves": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M15.5 13.5C19.0899 13.5 22 12.6046 22 11.5C22 10.3954 19.0899 9.5 15.5 9.5C11.9101 9.5 9 10.3954 9 11.5C9 12.6046 11.9101 13.5 15.5 13.5Z"
        stroke="#F8FAFC"
        strokeWidth="1.5"
      />
      <path
        d="M22 16C22 17.1046 19.0899 18 15.5 18C11.9101 18 9 17.1046 9 16"
        stroke="#F8FAFC"
        strokeWidth="1.5"
      />
      <path
        d="M22 11.5V20.3C22 21.515 19.0899 22.5 15.5 22.5C11.9101 22.5 9 21.515 9 20.3V11.5"
        stroke="#F8FAFC"
        strokeWidth="1.5"
      />
      <path
        d="M8.5 6.5C12.0899 6.5 15 5.60457 15 4.5C15 3.39543 12.0899 2.5 8.5 2.5C4.91015 2.5 2 3.39543 2 4.5C2 5.60457 4.91015 6.5 8.5 6.5Z"
        stroke="#F8FAFC"
        strokeWidth="1.5"
      />
      <path
        d="M6 11.5C4.10819 11.2698 2.36991 10.6745 2 9.5M6 16.5C4.10819 16.2698 2.36991 15.6745 2 14.5"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M6 21.5C4.10819 21.2698 2.36991 20.6745 2 19.5V4.5"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 6.5V4.5"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  "interest-rates": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M8 16.5L16 8.5M10 9.5C10 10.0523 9.55228 10.5 9 10.5C8.44772 10.5 8 10.0523 8 9.5C8 8.94772 8.44772 8.5 9 8.5C9.55228 8.5 10 8.94772 10 9.5ZM16 15.3284C16 15.8807 15.5523 16.3284 15 16.3284C14.4477 16.3284 14 15.8807 14 15.3284C14 14.7761 14.4477 14.3284 15 14.3284C15.5523 14.3284 16 14.7761 16 15.3284Z"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z"
        stroke="#F8FAFC"
        strokeWidth="1.5"
      />
    </svg>
  ),
  "gdp-growth": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M21 21.5H10C6.70017 21.5 5.05025 21.5 4.02513 20.4749C3 19.4497 3 17.7998 3 14.5V3.5"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.99707 17.499C11.5286 17.499 18.9122 16.0348 18.6979 6.93269M16.4886 8.54302L18.3721 6.64612C18.5656 6.45127 18.8798 6.44981 19.0751 6.64286L20.9971 8.54302"
        stroke="#F8FAFC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "national-debt": (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
    >
      <path
        d="M2 9.06907C2 7.87289 2.48238 7.13982 3.48063 6.58428L7.58987 4.29744C9.7431 3.09915 10.8197 2.5 12 2.5C13.1803 2.5 14.2569 3.09915 16.4101 4.29744L20.5194 6.58428C21.5176 7.13982 22 7.8729 22 9.06907C22 9.39343 22 9.55561 21.9646 9.68894C21.7785 10.3895 21.1437 10.5 20.5307 10.5H3.46928C2.85627 10.5 2.22152 10.3894 2.03542 9.68894C2 9.55561 2 9.39343 2 9.06907Z"
        stroke="#F8FAFC"
        strokeWidth="1.5"
      />
      <path
        d="M11.9961 7.5H12.0051"
        stroke="#F8FAFC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 10.5V19M8 10.5V19" stroke="#F8FAFC" strokeWidth="1.5" />
      <path d="M16 10.5V19M20 10.5V19" stroke="#F8FAFC" strokeWidth="1.5" />
      <path
        d="M19 19H5C3.34315 19 2 20.3431 2 22C2 22.2761 2.22386 22.5 2.5 22.5H21.5C21.7761 22.5 22 22.2761 22 22C22 20.3431 20.6569 19 19 19Z"
        stroke="#F8FAFC"
        strokeWidth="1.5"
      />
    </svg>
  ),
  unemployment: (
    <svg
      width="26"
      height="27"
      viewBox="0 0 26 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.002 6.38892L1.00008 11.2752C0.998933 14.2094 0.998355 15.6765 1.90964 16.5881C2.82093 17.4998 4.28803 17.4998 7.22223 17.4999L12.5566 17.5C15.4894 17.5001 16.9557 17.5001 17.8669 16.5891C18.7781 15.6781 18.7785 14.2117 18.779 11.2789L18.78 6.38892"
        stroke="#F8FAFC"
        strokeWidth="1.33335"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.77783 4.61115C6.77783 3.36272 6.77783 2.73851 7.07744 2.29011C7.20714 2.09599 7.37381 1.92932 7.56794 1.79961C8.01633 1.5 8.64055 1.5 9.889 1.5C11.1374 1.5 11.7616 1.5 12.21 1.79961C12.4041 1.92932 12.5708 2.09599 12.7005 2.29011C13.0001 2.73851 13.0001 3.36272 13.0001 4.61115"
        stroke="#F8FAFC"
        strokeWidth="1.33335"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9996 4.61123L2.77797 4.61108C1.79622 4.61115 1.00009 5.40725 1 6.389C1.00009 8.35255 2.59236 9.94483 4.55591 9.94501H15.2216C17.1852 9.94492 18.7774 8.35273 18.7775 6.38915C18.7774 5.40738 17.9813 4.61129 16.9996 4.61123Z"
        stroke="#F8FAFC"
        strokeWidth="1.33335"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24.9994 25.5L19 19.5M19.0006 25.5L25 19.5"
        stroke="#F8FAFC"
        strokeWidth="1.50001"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

// Get slug from URI
function getSlug(uri: string): string {
  return uri?.split("/")?.filter(Boolean)?.pop() || "";
}

const MACRO_CACHE_KEY = "macroEconomyPostsCache:v1";
let macroPostsCache: MacroPost[] | null = null;

function saveMacroCache(posts: MacroPost[]) {
  macroPostsCache = posts;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(MACRO_CACHE_KEY, JSON.stringify(posts));
  } catch {
    // ignore storage failures
  }
}

function readMacroCache(): MacroPost[] | null {
  if (macroPostsCache) {
    return macroPostsCache;
  }
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(MACRO_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MacroPost[];
    if (Array.isArray(parsed)) {
      macroPostsCache = parsed;
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function useMacroEconomyPosts() {
  const [posts, setPosts] = useState<MacroPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cached = readMacroCache();
    if (cached && cached.length) {
      setPosts(cached);
      setLoading(false);
    }

    async function load() {
      const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_URL;
      if (!endpoint) {
        if (!cancelled) {
          setError("WordPress endpoint is not configured.");
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: MACRO_QUERY }),
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load posts (" + response.status + ").");
        }

        const result = await response.json();
        const nodes = result?.data?.macroEconomies?.nodes;
        if (!Array.isArray(nodes)) {
          throw new Error("Unexpected response structure.");
        }

        const nextPosts: MacroPost[] = nodes.filter(Boolean);

        if (!cancelled) {
          setPosts(nextPosts);
          setError(null);
          setLoading(false);
          saveMacroCache(nextPosts);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load macro economy posts."
          );
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading, error };
}

export default function PageMacroEconomyLanding() {
  const pathname = usePathname();
  const { posts, loading, error } = useMacroEconomyPosts();

  const { col1, col2, col3 } = useMemo(() => {
    return {
      col1: posts.slice(0, 2),
      col2: posts.slice(2, 5),
      col3: posts.slice(5, 7),
    };
  }, [posts]);

  const hasPosts = posts.length > 0;
  const showPlaceholder = loading && !hasPosts;
  const showError = !!error && !hasPosts;

  return (
    <main>
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="bg-white border-b border-slate-300">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
            <SecondaryNav
              className="!font-baskervville"
              items={[
                {
                  label: "Macro Economy",
                  href: "/the-macro-economy-of-sri-lanka",
                },
                {
                  label: "Government Fiscal Operations",
                  href: "/government-fiscal-operations",
                },
                {
                  label: "Transparency in government Institutions",
                  href: "/transparency-in-government-institutions",
                },
                {
                  label: "State Owned Enterprises",
                  href: "/state-owned-enterprises",
                },
              ]}
              activePath={pathname}
            />
          </div>
        </div>
      </div>

      {/* Hero */}
      <HeroWhite
        title="The Macro Economy of Sri Lanka"
        paragraph="Explore key macroeconomic indicators with real-time dashboards."
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "The Macro Economy of Sri Lanka" },
        ]}
      />

      {/* Card Section */}
      <div className="max-w-7xl mx-auto px-5 md:px-10 xl:px-16 bg-white pb-12 md:pb-16 xl:pb-20">
        {showPlaceholder ? (
          <div className="flex items-center justify-center min-h-[200px] rounded-xl border border-dashed border-slate-200 bg-white text-slate-600 text-sm font-medium">
            Loading macro dashboards...
          </div>
        ) : showError ? (
          <div className="flex flex-col items-center justify-center gap-1 min-h-[200px] rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-medium text-center px-6">
            <span>
              Unable to load macro economy dashboards. Please try again later.
            </span>
            {error ? (
              <span className="block text-xs text-red-600/80">{error}</span>
            ) : null}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
            {/* Column 1 */}
            <div className="lg:col-span-3 flex flex-col gap-5 h-full">
              {col1.map((post, i) => (
                <MacroCard
                  key={post.id}
                  post={post}
                  gradient={i === 0 ? "lg:rounded-tl-4xl" : "lg:rounded-bl-4xl"}
                  flexGrow
                />
              ))}
            </div>

            {/* Column 2 */}
            <div className="lg:col-span-6 flex flex-col gap-5 h-full">
              {col2.map((post) => (
                <MacroCard key={post.id} post={post} flexGrow />
              ))}
            </div>

            {/* Column 3 */}
            <div className="lg:col-span-3 flex flex-col gap-5 h-full">
              {col3.map((post, i) => (
                <MacroCard
                  key={post.id}
                  post={post}
                  gradient={i === 0 ? "lg:rounded-tr-4xl" : "lg:rounded-br-4xl"}
                  flexGrow
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Card Section End */}
    </main>
  );
}

// Card component
function MacroCard({
  post,
  gradient = "",
  flexGrow = false,
}: {
  post: MacroPost;
  gradient?: string;
  flexGrow?: boolean;
}) {
  const featuredImg = post.featuredImage?.node?.sourceUrl;

  return (
    <div className={`relative ${flexGrow ? "flex-1" : ""}`}>
      {/* Background with overlay */}
      <div
        className={`absolute inset-0 rounded-lg shadow-lg ${gradient}`}
        style={{
          background: `
            linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)),
            linear-gradient(0deg, rgba(235,26,82,0.4), rgba(235,26,82,0.4)),
            url(${featuredImg || "/assets/images/card-imgs/mid-1.jpg"}) center/cover no-repeat
          `,
        }}
      ></div>

      {/* Card content */}
      <div className="relative flex h-full flex-col overflow-hidden z-10 rounded-lg">
        <div className="px-6 pt-8 pb-3 sm:px-6 sm:pt-10 sm:pb-0">
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full text-slate-50 bg-white/10 backdrop-blur-lg border border-white/20 shadow-inner text-sm xl:text-base font-semibold font-montserrat tracking-tight">
            {ICONS[getSlug(post.uri)]}
            <span>{post.title}</span>
          </div>
          <p
            className="mt-2 max-w-lg text-base/6 text-slate-50 font-normal font-sourcecodepro"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        </div>

        <div className="px-6 py-8 sm:px-6 sm:py-10 flex items-start gap-2 mt-auto">
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
      <div
        className={`pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-black/5 ${gradient}`}
      ></div>
    </div>
  );
}
