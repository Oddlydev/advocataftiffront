"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import LoadingIcon from "./LoadingIcon";
import ListBulletItem from "./ListBulletItem";

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
    <article className="w-full">
      <div className="flex flex-col gap-2">
        <a
          className="inline-flex text-sm font-medium tracking-normal leading-5 underline decoration-solid  decoration-[var(--brand-1-600)] underline-offset-[20.5%] text-[var(--color-brand-1-600)] font-[Montserrat]"
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
        <div className="mt-3 flex items-center gap-1 p-5">
          <LoadingIcon />
          <span
            className="text-xs font-semibold leading-4 tracking-normal font-[Montserrat]"
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
          <h3 className="mt-3 text-sm font-semibold tracking-normal leading-5 text-slate-700 font-[Montserrat]">
            Key Takeaways
          </h3>

          <div className="mt-2.5 space-y-3">
            {takeawayPoints.map((point) => (
              <ListBulletItem
                key={point}
                text={point}
                className="bg-transparent px-0 py-0"
              />
            ))}
          </div>
        </>
      )}
    </article>
  );
}
