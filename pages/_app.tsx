// pages/_app.tsx
import "../faust.config";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import { FaustProvider } from "@faustwp/core";
import Script from "next/script";
import "../styles/globals.css";

import HeaderNav from "@/src/components/header";
import Footer from "@/src/components/footer";

import BrandLogo from "@/public/assets/images/logos/brand-logo.svg";
import navbarImg from "@/public/assets/images/nav-bg-img.png";

// 👇 Import fonts
import {
  inter,
  montserrat,
  manrope,
  playfair,
  sourceCodePro,
  baskervville,
} from "@/src/lib/fonts";

type HeaderMenuItem = {
  id: string;
  label: string;
  uri?: string | null;
  parentId?: string | null;
};

type AppPageProps = AppProps["pageProps"] & {
  headerMenuItems?: HeaderMenuItem[];
};

const MENU_PREFETCH_QUERY = `
  query GetHeaderMenuPrefetch {
    menu(id: "Main Menu", idType: NAME) {
      menuItems(first: 200) {
        nodes {
          id
          label
          uri
          parentId
        }
      }
    }
  }
`;

function resolveWpGraphqlEndpoint(): string | null {
  const wpBase =
    process.env.NEXT_PUBLIC_WP_URL ||
    process.env.NEXT_PUBLIC_WORDPRESS_URL ||
    process.env.WORDPRESS_URL;

  if (!wpBase) return null;
  return `${wpBase.replace(/\/+$/, "")}/graphql`;
}

async function fetchHeaderMenuItems(): Promise<HeaderMenuItem[]> {
  const endpoint = resolveWpGraphqlEndpoint();
  if (!endpoint) return [];

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: MENU_PREFETCH_QUERY }),
    });

    if (!response.ok) return [];

    const payload = await response.json();
    return payload?.data?.menu?.menuItems?.nodes ?? [];
  } catch {
    return [];
  }
}

function MyApp({ Component, pageProps }: AppProps<AppPageProps>) {
  const router = useRouter();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!gaId) return;

    const handleRouteChange = (url: string) => {
      const gtag = (window as { gtag?: (...args: any[]) => void }).gtag;
      if (gtag) {
        gtag("config", gaId, { page_path: url });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, [gaId, router.events]);

  return (
    <FaustProvider pageProps={pageProps}>
      {gaId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { page_path: window.location.pathname });
              `,
            }}
          />
        </>
      ) : null}
      <div
        className={`${inter.variable} ${montserrat.variable} ${manrope.variable} ${playfair.variable} ${sourceCodePro.variable} ${baskervville.variable}`}
      >
        <HeaderNav
          logoSrc={BrandLogo.src}
          navDropdownImage={navbarImg.src}
          initialMenuItems={pageProps?.headerMenuItems ?? []}
          onSearch={(q) => console.log("search:", q)}
        />

        {/* Avoid remounting the entire page on shallow route changes */}
        <Component {...pageProps} />

        <Footer />
      </div>
    </FaustProvider>
  );
}

MyApp.getInitialProps = async (
  appContext: AppContext,
): Promise<AppInitialProps> => {
  const appProps = await App.getInitialProps(appContext);

  // Only prefetch on server so initial HTML contains real menu links.
  if (typeof window === "undefined") {
    const headerMenuItems = await fetchHeaderMenuItems();
    appProps.pageProps = {
      ...appProps.pageProps,
      headerMenuItems,
    };
  }

  return appProps;
};

export default MyApp;
