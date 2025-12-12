import React from "react";

type LoadingIconProps = {
  className?: string;
};

export default function LoadingIcon({ className = "" }: LoadingIconProps) {
  const petals = 12;
  const baseClassName =
    "h-4 w-4 flex-shrink-0 overflow-hidden rounded-sm";
  const classes = [baseClassName, className].filter(Boolean).join(" ");

  return (
    <svg
      width="17"
      height="16"
      viewBox="-8 -8 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classes}
      aria-hidden="true"
    >
      <defs>
        <style>{`
          @keyframes petalFill {
            0%, 100% { opacity: .25; }
            50%      { opacity: 1; }
          }
        `}</style>
      </defs>

      {Array.from({ length: petals }).map((_, i) => {
        const angle = (360 / petals) * i;
        const fill = i < 6 ? "#EA1952" : "#F3A9BA";
        const baseOpacity = i < 6 ? 0.95 : 0.55;

        return (
          <g key={i} transform={`rotate(${angle}) translate(0 -5.2)`}>
            <ellipse
              cx="0"
              cy="0"
              rx="1.05"
              ry="2.1"
              fill={fill}
              style={{
                opacity: baseOpacity,
                animation: "petalFill 1.1s ease-in-out infinite",
                animationDelay: `${i * 0.08}s`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
