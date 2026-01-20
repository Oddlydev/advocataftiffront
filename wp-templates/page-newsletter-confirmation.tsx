"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SEO from "@/src/components/SEO";
import Link from "next/link";

type Status = "idle" | "loading" | "success" | "error";

// Validate a single phone input by counting digits only (ignore spaces, '+', etc.)
function isValidPhoneDigits(raw: string) {
  const digits = (raw || "").replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 15;
}

export default function PageNewsletterConfirmation() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(searchParams?.get("email") ?? "");
  }, [searchParams]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const emailValue = email.trim();
    const fullName = (formData.get("fullName") as string | null)?.trim() ?? "";
    const phoneNumber =
      (formData.get("phone-number") as string | null)?.trim() ?? "";
    const organisation =
      (formData.get("organization") as string | null)?.trim() ?? "";
    const agree = formData.get("agree") === "on";

    setMessage("");

    // validations
    if (!emailValue) {
      setStatus("error");
      setMessage("Please provide your email address.");
      return;
    }

    if (!fullName) {
      setStatus("error");
      setMessage("Please provide your first and last name.");
      return;
    }

    const digitsOnly = phoneNumber.replace(/\D/g, "");
    if (!isValidPhoneDigits(phoneNumber)) {
      setStatus("error");
      setMessage("Please enter a valid contact number (8-15 digits).");
      return;
    }

    if (!agree) {
      setStatus("error");
      setMessage("Please agree to the Terms and Conditions to continue.");
      return;
    }

    setStatus("loading");

    const phone = phoneNumber;

    // Derive first/last name from the combined full name
    const [firstName, ...lastParts] = fullName.split(/\s+/);
    const lastName = lastParts.join(" ");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailValue,
          firstName,
          lastName,
          organisation,
          phone,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Subscription failed. Please try again.");
      }

      setStatus("success");
      setMessage("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setStatus("error");
      setMessage(errorMessage);
    }
  }

  return (
    <main>
      <SEO title="Newsletter Confirmation" />

      {status !== "success" && (
        <div className="bg-white py-16 sm:py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:px-10 xl:px-16 lg:grid-cols-12 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-5 max-w-sm">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-snug font-montserrat font-bold tracking-tight text-balance text-slate-950">
                Join Our Research Community
              </h2>
              <p className="mt-4 text-lg/7 font-normal font-baskervville text-slate-800">
                Get exclusive economic insights, policy analysis, and
                data-driven research delivered directly to your inbox from
                Advocata&apos;s expert team.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 rounded-lg shadow-sm border border-slate-200 py-8 px-7">
              <form
                onSubmit={handleSubmit}
                noValidate
                className="w-full lg:pt-2 space-y-6"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-base font-bold text-slate-800 font-sourcecodepro"
                  >
                    Email Address <span className="text-brand-1-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email address"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400 focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="full-name"
                    className="block text-base font-bold text-slate-800 font-sourcecodepro"
                  >
                    First and Last Name{" "}
                    <span className="text-brand-1-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="full-name"
                      type="text"
                      name="fullName"
                      required
                      placeholder="First and Last Name"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400 focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label
                    htmlFor="phone-number"
                    className="block text-base font-bold text-slate-800 font-sourcecodepro"
                  >
                    Contact Number <span className="text-brand-1-500">*</span>
                  </label>
                  <div className="mt-2">
                    <input
                      id="phone-number"
                      type="tel"
                      name="phone-number"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Phone Number"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400 focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div>
                  <label
                    htmlFor="organization"
                    className="block text-base font-bold text-slate-800 font-sourcecodepro"
                  >
                    Organization
                  </label>
                  <div className="mt-2">
                    <input
                      id="organization"
                      type="text"
                      name="organization"
                      placeholder="Your Company/Institution"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400
                      focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <div className="pt-7">
                  <div className="flex items-center gap-3">
                    <div className="relative flex justify-center items-center">
                      <input
                        id="agree"
                        type="checkbox"
                        name="agree"
                        required
                        className="peer h-5 w-5 rounded-sm border border-slate-500 appearance-none checked:bg-slate-600 checked:border-slate-600 focus:outline-none focus:ring-0 focus:ring-tranparent"
                      />
                      {/* Tick Icon */}
                      <svg
                        className="absolute top-1/2 left-1/2 w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 text-white pointer-events-none hidden peer-checked:block"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="text-base font-normal text-slate-600 font-sourcecodepro">
                      <label htmlFor="agree" className="cursor-pointer">
                        I agree to Advocata&apos;s{" "}
                      </label>
                      <a
                        href="/terms-and-conditions/"
                        className="underline hover:text-slate-900"
                      >
                        Terms and Conditions
                      </a>
                      .
                    </span>
                  </div>
                </div>

                {/* Global error message below form */}
                {status === "error" && message && (
                  <p className="text-sm text-red-600 font-sourcecodepro">
                    {message}
                  </p>
                )}

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full rounded-md px-6 py-3 text-base font-medium text-white font-sourcecodepro shadow-sm transition-colors duration-300 bg-brand-1-600 hover:bg-brand-1-900 focus:outline-none focus:ring-2 focus:ring-brand-1-200 focus:ring-offset-2"
                  >
                    {status === "loading"
                      ? "Submitting..."
                      : "Subscribe to Newsletter"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="bg-white py-16 sm:py-24 lg:py-32">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 md:px-10 xl:px-16 lg:grid-cols-12 lg:gap-12">
            {/* Left Column */}
            <div className="lg:col-span-5 max-w-sm">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl leading-snug font-montserrat font-bold tracking-tight text-balance text-slate-950">
                Join Our Research Community
              </h2>
              <p className="mt-4 text-lg/7 font-normal font-baskervville text-slate-800">
                Get exclusive economic insights, policy analysis, and
                data-driven research delivered directly to your inbox from
                Advocata&apos;s expert team.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 rounded-lg shadow-sm border border-slate-200 py-12 md:py-12 lg:py-32 px-6 lg:px-12">
              <div className="text-center">
                <div className="mb-6 mx-auto flex size-10 p-2.5 items-center justify-center rounded-full bg-brand-1-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10.0001 18.3333C14.5834 18.3333 18.3334 14.5833 18.3334 9.99999C18.3334 5.41666 14.5834 1.66666 10.0001 1.66666C5.41675 1.66666 1.66675 5.41666 1.66675 9.99999C1.66675 14.5833 5.41675 18.3333 10.0001 18.3333Z"
                      stroke="#F1F2F2"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.45825 10L8.81659 12.3583L13.5416 7.64166"
                      stroke="#F1F2F2"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl leading-snug font-montserrat font-bold text-slate-950">
                  Subscription Confirmed!
                </h3>
                <p className="mt-4 text-slate-950 font-normal font-sourcecodepro text-base/6">
                  Welcome to our research community. You&apos;ll start receiving
                  exclusive economic insights and policy analysis from our
                  expert team.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
