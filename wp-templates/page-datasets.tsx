import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Pagination from "../src/components/Pagination";
import CardType6 from "../src/components/Cards/CardType6";
import HeroBasic from "../src/components/HeroBlocks/HeroBasic";
import SearchField from "../src/components/InputFields/SearchField";
import FilterCarousel from "../src/components/FilterCarousel";
import SEO from "@/src/components/SEO";

/** Page + datasets + categories */
export const PAGE_QUERY = gql`
  query GetDatasetsPage($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      seo {
        title
        metaDesc
        canonical
        opengraphTitle
        opengraphDescription
        opengraphUrl
        opengraphSiteName
        opengraphImage {
          sourceUrl
        }
        twitterTitle
        twitterDescription
        twitterImage {
          sourceUrl
        }
        schema {
          raw
        }
      }
    }
    dataSets(first: 100) {
      nodes {
        id
        uri
        title
        excerpt
        content
        date
        dataSetsCategories {
          nodes {
            id
            name
            slug
          }
        }
        dataSetFields {
          dataSetFile {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }
    dataSetsCategories(first: 50) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

interface DatasetsPageProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null;
      seo?: any | null;
    } | null;
    dataSets?: {
      nodes?: Array<{
        id: string;
        uri?: string | null;
        title?: string | null;
        excerpt?: string | null;
        content?: string | null;
        date?: string | null;
        dataSetsCategories?: {
          nodes?: Array<{
            id: string;
            name?: string | null;
            slug?: string | null;
          }> | null;
        } | null;
        dataSetFields?: {
          dataSetFile?: {
            node?: { mediaItemUrl?: string | null } | null;
          } | null;
        } | null;
      }> | null;
    };
    dataSetsCategories?: {
      nodes?: Array<{
        id: string;
        name?: string | null;
        slug?: string | null;
      }> | null;
    };
  };
  loading?: boolean;
}

const datasetBgPattern = "/assets/images/patterns/dataset-bg-pattern.jpg";

/** First non-empty <p> from Gutenberg HTML (as plain text) */
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

/** Replace common WP HTML entities with readable characters */
function normalizeWpEntities(input?: string | null): string {
  if (!input) return "";
  return (
    input
      // Apostrophes / single quotes
      .replace(/&#8217;|&rsquo;/gi, "’")
      .replace(/&#8216;|&lsquo;/gi, "‘")
      // Double quotes
      .replace(/&#8220;|&ldquo;/gi, "“")
      .replace(/&#8221;|&rdquo;/gi, "”")
      // Ampersand
      .replace(/&#038;|&amp;/gi, "&")
  );
}

/** Datasets listing page */
const DatasetsPage: React.FC<DatasetsPageProps> = ({ data }) => {
  // Autofocus: disabled on first visit in this session, enabled afterwards
  const useAutoFocusAfterFirstVisit = (storageKey: string) => {
    const [enabled, setEnabled] = useState(false);
    useEffect(() => {
      if (typeof window === "undefined") return;
      const key = `visited:${storageKey}`;
      const hasVisited = sessionStorage.getItem(key);
      if (hasVisited) {
        setEnabled(true);
      } else {
        sessionStorage.setItem(key, "1");
        setEnabled(false);
      }
    }, [storageKey]);
    return enabled;
  };
  const searchAutoFocus = useAutoFocusAfterFirstVisit("datasets-page");
  const page = data?.page;
  const router = useRouter();
  if (!page) return <p>Datasets page not found.</p>;

  // UI state
  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const rawCats = data?.dataSetsCategories?.nodes ?? [];

  // Category name <-> slug maps
  const nameToSlug = useMemo(() => {
    const m = new Map<string, string>();
    m.set("All", "");
    rawCats.forEach((c) => c?.name && c?.slug && m.set(c.name, c.slug));
    return m;
  }, [rawCats]);

  const slugToName = useMemo(() => {
    const m = new Map<string, string>();
    m.set("", "All");
    rawCats.forEach(
      (c) => c?.slug && c?.name && m.set(String(c.slug).toLowerCase(), c.name)
    );
    return m;
  }, [rawCats]);

  // Build category list, but only keep those that have datasets
  const categories = useMemo(() => {
    const validCategoryIds = new Set(
      (data?.dataSets?.nodes ?? []).flatMap(
        (ds) => ds.dataSetsCategories?.nodes?.map((c) => c.id) ?? []
      )
    );

    const filtered = rawCats
      .filter((c) => validCategoryIds.has(c.id))
      .map((c) => c.name ?? "")
      .filter(Boolean);

    // Always prepend "All"
    return ["All", ...filtered];
  }, [rawCats, data?.dataSets?.nodes]);

  // Route detection: /datasets or /datasets/<category>
  const isListingView = React.useCallback(() => {
    const clean = router.asPath.split("?")[0].split("#")[0];
    const parts = clean.replace(/\/+$/, "").split("/").filter(Boolean);
    const base = parts[0] || "";
    const maybeSlug = base === "datasets" ? parts[1] || "" : "";
    const looksLikeDatasets = base === "datasets";
    const isKnownCategory =
      slugToName.has(maybeSlug.toLowerCase()) || maybeSlug === "";
    return looksLikeDatasets && isKnownCategory && parts.length <= 2;
  }, [router.asPath, slugToName]);

  // Initialize from URL on listing routes
  useEffect(() => {
    if (!isListingView()) return;

    const clean = router.asPath.split("?")[0].split("#")[0];
    const parts = clean.replace(/\/+$/, "").split("/").filter(Boolean);
    const maybeSlug = parts[0] === "datasets" ? parts[1] || "" : "";
    const fromUrl = slugToName.get(maybeSlug.toLowerCase()) || "All";
    setActiveCategory(fromUrl);
    setCurrentPage(1);

    const qp = router.query?.q;
    const qStr = Array.isArray(qp) ? qp[0] : qp;
    if (typeof qStr === "string") setSearchQuery(qStr);
  }, [router.asPath, router.query?.q, slugToName, isListingView]);

  const datasetCards = data?.dataSets?.nodes ?? [];

  // Search overrides category filter; otherwise filter by active category
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return datasetCards.filter((c) => {
        const inTitle = c.title?.toLowerCase().includes(q);
        const inExcerpt = c.excerpt?.toLowerCase().includes(q);
        const inContent = c.content?.toLowerCase()?.includes(q);
        const inCategory = c.dataSetsCategories?.nodes?.some((cat) =>
          cat.name?.toLowerCase().includes(q)
        );
        return inTitle || inExcerpt || inContent || inCategory;
      });
    }
    if (activeCategory !== "All") {
      return datasetCards.filter((c) =>
        c.dataSetsCategories?.nodes?.some((cat) => cat.name === activeCategory)
      );
    }
    return datasetCards;
  }, [activeCategory, searchQuery, datasetCards]);

  // Debounced URL sync (listing view only)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isListingView()) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const q = searchQuery.trim();
      if (q) {
        const href = `/datasets/?q=${encodeURIComponent(q)}`;
        if (router.asPath !== href) {
          router.replace(href, href, { shallow: true, scroll: false });
        }
      } else {
        const slug = nameToSlug.get(activeCategory) ?? "";
        const href = slug ? `/datasets/${slug}/` : `/datasets/`;
        if (router.asPath !== href) {
          router.replace(href, href, { shallow: true, scroll: false });
        }
      }
    }, 250);

    return () => {
      if (syncTimer.current) {
        clearTimeout(syncTimer.current);
        syncTimer.current = null;
      }
    };
  }, [searchQuery, activeCategory, nameToSlug, router.asPath, isListingView]);

  // Pagination
  const pageSize = 12;
  const totalItems = filteredCards.length;
  const paginatedCards = filteredCards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const hasResults = totalItems > 0;
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const scrollToResults = React.useCallback(() => {
    const el = resultsRef.current;
    if (!el || typeof window === "undefined") return;
    const headerOffset = 100;
    requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  }, []);

  // Category carousel state
  const isSearching = searchQuery.trim().length > 0;
  const displayActiveCategory = isSearching ? "All" : activeCategory;
  const initialIndex = useMemo(() => {
    const idx = categories.indexOf(displayActiveCategory);
    return idx >= 0 ? idx : 0;
  }, [categories, displayActiveCategory]);

  // Hero text: first paragraph from Gutenberg content
  const heroParagraph = normalizeWpEntities(
    firstParagraphFromHtml(page?.content)
  );

  return (
    <main>
      <SEO
        yoast={data?.page?.seo as any}
        title={data?.page?.title ?? undefined}
      />

      <div className="insight-hero relative">
        {/* Background image */}
        <Image
          src={datasetBgPattern}
          alt="hero background"
          width={1000}
          height={667}
          className="absolute inset-0 h-full w-full object-cover"
          priority={false}
        />

        {/* Overlay gradient */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background:
              "linear-gradient(0deg, rgba(20, 101, 245, 0.10) 0%, rgba(20, 101, 245, 0.10) 100%)",
          }}
        />

        {/* Hero content */}
        <div className="relative z-10">
          <HeroBasic
            bgUrl={datasetBgPattern}
            title="Research Datasets"
            paragraph={heroParagraph}
            overlay={null}
          />
        </div>
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pt-5 pb-3.5 md:pb-5 md:pt-10 lg:pt-16 lg:pb-6">
          <div className="pb-4">
            <SearchField
              value={searchQuery}
              onChange={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              onSubmit={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              placeholder="Search"
              autoFocus={searchAutoFocus}
            />
          </div>

          {categories.length > 0 && (
            <FilterCarousel
              key={`fc-${displayActiveCategory}`}
              items={categories}
              initialActiveIndex={initialIndex}
              onChangeActive={(label) => {
                if (isSearching) return;
                setActiveCategory(label);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      </section>

      <section className="bg-white pb-12 md:pb-16 xl:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {hasResults ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
              ref={resultsRef}
            >
              {paginatedCards.map((c) => {
                const fileUrl =
                  c.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? "";
                return (
                  <CardType6
                    key={c.id}
                    title={normalizeWpEntities(c.title)}
                    excerpt={normalizeWpEntities(c.excerpt)}
                    fileUrl={fileUrl}
                    postDate={c.date ?? ""}
                    uri={c.uri ?? undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16" aria-live="polite">
              <h3 className="text-xl font-semibold tracking-wide">
                {isSearching
                  ? `No datasets found for “${searchQuery.trim()}”.`
                  : displayActiveCategory === "All"
                    ? "No datasets found."
                    : `No datasets for “${displayActiveCategory}”.`}
              </h3>
              {isSearching ? (
                <p className="mt-2 text-gray-600">
                  Try adjusting your search terms.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </section>

      {hasResults && (
        <section className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-16">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={(p) => {
              setCurrentPage(p);
              scrollToResults();
            }}
          />
        </section>
      )}
    </main>
  );
};

export default DatasetsPage;

/** Attach query + variables for build/runtime data fetching */
(DatasetsPage as any).query = PAGE_QUERY;
(DatasetsPage as any).variables = (
  seedNode: { databaseId?: number | string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!seedNode?.databaseId) {
    throw new Error(
      "DatasetsPage.variables: missing databaseId from seed node."
    );
  }
  return { databaseId: String(seedNode.databaseId), asPreview: !!ctx?.preview };
};
