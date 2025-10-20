import React from "react";
import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import HeroWhite from "@/src/components/HeroBlocks/HeroWhite";
import { WysiwygInner } from "@/src/components/WysiwygInner";
import SecondaryButton from "@/src/components/Buttons/SecondaryBtn";
import CardType6 from "@/src/components/Cards/CardType6";
import SEO from "@/src/components/SEO";
import {
  downloadCsvFile,
  downloadExcelFromCsv,
  downloadPdfFromCsv,
} from "@/src/lib/downloadUtils";
import { InnerPageTitle, PageSubTitle } from "@/src/components/Typography";
import CsvTable from "@/src/components/CsvTable";
import RelatedDatasets from "@/src/components/RelatedDatasets";

/** Single dataset + a small related list */
export const SINGLE_DATASET_QUERY = gql`
  query GetSingleDataset($slug: ID!) {
    dataSet(id: $slug, idType: SLUG) {
      id
      title
      databaseId
      content
      date
      uri
      slug
      excerpt
      datasetMetaData {
        datasetMetaDataFile {
          node {
            mediaItemUrl
          }
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
      dataSetFields {
        dataSetFile {
          node {
            mediaItemUrl
          }
        }
      }
      dataSetsCategories {
        nodes {
          id
          name
          slug
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
    dataSets(first: 10, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        uri
        title
        excerpt
        date
        slug
        datasetMetaData {
          datasetMetaDataFile {
            node {
              mediaItemUrl
            }
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
  }
`;

interface SingleDatasetProps {
  data?: {
    dataSet?: {
      id: string;
      databaseId: number;
      title?: string | null;
      content?: string | null;
      date?: string | null;
      uri?: string | null;
      slug?: string | null;
      excerpt?: string | null;
      datasetMetaData?: {
        datasetMetaDataFile?: {
          node?: { mediaItemUrl?: string | null } | null;
        } | null;
      } | null;
      featuredImage?: {
        node?: { sourceUrl?: string | null; altText?: string | null } | null;
      } | null;
      dataSetFields?: {
        dataSetFile?: { node?: { mediaItemUrl?: string | null } | null } | null;
      } | null;
    } | null;
    dataSets?: {
      nodes?: Array<{
        id: string;
        uri?: string | null;
        title?: string | null;
        excerpt?: string | null;
        date?: string | null;
        slug?: string | null;
        dataSetFields?: {
          dataSetFile?: {
            node?: { mediaItemUrl?: string | null } | null;
          } | null;
        } | null;
      }> | null;
    } | null;
  };
}

