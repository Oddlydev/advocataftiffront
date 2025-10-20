import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import React from "react";
import SEO from "@/src/components/SEO";
import Image from "next/image";
import HeroBasic from "@/src/components/HeroBlocks/HeroBasic";
import WhiteButton from "@/src/components/Buttons/WhiteBtn";
// Using a plain anchor for consistent navigation behavior across browsers
// (Home page cards use <a> and work reliably.)

export const PAGE_QUERY = gql`
  query GetDashboardsPage($databaseId: ID!, $asPreview: Boolean = false) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      dashboardSection {
        dashboards {
          title
          description
          image {
            node {
              mediaItemUrl
            }
          }
          url
        }
      }
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
  }
`;

interface DashboardsPageProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null;
      seo?: any | null;
      dashboardSection?: {
        dashboards?: Array<{
          title?: string | null;
          description?: string | null;
          image?: { node?: { mediaItemUrl?: string | null } | null } | null;
          url?: string | null;
        } | null> | null;
      } | null;
    } | null;
  };
}
const datasetBgPattern = "/assets/images/patterns/dataset-bg-pattern.jpg";

// Normalize a WP/ACF URL to an internal path for Next.js routing
function toInternalHref(input?: string | null): string {
  if (!input) return "#";
  try {
    // If it's an absolute URL, keep only the pathname so the client router handles it
    const u = new URL(input);
    return u.pathname || "/";
  } catch {
    // Already relative or invalid for URL – return as-is
    return input;
  }
}

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
      .replace(/&#8217;/g, "'")
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

const PageDashboards: React.FC<DashboardsPageProps> = ({ data }) => {
  const page = data?.page;
  if (!page) return <p>Dashboards page not found.</p>;

  // Hero text: first paragraph from Gutenberg content
  const heroParagraph = normalizeWpEntities(
    firstParagraphFromHtml(page?.content)
  );

  return (
    <main>
      <SEO yoast={page?.seo as any} title={page?.title ?? undefined} />

      {/* Hero Section */}
      <div className="insight-hero relative">
        {/* Background image */}
        <Image
          src={datasetBgPattern}
          alt="hero background"
          width={1000}
          height={667}
          className="absolute inset-0 h-full w-full object-cover"
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
            title="Dashboards"
            paragraph={heroParagraph}
            overlay={null}
          />
        </div>
      </div>

      {/* Dynamic Sections from GraphQL */}
      <section className="bg-white pb-12 md:pb-16 xl:pb-20 pt-10 md:pt-12 xl:pt-16">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          {page.dashboardSection?.dashboards?.map((item: any, i: number) => (
            <Section
              key={i}
              title={item?.title ?? ""}
              text={item?.description ?? ""}
              imgSrc={item?.image?.node?.mediaItemUrl ?? ""}
              imgAlt={item?.title ?? "dashboard image"}
              url={item?.url ?? "#"}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default PageDashboards;

/* Section Component */
interface SectionProps {
  title: string;
  text: string;
  imgSrc: string;
  imgAlt: string;
  url: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  text,
  imgSrc,
  imgAlt,
  url,
}) => {
  const href = toInternalHref(url);
  return (
   <a href={href} className="block pt-8 group" aria-label={`Learn more about ${title}`}>
      <div
        className="border border-slate-400 shadow-2xl rounded-lg p-6 md:p-9 lg:px-12 lg:py-16 pr-0 lg:pr-0
                transition-all duration-300 ease-in-out hover:-translate-y-1.5"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
          {/* Left Column */}
          <div className="pr-6 md:pr-0 lg:pr-0">
            <h2 className="font-montserrat text-slate-950 font-bold text-2xl md:text-3xl xl:text-4xl leading-snug">
              {title}
            </h2>
            <p className="font-sourcecodepro text-slate-950 font-normal text-base/6 mt-0.5 lg:mt-2">
              {text}
            </p>

            <div className="mt-4 mb-7 font-semibold font-sourcecodepro transition-all duration-500 ease-in-out">
              <WhiteButton className="!py-2.5 !px-3.5 !text-sm !font-semibold text-gray-600 flex items-center gap-2">
                Learn more
                <svg
                  className="text-gray-600 size-3.5 opacity-0 translate-x-0 hidden group-hover:block group-focus:block group-hover:opacity-100 transition-all duration-300 ease-in-out"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M12.025 4.94165L17.0833 9.99998L12.025 15.0583"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.91667 10H16.9417"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </WhiteButton>
            </div>
          </div>

          {/* Right Column */}
          <div className="relative">
            <Image
              src={imgSrc}
              alt={imgAlt}
              className="w-full h-full rounded-l-lg md:rounded-lg xl:rounded-l-lg xl:rounded-r-none"
              width={511}
              height={503}
              priority={false}
            />
            {/* Overlay */}
            <div
              className="absolute inset-0 rounded-l-lg md:rounded-lg xl:rounded-l-lg xl:rounded-r-none pointer-events-none"
              style={{
                background:
                  "linear-gradient(0deg, rgba(235, 26, 82, 0.20), rgba(235, 26, 82, 0.20))",
              }}
            />
          </div>
        </div>
      </div>
    </a>
  );
};

/** Attach query + variables for build/runtime data fetching */
(PageDashboards as any).query = PAGE_QUERY;
(PageDashboards as any).variables = (
  seedNode: { databaseId?: number | string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!seedNode?.databaseId) {
    throw new Error(
      "PageDashboards.variables: missing databaseId from seed node."
    );
  }
  return { databaseId: String(seedNode.databaseId), asPreview: !!ctx?.preview };
};
