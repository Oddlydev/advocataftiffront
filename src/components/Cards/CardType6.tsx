import React from "react";
import Link from "next/link";

interface CardType6Props {
  title: string;
  excerpt: string;
  fileUrl: string;
  postDate?: string;
  uri?: string; // permalink for title
}

const stripParagraphTags = (html: string) => {
  return html.replace(/<\/?p>/g, "");
};

// Helper to format date as YYYY-MM-DD only
const formatDate = (dateStr?: string | Date | number) => {
  if (!dateStr) return "";

  if (typeof dateStr === "string") {
    return dateStr.split("T")[0]; // ISO string
  }

  try {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};

// Extract the filename (without query params) from a URL
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
  return (
    <div className="h-full">
      <div
        className={[
          "relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg bg-white border border-slate-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1.5",
          "transition-all duration-500 ease-in-out",
          "focus:border-gray-300 focus:bg-gray-50 focus:shadow-inner-lg",
          "card card-type-6",
        ].join(" ")}
      >
        {uri && (
          <Link
            href={uri}
            prefetch={false}
            aria-label={title}
            className="absolute inset-0 z-10"
          >
            <span className="sr-only">{title}</span>
          </Link>
        )}
        <div className="card-body flex flex-1 flex-col justify-between bg-white px-6 py-5">
          <div className="flex-1">
            <div>
              {/* Title with permalink only — mirrors CardType5 pattern */}
              <h2 className="mt-2 text-2xl leading-snug font-semibold font-montserrat text-slate-800 transition-colors duration-500 ease-in-out">
                {title}
              </h2>

              <div className="mt-2 text-base/6 font-normal font-sourcecodepro text-slate-600 line-clamp-3 transition-colors duration-500 ease-in-out">
                {stripParagraphTags(excerpt)}
              </div>
            </div>
          </div>

          <div className="card-footer mt-6 flex items-center justify-between">
            <div className="date-info flex justify-between w-full items-center space-x-1 text-xs/tight font-medium font-sourcecodepro text-slate-600">
              {/* <!-- Left section --> */}
              <div className="pdf-btn flex items-start md:items-center space-x-1.5 text-sm leading-snug font-medium font-sourcecodepro text-slate-600">
                <svg
                  className="pdf-icon mt-1 md:mt-0 size-6 fill-slate-600"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9.04039 17.5885H14.9719C15.1626 17.5885 15.3264 17.5201 15.4634 17.3832C15.6006 17.2464 15.6691 17.0817 15.6691 16.889C15.6691 16.6963 15.6006 16.5316 15.4634 16.3947C15.3264 16.2579 15.1626 16.1895 14.9719 16.1895H9.04039C8.84606 16.1895 8.68131 16.2582 8.54614 16.3957C8.41081 16.5332 8.34314 16.6977 8.34314 16.889C8.34314 17.0802 8.41081 17.2445 8.54614 17.382C8.68131 17.5197 8.84606 17.5885 9.04039 17.5885ZM9.04039 13.6287H14.9719C15.1626 13.6287 15.3264 13.5603 15.4634 13.4235C15.6006 13.2867 15.6691 13.1219 15.6691 12.9292C15.6691 12.7367 15.6006 12.572 15.4634 12.435C15.3264 12.2982 15.1626 12.2297 14.9719 12.2297H9.04039C8.84606 12.2297 8.68131 12.2986 8.54614 12.4362C8.41081 12.5737 8.34314 12.7381 8.34314 12.9292C8.34314 13.1206 8.41081 13.285 8.54614 13.4225C8.68131 13.56 8.84606 13.6287 9.04039 13.6287ZM6.38639 21.298C5.91372 21.298 5.51147 21.1321 5.17964 20.8002C4.84764 20.4682 4.68164 20.066 4.68164 19.5935V4.4065C4.68164 3.934 4.84764 3.53175 5.17964 3.19975C5.51147 2.86791 5.91439 2.702 6.38839 2.702H13.5421C13.7688 2.702 13.9869 2.74541 14.1964 2.83224C14.4057 2.91908 14.5909 3.04116 14.7519 3.1985L18.8084 7.24875C18.9694 7.40925 19.0946 7.595 19.1839 7.806C19.2734 8.01716 19.3181 8.23691 19.3181 8.46525V19.5912C19.3181 20.0652 19.1521 20.4682 18.8201 20.8002C18.4883 21.1321 18.0861 21.298 17.6134 21.298H6.38639ZM13.5604 7.60375V4.10099H6.38839C6.31139 4.10099 6.24089 4.133 6.17689 4.197C6.11272 4.26116 6.08064 4.33174 6.08064 4.40874V19.5912C6.08064 19.6682 6.11272 19.7388 6.17689 19.803C6.24089 19.867 6.31139 19.899 6.38839 19.899H17.6114C17.6884 19.899 17.7589 19.867 17.8229 19.803C17.8871 19.7388 17.9191 19.6682 17.9191 19.5912V8.4595H14.4164C14.1772 8.4595 13.9748 8.37666 13.8091 8.211C13.6433 8.04533 13.5604 7.84291 13.5604 7.60375Z"
                    fill="currentColor"
                  />
                </svg>
                <span>csv,json,xml,excel</span>
              </div>

              {/* Right section */}
              <time className="text-xs/tight font-medium font-sourcecodepro text-slate-600">
                {formatDate(postDate)}
              </time>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardType6;
