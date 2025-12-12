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
  const [contentVisible, setContentVisible] = useState(false);

  const reveal = useCallback(() => {
    if (state !== "idle") return;

    setState("analyzing");
    delayRef.current = setTimeout(() => {
      setState("revealed");
    }, 1500);
  }, [state]);

  useEffect(() => {
    if (autoOpen && state === "idle") reveal();
  }, [autoOpen, reveal, state]);

  useEffect(() => {
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  useEffect(() => {
    let frame: number | null = null;
    if (state === "revealed") {
      frame = requestAnimationFrame(() => {
        setContentVisible(true);
      });
    } else {
      setContentVisible(false);
    }

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [state]);

  const animationStyle = (delay: number) =>
    contentVisible
      ? {
          animation: `fade-slide-down 0.9s cubic-bezier(0.4,0,0.2,1) ${delay}s both`,
        }
      : undefined;

  return (
    <article className="w-full">
      <div className="flex flex-col gap-2">
        {state === "idle" ? (
          <a
            className="inline-flex text-sm font-medium tracking-normal leading-5 underline decoration-solid decoration-[var(--brand-1-600)] underline-offset-[20.5%] text-[var(--color-brand-1-600)] font-[Montserrat]"
            href="#"
            onClick={(event) => {
              event.preventDefault();
              reveal();
            }}
          >
            Click to see Methodology
          </a>
        ) : state === "analyzing" ? (
          <div className="inline-flex items-center gap-1 text-xs font-semibold leading-4 tracking-normal font-[Montserrat]">
            <LoadingIcon />
            <span
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
        ) : null}
      </div>

      {state === "revealed" && (
        <div className="mt-3 space-y-2">
          <div className="opacity-0" style={animationStyle(0)}>
            <h3 className="text-sm font-semibold tracking-normal leading-5 text-slate-700 font-[Montserrat]">
              Methodology
            </h3>
          </div>

          <p
            className="text-xs leading-5 tracking-[0px] text-slate-600 opacity-0"
            style={{
              fontFamily: '"Source Code Pro"',
              ...animationStyle(0.15),
            }}
          >
            Analysis performed using descriptive statistics, variance analysis,
            and correlation matrices. All figures are inflation-adjusted to 2024
            prices using the Consumer Price Index (CPI) provided by the Reserve
            Bank of India.
          </p>
        </div>
      )}
    </article>
  );
}
