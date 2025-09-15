"use client";

import React, { useEffect, useMemo, useRef, useState, type JSX } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SEO from "@/src/components/SEO";

import SecondaryNav from "@/src/components/SecondaryNav";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import SearchField from "@/src/components/InputFields/SearchField";
import DefaultDropdown from "@/src/components/Dropdowns/DefaultDropdown";
import Pagination from "@/src/components/Pagination";
import CardType6 from "@/src/components/Cards/CardType6";
import { PageSubTitle, InnerPageTitle } from "@/src/components/Typography";
import CsvTableTransparency from "@/src/components/CsvTransparency";

// ----------------------
// Types
// ----------------------
type TaxNode = { name: string; slug: string };

type TransparencyPost = {
  title: string;
  slug: string;
  industries: TaxNode[];
  years: TaxNode[];
  csvUrl: string | null;
};

// ----------------------
// GraphQL helpers
// ----------------------
async function gql<T>(query: string): Promise<T> {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_URL as string | undefined;
  if (!url) throw new Error("NEXT_PUBLIC_WORDPRESS_URL not defined");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GraphQL error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function fetchPageSEOByUri(uri: string): Promise<any | null> {
  const wpUri = uri.endsWith("/") ? uri : `${uri}/`;
  const encoded = wpUri.replace(/"/g, '\\"');
  const data = await gql<{ nodeByUri?: { __typename?: string; seo?: any } }>(
    `query GetSeoByUri {\n  nodeByUri(uri: "${encoded}") {\n    __typename\n    ... on Page {\n      seo {\n        title\n        metaDesc\n        canonical\n        opengraphTitle\n        opengraphDescription\n        opengraphUrl\n        opengraphSiteName\n        opengraphImage { sourceUrl }\n        twitterTitle\n        twitterDescription\n        twitterImage { sourceUrl }\n        schema { raw }\n      }\n    }\n  }\n}`
  );
  return data?.nodeByUri && (data.nodeByUri as any).seo
    ? (data.nodeByUri as any).seo
    : null;
}

async function fetchTransparencyYears(): Promise<TaxNode[]> {
  const data = await gql<{ transparencyYears: { nodes: TaxNode[] } }>(`
    query GetTransparencyYears {
      transparencyYears(first: 100) {
        nodes { name slug }
      }
    }
  `);
  return data?.transparencyYears?.nodes ?? [];
}

async function fetchTransparencyIndustries(): Promise<TaxNode[]> {
  const data = await gql<{ transparanceyIndustries: { nodes: TaxNode[] } }>(`
    query GetTransparencyIndustries {
      transparanceyIndustries(first: 100) {
        nodes { name slug }
      }
    }
  `);
  return data?.transparanceyIndustries?.nodes ?? [];
}

async function fetchTransparencyPosts(): Promise<TransparencyPost[]> {
  const data = await gql<{
    govTransparencies: {
      nodes: Array<{
        title: string;
        slug: string;
        transparanceyIndustries?: { nodes: TaxNode[] };
        transparencyYears?: { nodes: TaxNode[] };
        dataSetFields?: { dataSetFile?: { node?: { mediaItemUrl?: string } } };
      }>;
    };
  }>(`
    query GetTransparencyPosts {
      govTransparencies(first: 100) {
        nodes {
          title
          slug
          transparanceyIndustries { nodes { name slug } }
          transparencyYears { nodes { name slug } }
          dataSetFields {
            dataSetFile { node { mediaItemUrl } }
          }
        }
      }
    }
  `);

  return (
    data?.govTransparencies?.nodes?.map((n) => ({
      title: n.title,
      slug: n.slug,
      industries: n.transparanceyIndustries?.nodes ?? [],
      years: n.transparencyYears?.nodes ?? [],
      csvUrl: n.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? null,
    })) ?? []
  );
}

// ----------------------
// Component
// ----------------------
export default function PageTransparencyDashboard(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [seo, setSeo] = useState<any | null>(null);

  const [queryInput, setQueryInput] = useState("");
  const [industry, setIndustry] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [openId, setOpenId] = useState<"one" | "two" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [yearOptions, setYearOptions] = useState<TaxNode[]>([]);
  const [industryOptions, setIndustryOptions] = useState<TaxNode[]>([]);
  const [posts, setPosts] = useState<TransparencyPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<TransparencyPost[]>([]);
  const [currentCsvUrl, setCurrentCsvUrl] = useState<string | null>(null);

  // removed URL syncing; no init gating
  const pageSize = 10;

  // Load defaults from URL
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const ind = searchParams.get("industry");
    const yr = searchParams.get("year");
    setQueryInput(q);
    setIndustry(ind);
    setYear(yr);
  }, [searchParams]);

  // Load backend data
  useEffect(() => {
    async function load() {
      try {
        try {
          const s = await fetchPageSEOByUri(
            pathname || "/transparency-dashboard/"
          );
          setSeo(s);
        } catch (e) {
          console.warn("SEO fetch failed", e);
        }
        const [years, industries, posts] = await Promise.all([
          fetchTransparencyYears(),
          fetchTransparencyIndustries(),
          fetchTransparencyPosts(),
        ]);

        setYearOptions(years);
        setIndustryOptions(industries);
        setPosts(posts);

        // ✅ Only set defaults if nothing is chosen in the URL
        const yearInUrl = !!searchParams.get("year");
        const industryInUrl = !!searchParams.get("industry");

        if (!year && !yearInUrl && years.length > 0) {
          setYear(years[0].slug);
        }
        if (!industry && !industryInUrl && industries.length > 0) {
          setIndustry(industries[0].slug);
        }
      } catch (e) {
        console.error(e);
      } finally {
        // noop
      }
    }
    load();
  }, []);

  // Filter posts
  useEffect(() => {
    let results = posts;
    if (industry) {
      results = results.filter((p) =>
        p.industries.some((ind) => ind.slug === industry)
      );
    }
    if (year) {
      results = results.filter((p) => p.years.some((y) => y.slug === year));
    }
    setFilteredPosts(results);
    setCurrentPage(1);
  }, [industry, year, posts]);

  // Pick first CSV
  useEffect(() => {
    if (filteredPosts.length > 0) {
      setCurrentCsvUrl(filteredPosts[0].csvUrl ?? null);
    } else {
      setCurrentCsvUrl(null);
    }
  }, [filteredPosts]);

  // URL syncing removed to avoid jank and re-renders

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <main>
      <SEO yoast={seo as any} title="Transparency in government Institutions" />
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-4 lg:py-0">
          <SecondaryNav
            className="!font-baskervville"
            items={[
              { label: "Macro Economy", href: "#" },
              { label: "Government Fiscal Operations", href: "#" },
              {
                label: "Transparency in government Institutions",
                href: (() => {
                  const params = new URLSearchParams();
                  if (industry) params.set("industry", industry);
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/transparency-dashboard?${qs}`
                    : "/transparency-dashboard";
                })(),
              },
              {
                label: "State Owned Enterprises",
                href: (() => {
                  const params = new URLSearchParams();
                  if (industry) params.set("industry", industry);
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/state-owned-dashboard?${qs}`
                    : "/state-owned-dashboard";
                })(),
              },
            ]}
            activePath={pathname}
          />
        </div>
      </div>

      {/* Hero */}
      <HeroWhite
        title="Transparency in Government Institutions"
        paragraph="Explore accountability and transparency datasets across institutions."
        items={[{ label: "Transparency Dashboard" }]}
      />

      {/* Filters */}
      <section className="bg-white py-3.5 md:py-5 xl:py-6">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="lg:flex gap-2 items-center justify-between pb-9">
            <div className="relative w-full xl:w-1/2">
              <SearchField
                value={queryInput}
                onChange={(q) => {
                  setQueryInput(q);
                  setCurrentPage(1);
                }}
                placeholder="Search Transparency..."
              />
            </div>

            {/* Dropdowns */}
            <div className="grid md:flex gap-3 items-center md:justify-end w-full lg:w-1/2 mt-4 xl:mt-0">
              <span className="text-slate-800 font-medium text-lg/7 font-sourcecodepro md:flex md:justify-items-end mt-3 md:mt-0">
                Filter by :
              </span>

              <DefaultDropdown
                idKey="one"
                label={
                  industry
                    ? (industryOptions.find((i) => i.slug === industry)?.name ??
                      "Industry")
                    : "Industry"
                }
                items={[
                  { label: "All Industries", onClick: () => setIndustry(null) },
                  ...industryOptions.map((ind) => ({
                    label: ind.name,
                    onClick: () => setIndustry(ind.slug),
                  })),
                ]}
                align="right"
                open={openId === "one"}
                onOpenChange={(v) => setOpenId(v ? "one" : null)}
              />

              <DefaultDropdown
                idKey="two"
                label={
                  year
                    ? (yearOptions.find((y) => y.slug === year)?.name ?? "Year")
                    : "Year"
                }
                items={yearOptions.map((y) => ({
                  label: y.name,
                  onClick: () => setYear(y.slug),
                }))}
                align="right"
                open={openId === "two"}
                onOpenChange={(v) => setOpenId(v ? "two" : null)}
              />
            </div>
          </div>

          {/* CSV Table */}
          {currentCsvUrl ? (
            <CsvTableTransparency
              csvUrl={currentCsvUrl}
              filterQuery={queryInput}
            />
          ) : (
            <p className="text-gray-500">No dataset found for selection.</p>
          )}
        </div>
      </section>

      {/* Pagination */}
      <section className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pt-6 md:pt-9 hidden">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredPosts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Related datasets */}
      <section className="bg-pink-100 py-12 md:py-16 xl:py-20 mt-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="max-w-2xl text-left">
            <PageSubTitle>Advocata AI Suggestions</PageSubTitle>
            <InnerPageTitle>Related datasets</InnerPageTitle>
          </div>

          <div className="mt-11 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <CardType6
              title="Sri Lanka - Food Security and Nutrition Indicators"
              excerpt="Indicators covering nutrition, food production, and resilience."
              fileUrl=""
              postDate="2024-08-18"
              uri="#"
            />
            <CardType6
              title="TESLA Stock Data 2024"
              excerpt="Financial performance and global stock indicators."
              fileUrl=""
              postDate="2024-08-18"
              uri="#"
            />
            <CardType6
              title="Tourism Recovery and Crisis Management"
              excerpt="How effective crisis management supports tourism recovery."
              fileUrl=""
              postDate="2024-08-18"
              uri="#"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
