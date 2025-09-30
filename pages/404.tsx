// pages/404.tsx
import PrimaryButton from "@/src/components/Buttons/PrimaryBtn";
import WhiteIconButton from "@/src/components/Buttons/WhiteIconBtn";
import { NextPage } from "next";
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
              We couldn’t find the page you were looking for. Don’t worry—you
              can still explore datasets and insights across our platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <PrimaryButton href="/datasets">Search datasets</PrimaryButton>
              <WhiteIconButton
                text="Go back home"
                link="/"
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
                      stroke-width="1.8"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M2.91669 10H16.9417"
                      stroke="#4B5563"
                      stroke-width="1.8"
                      stroke-miterlimit="10"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Custom404;
