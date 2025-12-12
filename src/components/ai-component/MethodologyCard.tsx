"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadingIcon from "./LoadingIcon";

type MethodologyCardProps = {
  autoOpen?: boolean;
};

export default function MethodologyCard({
  autoOpen = false,
}: MethodologyCardProps) {
  const [state, setState] = useState<"idle" | "analyzing" | "revealed">("idle");
  const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reveal = useCallback(() => {
    if (state !== "idle") return;

    setState("analyzing");
    delayRef.current = setTimeout(() => {
      setState("revealed");
    }, 650);
  }, [state]);

  useEffect(() => {
    if (autoOpen && state === "idle") reveal();
  }, [autoOpen, reveal, state]);

  useEffect(() => {
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  return (
    <article className="w-full rounded-[24px] p-6">
      <div className="flex flex-col gap-2">
        <a
          className="inline-flex text-sm font-semibold tracking-[0px] leading-5 underline decoration-solid underline-offset-[20.5%] text-[#CF1244] font-[Montserrat]"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            reveal();
          }}
        >
          Click to see Methodology
        </a>
      </div>

      {state !== "idle" && (
        <div className="mt-4 flex items-center gap-2">
          <LoadingIcon />
          <span
            className="text-xs font-semibold leading-4 tracking-[0px] font-[Montserrat]"
            style={{
              background: "linear-gradient(90deg,#64748B,#CBD5E1)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Analyzing...
          </span>
        </div>
      )}

      {state === "revealed" && (
        <>
          <h3 className="mt-5 text-lg font-semibold tracking-[0px] leading-5 text-slate-700 font-[Montserrat]">
            Methodology
          </h3>
          <p className="mt-3 text-xs leading-5 tracking-[0px] text-slate-600 font-['Source Code Pro']">
            Analysis performed using descriptive statistics, variance analysis,
            and correlation matrices. All figures are inflation-adjusted to 2024
            prices using the Consumer Price Index (CPI) provided by the Reserve
            Bank of India.
          </p>
        </>
      )}
    </article>
  );
}
