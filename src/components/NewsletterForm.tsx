"use client";

import { useState, useEffect } from "react";

interface NewsletterFormProps {
  variant?: "desktop" | "mobile";
}

export default function NewsletterForm({
  variant = "desktop",
}: NewsletterFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  // Close popup with ESC key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowPopup(false);
    }
    if (showPopup) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showPopup]);

  // Step 1 → Capture email from footer
  function onFooterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email-address") as HTMLInputElement)
      .value;
    setSavedEmail(email);
    setShowPopup(true); // open modal
  }

  // Step 2 → Handle popup submit
  async function onPopupSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const payload = {
      email: savedEmail,
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement)
        .value,
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value,
      organisation: (
        form.elements.namedItem("organisation") as HTMLInputElement
      ).value,
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    };

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");

      setStatus("success");
      setMessage("Thank you for subscribing! 🎉");
      setShowPopup(false);

      // clear footer form email input
      const footerForm = document.querySelector<HTMLFormElement>(
        "form#newsletter-footer-form"
      );
      footerForm?.reset();
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "Something went wrong");
    }
  }

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
        <p className="mt-3 text-base/6 md:text-lg/7 font-sourcecodepro font-normal text-brand-white/80">
          Get exclusive economic insights and data analysis delivered to your
          inbox from Advocata&apos;s research team.
        </p>
      </div>

      {/* Footer form (only email) */}
      <form
        className="mt-7 grid"
        id="newsletter-footer-form"
        onSubmit={onFooterSubmit}
      >
        <label htmlFor={`email-address-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          type="email"
          name="email-address"
          id={`email-address-${variant}`}
          autoComplete="email"
          required
          className="footer-subscribe-input block w-full rounded-md shadow-sm bg-white px-3 py-3.5 text-base/6 text-gray-900"
          placeholder="Enter your email"
        />
        <div className="mt-3 sm:shrink-0">
          <button
            type="submit"
            className={`footer-subscribe-btn flex w-full items-center justify-center rounded-md px-6 py-4 text-lg/7 font-medium text-brand-white font-sourcecodepro shadow-sm transition-colors duration-300 ease-in-out cursor-pointer ${
              variant === "desktop"
                ? "bg-brand-1-600 hover:bg-brand-1-900"
                : "bg-brand-1-900 hover:bg-brand-1-950"
            }`}
          >
            Subscribe
          </button>
        </div>
      </form>

      {/* Footer message → only show when popup is NOT open */}
      {!showPopup && message && (
        <p
          className={`mt-3 text-sm ${
            status === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {/* Fullscreen Modal Form */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl p-8">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 text-gray-900">
              Complete your subscription
            </h2>

            <form onSubmit={onPopupSubmit} className="grid gap-5">
              {/* Pre-filled email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={savedEmail}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Organisation
                </label>
                <input
                  type="text"
                  name="organisation"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm px-3 py-2"
                />
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors"
              >
                {status === "loading" ? "Submitting..." : "Finish Subscription"}
              </button>
              {showPopup && message && (
                <p
                  className={`mt-3 text-sm text-center ${
                    status === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
