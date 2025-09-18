import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import React from "react";
import SEO from "@/src/components/SEO";
import Image from "next/image";
import HeroBasic from "@/src/components/HeroBlocks/HeroBasic";
import WhiteButton from "@/src/components/Buttons/WhiteBtn";

export const PAGE_QUERY = gql`
  query GetDashboardsPage($databaseId: ID!, $asPreview: Boolean = false) {
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
  }
`;

interface DashboardsPageProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null;
      seo?: any | null;
    } | null;
  };
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
      .replace(/&#8217;/g, "'")
      .trim();
    if (inner) return inner;
  }
  return "";
}

const PageDashboards: React.FC<DashboardsPageProps> = ({ data }) => {
  const page = data?.page;
  if (!page) return <p>Dashboards page not found.</p>;

  // Hero text: first paragraph from Gutenberg content
  const heroParagraph = firstParagraphFromHtml(page?.content);
  return (
    <main>
      <SEO yoast={page?.seo as any} title={page?.title ?? undefined} />
      <div className="insight-hero relative">
        {/* Background Image */}
        <img
          src={datasetBgPattern}
          alt="hero background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Hero Content */}
        <div className="relative z-10">
          <HeroBasic
            title="Economic Dashboards"
            paragraph={heroParagraph}
            overlay={null}
          />
        </div>
      </div>
      {/* Hero Section End */}

      {/* Sections */}
      <Section
        title="Government Fiscal Operations"
        text="Transparency in government institutions refers to the open and accessible sharing of information about financial activities."
        imgSrc="/assets/images/chart img/product-card.jpg"
        imgAlt="fiscal-operations-chart-img"
        url="#"
      />

      <Section
        title="The Macro Economy of Sri Lanka"
        text="Transparency in government institutions refers to the open and accessible sharing of information about financial activities."
        imgSrc="/assets/images/chart img/chart-container.jpg"
        imgAlt="government-institutions-chart-img"
        url="#"
      />

      <Section
        title="Transparency in government institutions"
        text="Transparency in government institutions refers to the open and accessible sharing of information about financial activities."
        imgSrc="/assets/images/chart img/transparency in-government-institutions.jpg"
        imgAlt="government-institutions-chart-img"
        url="/transparency-dashboard"
      />

      <Section
        title="The Finances of State Owned Enterprises"
        text="Transparency in government institutions refers to the open and accessible sharing of information about financial activities."
        imgSrc="/assets/images/chart img/state-owned-enterprises.jpg"
        imgAlt="state-owned-chart-img"
        url="/state-owned-dashboard"
      />
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
}

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
  return (
    <div className="bg-white py-12 md:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
        <div className="border border-slate-400 shadow-2xl rounded-lg p-3 lg:p-12 transition-all duration-300 ease-in-out hover:-translate-y-1.5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 items-center">
            {/* Left Column */}
            <div>
              <h2 className="font-family-montserrat text-slate-950 font-normal text-2xl md:text-3xl xl:text-4xl leading-snug">
                {title}
              </h2>
              <p className="font-family-sourcecodepro text-slate-950 font-normal text-base/6 mt-0.5 lg:mt-2">
                {text}
              </p>
              <div className="mt-4 lg:mt-5">
                <WhiteButton url={url}>Learn more</WhiteButton>
              </div>
            </div>

            {/* Right Column */}
            <div>
              <Image
                src={imgSrc}
                alt={imgAlt}
                className="w-full h-full rounded-lg"
                width={511}
                height={503}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
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
