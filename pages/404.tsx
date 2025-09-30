// pages/404.tsx
import Link from "next/link";
import { NextPage } from "next";
import PrimaryButton from "@/src/components/Buttons/PrimaryBtn";
import WhiteButton from "@/src/components/Buttons/WhiteBtn";


const Custom404: NextPage = () => {
  return (
<section id="primary">
          <main id="main">
            <div className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
              <div className="text-center">
                <p className="text-base leading-snug font-sourcecodepro font-semibold text-brand-1-600">
                  404 error
                </p>
                <h1 className="mt-4 text-4xl md:text-5xl leading-snug font-bold font-montserrat tracking-tight text-balance text-slate-950">
                  Oops! This page is missing
                </h1>
                <p className="mt-6 text-lg/7 font-normal font-baskervville text-pretty text-slate-800 max-w-xl mx-auto">
                  We couldn’t find the page you were looking for. Don’t worry—you can
                  still explore datasets and insights across our platform.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                  <PrimaryButton>Search datasets</PrimaryButton>
                  <WhiteButton>Go back home</WhiteButton>
                </div>
              </div>
            </div>
          </main>
        </section>
  );
};

export default Custom404;
