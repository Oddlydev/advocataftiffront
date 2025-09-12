// pages/404.tsx
import Link from "next/link";
import { NextPage } from "next";
import PrimaryButton from "@/src/components/Buttons/PrimaryBtn";

const Custom404: NextPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-white">
      <div className="mx-auto max-w-2xl px-5 md:px-10 xl:px-24 text-center py-20">
        {/* Error code */}
        <h1 className="text-7xl font-bold font-montserrat tracking-tight text-brand-1-900 sm:text-8xl">
          404
        </h1>

        {/* Message */}
        <p className="mt-6 text-lg text-gray-600 font-sourcecodepro">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        {/* Back to home button */}
        <div className="mt-10">
          <PrimaryButton href="/">Back to Home</PrimaryButton>
        </div>
      </div>
    </main>
  );
};

export default Custom404;