/** Dataset details page */
const DatasetInnerPage: React.FC<SingleDatasetProps> = ({ data }) => {
  const dataset = data?.dataSet;
  const allRelated = data?.dataSets?.nodes ?? [];
  if (!dataset) return <p>Dataset not found.</p>;

  // Short hero paragraph from WYSIWYG/excerpt
  const rawExcerpt = dataset.excerpt || dataset.content || "";
  const plainExcerpt = rawExcerpt.replace(/<[^>]+>/g, "").trim();
  const heroParagraph =
    plainExcerpt.length > 260
      ? `${plainExcerpt.slice(0, 260).trimEnd()}…`
      : plainExcerpt;

  const downloadUrl =
    dataset.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? "";
  const metaUrl =
    dataset.datasetMetaData?.datasetMetaDataFile?.node?.mediaItemUrl ?? null;

  // Exclude current dataset; cap to 3 items
  const related =
    allRelated
      .filter(
        (d) => d.id !== dataset.id && (d.slug ? d.slug !== dataset.slug : true)
      )
      .slice(0, 3) ?? [];

  return (
    <main>
      <SEO yoast={(dataset as any)?.seo} title={dataset.title ?? undefined} />
      {/* Hero */}
      <section className="bg-white">
        <div className="px-5 md:px-10 xl:px-16 mx-auto w-full">
          <div className="">
            <HeroWhite
              title={dataset.title ?? ""}
              paragraph={heroParagraph}
              items={[{ label: "Datasets", href: "/datasets" }]}
            />
          </div>
        </div>
      </section>

      {/* Body content */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <WysiwygInner>
            <div dangerouslySetInnerHTML={{ __html: dataset.content ?? "" }} />
          </WysiwygInner>
        </div>
      </section>

      {/* Preview table if CSV source is available */}
      {downloadUrl?.toLowerCase().endsWith(".csv") && (
        <section className="bg-white -mt-4 md:-mt-5 xl:-mt-8">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
            <CsvTable csvUrl={downloadUrl} />
          </div>
        </section>
      )}

      {/* Download actions */}
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16 pt-6 md:pt-9 pb-16">
        <div className="grid md:flex gap-7 items-center justify-start md:justify-end w-full">
          <div>
            <p className="text-base/6 font-medium font-sourcecodepro text-slate-600">
              Download data sources :
            </p>
          </div>
          <div className="flex gap-3 md:gap-2">
            <SecondaryButton
              onClick={() =>
                downloadPdfFromCsv(downloadUrl, dataset.slug || "dataset")
              }
            >
              PDF
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.5 9.16663V14.1666L9.16667 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.50016 14.1667L5.8335 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3332 8.33329V12.5C18.3332 16.6666 16.6665 18.3333 12.4998 18.3333H7.49984C3.33317 18.3333 1.6665 16.6666 1.6665 12.5V7.49996C1.6665 3.33329 3.33317 1.66663 7.49984 1.66663H11.6665"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3332 8.33329H14.9998C12.4998 8.33329 11.6665 7.49996 11.6665 4.99996V1.66663L18.3332 8.33329Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SecondaryButton>

            <SecondaryButton
              onClick={() => {
                if (metaUrl) {
                  // Fire both downloads: meta and dataset
                  try {
                    downloadCsvFile(
                      metaUrl,
                      `${dataset.slug || "dataset"}-meta`
                    );
                  } catch {}
                }
                downloadCsvFile(downloadUrl, dataset.slug || "dataset");
              }}
            >
              CSV
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.5 9.16663V14.1666L9.16667 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.50016 14.1667L5.8335 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3332 8.33329V12.5C18.3332 16.6666 16.6665 18.3333 12.4998 18.3333H7.49984C3.33317 18.3333 1.6665 16.6666 1.6665 12.5V7.49996C1.6665 3.33329 3.33317 1.66663 7.49984 1.66663H11.6665"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3332 8.33329H14.9998C12.4998 8.33329 11.6665 7.49996 11.6665 4.99996V1.66663L18.3332 8.33329Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SecondaryButton>

            <SecondaryButton
              onClick={() =>
                downloadExcelFromCsv(downloadUrl, dataset.slug || "dataset")
              }
            >
              Excel
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7.5 9.16663V14.1666L9.16667 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.50016 14.1667L5.8335 12.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3332 8.33329V12.5C18.3332 16.6666 16.6665 18.3333 12.4998 18.3333H7.49984C3.33317 18.3333 1.6665 16.6666 1.6665 12.5V7.49996C1.6665 3.33329 3.33317 1.66663 7.49984 1.66663H11.6665"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M18.3332 8.33329H14.9998C12.4998 8.33329 11.6665 7.49996 11.6665 4.99996V1.66663L18.3332 8.33329Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SecondaryButton>
          </div>
        </div>
      </div>

      {/* Related datasets */}
      <RelatedDatasets datasetId={String(dataset.databaseId)} />
      {/* {related.length > 0 && (
        <section className="bg-pink-100 py-12 md:py-16 xl:py-20">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
            <PageSubTitle>Advocata ai suggestions</PageSubTitle>
            <InnerPageTitle className="mb-8">Related Datasets</InnerPageTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((c) => (
                <CardType6
                  key={c.id}
                  title={c.title ?? ""}
                  excerpt={c.excerpt ?? ""}
                  fileUrl={
                    c.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? ""
                  }
                  postDate={c.date ?? ""}
                  uri={c.uri ?? undefined}
                />
              ))}
            </div>
          </div>
        </section>
      )} */}
    </main>
  );
};

export default DatasetInnerPage;

/** Attach query + variables for build/runtime data fetching */
(DatasetInnerPage as any).query = SINGLE_DATASET_QUERY;
(DatasetInnerPage as any).variables = (
  seedNode: { slug?: string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!ctx.params?.slug && !seedNode?.slug) {
    throw new Error(
      "DatasetInnerPage.variables: missing slug from params/seedNode."
    );
  }
  const slug =
    (Array.isArray(ctx.params?.slug)
      ? ctx.params?.slug[0]
      : ctx.params?.slug) || seedNode?.slug;
  return { slug };
};
