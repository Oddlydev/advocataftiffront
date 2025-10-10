import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import React from "react";
import SEO from "@/src/components/SEO";
import HeroBlack from "@/src/components/HeroBlocks/HeroBlack";
import CardType5 from "@/src/components/Cards/CardType5";
import { PageSubTitle, PageTitle } from "@/src/components/Typography";
import PostContent from "@/src/components/PostContent";

/** Single insight + small related list */
export const SINGLE_INSIGHT_QUERY = gql`
  query GetSingleInsight($slug: ID!) {
    insight(id: $slug, idType: SLUG) {
      id
      title
      content
      date
      uri
      slug
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
      featuredImage {
        node {
          sourceUrl
          altText
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
    # grab a few extra so we can filter out the current post and still have up to 3
    insights(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        title
        excerpt
        date
        slug
        uri
        featuredImage {
          node {
            sourceUrl
            altText
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
  }
`;

interface SingleInsightProps {
  data?: {
    insight?: {
      id: string;
      title?: string | null;
      content?: string | null;
      date?: string | null;
      uri?: string | null;
      slug?: string | null;
      featuredImage?: {
        node?: { sourceUrl?: string | null; altText?: string | null } | null;
      } | null;
      insightsCategories?: {
        nodes?: Array<{
          id: string;
          name?: string | null;
          slug?: string | null;
        }> | null;
      } | null;
    } | null;
    insights?: {
      nodes?: Array<{
        id: string;
        title?: string | null;
        excerpt?: string | null;
        date?: string | null;
        slug?: string | null;
        uri?: string | null;
        featuredImage?: {
          node?: { sourceUrl?: string | null; altText?: string | null } | null;
        } | null;
        insightsCategories?: {
          nodes?: Array<{
            id: string;
            name?: string | null;
            slug?: string | null;
          }> | null;
        } | null;
      }> | null;
    } | null;
  };
}

/** Insight details page */
const SingleInsight: React.FC<SingleInsightProps> = ({ data }) => {
  const insight = data?.insight;
  const allRelated = data?.insights?.nodes ?? [];

  if (!insight) return <p>Insight not found.</p>;

  const dateText = insight.date
    ? new Date(insight.date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Exclude current post; cap to 3 items
  const related =
    allRelated
      .filter(
        (p) => p.id !== insight.id && (p.slug ? p.slug !== insight.slug : true)
      )
      .slice(0, 3) ?? [];

  return (
    <main>
      <SEO yoast={(insight as any)?.seo} title={insight.title ?? undefined} />
      {/* Hero */}
      <HeroBlack
        title={insight.title ?? ""}
        dateText={dateText}
        homeHref="/"
        items={[{ label: "Insights", href: "/insights" }]}
      />

      {/* Body */}
      <div className="bg-white py-10 md:py-16 xl:py-20">
        <div className="mx-auto max-w-full">
          <div className="mx-auto max-w-full">
            {insight.title && (
              <h2 className="text-slate-950 font-montserrat font-bold text-3xl lg:text-4xl leading-snug mb-6 mx-auto max-w-4xl px-5 md:px-10 xl:px-16">
                {insight.title}
              </h2>
            )}
            <PostContent content={insight.content ?? ""} variant="single" />
          </div>
        </div>
      </div>

      {/* Related highlights */}
      {related.length > 0 && (
        <div className="bg-pink-100 py-12 md:py-16 xl:py-20">
          <div className="mx-auto max-w-full px-5 md:px-10 xl:px-16">
            <div className="max-w-2xl text-left">
              <PageSubTitle>highlights</PageSubTitle>
              <PageTitle className="!text-4xl">See other Highlights</PageTitle>
            </div>

            <div className="mt-11 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {related.map((post) => (
                <CardType5
                  key={post.id}
                  title={post.title ?? ""}
                  excerpt={post.excerpt ?? ""}
                  imageUrl={post.featuredImage?.node?.sourceUrl ?? undefined}
                  postDate={post.date ?? ""}
                  uri={post.uri ?? undefined}
                  categories={post.insightsCategories?.nodes ?? []}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SingleInsight;

/** Attach query + variables for build/runtime data fetching */
(SingleInsight as any).query = SINGLE_INSIGHT_QUERY;
(SingleInsight as any).variables = (
  seedNode: { slug?: string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!ctx.params?.slug && !seedNode?.slug) {
    throw new Error(
      "SingleInsight.variables: missing slug from params/seedNode."
    );
  }

  const slug =
    (Array.isArray(ctx.params?.slug)
      ? ctx.params?.slug[0]
      : ctx.params?.slug) || seedNode?.slug;

  return { slug };
};
