import React from "react";

interface CardType6Props {
  title: string;
  excerpt: string;
  fileUrl: string;
  postDate?: string;
  uri?: string; // permalink for title
}

const stripParagraphTags = (html: string) => html.replace(/<\/?p>/g, "");

// Function to format date as "24th August 2025"
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "";
  const day = date.getDate();
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${day}${suffix} ${month} ${year}`;
};

// Extract filename (without query params) from a URL
const getFileNameFromUrl = (url: string) => {
  try {
    const cleanUrl = url.split("?")[0];
    const segments = cleanUrl.split("/");
    return segments[segments.length - 1] || "download";
  } catch {
    return "download";
  }
};

// Required fixed label per spec
const FIXED_DOWNLOAD_LABEL = "csv,json,xml,excel";

const CardType6: React.FC<CardType6Props> = ({
  title,
  excerpt,
  fileUrl,
  postDate,
  uri,
}) => {
  const toInternalHref = (input?: string): string | undefined => {
    if (!input) return undefined;
    try {
      const u = new URL(
        input,
        typeof window !== "undefined" ? window.location.origin : "http://localhost"
      );
      return u.pathname || "/";
    } catch {
      return input; // already relative
    }
  };

  const href = toInternalHref(uri);
  const isoDate = postDate ? new Date(postDate).toISOString() : undefined;

  return (
    <div className="h-full">
      <div
        className={[
          "relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg bg-white border border-slate-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1.5",
          "focus:border-gray-300 focus:bg-gray-50 focus:shadow-inner-lg",
          "card card-type-6",
        ].join(" ")}
      >
        {href && (
          <a href={href} aria-label={title} className="absolute inset-0 z-10">
            <span className="sr-only">{title}</span>
          </a>
        )}

        <div className="card-body flex flex-1 flex-col justify-between bg-white px-6 py-5">
          <div className="flex-1">
            <h2 className="mt-2 text-2xl leading-snug font-semibold font-montserrat text-slate-800 transition-colors duration-500 ease-in-out">
              {title}
            </h2>

            <div className="mt-2 text-base/6 font-normal font-sourcecodepro text-slate-600 line-clamp-3 transition-colors duration-500 ease-in-out">
              {stripParagraphTags(excerpt)}
            </div>
          </div>

          <div className="card-footer mt-6 flex items-center justify-between">
            <div className="date-info flex justify-between w-full items-center space-x-1 text-xs/tight font-medium font-sourcecodepro text-slate-600">
              {/* Download label (per spec) */}
              {/* <div className="pdf-btn flex items-center space-x-1.5 text-sm leading-snug font-medium font-sourcecodepro text-slate-600">
                <svg
                  className="pdf-icon size-5 fill-slate-600"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M9 2h6l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 3.5V8h4.5L14 3.5zM12 12H8v2h4v4h2v-4h4v-2h-4V8h-2v4z" />
                </svg>
                <span>{FIXED_DOWNLOAD_LABEL}</span>
              </div> */}

              {/* Right-aligned date */}
              {postDate && (
                <time
                  className="text-xs leading-tight font-medium font-sourcecodepro text-slate-600 uppercase"
                  dateTime={isoDate}
                >
                  {formatDate(postDate)}
                </time>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardType6;
