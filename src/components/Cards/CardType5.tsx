import React from "react";
import Image from "next/image";
// Use a plain anchor for robust navigation (works even with absolute URLs)

interface CardType5Props {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  postDate?: string;
  uri?: string; // permalink for title
  categories?: { id: string; name?: string | null; slug?: string | null }[];
}

const stripParagraphTags = (html?: string) =>
  html ? html.replace(/<\/?p>/g, "") : "";

// Function to format date as "24th August 2025"
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
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

const toISOOrRaw = (date?: string) => {
  if (!date) return undefined;
  const d = new Date(date);
  return isNaN(d.getTime()) ? date : d.toISOString().split("T")[0];
};

const CardType5: React.FC<CardType5Props> = ({
  title,
  excerpt,
  imageUrl = "/assets/images/card-imgs/card-img-5.jpg",
  postDate,
  uri,
  categories = [],
}) => {
  const isoDate = toISOOrRaw(postDate);

  const toInternalHref = (input?: string): string | undefined => {
    if (!input) return undefined;
    try {
      const u = new URL(input, typeof window !== "undefined" ? window.location.origin : "http://localhost");
      return u.pathname || "/";
    } catch {
      return input; // already a relative path
    }
  };

  const Article = (
    
    <article
      className="card card-type-5 group relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg bg-white border border-gray-300 hover:border-gray-300 hover:-translate-y-1.5 hover:shadow-lg focus:border-brand-2-100 focus:bg-gray-50 focus:shadow-inner-lg"
      aria-label={title}
    >
      <div className="relative shrink-0 w-full h-64">
        <Image
          className="object-cover"
          src={imageUrl}
          alt={title || 'card-type-5 img'}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          priority={false}
        />
      </div>

      <div className="card-body flex flex-1 flex-col justify-between bg-white p-8 pb-7">
        <div className="flex-1">
          {categories.length > 0 && (
            <span
              className="card-category text-sm leading-5 md:text-base md:leading-6 font-normal border-b-2 border-transparent font-sourcecodepro text-slate-800 uppercase pb-1 
                        transition-all duration-500 ease-in-out group-hover:border-brand-1-500"
            >
              {categories
                .map((cat) => cat?.name)
                .filter(Boolean)
                .join(', ')}
            </span>
          )}

          <h2 className="mt-3 text-xl leading-snug xl:text-2xl xl:leading-snug font-semibold font-montserrat text-slate-950 transition-colors duration-500 ease-in-out line-clamp-3">
            {title}
          </h2>

          {excerpt && (
            <p className="mt-3 text-base leading-6 font-normal font-sourcecodepro text-slate-600 line-clamp-3 transition-colors duration-500 ease-in-out">
              {stripParagraphTags(excerpt)}
            </p>
          )}
        </div>

        {postDate && (
          <div className="card-footer mt-7 flex items-center justify-between">
            <div className="date-info flex justify-between w-full items-center space-x-1 uppercase text-xs leading-tight font-medium font-sourcecodepro text-slate-600">
              <time
                className="text-xs leading-tight font-medium font-sourcecodepro text-slate-600 uppercase"
                dateTime={isoDate}
              >
                {formatDate(postDate)}
              </time>
            </div>
          </div>
        )}
      </div>
    </article>
  );

  const href = toInternalHref(uri);
  return href ? (
    <a href={href} aria-label={title} className="block h-full">
      {Article}
    </a>
  ) : (
    Article
  );
};

export default CardType5;
