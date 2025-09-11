// components/Accordion.tsx
import { useEffect, useId, useState } from "react";

export type AccordionItem = {
  id?: string | number;
  title: string | React.ReactNode;
  content?: React.ReactNode;
  html?: string;
};

export type AccordionProps = {
  items: AccordionItem[];
  className?: string;
  defaultOpenIndex?: number | null; // open first by default
  singleOpen?: boolean; // only one open at a time
};

export default function Accordion({
  items,
  className = "",
  defaultOpenIndex = 0,
  singleOpen = true,
}: AccordionProps) {
  const [open, setOpen] = useState<Set<number>>(() => {
    const s = new Set<number>();
    if (typeof defaultOpenIndex === "number") s.add(defaultOpenIndex);
    return s;
  });
  const baseId = useId();

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      const isOpen = next.has(i);
      if (singleOpen) next.clear();
      if (!isOpen) next.add(i);
      else if (!singleOpen) next.delete(i);
      return next;
    });
  };

  useEffect(() => {
    if (typeof defaultOpenIndex === "number") {
      setOpen(new Set([defaultOpenIndex]));
    }
  }, [items, defaultOpenIndex]);

  return (
    <div className={`w-full ${className}`}>
      <dl className="mt-16 max-w-4xl space-y-4 mx-auto">
        {items.map((item, i) => {
          const panelId = `${baseId}-panel-${i}`;
          const btnId = `${baseId}-button-${i}`;
          const isOpen = open.has(i);

          return (
            <div key={item.id ?? i} className="accordion">
              <dt>
                <button
                  id={btnId}
                  type="button"
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  onClick={() => toggle(i)}
                  className={[
                    // from @apply .accordion-btn
                    "bg-neutral-100 rounded-lg border border-zinc-300",
                    "py-4 px-4 md:py-4 md:px-6",
                    "text-slate-950 flex w-full items-start justify-between",
                    "gap-16 md:gap-64 text-left",
                    // hide the question button when open (matches PHP)
                    isOpen ? "hidden" : "",
                  ].join(" ")}
                >
                  <span className="text-lg leading-7 md:text-xl md:leading-7 font-bold font-montserrat">
                    {item.title}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      className="transition-transform"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 8L10 13L15 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </dt>

              <dd
                id={panelId}
                role="region"
                aria-labelledby={btnId}
                className={[
                  isOpen ? "block" : "hidden",
                  // from @apply .accordion-content
                  "mt-6 bg-white/25 border border-white rounded-lg",
                  "p-4 md:p-6 text-slate-50",
                ].join(" ")}
              >
                <h3
                  className="flex w-full items-start justify-between gap-16 md:gap-56 text-left text-slate-50 font-medium font-montserrat"
                  onClick={() => toggle(i)} // click header to close (matches your PHP)
                >
                  <span className="text-lg leading-7 md:text-xl md:leading-7 font-bold font-montserrat">
                    {item.title}
                  </span>
                  <span className="ml-6 flex h-7 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M15 13L10 8L5 13"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </h3>

                {item.content ? (
                  <div className="text-base leading-6 md:text-lg md:leading-7 pt-4 max-w-full md:max-w-4xl font-normal font-sourcecodepro">
                    {item.content}
                  </div>
                ) : item.html ? (
                  <div
                    className="text-base leading-6 md:text-lg md:leading-7 pt-4 max-w-full md:max-w-4xl font-normal font-sourcecodepro"
                    dangerouslySetInnerHTML={{ __html: item.html }}
                  />
                ) : null}
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
