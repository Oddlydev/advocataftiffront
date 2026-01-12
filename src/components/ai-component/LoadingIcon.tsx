import React from "react";

type LoadingIconProps = {
  className?: string;
};

const PETALS = 12;
const RADIUS = 6.5;

export default function LoadingIcon({ className = "" }: LoadingIconProps) {
  const baseClassName = "h-4 w-4 flex-shrink-0 overflow-hidden rounded-sm";
  const classes = [baseClassName, className].filter(Boolean).join(" ");

  return (
    <svg
      width="16"
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

      {Array.from({ length: PETALS }).map((_, i) => {
        const angle = (360 / PETALS) * i;
        const fill = i < PETALS / 2 ? "#EA1952" : "#F3A9BA";
        const baseOpacity = i < PETALS / 2 ? 0.95 : 0.55;

        return (
          <g key={i} transform={`rotate(${angle}) translate(0 -${RADIUS})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="0.85"
              ry="1.95"
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
