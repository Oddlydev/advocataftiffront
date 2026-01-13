"use client";

import React, { useEffect, useRef, useState } from "react";
import LoadingIcon from "./LoadingIcon";
import DetailCard, { DetailVariant } from "./DetailCard";
import type { DetailContentMap } from "./detailContent.types";

type SuggestedActionCardProps = {
  showDetailOnClick?: boolean;
  title?: string;
  description?: string;
  detailVariant?: DetailVariant;
  detailContent?: DetailContentMap[DetailVariant];
  takeaways?: string[];
  methodology?: string;
  reportContent?: string | null;
  reportTitle?: string;
};

type FlowState = "idle" | "thinking" | "revealing" | "detail";

export default function SuggestedActionCard({
  showDetailOnClick = false,
  title = "Generate Summary Statistics Report",
  description = "Get mean, median, growth rates & volatility for all 12 categories",
  detailVariant,
  detailContent,
  takeaways,
  methodology,
  reportContent,
  reportTitle,
}: SuggestedActionCardProps) {
  const [active, setActive] = useState(false);

  const resolvedVariant = detailVariant ?? "composition";

  const [flow, setFlow] = useState<FlowState>("idle");
  const [detailVisible, setDetailVisible] = useState(false);

  const thinkingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (thinkingTimerRef.current) {
      clearTimeout(thinkingTimerRef.current);
      thinkingTimerRef.current = null;
    }
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (flow === "revealing" || flow === "detail") {
      requestAnimationFrame(() => setDetailVisible(true));
    } else {
      setDetailVisible(false);
    }
  }, [flow]);

  const handleClick = () => {
    // Toggle active UI state always
    setActive((prev) => !prev);

    if (!showDetailOnClick) return;

    const isOpen = flow !== "idle";

    // If open (thinking/revealing/detail), clicking again closes it
    if (isOpen) {
      clearTimers();
      setFlow("idle");
      return;
    }

    // Start open sequence
    setFlow("thinking");

    clearTimers();
    thinkingTimerRef.current = setTimeout(() => {
      setFlow("revealing");

      revealTimerRef.current = setTimeout(() => {
        setFlow("detail");
      }, 1200);
    }, 900);
  };

  const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <div className="w-full">
      <article
        onClick={handleClick}
        className={`group flex w-full items-start gap-[16px] rounded-2xl border px-5 py-4 transition-all duration-200 ${
          active
            ? "border-[rgba(234,25,82,0.3)] bg-[linear-gradient(135deg,rgba(234,25,82,0.05)_0%,rgba(227,63,255,0.05)_100%)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]"
            : "border-slate-200 bg-white hover:border-[rgba(234,25,82,0.2)] hover:bg-[#F8FAFC] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
        } ${showDetailOnClick ? "cursor-pointer" : ""}`}
      >
        <span
          className={`flex h-[44px] w-[44px] min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-[10px] p-4 transition duration-200 ${
            active
              ? "bg-[linear-gradient(270deg,#EA1952_0%,#AA1E58_100%)] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] text-white"
              : "bg-slate-100 text-[#64748B] group-hover:text-[var(--brand-1-500)] group-hover:bg-[linear-gradient(135deg,rgba(234,25,82,0.1)_0%,rgba(227,63,255,0.1)_100%)]"
          }`}
        >
          {active ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0.833374 0.833344L5.83337 5.83334L10.8334 0.833344"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M0.833374 10.8333L5.83337 5.83333L0.833374 0.833328"
                stroke="currentColor"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>

        <div className="space-y-1">
          <h3
            className={`text-sm font-semibold leading-5 transition-colors duration-200 ${
              active
                ? "text-[var(--brand-1-500)]"
                : "text-slate-900 group-hover:text-[var(--brand-1-500)]"
            }`}
            style={{ fontFamily: "Montserrat" }}
          >
            {title}
          </h3>

          <p
            className="text-xs leading-4 text-slate-600 tracking-normal"
            style={{ fontFamily: '"Source Code Pro"' }}
          >
            {description}
          </p>
        </div>
      </article>

      {/* SINGLE OUTPUT REGION */}
      {showDetailOnClick && (
        <div>
          {flow === "thinking" ? (
            <div className="flex items-center gap-1 px-5 py-5">
              <LoadingIcon />
              <span
                className="text-xs font-semibold font-[Montserrat]"
                style={{
                  background:
                    "linear-gradient(90deg, var(--slate-500, #64748B) 0%, var(--slate-300, #CBD5E1) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Thinking...
              </span>
            </div>
          ) : flow === "revealing" || flow === "detail" ? (
            <div className="mt-2">
              <div
                className="grid overflow-hidden transition-[grid-template-rows,opacity,transform]"
                style={{
                  gridTemplateRows: detailVisible ? "1fr" : "0fr",
                  transitionDuration: "1200ms",
                  transitionTimingFunction: EASING,
                  opacity: detailVisible ? 1 : 0,
                  transform: detailVisible
                    ? "translateY(0)"
                    : "translateY(-6px)",
                }}
              >
                <div className="min-h-0">
                  {detailContent ? (
                    <DetailCard
                      variant={resolvedVariant}
                      detailContent={detailContent}
                      takeaways={takeaways}
                      methodology={methodology}
                      reportContent={reportContent ?? undefined}
                      reportTitle={reportTitle}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
