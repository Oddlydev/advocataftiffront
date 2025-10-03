import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import React from "react";
import SEO from "@/src/components/SEO";
import PostContent from "@/src/components/PostContent";
import HeroBlack from "@/src/components/HeroBlocks/HeroBlack";

export const PAGE_QUERY = gql`
  query GetPrivacyPolicyPage(
    $databaseId: ID!
    $asPreview: Boolean = false
  ) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      date
      modified
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

interface PrivacyPolicyPageProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null;
      date?: string | null;
      modified?: string | null;
      seo?: any | null;
    } | null;
  };
  loading?: boolean;
}

function formatUpdatedDate(isoDate?: string | null): string | undefined {
  if (!isoDate) return undefined;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return `Updated ${parsed.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ data }) => {
  const page = data?.page;

  if (!page) {
    return (
      <main className="bg-white py-10 md:py-16 xl:py-20">
        <div className="mx-auto max-w-full">
          <div className="mx-auto max-w-4xl px-5 md:px-10 xl:px-16">
            <p className="text-center text-slate-600">
              Privacy Policy content unavailable.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const heroDateText =
    formatUpdatedDate(page.modified ?? page.date) ?? "";

  return (
    <main>
      <SEO yoast={page?.seo as any} title={page?.title ?? undefined} />

      <HeroBlack
        title={page?.title ?? ""}
        dateText={heroDateText}
        homeHref="/"
        items={[{ label: "Privacy Policy" }]}
        showDate={false}
      />

      <div className="bg-white py-10 md:py-16 xl:py-20">
        <div className="mx-auto max-w-full">
          <div className="mx-auto max-w-4xl px-5 md:px-10 xl:px-16">
            <PostContent content={page?.content ?? ""} variant="single" />
          </div>
        </div>
      </div>
    </main>
  );
};

(PrivacyPolicyPage as any).query = PAGE_QUERY;
(PrivacyPolicyPage as any).variables = (
  seedNode: { databaseId?: number | string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!seedNode?.databaseId) {
    throw new Error(
      "PrivacyPolicyPage.variables: missing databaseId from seed node."
    );
  }
  return {
    databaseId: String(seedNode.databaseId),
    asPreview: !!ctx?.preview,
  };
};

export default PrivacyPolicyPage;
