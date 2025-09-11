"use client";

import { useEffect } from "react";
import { liteClient as algoliasearch } from "algoliasearch/lite";

import instantsearch from "instantsearch.js";
import { relatedProducts } from "instantsearch.js/es/widgets";

export default function RecommendTest() {
  useEffect(() => {
    const searchClient = algoliasearch(
      "5WBGSMHHLG", // App ID
      "ab90572ef0de1cf074052c51e68ed5b4" // Search API key
    );

    const search = instantsearch({
      searchClient,
      indexName: "wp_searchsearchable_posts",
      future: { preserveSharedStateOnUnmount: true }, // removes warning
    });

    search.addWidgets([
      relatedProducts({
        container: "#recommend-container",
        objectIDs: ["125-0"], // try with a known objectID
      }),
    ]);

    search.start();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Algolia Recommend Test</h1>
      <div id="recommend-container" />
    </main>
  );
}
