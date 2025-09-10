// wp-templates/page-test.tsx
import Head from "next/head";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
} from "@apollo/client";
import { DATASET_QUERY } from "../queries/datasetQueries";
import HeroBlack from "@/src/components/HeroBlocks/HeroBlack";

// 🔹 Setup Apollo client
const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_WORDPRESS_URL?.replace(/\/$/, "")}/graphql`,
  cache: new InMemoryCache(),
});

// 🔹 Entry: Wraps everything in ApolloProvider
export default function PageTest() {
  return (
    <ApolloProvider client={client}>
      <DatasetsInner />
    </ApolloProvider>
  );
}


// 🔹 Inner component: put ALL your HTML/JSX here
function DatasetsInner() {
  const { data, loading, error } = useQuery(DATASET_QUERY);

  const nodes: Array<any> = Array.isArray(data?.datasets?.nodes)
    ? data!.datasets!.nodes
    : [];

  return (
    <>
      <Head>
        <title>Datasets – Test</title>
      </Head>

      <main className="container mx-auto p-6">
        {/* Example custom component with ACF data */}
        <HeroBlack />

        <h1 className="text-2xl font-bold mb-6">Datasets</h1>

        {loading && <p>Loading…</p>}
        {error && <p className="text-red-600">Failed to load datasets.</p>}
        {!loading && nodes.length === 0 && <p>No datasets found.</p>}

        {/* 🔹 THIS is your HTML block for Gutenberg/ACF display */}
        <div className="grid gap-6 md:grid-cols-2">
          {nodes.map((ds, i) => {
            const fg = ds?.datasetFieldGroup;
            const img = fg?.datasetImage?.node;

            return (
              <article key={i} className="p-4 border rounded shadow-sm">
                <h2 className="text-xl font-semibold">
                  {ds?.title ?? "Untitled"}
                </h2>

                {fg?.datasetTitle && (
                  <p className="mt-2">
                    <strong>Dataset Title:</strong> {fg.datasetTitle}
                  </p>
                )}

                {fg?.datasetDescription && (
                  <p className="mt-2 whitespace-pre-line">
                    <strong>Description:</strong> {fg.datasetDescription}
                  </p>
                )}

                {img?.sourceUrl && (
                  <figure className="mt-3">
                    <img
                      src={img.sourceUrl}
                      alt={img.altText || ""}
                      className="max-w-full h-auto"
                    />
                    {img.altText && (
                      <figcaption className="text-sm opacity-70 mt-1">
                        {img.altText}
                      </figcaption>
                    )}
                  </figure>
                )}
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}
