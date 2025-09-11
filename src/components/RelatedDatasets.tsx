"use client";

import { useEffect } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";
import instantsearch from "instantsearch.js";
import { relatedProducts } from "instantsearch.js/es/widgets";

import { PageSubTitle, InnerPageTitle } from "@/src/components/Typography";

interface RelatedDatasetsProps {
  datasetId: string;
}

// Utility functions
function stripParagraphTags(text: string = ""): string {
  return text.replace(/<\/?p[^>]*>/g, "").trim();
}

function formatDate(date: string = ""): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function RelatedDatasets({ datasetId }: RelatedDatasetsProps) {
  useEffect(() => {
    if (!datasetId) return;

    const recommendObjectID = datasetId.endsWith("-0")
      ? datasetId
      : `${datasetId}-0`;

    const searchClient = algoliasearch(
      process.env.NEXT_PUBLIC_ALGOLIA_APP_ID as string,
      process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY as string
    );

    const search = instantsearch({
      searchClient,
      indexName: "wp_searchsearchable_posts",
      future: { preserveSharedStateOnUnmount: true },
    });

    search.addWidgets([
      relatedProducts({
        container: "#related-datasets-container",
        objectIDs: [recommendObjectID],
        cssClasses: {
          list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          item: "h-full",
          title: "hidden",
        },
        templates: {
          header: "", // removes default "Related products" h3
          item(hit: any) {
            const title = hit.post_title || "";
            const excerpt = hit.post_excerpt || "";
            const uri = hit.permalink || "#";
            const postDate = hit.post_date || "";

            return `
              <div class="relative flex flex-col h-full overflow-hidden rounded-lg bg-white border border-slate-300
                          transition-all duration-500 ease-in-out
                          hover:-translate-y-1.5 hover:border-brand-2-100
                          hover:shadow-[0_0_40px_0_rgba(79,8,46,0.40)]
                          focus:border-brand-2-100 focus:shadow-inner-lg
                          card card-type-6">
                ${
                  uri
                    ? `<a href="${uri}" aria-label="${title}" class="absolute inset-0 z-10">
                         <span class="sr-only">${title}</span>
                       </a>`
                    : ""
                }
                <div class="card-body flex flex-1 flex-col justify-between bg-white px-6 py-5">
                  <div class="flex-1">
                    <h2 class="mt-2 cursor-pointer text-2xl leading-snug font-semibold font-family-montserrat text-slate-800">
                      ${title}
                    </h2>
                    <div class="mt-2 text-base/6 font-normal font-family-sourcecodepro text-slate-600 line-clamp-3">
                      ${stripParagraphTags(excerpt)}
                    </div>
                  </div>
                  <div class="card-footer mt-6 flex items-center justify-between">
                    <time class="text-xs/tight font-medium font-family-sourcecodepro text-slate-600">
                      ${formatDate(postDate)}
                    </time>
                  </div>
                </div>
              </div>
            `;
          },
        },
      }),
    ]);

    search.start();

    return () => {
      search.dispose();
    };
  }, [datasetId]);

  return (
    <section className="bg-pink-100 py-12 md:py-16 xl:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-10 xl:px-16">
        <PageSubTitle>Advocata AI Suggestions</PageSubTitle>
        <InnerPageTitle className="mb-8">Related Datasets</InnerPageTitle>
        <div id="related-datasets-container" />
      </div>
    </section>
  );
}
