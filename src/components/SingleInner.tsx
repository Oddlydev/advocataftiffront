import React from "react";
import clsx from "clsx";

type SingleInnerProps = {
  children: React.ReactNode;
  className?: string;
};

export const SingleInner: React.FC<SingleInnerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(
        // headings
        "[&_h2]:text-slate-950 [&_h2]:font-montserrat [&_h2]:font-normal [&_h2]:text-2xl [&_h2]:leading-8 [&_h2]:lg:leading-10 [&_h2]:lg:text-3xl [&_h2]:mb-6",
        "[&_h3]:text-slate-950 [&_h3]:font-montserrat [&_h3]:font-normal [&_h3]:text-xl [&_h3]:leading-7 [&_h3]:lg:leading-8 [&_h3]:lg:text-2xl [&_h3]:mt-6",

        // paragraphs
        "[&_p]:text-slate-600 [&_p]:font-sourcecodepro [&_p]:font-normal [&_p]:text-base/6 [&_p]:pb-4 [&_p]:pt-4",

        // ordered lists
        "[&_ol]:break-all [&_ol]:text-slate-600 [&_ol]:text-lg/7 [&_ol]:font-normal [&_ol]:font-sourcecodepro [&_ol]:py-2",
        "[&_ol>li>a]:text-secondary [&_ol>li>a]:italic [&_ol>li>a]:underline [&_ol>li>a]:underline-offset-4 [&_ol>li>a]:transition-colors",

        // unordered lists + custom bullet
        "[&_ul]:ml-6 [&_ul]:space-y-3 [&_ul]:text-slate-600 [&_ul]:text-lg/7 [&_ul]:font-normal [&_ul]:font-sourcecodepro [&_ul]:py-2",
        "[&_ul>li]:relative [&_ul>li]:pl-8",
        "[&_ul>li::before]:content-[''] [&_ul>li::before]:absolute [&_ul>li::before]:left-0 [&_ul>li::before]:top-[0.4rem] [&_ul>li::before]:w-5 [&_ul>li::before]:h-5",
        "[&_ul>li::before]:bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M9.99999 18.3334C14.5833 18.3334 18.3333 14.5834 18.3333 10.0001C18.3333 5.41675 14.5833 1.66675 9.99999 1.66675C5.41666 1.66675 1.66666 5.41675 1.66666 10.0001C1.66666 14.5834 5.41666 18.3334 9.99999 18.3334Z' stroke='%23475669' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='M6.45834 9.99993L8.81668 12.3583L13.5417 7.6416' stroke='%23475669' stroke-width='1.25' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] [&_ul>li::before]:bg-no-repeat [&_ul>li::before]:bg-center [&_ul>li::before]:bg-contain",

        // blockquote
        "[&_blockquote]:italic [&_blockquote]:font-medium [&_blockquote]:border-slate-200 [&_blockquote]:border-l-4 [&_blockquote]:lg:pl-8 [&_blockquote]:py-3",
        "[&_blockquote>p]:py-0",

        // meta span rows
        "[&_span]:flex [&_span]:items-center [&_span]:gap-1 [&_span]:text-slate-500 [&_span]:text-xs [&_span]:leading-4 [&_span]:font-normal [&_span]:font-sourcecodepro [&_span]:mb-2",
        "[&_span>svg]:text-slate-500 [&_span>svg]:size-3",

        // media helpers
        "[&_.size-large]:w-full [&_.size-large]:pt-4",
        "[&_.cover-large]:w-full [&_.cover-large]:pt-4",
        "[&_.cover-large>img]:w-full [&_.cover-large>img]:h-full [&_.cover-large>img]:object-cover [&_.cover-large>img]:mb-0",

        className
      )}
    >
      {children}
    </div>
  );
};
