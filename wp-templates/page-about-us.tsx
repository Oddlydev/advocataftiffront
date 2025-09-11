import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import React from "react";
import Accordion from "../src/components/Accordion";
import { PageSubTitle, PageTitle } from "@/src/components/Typography";
import TextBlock from "../src/components/TextBlock";
import SEO from "@/src/components/SEO";

/** Page + sections data */
export const PAGE_QUERY = gql`
  query GetAboutPage($databaseId: ID!, $asPreview: Boolean = false) {
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
        opengraphImage { sourceUrl }
        twitterTitle
        twitterDescription
        twitterImage { sourceUrl }
        schema { raw }
      }
      aboutFaqSection {
        aboutFaqDetails {
          aboutFaqItemTitle
          aboutFaqItemDescription
        }
      }
      aboutHeroSection {
        aboutUsHeroBackgroundImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

interface AboutPageProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null; // Gutenberg HTML
      seo?: any | null;
      aboutFaqSection?: {
        aboutFaqDetails?: Array<{
          aboutFaqItemTitle?: string | null;
          aboutFaqItemDescription?: string | null;
        }> | null;
      } | null;
      aboutHeroSection?: {
        aboutUsHeroBackgroundImage?: {
          node?: {
            sourceUrl?: string | null;
            altText?: string | null;
          } | null;
        } | null;
      } | null;
    } | null;
  };
  loading?: boolean;
}

/** Hero background image + overlay */
const AboutHero: React.FC<{
  image?: { sourceUrl?: string | null; altText?: string | null };
}> = ({ image }) => {
  if (!image?.sourceUrl) return null;
  return (
    <div className="about-hero relative">
      <div>
        <img
          src={image.sourceUrl}
          width={1628}
          height={700}
          className="h-full w-full object-cover"
          alt={image.altText || "About hero"}
        />
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(235, 26, 82, 0.16) 0%, rgba(235, 26, 82, 0.16) 100%)",
        }}
      />
    </div>
  );
};

/** Strip HTML & normalise whitespace */
function toPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** First heading + all paragraph texts from Gutenberg HTML */
function extractIntro(html?: string | null): {
  heading?: string;
  paragraphs: string[];
} {
  if (!html) return { paragraphs: [] };

  const hMatch = html.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const heading = hMatch ? toPlainText(hMatch[1]) : undefined;

  const pMatches = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  const paragraphs = pMatches
    .map((p) =>
      toPlainText(p.replace(/^<p\b[^>]*>/i, "").replace(/<\/p>$/i, ""))
    )
    .filter(Boolean);

  return { heading, paragraphs };
}

/** About page */
const AboutPage: React.FC<AboutPageProps> = ({ data }) => {
  const page = data?.page;

  const html = page?.content ?? undefined;
  const { heading: introTitle, paragraphs: introParagraphs } =
    extractIntro(html);

  const heroImage =
    page?.aboutHeroSection?.aboutUsHeroBackgroundImage?.node ?? undefined;

  const faqItems =
    page?.aboutFaqSection?.aboutFaqDetails?.map((item) => ({
      title: item?.aboutFaqItemTitle,
      content: item?.aboutFaqItemDescription,
    })) ?? [];

  return (
    <main>
      <SEO yoast={page?.seo as any} title={page?.title ?? undefined} />
      <div className="overflow-x-hidden">
        <AboutHero image={heroImage} />

        {/* Intro (derived from Gutenberg) */}
        {(introTitle || introParagraphs.length > 0) && (
          <TextBlock
            subtitle="who we are"
            title={introTitle ?? ""}
            paragraphs={introParagraphs}
            className="mx-auto max-w-7xl px-5 md:px-10 xl:px-24 py-14 md:py-20"
          />
        )}

        {/* FAQ */}
        <section className="relative overflow-hidden py-24 sm:py-32 bg-brand-2-900">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
            <div className="mx-auto max-w-4xl text-center">
              <PageSubTitle className="!text-slate-50">FAQ</PageSubTitle>
              <PageTitle className="!text-slate-50">
                How can we help you?
              </PageTitle>
            </div>

            <Accordion
              className="mx-auto max-w-4xl"
              defaultOpenIndex={0}
              items={faqItems.map((item) => ({
                title: (
                  <span className="text-lg/7 md:text-xl/7 font-montserrat font-medium">
                    {item.title}
                  </span>
                ),
                content: (
                  <p className="text-base/6 md:text-lg/7 pt-4 max-w-sm md:max-w-4xl">
                    {item.content}
                  </p>
                ),
              }))}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutPage;

/** Attach query + variables for build/runtime data fetching */
(AboutPage as any).query = PAGE_QUERY;
(AboutPage as any).variables = (
  seedNode: { databaseId?: number | string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!seedNode?.databaseId) {
    throw new Error("AboutPage.variables: missing databaseId from seed node.");
  }
  return {
    databaseId: String(seedNode.databaseId),
    asPreview: !!ctx?.preview,
  };
};
