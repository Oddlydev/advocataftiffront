// import React, { JSX } from "react";
import React, { JSX, useState, useEffect } from "react";

import { gql } from "@apollo/client";
import type { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import SEO from "@/src/components/SEO";

// Components
import Card from "@/src/components/Cards/DashboardCard";
import CardType5 from "@/src/components/Cards/CardType5";
import CardType6 from "@/src/components/Cards/CardType6";
import PrimaryButton from "@/src/components/Buttons/PrimaryBtn";
import {
  PageSubTitle,
  PageTitle,
  PageTitleText,
} from "@/src/components/Typography";
import SearchFieldHome from "@/src/components/InputFields/SearchFieldHome";
import WhiteIconButton from "@/src/components/Buttons/WhiteIconBtn";
import FeaturedDashboardChart, {
  FeaturedDashboardChartProps,
} from "@/src/components/HeroBlocks/FeaturedDashboardChart";

type DashboardFileNode = { mediaItemUrl?: string | null } | null;
type DashboardDataSetFields = {
  dataSetFile?: { node?: DashboardFileNode } | null;
};
type FeaturedDashboardEntry = {
  __typename?: string | null;
  databaseId?: number | null;
  slug?: string | null;
  uri?: string | null;
  title?: string | null;
  dataSetFields?: DashboardDataSetFields | null;
};
interface HomePageProps {
  data?: {
    page?: {
      title?: string | null;
      content?: string | null;
      seo?: {
        title?: string | null;
        metaDesc?: string | null;
        canonical?: string | null;
        opengraphTitle?: string | null;
        opengraphDescription?: string | null;
        opengraphUrl?: string | null;
        opengraphSiteName?: string | null;
        opengraphImage?: { sourceUrl?: string | null } | null;
        twitterTitle?: string | null;
        twitterDescription?: string | null;
        twitterImage?: { sourceUrl?: string | null } | null;
        schema?: { raw?: string | null } | null;
      } | null;
      homeAiSection?: {
        aiTitle?: string | null;
        aiDescription?: string | null;
      } | null;
      homeHeroThumbnail?: {
        homeHeroThumbnail?: {
          heroSectionImage?: { node?: { mediaItemUrl?: string | null } | null };
          heroSectionVideo?: { node?: { mediaItemUrl?: string | null } | null };
        } | null;
      } | null;
      featuredDashboardSection?: {
        featuredDashboard?: {
          nodes?: Array<FeaturedDashboardEntry | null> | null;
        } | null;
      } | null;
    } | null;

    dashboardsPage?: {
      dashboardSection?: {
        dashboards?: Array<{
          title?: string | null;
          description?: string | null;
          url?: string | null;
          image?: { node?: { mediaItemUrl?: string | null } | null } | null;
        }> | null;
      } | null;
    } | null;

    dataSets?: {
      nodes?: Array<{
        id: string;
        uri?: string | null;
        title?: string | null;
        excerpt?: string | null;
        date?: string | null;
        dataSetFields?: {
          dataSetFile?: { node?: { mediaItemUrl?: string | null } | null };
        } | null;
      }> | null;
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
      }> | null;
    } | null;
  };
  loading?: boolean;
}

/** GraphQL query for page, dashboards, datasets, and insights */
const PAGE_QUERY = gql`
  query GetHomePage(
    $databaseId: ID!
    $dashboardId: ID!
    $asPreview: Boolean = false
  ) {
    page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
      title
      content
      featuredDashboardSection {
        featuredDashboard {
          nodes {
            __typename
            databaseId
            slug
            uri
            ... on MacroEconomy {
              dataSetFields {
                dataSetFile {
                  node {
                    mediaItemUrl
                  }
                }
              }
            }
            ... on GovernmentFiscal {
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
      homeAiSection {
        aiTitle
        aiDescription
      }
      homeHeroThumbnail {
        homeHeroThumbnail {
          heroSectionImage {
            node {
              mediaItemUrl
            }
          }
          heroSectionVideo {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }

    dashboardsPage: page(
      id: $dashboardId
      idType: DATABASE_ID
      asPreview: $asPreview
    ) {
      dashboardSection {
        dashboards {
          title
          description
          url
          image {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }

    dataSets(first: 6) {
      nodes {
        id
        uri
        title
        excerpt
        date
        dataSetFields {
          dataSetFile {
            node {
              mediaItemUrl
            }
          }
        }
      }
    }

    insights(first: 3) {
      nodes {
        id
        uri
        title
        excerpt
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
  }
`;

/** Strip tags and normalize text from Gutenberg HTML */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
}

