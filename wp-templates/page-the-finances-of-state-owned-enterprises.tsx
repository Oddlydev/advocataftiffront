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
import CsvTable from "@/src/components/CsvTable";
import RelatedDatasets from "@/src/components/RelatedDatasets";

// ----------------------
// Simple in-memory + session cache for SOE dashboard data
// ----------------------
type SOEDataCache = {
  years: TaxNode[];
  industries: TaxNode[];
  posts: SOEPost[];
};

const SOE_CACHE_KEY = "soeDashboardData:v1";
let soeDataCache: SOEDataCache | null = null;

function saveSOECache(data: SOEDataCache) {
  soeDataCache = data;
  try {
    sessionStorage.setItem(SOE_CACHE_KEY, JSON.stringify(data));
  } catch {}
}

function readSOECache(): SOEDataCache | null {
  if (soeDataCache) return soeDataCache;
  try {
    const raw = sessionStorage.getItem(SOE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SOEDataCache;
    soeDataCache = parsed;
    return parsed;
  } catch {
    return null;
  }
}

// ----------------------
// Utils
// ----------------------
function firstParagraphFromHtml(html?: string | null): string {
  if (!html) return "";
  // Grab all <p> blocks
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
// Types
// ----------------------
type TaxNode = { name: string; slug: string };

type SOEPost = {
  databaseId: number;
  title: string;
  slug: string;
  industries: TaxNode[];
  years: TaxNode[];
  csvUrl: string | null;
  methodologyFileUrl?: string | null;
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
  const encoded = wpUri.replace(/"/g, '"');
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
    }`,
  );
  return data?.nodeByUri && (data.nodeByUri as any).seo
    ? (data.nodeByUri as any).seo
    : null;
}

async function fetchPageMetaByUri(
  uri: string,
): Promise<{ title?: string | null; content?: string | null } | null> {
  const wpUri = uri.endsWith("/") ? uri : `${uri}/`;
  const encoded = wpUri.replace(/"/g, '"');
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
    }`,
  );
  if (!data?.nodeByUri) return null;
  const node: any = data.nodeByUri as any;
  return { title: node?.title ?? null, content: node?.content ?? null };
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
        databaseId: number;
        title: string;
        slug: string;
        soeIndustries?: { nodes: TaxNode[] };
        sOEYears?: { nodes: TaxNode[] };
        dataSetFields?: { dataSetFile?: { node?: { mediaItemUrl?: string } } };
        dashboardMethodologyFileSection?: {
          methodologyFile?: { node?: { mediaItemUrl?: string } };
        };
      }>;
    };
  }>(`
    query GetSOEPosts {
      stateOwnedEnterprises(first: 100) {
        nodes {
          databaseId
          title
          slug
          soeIndustries { nodes { name slug } }
          sOEYears { nodes { name slug } }
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

  return (
    data?.stateOwnedEnterprises?.nodes?.map((node) => ({
      databaseId: node.databaseId,
      title: node.title,
      slug: node.slug,
      industries: node.soeIndustries?.nodes ?? [],
      years: node.sOEYears?.nodes ?? [],
      csvUrl: node.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? null,
      methodologyFileUrl:
        node.dashboardMethodologyFileSection?.methodologyFile?.node
          ?.mediaItemUrl ?? null,
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
export default function PageTheFinancesofStateOwnedEnterprises(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [seo, setSeo] = useState<any | null>(null);
  const [heroTitle, setHeroTitle] = useState<string>("");
  const [heroParagraph, setHeroParagraph] = useState<string>("");

  const [queryInput, setQueryInput] = useState("");
  // Multi-select industries to filter CSV rows by Sector column
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [year, setYear] = useState<string | null>(null);
  const [openId, setOpenId] = useState<"one" | "two" | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [yearOptions, setYearOptions] = useState<TaxNode[]>([]);
  const [industryOptions, setIndustryOptions] = useState<TaxNode[]>([]);
  const [soePosts, setSoePosts] = useState<SOEPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<SOEPost[]>([]);
  const [currentCsvUrl, setCurrentCsvUrl] = useState<string | null>(null);
  const [currentPostTitle, setCurrentPostTitle] = useState("");

  const [isLoading, setIsLoading] = useState(true); //   loader state

  const pageSize = 10;

  // Instant hydrate from cache to avoid loader on tab returns
  useEffect(() => {
    const cached = readSOECache();
    if (!cached) return;

    // Keep same year sort behavior
    const yearsSorted = sortYearsDesc(cached.years);
    setYearOptions(yearsSorted);
    setIndustryOptions(cached.industries);
    setSoePosts(cached.posts);

    const urlYear = searchParams.get("year");
    const effectiveYear = urlYear ?? year ?? yearsSorted[0]?.slug ?? null;
    // Do not preselect industries from URL on initial load
    if (!year && effectiveYear) setYear(effectiveYear);

    let initial = cached.posts;
    if (effectiveYear) {
      initial = initial.filter((p) =>
        p.years.some((y) => y.slug === effectiveYear),
      );
    }
    // Do not filter posts by industry; industry selection filters CSV rows.
    setFilteredPosts(initial);
    if (initial[0]) {
      setCurrentCsvUrl(initial[0].csvUrl ?? null);
      setCurrentPostTitle(initial[0].title ?? "");
    }
    setIsLoading(false);
  }, []);

  // Load defaults from URL (ignore industry to avoid auto-select)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const yr = searchParams.get("year");
    setQueryInput(q);
    setYear(yr);
  }, [searchParams]);

  // Load SOE data once
  useEffect(() => {
    async function load() {
      const cached = readSOECache();
      if (!cached) setIsLoading(true);
      try {
        const [seoRes, meta, yearsRaw, industriesRaw, posts] =
          await Promise.all([
            fetchPageSEOByUri(
              pathname || "/the-finances-of-state-owned-enterprises/",
            ).catch((e) => {
              console.warn("SEO fetch failed", e);
              return null as any;
            }),
            fetchPageMetaByUri(
              pathname || "/the-finances-of-state-owned-enterprises/",
            ).catch((e) => {
              console.warn("Meta fetch failed", e);
              return null as any;
            }),
            fetchSOEYears(),
            fetchSOEIndustries(),
            fetchSOEPosts(),
          ]);

        if (seoRes) setSeo(seoRes);
        if (meta) {
          setHeroTitle(meta.title ?? "");
          setHeroParagraph(firstParagraphFromHtml(meta.content));
        }

        const years = sortYearsDesc(yearsRaw);
        setYearOptions(years);
        setIndustryOptions(industriesRaw);
        setSoePosts(posts);
        saveSOECache({ years, industries: industriesRaw, posts });

        // Determine effective selection and prime results before clearing loader
        const urlYear = searchParams.get("year");
        const effectiveYear = urlYear ?? year ?? years[0]?.slug ?? null;
        // Do not preselect industries from URL on initial load

        if (!year && effectiveYear) setYear(effectiveYear);

        let initial = posts;
        if (effectiveYear) {
          initial = initial.filter((p) =>
            p.years.some((y) => y.slug === effectiveYear),
          );
        }
        // Do not filter by industry here; applies at CSV row-level
        setFilteredPosts(initial);
        if (initial[0]) {
          setCurrentCsvUrl(initial[0].csvUrl ?? null);
          setCurrentPostTitle(initial[0].title ?? "");
        } else {
          setCurrentCsvUrl(null);
          setCurrentPostTitle("");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  // Filter posts (by year only). Industry selection filters CSV rows, not posts.
  useEffect(() => {
    let results = soePosts;
    if (year) {
      results = results.filter((p) => p.years.some((y) => y.slug === year));
    }
    setFilteredPosts(results);
    setCurrentPage(1);
  }, [year, soePosts]);

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

  // Remove industry from URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has("industry")) {
      params.delete("industry");
      const qs = params.toString();
      const newUrl = `${pathname}${qs ? `?${qs}` : ""}`;
      router.replace(newUrl);
    }
  }, [searchParams, pathname, router]);

  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  return (
    <main>
      <SEO yoast={seo as any} title="The Finances of SOEs" />
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
                label: "Transparency in Government Institutions",
                href: (() => {
                  const params = new URLSearchParams();
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/transparency-in-government-institutions?${qs}`
                    : "/transparency-in-government-institutions";
                })(),
              },
              {
                label: "The Finances of SOEs",
                href: (() => {
                  const params = new URLSearchParams();
                  if (year) params.set("year", year);
                  const qs = params.toString();
                  return qs
                    ? `/the-finances-of-state-owned-enterprises?${qs}`
                    : "/the-finances-of-state-owned-enterprises";
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
          title={heroTitle || "The Finances of State Owned Enterprises"}
          paragraph={heroParagraph || ""}
          items={[
            { label: "Dashboards", href: "/dashboard" },
            { label: "The Finances of SOEs" },
          ]}
        />
      </div>

      {/* Filters */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="lg:flex gap-2 xl:gap-12 items-center justify-between pb-9">
            {/* Search */}
            <div className="relative w-full xl:w-3/4">
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
                  selectedIndustries.length > 0
                    ? `Sector (${selectedIndustries.length})`
                    : "Sector"
                }
                items={industryOptions.map((ind) => ({
                  kind: "checkbox" as const,
                  label: ind.name,
                  checked: selectedIndustries.includes(ind.name),
                  onClick: () => {
                    setSelectedIndustries((prev) =>
                      prev.includes(ind.name)
                        ? prev.filter((n) => n !== ind.name)
                        : [...prev, ind.name],
                    );
                  },
                }))}
                align="right"
                open={openId === "one"}
                onOpenChange={(v) => setOpenId(v ? "one" : null)}
                closeOnItemClick={false}
                footer={
                  <div className="flex items-center justify-end gap-2 px-3 py-2 !bg-transparent">
                    <button
                      type="button"
                      className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide rounded-sm bg-white text-gray-600 border border-slate-200 shadow-sm hover:text-gray-50 hover:bg-brand-1-900"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedIndustries([]);
                        setOpenId(null);
                      }}
                    >
                      CLEAR
                    </button>
                    <button
                      type="button"
                      className="px-3 py-2.5 text-xs text-brand-white font-semibold uppercase tracking-wide rounded-sm bg-brand-1-900 text-brand-4 border border-slate-200 shadow-sm hover:bg-gray-50 hover:text-brand-1-900"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenId(null);
                      }}
                    >
                      OK
                    </button>
                  </div>
                }
              />

              {/* Year Dropdown */}
              <DefaultDropdown
                idKey="two"
                closeOnItemClick={false}
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
                itemClassName="w-full text-left" //   full width applied
              />
            </div>
          </div>

          {filteredPosts[0]?.methodologyFileUrl && (
            <div className="bg-gray-50 rounded-lg px-6 py-3.5 mb-3">
              <div className="grid grid-cols-1 md:flex md:justify-between gap-4 text-xs/4 text-slate-600 font-normal leading-4 font-sourcecodepro">
                <div className="text-slate-600 text-xs/4 font-normal font-sourcecodepro grid items-center gap-2">
                  <p>
                    To access the methodology for the dashboard on the Finances
                    of State Owned Enterprises click{" "}
                    {filteredPosts[0]?.methodologyFileUrl ? (
                      <a
                        href={filteredPosts[0].methodologyFileUrl}
                        className="text-brand-1-600"
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                    ) : (
                      <span className="text-slate-500">(not available)</span>
                    )}
                    .
                  </p>

                  <div>In LKR '000s</div>
                </div>
              </div>
            </div>
          )}

          {/* CSV Table */}
          {isLoading ? (
            <p className="text-gray-500 pb-6 text-xl font-sourcecodepro font-medium">
              Loading dataset...
            </p>
          ) : currentCsvUrl ? (
            <CsvTable
              csvUrl={currentCsvUrl}
              filterQuery={queryInput}
              sectorFilters={selectedIndustries}
            />
          ) : (
            <p className="text-gray-500 pb-6 text-xl font-sourcecodepro font-medium">
              No dataset found for selection.
            </p>
          )}

          <div className="mx-auto max-w-7xl pt-6 md:pt-9 pb-16">
            <div>
              <div className="grid xl:flex gap-4 xl:gap-7 items-center justify-start xl:justify-end w-full">
                <div>
                  <p className="text-sm xl:text-base/6 font-medium font-sourcecodepro text-slate-600">
                    Interpretation of the indicators :
                  </p>
                </div>
                <div className="grid md:flex items-center gap-2.5 md:gap-5">
                  {/* Good */}
                  <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                    <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                      Successful
                    </span>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <circle cx="6" cy="6" r="6" fill="#22C55E" />
                      </svg>
                    </div>
                  </div>

                  {/* Marginal Success */}
                  <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                    <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                      Marginally Successful
                    </span>
                    <div className="flex items-center gap-.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <circle cx="6" cy="6" r="6" fill="#F59E0B" />
                      </svg>
                    </div>
                  </div>

                  {/* Average */}
                  <div className="flex items-center gap-3 md:border-r border-slate-300 pr-3 md:pr-4">
                    <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                      Unsuccessful
                    </span>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <circle cx="6" cy="6" r="6" fill="#F97316" />
                      </svg>
                    </div>
                  </div>

                  {/* Poor */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm/tight font-medium font-sourcecodepro text-slate-600">
                      Total Failure
                    </span>
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <circle cx="6" cy="6" r="6" fill="#DC2626" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
      {paginatedPosts.map((post) => (
        <RelatedDatasets
          key={post.slug}
          datasetId={String((post as any).databaseId)}
        />
      ))}
    </main>
  );
}
