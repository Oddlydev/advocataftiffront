"use client";

import { useState } from "react";

interface NewsletterFormProps {
  listId?: number; // MailPoet list ID
  variant?: "desktop" | "mobile";
}

export default function NewsletterForm({
  listId = 1,
  variant = "desktop",
}: NewsletterFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  async function onSubscribe(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email-address") as HTMLInputElement)
      .value;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/custom/v1/subscribe`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, list_id: listId }),
        }
      );

      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      setMessage("Thanks for subscribing!");
      form.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong");
    }
  }

  // Shared SVG header
  const Header = () => (
    <div className="flex justify-between items-center">
      <div>
        <svg
          className="w-5 h-4 text-brand-white"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
        >
          <path
            d="M2 4C2 2.89543 2.89543 2 4 2H20.4167C21.5212 2 22.4167 2.89543 22.4167 4V16.3333C22.4167 17.4379 21.5212 18.3333 20.4167 18.3333H4C2.89543 18.3333 2 17.4379 2 16.3333V4Z"
            stroke="currentColor"
            strokeWidth="2.04167"
            strokeLinejoin="round"
          />
          <path
            d="M20.7151 6.76392L13.0665 10.6615C12.8069 10.7821 12.5121 10.8456 12.2119 10.8456C11.9118 10.8456 11.617 10.7821 11.3574 10.6615L3.70117 6.76392"
            stroke="currentColor"
            strokeWidth="2.04167"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <span className="block w-10 border-t-4 border-brand-white" />
      </div>
    </div>
  );

  return (
    <div
      className={`rounded-lg border border-white/50 backdrop-blur-xl ${
        variant === "desktop" ? "p-8" : "p-7"
      }`}
    >
      <Header />

      <div className="mt-5">
        <h3
          className={
            variant === "desktop"
              ? "text-xl/7 md:text-2xl/snug tracking-normal font-montserrat font-normal text-brand-white"
              : "footer-heading text-2xl/snug tracking-normal font-montserrat font-normal text-brand-white"
          }
        >
          Newsletter Subscription
        </h3>
        <p className="mt-3 text-base/6 md:text-lg/7 font-baskervville font-normal text-brand-white/80">
          Get exclusive economic insights and data analysis delivered to your
          inbox from Advocata&apos;s research team.
        </p>
      </div>

      <form className="mt-7 grid" onSubmit={onSubscribe}>
        <label htmlFor={`email-address-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          type="email"
          name="email-address"
          id={`email-address-${variant}`}
          autoComplete="email"
          required
          className="footer-subscribe-input block w-full rounded-md shadow-sm bg-white px-3 py-3.5 text-base/6 text-gray-900 font-baskervville font-normal border border-gray-300 hover:border-gray-300 outline-0 outline-offset-0 outline-transparent placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-brand-2-900 focus:ring-1 focus:ring-indigo-500"
          placeholder="Enter your email"
        />
        <div className="mt-3 sm:shrink-0">
          <button
            type="submit"
            disabled={status === "loading"}
            className={`footer-subscribe-btn flex w-full items-center justify-center rounded-md bg-brand-1-600 px-6 py-4 text-lg/7 font-medium text-brand-white font-sourcecodepro shadow-sm hover:bg-brand-1-900 transform focus-visible:outline-0 focus-visible:outline-offset-0 focus-visible:outline-transparent transition-colors duration-300 ease-in-out cursor-pointer ${
              variant === "desktop"
                ? "bg-brand-1-600 hover:bg-brand-1-900"
                : "bg-brand-1-900 hover:bg-brand-1-950"
            }`}
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      </form>

      {message && (
        <p
          className={`mt-3 text-sm ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}