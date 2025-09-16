"use client";

import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import SEO from "@/src/components/SEO";

import SearchField from "@/src/components/InputFields/SearchField";
import Pagination from "@/src/components/Pagination";
import DefaultDropdown from "@/src/components/Dropdowns/DefaultDropdown";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import SecondaryNav from "@/src/components/SecondaryNav";
import { PageSubTitle, InnerPageTitle } from "@/src/components/Typography";
import CsvTable from "@/src/components/CsvTable";
import CardType6 from "@/src/components/Cards/CardType6";

// ----------------------
// Types
// ----------------------
type TaxNode = { name: string; slug: string };

type SOEPost = {
  title: string;
  slug: string;
  industries: TaxNode[];
  years: TaxNode[];
  csvUrl: string | null;
};

// ----------------------
// GraphQL fetch helpers
// ----------------------
async function gql<T>(query: string): Promise<T> {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_URL as string | undefined;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not defined");
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
    `query GetSeoByUri {
      nodeByUri(uri: "${encoded}") {
        __typename
        ... on Page {
          seo {
            title
            metaDesc
            canonical
            opengraphTitle
            opengraphDescription
            opengraphUrl
            opengraphSiteName
            opengraphImage { sourceUrl }
            twitterTitle
            twitterDescription
            twitterImage { sourceUrl }
            schema { raw }
          }
        }
      }
    }`
  );
  return data?.nodeByUri && (data.nodeByUri as any).seo
    ? (data.nodeByUri as any).seo
    : null;
}

async function fetchSOEYears(): Promise<TaxNode[]> {
  const data = await gql<{ sOEYears: { nodes: TaxNode[] } }>(`
    query GetSOEYears {
      sOEYears(first: 100) {
        nodes { name slug }
      }
    }
  `);
  return data?.sOEYears?.nodes ?? [];
}

async function fetchSOEIndustries(): Promise<TaxNode[]> {
  const data = await gql<{ soeIndustries: { nodes: TaxNode[] } }>(`
    query GetSOEIndustries {
      soeIndustries(first: 100) {
        nodes { name slug }
      }
    }
  `);
  return data?.soeIndustries?.nodes ?? [];
}

async function fetchSOEPosts(): Promise<SOEPost[]> {
  const data = await gql<{
    stateOwnedEnterprises: {
      nodes: Array<{
        title: string;
        slug: string;
        soeIndustries?: { nodes: TaxNode[] };
        sOEYears?: { nodes: TaxNode[] };
        dataSetFields?: { dataSetFile?: { node?: { mediaItemUrl?: string } } };
      }>;
    };
  }>(`
    query GetSOEPosts {
      stateOwnedEnterprises(first: 100) {
        nodes {
          title
          slug
          soeIndustries { nodes { name slug } }
          sOEYears { nodes { name slug } }
          dataSetFields {
            dataSetFile { node { mediaItemUrl } }
          }
        }
      }
    }
  `);

  return (
    data?.stateOwnedEnterprises?.nodes?.map((node) => ({
      title: node.title,
      slug: node.slug,
      industries: node.soeIndustries?.nodes ?? [],
      years: node.sOEYears?.nodes ?? [],
      csvUrl: node.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? null,
    })) ?? []
  );
}

function sortYearsDesc(years: TaxNode[]): TaxNode[] {
  return [...years].sort((a, b) => {
    const an = parseInt(a.name.replace(/\D/g, ""), 10);
    const bn = parseInt(b.name.replace(/\D/g, ""), 10);
    if (!Number.isNaN(bn) && !Number.isNaN(an) && bn !== an) return bn - an;
    return b.name.localeCompare(a.name);
  });
}

// ----------------------
// Component
// ----------------------
export default function PageStateOwnedDashboard(): JSX.Element {
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
  const [soePosts, setSoePosts] = useState<SOEPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SOEPost[]>([]);
  const [currentCsvUrl, setCurrentCsvUrl] = useState<string | null>(null);
  const [currentPostTitle, setCurrentPostTitle] = useState("");

  const [isLoading, setIsLoading] = useState(true); // ✅ loader state

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

  // Load SOE data once
  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        try {
          const s = await fetchPageSEOByUri(
            pathname || "/state-owned-dashboard/"
          );
          setSeo(s);
        } catch (e) {
          console.warn("SEO fetch failed", e);
        }

        const [yearsRaw, industriesRaw, posts] = await Promise.all([
          fetchSOEYears(),
          fetchSOEIndustries(),
          fetchSOEPosts(),
        ]);

        const years = sortYearsDesc(yearsRaw);
        setYearOptions(years);
        setIndustryOptions(industriesRaw);
        setSoePosts(posts);

        const yearInUrl = !!searchParams.get("year");
        const industryInUrl = !!searchParams.get("industry");
        if (!year && !yearInUrl && years.length > 0) {
          const latestYearSlug = years[0].slug;
          setYear(latestYearSlug);

          const postsForLatestYear = posts.filter((p) =>
            p.years.some((y) => y.slug === latestYearSlug)
          );

          if (postsForLatestYear.length > 0) {
            const first = postsForLatestYear[0];
            const defaultIndustry = first.industries?.[0]?.slug ?? null;
            if (!industry && !industryInUrl && defaultIndustry)
              setIndustry(defaultIndustry);
            setCurrentCsvUrl(first.csvUrl ?? null);
            setCurrentPostTitle(first.title ?? "");
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filter posts
  useEffect(() => {
    let results = soePosts;
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
  }, [industry, year, soePosts]);

  // Pick current CSV
  useEffect(() => {
    if (filteredPosts.length > 0) {
      const post = filteredPosts[0];
      setCurrentCsvUrl(post.csvUrl);
      setCurrentPostTitle(post.title);
    } else {
      setCurrentCsvUrl(null);
      setCurrentPostTitle("");
    }
  }, [filteredPosts]);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return (
    <main>
      <SEO yoast={seo as any} title="State Owned Enterprises" />
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
      <div>
        <HeroWhite
          title="State Owned Enterprises"
          paragraph="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          items={[{ label: "State Owned Dashboard" }]}
        />
      </div>

      {/* Filters */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="lg:flex gap-2 items-center justify-between pb-9">
            {/* Search */}
            <div className="relative w-full xl:w-1/2">
              <SearchField
                value={queryInput}
                onChange={(q) => {
                  setQueryInput(q);
                  setCurrentPage(1);
                }}
                placeholder="Search SOE..."
              />
            </div>

            {/* Dropdowns */}
            <div className="grid md:flex gap-3 items-center md:justify-end w-full lg:w-1/2 mt-4 xl:mt-0">
              <span className="text-slate-800 font-medium text-lg/7 font-sourcecodepro md:flex md:justify-items-end mt-3 md:mt-0">
                Filter by :
              </span>

              {/* Industry Dropdown */}
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

              {/* Year Dropdown */}
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
          {isLoading ? (
            <p className="text-gray-500">Loading dataset...</p>
          ) : currentCsvUrl ? (
            <CsvTable csvUrl={currentCsvUrl} filterQuery={queryInput} />
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
