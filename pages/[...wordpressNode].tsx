// pages/[...wordpressNode].tsx
import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
import type { GetStaticPropsContext, GetStaticPaths } from "next";

interface WordPressTemplateProps {
  _TEMPLATE_SLUG_?: string;
  _SEED_NODE_?: unknown;
  loading?: boolean;
}

export default function Page(props: any) {
  return <WordPressTemplate {...props} />;
}

//   Type the ctx param so TS doesn't complain about implicit any
export async function getStaticProps(ctx: GetStaticPropsContext) {
  const props = await getWordPressProps({ ctx });
  return { ...props, revalidate: 120 };
}

//   Type getStaticPaths too
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