/** Extract first heading + first non-empty paragraph */
function extractHeroFromGutenberg(html?: string | null): {
  title?: string;
  description?: string;
} {
  if (!html) return {};
  const h = html.match(/<h[1-6]\b[^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const title = h ? stripHtml(h[1]) : undefined;

  const pMatches = html.match(/<p\b[^>]*>[\s\S]*?<\/p>/gi) || [];
  let description: string | undefined;
  for (const p of pMatches) {
    const inner = stripHtml(
      p.replace(/^<p\b[^>]*>/i, "").replace(/<\/p>$/i, "")
    );
    if (inner) {
      description = inner;
      break;
    }
  }
  return { title, description };
}

/** Main Home Page component */
export default function PageHome({ data }: HomePageProps): JSX.Element {
  const router = useRouter();
  const homeHeroBg = "/assets/images/patterns/home-hero.jpg";

  const heroHtml = data?.page?.content ?? undefined;
  const { title: heroTitle, description: heroDescription } =
    extractHeroFromGutenberg(heroHtml);

  const heroVideo =
    data?.page?.homeHeroThumbnail?.homeHeroThumbnail?.heroSectionVideo?.node
      ?.mediaItemUrl;
  const heroImage =
    data?.page?.homeHeroThumbnail?.homeHeroThumbnail?.heroSectionImage?.node
      ?.mediaItemUrl;
  const featuredNodes =
    data?.page?.featuredDashboardSection?.featuredDashboard?.nodes ?? [];
  let featuredDashboardChart: FeaturedDashboardChartProps | null = null;
  let featuredDashboardUri: string | null = null;

  const primaryFeatured = featuredNodes.find(
    (node): node is FeaturedDashboardEntry =>
      Boolean(node) &&
      (node?.__typename === "MacroEconomy" ||
        node?.__typename === "GovernmentFiscal")
  );

  if (primaryFeatured?.__typename === "MacroEconomy") {
    featuredDashboardChart = {
      kind: "macro",
      slug: primaryFeatured.slug ?? undefined,
      datasetUrl:
        primaryFeatured.dataSetFields?.dataSetFile?.node?.mediaItemUrl ??
        undefined,
      databaseId: primaryFeatured.databaseId ?? undefined,
      title: primaryFeatured.title ?? undefined,
    };
    featuredDashboardUri = primaryFeatured.uri ?? null;
  } else if (primaryFeatured?.__typename === "GovernmentFiscal") {
    featuredDashboardChart = {
      kind: "fiscal",
      datasetUrl:
        primaryFeatured.dataSetFields?.dataSetFile?.node?.mediaItemUrl ??
        undefined,
      databaseId: primaryFeatured.databaseId ?? undefined,
      title: primaryFeatured.title ?? undefined,
    };
    featuredDashboardUri = primaryFeatured.uri ?? null;
  }

  data?.page?.homeHeroThumbnail?.homeHeroThumbnail?.heroSectionImage?.node
    ?.mediaItemUrl;

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  // z-index toggle effect
  useEffect(() => {
    if (typeof window === "undefined") return; // Only run in browser

    const featured = document.getElementById("featured-section");
    if (!featured) return;

    if (isSearchVisible) {
      featured.classList.remove("z-20");
    } else {
      featured.classList.add("z-20");
    }
  }, [isSearchVisible]);

  return (
    <div className="bg-white overflow-x-hidden">
      <SEO
        yoast={data?.page?.seo as any}
        title={data?.page?.title ?? heroTitle ?? "Home"}
        description={heroDescription}
      />
      {/* Hero section */}
      <div
        className="home-hero relative text-white h-screen md:h-[65vh] xl:h-screen"
        style={{
          backgroundImage: `url(${homeHeroBg})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundColor: "lightgray",
        }}
      >
        {/* Overlay container */}
        <div className="absolute inset-0 h-full w-full overflow-hidden">
          {/* Blurred overlay */}
          <div className="absolute inset-0 h-full w-full backdrop-blur-xs" 
            style={{ 
              maskImage: "linear-gradient(0deg, rgba(235, 26, 82, 0.20) 0%, rgba(235, 26, 82, 0.20) 100%)", 
              WebkitMaskImage: "linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.45) 100%)", }} >
          </div>

          {/* Red + Black gradient overlay */}
          <div
            className="absolute inset-0 h-full w-full"
            style={{
              background: `
                linear-gradient(0deg, rgba(235, 26, 82, 0.20) 0%, rgba(235, 26, 82, 0.20) 100%),
                linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.45) 100%)
              `,
            }}
          ></div>
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 flex items-center">
          <div className="hero-block-container px-5 md:px-16 xl:px-20 pt-10 pb-24 sm:pb-28 md:pt-16 md:pb-16 xl:pt-56 xl:pb-78 relative z-10 mx-auto">
            <div className="hero-block-center text-center mx-auto max-w-4xl grid justify-center">
              {heroTitle && (
                <h1 className="hero-title mb-5 text-slate-50 text-4xl md:text-5xl xl:text-[80px] leading-snug font-montserrat font-extrabold">
                  {heroTitle}
                </h1>
              )}
              {heroDescription && (
                <div className="space-y-2.5">
                  <p className="hero-paragraph text-slate-200 text-base/6 lg:text-lg/7 font-montserrat font-normal mx-auto">
                    {heroDescription}
                  </p>
                </div>
              )}
              <div className="mt-8">
                <SearchFieldHome setIsSearchVisible={setIsSearchVisible} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero media (video or image) */}
      {featuredDashboardChart ? (
        <div id="featured-section" className="bg-white pb-0 relative">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
            <div className="ring-1 ring-black/10 rounded-3xl relative -top-30 custom-top-50 sm:-top-28 md:-top-28 lg:-top-40 xl:-top-30 overflow-visible bg-brand-1-800 p-5 md:p-10">
              <div className="md:flex items-center justify-between px-3 py-2 md:px-6 md:py-4">
                <h2 className="text-2xl md:text-3xl xl:text-4xl leading-snug font-montserrat font-bold text-slate-50">
                  Featured Dashboard
                </h2>
                <div className="mt-3.5 md:mt-0">
                  <WhiteIconButton
                    text="View All Dashboards"
                    link="/dashboard"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.025 4.94168L17.0834 10L12.025 15.0583"
                          stroke="#4B5563"
                          strokeWidth="1.8"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.91669 10H16.9417"
                          stroke="#4B5563"
                          strokeWidth="1.8"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
              <FeaturedDashboardChart {...featuredDashboardChart} />
            </div>
          </div>
        </div>
      ) : heroVideo ? (
        <div id="featured-section" className="bg-white pb-0 relative">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
            <div className="ring-1 ring-black/10 rounded-3xl relative -top-30 custom-top-50 sm:-top-28 md:-top-28 lg:-top-40 xl:-top-32 overflow-visible bg-brand-1-800 p-5 md:p-10">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-2xl md:text-3xl xl:text-4xl leading-snug font-montserrat font-bold text-slate-50">
                  Featured Dashboard
                </h2>
                <div>
                  <WhiteIconButton
                    text="View All Dashboards"
                    link="/dashboard"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.025 4.94168L17.0834 10L12.025 15.0583"
                          stroke="#4B5563"
                          strokeWidth="1.8"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.91669 10H16.9417"
                          stroke="#4B5563"
                          strokeWidth="1.8"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
              <video
                src={heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="rounded-3xl h-full w-full object-cover mt-3"
              />
            </div>
          </div>
        </div>
      ) : heroImage ? (
        <div className="bg-white pb-0 relative">
          <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
            <div className="ring-1 ring-black/10 rounded-3xl relative -top-32 sm:-top-28 md:-top-28 lg:-top-40 xl:-top-32 overflow-hidden bg-brand-1-800 p-10">
              <div className="flex items-center justify-between px-6 py-4">
                <h2 className="text-2xl md:text-3xl xl:text-4xl leading-snug font-montserrat font-bold text-slate-50">
                  Featured Dashboard
                </h2>
                <div>
                  <WhiteIconButton
                    text="View All Dashboards"
                    link="/dashboard"
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M12.025 4.94168L17.0834 10L12.025 15.0583"
                          stroke="#4B5563"
                          strokeWidth="1.8"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.91669 10H16.9417"
                          stroke="#4B5563"
                          strokeWidth="1.8"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
              <img
                src={heroImage}
                className="rounded-3xl h-full w-full object-cover mt-3"
                width={1120}
                height={713}
                loading="lazy"
                alt="Home hero"
              />
            </div>
          </div>
        </div>
      ) : null}
      {/* Dashboards */}
      <div className="bg-white pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="mx-auto max-w-xl xl:max-w-3xl text-center">
            <PageSubTitle className="page-sub-title">dashboard</PageSubTitle>
            <PageTitle className="page-title">
              Explore Our Advanced Dashboards
            </PageTitle>
            <PageTitleText className="page-title-text">
              Our platform features 4 interactive dashboards to help you
              understand the state of Sri Lanka's macro economy, government
              fiscal operations, the fiscal health of state-owned enterprises
              and government fiscal transparency.
            </PageTitleText>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:gap-8 xl:gap-10 sm:mt-16 xl:grid-cols-7 xl:grid-rows-2">
            {data?.dashboardsPage?.dashboardSection?.dashboards?.map(
              (card, i) => {
                let variantClasses = "";
                let colSpan = "";

                // Style variants
                switch (i) {
                  case 0:
                  case 3:
                    variantClasses = "bg-white text-slate-950 border-slate-400";
                    break;
                  case 1:
                    variantClasses =
                      "bg-brand-1-900 text-slate-50 border-slate-400";
                    break;
                  case 2:
                    variantClasses =
                      "bg-brand-black text-slate-50 border-slate-400";
                    break;
                  default:
                    variantClasses = "bg-white text-slate-950 border-slate-400"; // fallback
                }

                // Grid spans
                if (i === 0 || i === 3) {
                  colSpan = "xl:col-span-4";
                } else {
                  colSpan = "xl:col-span-3";
                }

                return (
                  <div key={i} className={`flex p-px ${colSpan}`}>
                    <Card
                      title={card?.title ?? ""}
                      description={card?.description ?? ""}
                      image={
                        card?.image?.node?.mediaItemUrl ??
                        "/assets/images/card-imgs/card-img-1.jpg"
                      }
                      url={card?.url ?? "#"}
                      className={variantClasses}
                    />
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>

      {/* AI intro */}
      <div
        className="relative overflow-hidden bg-white py-24 sm:py-32"
        style={{
          background:
            "url('/assets/images/patterns/ai-banner.jpg') no-repeat center/cover",
        }}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start">
            <div className="lg:pt-4 lg:pr-4 lg:w-3xl">
              <div className="max-w-md md:max-w-xl lg:max-w-none">
                {data?.page?.homeAiSection?.aiTitle && (
                  <span
                    className="text-xs font-semibold text-white py-2 px-3 rounded-full uppercase font-sourcecodepro"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.24)" }}
                  >
                    {data.page.homeAiSection.aiTitle}
                  </span>
                )}
                {data?.page?.homeAiSection?.aiDescription && (
                  <h3 className="mt-5 xl:text-6xl sm:text-5xl text-3xl leading-9 md:leading-14 xl:leading-16 font-bold font-montserrat text-pretty text-white">
                    {data.page.homeAiSection.aiDescription}
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Datasets */}
      <div className="bg-white py-12 md:py-16 xl:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <PageSubTitle className="page-sub-title">Datasets</PageSubTitle>
            <PageTitle className="page-title">
              Explore Our Comprehensive Dataset Collection
            </PageTitle>
          </div>
          <div className="mx-auto my-8 md:my-11 grid max-w-2xl grid-cols-1 gap-6 xl:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 md:grid-cols-2">
            {(data?.dataSets?.nodes ?? []).map((c) => (
              <div key={c.id} className="h-full">
                <CardType6
                  title={c.title ?? ""}
                  excerpt={c.excerpt ?? ""}
                  fileUrl={
                    c.dataSetFields?.dataSetFile?.node?.mediaItemUrl ?? ""
                  }
                  postDate={c.date ?? ""}
                  uri={c.uri ?? undefined}
                />
              </div>
            ))}
          </div>
          <div className="mx-auto max-w-7xl text-center">
            <PrimaryButton onClick={() => router.push("/datasets")}>
              All Data Sets
            </PrimaryButton>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-pink-100 py-12 md:py-16 xl:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <PageSubTitle className="page-sub-title">Highlights</PageSubTitle>
            <PageTitle className="page-title">
              Stay Up to Date with the Latest News and Our Insights on Sri
              Lanka's Economy
            </PageTitle>
          </div>
          <div className="mx-auto my-8 md:my-11 grid max-w-2xl grid-cols-1 gap-6 xl:gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 md:grid-cols-2">
            {(data?.insights?.nodes ?? []).map((c) => (
              <div key={c.id} className="h-full">
                <CardType5
                  title={c.title ?? ""}
                  excerpt={c.excerpt ?? ""}
                  imageUrl={c.featuredImage?.node?.sourceUrl ?? ""}
                  postDate={c.date ?? ""}
                  uri={c.uri ?? undefined}
                  categories={c.insightsCategories?.nodes ?? []}
                />
              </div>
            ))}
          </div>
          <div className="mx-auto max-w-7xl text-center">
            <PrimaryButton onClick={() => router.push("/insights")}>
              More Insights
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Attach query + variables for Next.js data fetching */
(PageHome as any).query = PAGE_QUERY;
(PageHome as any).variables = (
  _seedNode: { databaseId?: number | string } = {},
  ctx: GetStaticPropsContext
) => {
  if (!_seedNode?.databaseId) {
    throw new Error("PageHome.variables: missing databaseId from seed node.");
  }
  return {
    databaseId: String(_seedNode.databaseId), // home page id
    dashboardId: "224", // dashboards page id
    asPreview: !!ctx?.preview,
  };
};
