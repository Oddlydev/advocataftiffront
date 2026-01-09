// pages/_app.tsx
import "../faust.config";
import React from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import { FaustProvider } from "@faustwp/core";
import "../styles/globals.css";

import dynamic from "next/dynamic";

const HeaderNav = dynamic(() => import("@/src/components/header"), {
  ssr: true,
});
const Footer = dynamic(() => import("@/src/components/footer"), {
  ssr: true,
});

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

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <FaustProvider pageProps={pageProps}>
      <div
        className={`${inter.variable} ${montserrat.variable} ${manrope.variable} ${playfair.variable} ${sourceCodePro.variable} ${baskervville.variable}`}
      >
        <HeaderNav
          logoSrc={BrandLogo.src}
          navDropdownImage={navbarImg.src}
          onSearch={(q) => console.log("search:", q)}
        />

        {/* Avoid remounting the entire page on shallow route changes */}
        <Component {...pageProps} />

        <Footer />
      </div>
    </FaustProvider>
  );
}
