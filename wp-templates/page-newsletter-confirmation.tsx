"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import SEO from "@/src/components/SEO";

type Status = "idle" | "loading" | "success" | "error";

type SplitName = {
  firstName: string;
  lastName: string;
};

function splitName(name: string): SplitName {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return { firstName: "", lastName: "" };
  }
  const [firstName, ...rest] = parts;
  return { firstName, lastName: rest.join(" ") };
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
    const nameValue = (formData.get("name") as string | null)?.trim() ?? "";
    const { firstName, lastName } = splitName(nameValue);
    const countryCode =
      (formData.get("country") as string | null)?.trim() ?? "";
    const phoneNumber =
      (formData.get("phone-number") as string | null)?.trim() ?? "";
    const organisation =
      (formData.get("organization") as string | null)?.trim() ?? "";

    if (!emailValue) {
      setStatus("error");
      setMessage("Please provide your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const phone = [countryCode, phoneNumber].filter(Boolean).join(" ").trim();

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
                Advocata's expert team.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 rounded-lg shadow-sm border border-slate-200 py-8 px-7">
              <form
                onSubmit={handleSubmit}
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
                      autoComplete="email"
                      placeholder="kamal978@gmail.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400
                      focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-base font-bold text-slate-800 font-sourcecodepro"
                    >
                      Your Name <span className="text-brand-1-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="name"
                        type="text"
                        name="name"
                        autoComplete="given-name"
                        placeholder="Kamal Perera"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400
                        focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone Number with Country */}
                  <div>
                    <label
                      htmlFor="phone-number"
                      className="block text-base font-bold text-slate-800 font-sourcecodepro"
                    >
                      Contact Number <span className="text-brand-1-500">*</span>
                    </label>
                    <div className="mt-2">
                      <div
                        className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-200
                      has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-brand-1-200
                      w-full px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400
                      focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200"
                      >
                        <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                          <select
                            id="country"
                            name="country"
                            autoComplete="country"
                            aria-label="Country"
                            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-transparent"
                          >
                            <option>+94</option>
                            <option>+95</option>
                            <option>+96</option>
                          </select>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M5.29289 7.29289C5.68342 6.90237 6.31658 6.90237 6.7071 7.29289L9.99999 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.68341 13.0976 9.29289 12.7071L5.29289 8.70711C4.90237 8.31658 4.90237 7.68342 5.29289 7.29289Z"
                              fill="#1E293B"
                            />
                          </svg>
                        </div>
                        <div className="flex -ml-px">
                          <input
                            id="phone-number"
                            type="text"
                            name="phone-number"
                            placeholder="11 234 5678"
                            className="block min-w-0 grow bg-white pr-3 pl-1 text-base text-slate-800 font-sourcecodepro placeholder:text-gray-400 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

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
                      autoComplete="organization"
                      placeholder="Your Company/Institution"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-slate-800 font-sourcecodepro border border-gray-200 placeholder:text-gray-400
                      focus:border-brand-1-200 focus:bg-brand-white focus:shadow-sm focus:ring-1 focus:ring-brand-1-200 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer relative">
                    <input
                      id="agree"
                      type="checkbox"
                      name="agree"
                      className="peer mt-1 h-4 w-4 rounded-sm border border-[#475569] appearance-none
                      checked:bg-brand-1-600 checked:border-brand-1-600 focus:outline-none focus:ring-2 focus:ring-brand-1-600"
                    />
                    <svg
                      className="pointer-events-none absolute hidden peer-checked:block mt-1 ml-0.5 w-3.5 h-3.5 text-white"
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
                    <span className="text-base font-medium text-slate-600 font-sourcecodepro">
                      I agree to Advocata's Privacy Policy and Terms of Service.
                    </span>
                  </label>
                </div>

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
                Advocata's expert team.
              </p>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-7 rounded-lg shadow-sm border border-slate-200 py-12 md:py-12 lg:py-32 px-6 lg:px-12">
              <div className="text-center">
                <div className="mb-6 mx-auto flex size-10 p-2.5 items-center justify-center rounded-full bg-brand-1-700">
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
                  Welcome to our research community. You'll start receiving
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
