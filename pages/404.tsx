// pages/404.tsx
import { NextPage } from "next";
import Link from "next/link";

// This is the custom 404 page for the application
// It provides a user-friendly message and navigation options when a page is not found
const Custom404: NextPage = () => {
  return (
    <main id="main">
      <div className="grid min-h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          {/* Error label */}
          <p className="text-base leading-snug font-sourcecodepro font-semibold text-brand-1-600">
            404 error
          </p>

          {/* Heading */}
          <h1 className="mt-4 text-4xl md:text-5xl leading-snug font-bold font-montserrat tracking-tight text-balance text-slate-950">
            Oops! This page is missing
          </h1>

          {/* Description */}
          <p className="mt-6 text-lg font-baskervville text-slate-800 max-w-xl mx-auto">
            We couldn’t find the page you were looking for. Don’t worry—you can
            still explore datasets and insights across our platform.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="#" className="btn btn-primary">
              Search datasets
            </Link>
            <Link href="/" className="text-sm btn btn-white">
              Go back home <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Custom404;
