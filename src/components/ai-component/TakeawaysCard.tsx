"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadingIcon from "./LoadingIcon";

const takeawayPoints = [
  "Average annual growth: Food (5.8%), Housing (4.2%), Alcohol & Tobacco (12.3%).",
  "Volatility index: Highest in Recreation & Culture (σ=18.2%), lowest in Education (σ=4.1%).",
  "Missing data: 15% of cells across years 2002-2006 require attention.",
];

type TakeawaysCardProps = {
  autoOpen?: boolean;
};

export default function TakeawaysCard({
  autoOpen = false,
}: TakeawaysCardProps) {
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
          Click to see Key Takeaways
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
            Key Takeaways
          </h3>

          <div className="mt-3 space-y-3">
            {takeawayPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-2 text-sm leading-[1.6] text-slate-600"
              >
                <span className="mt-[6px] h-[8px] w-[8px] rounded-full bg-gradient-to-b from-[#ea1952] to-[#aa1e58]" />
                <p className="flex-1 font-['Source Code Pro']">{point}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </article>
  );
}
