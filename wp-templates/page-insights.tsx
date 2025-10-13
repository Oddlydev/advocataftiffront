import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Pagination from "../src/components/Pagination";
import CardType5 from "../src/components/Cards/CardType5";
import HeroBasic from "../src/components/HeroBlocks/HeroBasic";
import SearchField from "../src/components/InputFields/SearchField";
import FilterCarousel from "../src/components/FilterCarousel";
import SEO from "@/src/components/SEO";

const PAGE_QUERY = gql`
  query GetInsightsPage($databaseId: ID!, $asPreview: Boolean = false) {
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
    insights(first: 100) {
      nodes {
        id
        uri
        title
        excerpt
        content
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
        insightsCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
    insightsCategories(first: 50) {
      nodes {
        id
        name
        slug
      }
    }
  }
`;

interface InsightsPageProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null;
      seo?: any | null;
    } | null;
    insights?: {
      nodes?: Array<{
        id: string;
        uri?: string | null;
        title?: string | null;
        excerpt?: string | null;
        date?: string | null;
        featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
        insightsCategories?: {
          nodes?: Array<{
            id: string;
            name?: string | null;
            slug?: string | null;
          }> | null;
        } | null;
      }>;
    };
    insightsCategories?: {
      nodes?: Array<{ id: string; name?: string | null; slug?: string | null }>;
    };
  };
  loading?: boolean;
}

const insightBgPattern = "/assets/images/patterns/insight-bg-pattern.jpg";

/** Return the first NON-EMPTY <p> from Gutenberg HTML as plain text */
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

export default function InsightsPage({ data }: InsightsPageProps) {
  const page = data?.page;
  const router = useRouter();
  if (!page) return <p>Insights page not found.</p>;

  const [currentPage, setCurrentPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const pageSize = 6;

  const rawCats = data?.insightsCategories?.nodes ?? [];

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

  const categories = useMemo(() => {
    const validCategoryIds = new Set(
      (data?.insights?.nodes ?? []).flatMap(
        (ds) => ds.insightsCategories?.nodes?.map((c) => c.id) ?? []
      )
    );

    const filtered = rawCats
      .filter((c) => validCategoryIds.has(c.id))
      .map((c) => c.name ?? "")
      .filter(Boolean);

    // Always prepend "All"
    return ["All", ...filtered];
  }, [rawCats, data?.insights?.nodes]);

  const isListingView = React.useCallback(() => {
    const clean = router.asPath.split("?")[0].split("#")[0];
    const parts = clean.replace(/\/+$/, "").split("/").filter(Boolean);
    const base = parts[0] || "";
    const maybeSlug = base === "insights" ? parts[1] || "" : "";
    const looksLikeInsights = base === "insights";
    const isKnownCategory =
      slugToName.has(maybeSlug.toLowerCase()) || maybeSlug === "";

    return looksLikeInsights && isKnownCategory && parts.length <= 2;
  }, [router.asPath, slugToName]);

  useEffect(() => {
    if (!isListingView()) return;

    const clean = router.asPath.split("?")[0].split("#")[0];
    const parts = clean.replace(/\/+$/, "").split("/").filter(Boolean);
    const maybeSlug = parts[0] === "insights" ? parts[1] || "" : "";
    const fromUrl = slugToName.get(maybeSlug.toLowerCase()) || "All";
    setActiveCategory(fromUrl);
    setCurrentPage(1);

    const qp = router.query?.q;
    const qStr = Array.isArray(qp) ? qp[0] : qp;
    if (typeof qStr === "string") setSearchQuery(qStr);
  }, [router.asPath, router.query?.q, slugToName, isListingView]);

  const cards = (data?.insights?.nodes ?? []) as Array<{
    id: string;
    uri?: string | null;
    title?: string | null;
    excerpt?: string | null;
    date?: string | null;
    featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
    insightsCategories?: {
      nodes?: Array<{
        id: string;
        name?: string | null;
        slug?: string | null;
      }> | null;
    } | null;
  }>;

  // Global search; category filter applies only when search is empty
  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return cards.filter((c) => {
        const inTitle = c.title?.toLowerCase().includes(q);
        const inExcerpt = c.excerpt?.toLowerCase().includes(q);
        const inContent = (c as any).content?.toLowerCase()?.includes(q);
        const inCategory = c.insightsCategories?.nodes?.some((cat) =>
          cat.name?.toLowerCase().includes(q)
        );
        return inTitle || inExcerpt || inContent || inCategory;
      });
    }
    if (activeCategory !== "All") {
      return cards.filter((c) =>
        c.insightsCategories?.nodes?.some((cat) => cat.name === activeCategory)
      );
    }
    return cards;
  }, [activeCategory, searchQuery, cards]);

  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!isListingView()) return;

    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const q = searchQuery.trim();
      if (q) {
        const href = `/insights/?q=${encodeURIComponent(q)}`;
        if (router.asPath !== href) {
          router.replace(href, href, { shallow: true, scroll: false });
        }
      } else {
        const slug = nameToSlug.get(activeCategory) ?? "";
        const href = slug ? `/insights/${slug}/` : `/insights/`;
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

  const totalItems = filteredCards.length;
  const paginated = filteredCards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const hasResults = totalItems > 0;

  const isSearching = searchQuery.trim().length > 0;
  const displayActiveCategory = isSearching ? "All" : activeCategory;
  const initialIndex = useMemo(() => {
    const idx = categories.indexOf(displayActiveCategory);
    return idx >= 0 ? idx : 0;
  }, [categories, displayActiveCategory]);

  // Get only the page description from Gutenberg content
  const heroParagraph = firstParagraphFromHtml(page?.content);

  return (
    <main>
      <SEO yoast={page?.seo as any} title={page?.title ?? undefined} />

      <div className="insight-hero relative">
        {/* Background Image */}
        <img
          src={insightBgPattern}
          alt="hero background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(235,26,82,0.16)] to-[rgba(235,26,82,0.16)]" />

        {/* Hero Content */}
        <div className="relative z-10">
          <HeroBasic
            // bgUrl={insightBgPattern}
            title="Exploring Insights"
            paragraph={heroParagraph}
          />
        </div>
      </div>

      <div className="bg-white">
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
              autoFocus={true}
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
      </div>

      <div className="bg-white pt-6 pb-12 md:pb-16 xl:pb-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {hasResults ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {paginated.map((c) => (
                <CardType5
                  key={c.id}
                  title={c.title ?? ""}
                  excerpt={c.excerpt ?? ""}
                  imageUrl={c.featuredImage?.node?.sourceUrl ?? undefined}
                  postDate={c.date ?? ""}
                  uri={c.uri ?? undefined}
                  categories={c.insightsCategories?.nodes ?? []}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16" aria-live="polite">
              <h3 className="text-xl font-semibold tracking-wide">
                {isSearching
                  ? `No insights found for “${searchQuery.trim()}”.`
                  : displayActiveCategory === "All"
                    ? "No insights found."
                    : `No insights for “${displayActiveCategory}”.`}
              </h3>
              {isSearching ? (
                <p className="mt-2 text-gray-600">
                  Try adjusting your search terms.
                </p>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {hasResults && (
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pb-16">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </main>
  );
}

(InsightsPage as any).query = PAGE_QUERY;
(InsightsPage as any).variables = (
  seedNode: { databaseId?: number | string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!seedNode?.databaseId) {
    throw new Error(
      "InsightsPage.variables: missing databaseId from seed node."
    );
  }
  return {
    databaseId: String(seedNode.databaseId),
    asPreview: !!ctx?.preview,
  };
};
