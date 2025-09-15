import React from "react";
import Link from "next/link";

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

  const Article = (
    
    <article
      className="card card-type-5 relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg border border-gray-300 hover:border-gray-300 hover:-translate-y-1.5 hover:shadow-[0px_0px_40px_0px_rgba(79,8,46,0.40)] focus:border-gray-300 focus:bg-gray-50 focus:shadow-inner-lg"
      aria-label={title}
    >
      <div>
        <img
          className="card-img shrink-0 w-full h-64 object-cover aspect-[4/3]"
          src={imageUrl}
          alt={title || "card-type-5 img"}
          width={100}
          height={100}
          loading="lazy"
        />
      </div>

      <div className="card-body flex flex-1 flex-col justify-between bg-white p-8 pb-7">
        <div className="flex-1">
          {categories.length > 0 && (
            <span className="card-category text-sm leading-5 md:text-base md:leading-6 font-normal border-b-2 border-transparent font-family-sourcecodepro text-slate-800 uppercase pb-1 transition-all duration-500 ease-in-out focus:border-b-2 focus:border-transparent hover:border-brand-1-500">
              {categories
                .map((cat) => cat?.name)
                .filter(Boolean)
                .join(", ")}
            </span>
          )}

          <h2 className="mt-3 text-xl leading-snug md:text-2xl md:leading-snug font-semibold font-family-montserrat text-slate-950 transition-colors duration-500 ease-in-out line-clamp-3">
            {title}
          </h2>

          {excerpt && (
            <p className="mt-3 text-base leading-6 font-normal font-family-sourcecodepro text-slate-600 line-clamp-3 transition-colors duration-500 ease-in-out">
              {stripParagraphTags(excerpt)}
            </p>
          )}
        </div>

        {postDate && (
          <div className="card-footer mt-9 flex items-center justify-between">
            <div className="date-info flex justify-between w-full items-center space-x-1 text-xs leading-tight font-medium font-family-sourcecodepro text-slate-600">
              <time
                className="text-xs leading-tight font-medium font-family-baskervville text-slate-600"
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

  return uri ? (
    <Link href={uri} prefetch={false} aria-label={title} className="block h-full">
      {Article}
    </Link>
  ) : (
    Article
  );
};

export default CardType5;
