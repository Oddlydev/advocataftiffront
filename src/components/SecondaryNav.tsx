import React from "react";

type NavItem = { label: React.ReactNode; href?: string };

type SecondaryNavProps = {
  items: NavItem[];
  className?: string;
  activePath?: string;
};

export default function SecondaryNav({
  items,
  className = "",
  activePath,
}: SecondaryNavProps) {
  const normalizePath = (p?: string | null) => {
    if (!p) return "";
    try {
      // If it's an absolute URL, use URL API; otherwise, create a fake base
      const url = p.startsWith("http")
        ? new URL(p)
        : new URL(p, "http://local");
      let pathname = url.pathname || "";
      // remove trailing slash except root
      if (pathname.length > 1 && pathname.endsWith("/"))
        pathname = pathname.slice(0, -1);
      return pathname;
    } catch {
      // Fall back to basic split
      return String(p).split("?")[0].replace(/\/$/, "");
    }
  };

  const activePathNorm = normalizePath(activePath || "");

  return (
    <div className={["secondary-nav bg-transparent", className].join(" ")}>
      <div className="secondary-nav-wrapper">
        <div className="secondary-nav-flyout flex justify-center items-center">
          <div className="secondary-nav-flyout-content flex space-x-4 overflow-x-auto overflow-y-hidden px-0 pt-4 pb-0 no-scrollbar momentum">
            
            {items.map((it, idx) => {
              const hrefPathNorm = normalizePath(it.href || "");
              const isActive =
                !!hrefPathNorm && hrefPathNorm === activePathNorm;

              return (
                <a
                  key={idx}
                  href={it.href || "#"}
                  className={[
                    "secondary-nav-item font-baskervville text-slate-600 text-sm/tight font-normal border-b-2  whitespace-nowrap hover:text-slate-800 hover:border-slate-600 focus:text-slate-950 focus:border-brand-1-500 transition-colors py-4",
                    isActive 
                    ? "border-brand-1-500 text-slate-950" 
                    : "border-transparent",
                  ].join(" ")}
                >
                  {it.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}