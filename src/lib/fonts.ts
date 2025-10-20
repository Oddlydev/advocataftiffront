// src/lib/fonts.ts
import { Inter, Montserrat, Manrope, Playfair_Display, Source_Code_Pro, Baskervville, IBM_Plex_Sans } from "next/font/google";

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

export const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

export const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
});

export const sourceCodePro = Source_Code_Pro({
    subsets: ["latin"],
    variable: "--font-sourcecodepro",
});

export const baskervville = Baskervville({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-baskervville",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibmplexsans",
});
