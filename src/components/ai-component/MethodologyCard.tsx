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
    if (state === "revealed") {
      requestAnimationFrame(() => setContentVisible(true));
    } else {
      setContentVisible(false);
    }
  }, [state]);

  const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

  const animationStyle = (delay: number) =>
    contentVisible
      ? {
          opacity: 1,
          animation: `fade-slide-down-slow 1.6s ${EASING} ${delay}s both`,
        }
      : { opacity: 0 };

  return (
    <article className="w-full">
      <style>{`
        @keyframes fade-slide-down-slow {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Trigger */}
      <div className="flex flex-col gap-2 pt-5 px-5">
        {state === "idle" ? (
          <a
            href="#"
            className="block w-fit text-sm font-medium leading-5 underline decoration-solid decoration-[var(--brand-1-600)] underline-offset-[20.5%] text-[var(--color-brand-1-600)] font-[Montserrat]"
            onClick={(event) => {
              event.preventDefault();
              reveal();
            }}
          >
            Click to see Methodology
          </a>
        ) : state === "analyzing" ? (
          <div className="inline-flex items-center gap-1 text-xs font-semibold leading-4 font-[Montserrat]">
            <LoadingIcon />
            <span className="text-slate-600">Analyzing...</span>
          </div>
        ) : null}
      </div>

      {/* Content */}
      {state === "revealed" && (
        <div className="mt-3">
          <div
            className="grid overflow-hidden transition-[grid-template-rows,opacity,transform]"
            style={{
              gridTemplateRows: contentVisible ? "1fr" : "0fr",
              transitionDuration: "1200ms",
              transitionTimingFunction: EASING,
              opacity: contentVisible ? 1 : 0,
              transform: contentVisible ? "translateY(0)" : "translateY(-6px)",
            }}
          >
            <div className="min-h-0">
              <div className="space-y-2">
                <div className="opacity-0" style={animationStyle(0.08)}>
                  <h3 className="text-sm font-semibold leading-5 text-slate-700 font-[Montserrat]">
                    Methodology
                  </h3>
                </div>

                <p
                  className="text-xs leading-5 tracking-[0px] text-slate-600 opacity-0"
                  style={{
                    fontFamily: '"Source Code Pro"',
                    ...animationStyle(0.22),
                  }}
                >
                  Analysis performed using descriptive statistics, variance
                  analysis, and correlation matrices. All figures are
                  inflation-adjusted to 2024 prices using the Consumer Price
                  Index (CPI) provided by the Reserve Bank of India.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
