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

function formatDate(dateValue: string | number | null): string {
  if (!dateValue) return "";

  let d: Date;

  if (typeof dateValue === "number") {
    // Unix timestamp in seconds
    d = new Date(dateValue * 1000);
  } else if (/^\d+$/.test(dateValue)) {
    // Numeric string -> treat as Unix timestamp
    d = new Date(parseInt(dateValue, 10) * 1000);
  } else {
    // Normal date string
    d = new Date(dateValue);
  }

  if (isNaN(d.getTime())) return ""; // invalid date

  // Format: YYYY-MM-DD
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
      indexName: "wp_searchable_posts",
      future: { preserveSharedStateOnUnmount: true },
    });

    search.addWidgets([
      relatedProducts({
        container: "#related-datasets-container",
        objectIDs: [recommendObjectID],
        queryParameters: {
          filters: 'post_type_label:"Data Sets"',
        },
        cssClasses: {
          list: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
          item: "h-full",
          title: "hidden",
        },
        transformItems(items) {
          return items.slice(0, 3);
        },
        templates: {
          header: "",
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
