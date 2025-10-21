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
import RelatedDatasets from "@/src/components/RelatedDatasets";

// ----------------------
// Utils
// ----------------------
function firstParagraphFromHtml(html?: string | null): string {
  if (!html) return "";
  const matches = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  for (const p of matches) {
    const inner = p
      .replace(/^<p\b[^>]*>/i, "")
      .replace(/<\/p>$/i, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+\n/g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
    if (inner) return inner;
  }
  return "";
}

// ----------------------
// Simple in-memory + session cache to keep data
// when switching dashboard tabs client-side.
// ----------------------
type TransparencyDataCache = {
  years: TaxNode[];
  industries: TaxNode[];
  posts: TransparencyPost[];
};

const TRANSPARENCY_CACHE_KEY = "transparencyDashboardData:v1";
let transparencyDataCache: TransparencyDataCache | null = null;

function saveTransparencyCache(data: TransparencyDataCache) {
  transparencyDataCache = data;
  try {
    sessionStorage.setItem(TRANSPARENCY_CACHE_KEY, JSON.stringify(data));
  } catch {}
}

function readTransparencyCache(): TransparencyDataCache | null {
  if (transparencyDataCache) return transparencyDataCache;
  try {
    const raw = sessionStorage.getItem(TRANSPARENCY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TransparencyDataCache;
    transparencyDataCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

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
  methodologyFileUrl: string | null;
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

async function fetchPageMetaByUri(
  uri: string
): Promise<{ title?: string | null; content?: string | null } | null> {
  const wpUri = uri.endsWith("/") ? uri : `${uri}/`;
  const encoded = wpUri.replace(/"/g, '\\"');
  const data = await gql<{
    nodeByUri?: {
      __typename?: string;
      title?: string | null;
      content?: string | null;
    };
  }>(
    `query GetPageMetaByUri {
      nodeByUri(uri: "${encoded}") {
        __typename
        ... on Page { title content }
      }
    }`
  );
  if (!data?.nodeByUri) return null;
  const node: any = data.nodeByUri as any;
  return { title: node?.title ?? null, content: node?.content ?? null };
}

// ✅ Combined query for years, industries, and posts
async function fetchTransparencyDashboardData(): Promise<{
  years: TaxNode[];
  industries: TaxNode[];
  posts: TransparencyPost[];
}> {
  const data = await gql<{
    transparencyYears: { nodes: TaxNode[] };
    transparanceyIndustries: { nodes: TaxNode[] };
    govTransparencies: {
      nodes: Array<{
        title: string;
        slug: string;
        transparanceyIndustries?: { nodes: TaxNode[] };
        transparencyYears?: { nodes: TaxNode[] };
        dashboardMethodologyFileSection?: {
          methodologyFile?: { node?: { mediaItemUrl?: string } };
        };
        dataSetFields?: { dataSetFile?: { node?: { mediaItemUrl?: string } } };
      }>;
    };
  }>(`
    query GetTransparencyDashboardData {
      transparencyYears(first: 100) {
        nodes { name slug }
      }
      transparanceyIndustries(first: 100) {
        nodes { name slug }
      }
      govTransparencies(first: 100) {
        nodes {
          databaseId
          title
          slug
          transparanceyIndustries { nodes { name slug } }
          transparencyYears { nodes { name slug } }
          dataSetFields {
            dataSetFile { node { mediaItemUrl } }
          }
          dashboardMethodologyFileSection{
            methodologyFile{
              node{
                mediaItemUrl
              }
            }
          }
        }
      }
    }
  `);

  return {
    years: data?.transparencyYears?.nodes ?? [],
    industries: data?.transparanceyIndustries?.nodes ?? [],
    posts:
      data?.govTransparencies?.nodes?.map((n) => ({
        databaseId: (n as any).databaseId,
        title: n.title,
        slug: n.slug,
        industries: n.transparanceyIndustries?.nodes ?? [],
        years: n.transparencyYears?.nodes ?? [],
        csvUrl: n.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? null,
        methodologyFileUrl:
          n.dashboardMethodologyFileSection?.methodologyFile?.node
            ?.mediaItemUrl ?? null,
      })) ?? [],
  };
}

// ----------------------
// Component
// ----------------------
export default function PageTransparencyDashboard(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [seo, setSeo] = useState<any | null>(null);
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroParagraph, setHeroParagraph] = useState<string>("");

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

  const [isLoading, setIsLoading] = useState(true); // ✅ loader

  const pageSize = 10;

  // Instant hydrate from cache to avoid loader on tab returns
  useEffect(() => {
    const cached = readTransparencyCache();
    if (!cached) return;

    setYearOptions(cached.years);
    setIndustryOptions(cached.industries);
    setPosts(cached.posts);

    const urlYear = searchParams.get("year");
    const urlIndustry = searchParams.get("industry");
    const effectiveYear = urlYear ?? year ?? cached.years[0]?.slug ?? null;
    const effectiveIndustry =
      urlIndustry ?? industry ?? cached.industries[0]?.slug ?? null;
    if (!year && effectiveYear) setYear(effectiveYear);
    if (!industry && effectiveIndustry) setIndustry(effectiveIndustry);

    let initial = cached.posts;
    if (effectiveIndustry) {
      initial = initial.filter((p) =>
        p.industries.some((ind) => ind.slug === effectiveIndustry)
      );
    }
    if (effectiveYear) {
      initial = initial.filter((p) =>
        p.years.some((y) => y.slug === effectiveYear)
      );
    }
    setFilteredPosts(initial);
    setCurrentCsvUrl(initial[0]?.csvUrl ?? null);
    setIsLoading(false);
  }, []);

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
      const cached = readTransparencyCache();
      if (!cached) setIsLoading(true);
      try {
        const [seoRes, data, meta] = await Promise.all([
          fetchPageSEOByUri(
            pathname || "/transparency-in-government-institutions/"
          ).catch((e) => {
            console.warn("SEO fetch failed", e);
            return null as any;
          }),
          fetchTransparencyDashboardData(),
          fetchPageMetaByUri(
            pathname || "/transparency-in-government-institutions/"
          ).catch((e) => {
            console.warn("Meta fetch failed", e);
            return null as any;
          }),
        ]);
        if (seoRes) setSeo(seoRes);
        if (meta) {
          setHeroTitle(meta.title ?? "");
          setHeroParagraph(firstParagraphFromHtml(meta.content));
        }

        const { years, industries, posts } = data;

        setYearOptions(years);
        setIndustryOptions(industries);
        setPosts(posts);
        saveTransparencyCache({ years, industries, posts });

        // Prime selection and results immediately (URL > state > first available)
        const urlYear = searchParams.get("year");
        const urlIndustry = searchParams.get("industry");
        const effectiveYear = urlYear ?? year ?? years[0]?.slug ?? null;
        const effectiveIndustry =
          urlIndustry ?? industry ?? industries[0]?.slug ?? null;

        if (!year && effectiveYear) setYear(effectiveYear);
        if (!industry && effectiveIndustry) setIndustry(effectiveIndustry);

        let initialResults = posts;
        if (effectiveIndustry) {
          initialResults = initialResults.filter((p) =>
            p.industries.some((ind) => ind.slug === effectiveIndustry)
          );
        }
        if (effectiveYear) {
          initialResults = initialResults.filter((p) =>
            p.years.some((y) => y.slug === effectiveYear)
          );
        }
        setFilteredPosts(initialResults);
        setCurrentCsvUrl(initialResults[0]?.csvUrl ?? null);

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
        setIsLoading(false);
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

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <main>
      <SEO yoast={seo as any} title="Transparency in government Institutions" />
      {/* Secondary Navigation */}
      <div className="bg-white border-b border-slate-300">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 py-0 lg:py-0">
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
                href: (() => {
                  const params = new URLSearchParams();
                  if (industry) params.set("industry", industry);
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/transparency-in-government-institutions?${qs}`
                    : "/transparency-in-government-institutions";
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
                    ? `/state-owned-enterprises?${qs}`
                    : "/state-owned-enterprises";
                })(),
              },
            ]}
            activePath={pathname}
          />
        </div>
      </div>

      {/* Hero */}
      <HeroWhite
        title={heroTitle || "Transparency in Government Institutions"}
        paragraph={
          heroParagraph ||
          "Explore accountability and transparency datasets across institutions."
        }
        items={[
          { label: "Dashboards", href: "/dashboard" },
          { label: "Transparency Dashboard" },
        ]}
      />

      {/* Filters */}
      <section className="bg-white pt-3.5 md:pt-5 xl:pt-6 pb-6 md:pb-9 xl:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="lg:flex gap-2 xl:gap-12 items-center justify-between pb-9">
            <div className="relative w-full xl:w-3/4">
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
          {isLoading ? (
            <p className="text-gray-500 pb-6 text-xl font-sourcecodepro font-medium">
              Loading dataset...
            </p>
          ) : currentCsvUrl ? (
            <CsvTableTransparency
              csvUrl={currentCsvUrl}
              filterQuery={queryInput}
            />
          ) : (
            <p className="text-gray-500 pb-6 text-xl font-sourcecodepro font-medium">
              No dataset found for selection.
            </p>
          )}
          {filteredPosts[0]?.methodologyFileUrl && (
            <div className="bg-gray-50 rounded-lg px-6 py-3.5 mt-3">
              <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-sourcecodepro">
                <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro flex items-center gap-2">
                  <p>
                    To access the methodology for the dashboard on the
                    Transparency in Government Institutions click{" "}
                    <a
                      href={filteredPosts[0]?.methodologyFileUrl}
                      className="text-brand-1-600"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <section className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-16 hidden">
        <Pagination
          currentPage={currentPage}
          totalItems={filteredPosts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </section>

      {/* Related datasets */}
      {paginatedPosts.map((post) => (
        <RelatedDatasets
          key={post.slug}
          datasetId={String((post as any).databaseId)}
        />
      ))}
    </main>
  );
}
