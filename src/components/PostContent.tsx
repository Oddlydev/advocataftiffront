// components/PostContent.tsx
import parse, { domToReact } from "html-react-parser";

type Props = {
  content: string;
  variant?: "single" | "wysiwyg";
};

export default function PostContent({ content, variant = "single" }: Props) {
  const options = {
    replace: (domNode: any) => {
      if (domNode.type === "tag") {
        switch (domNode.name) {
          // ---------- HEADINGS ----------
          case "h2":
            return (
              <h2
                className={
                  variant === "single"
                    ? "text-slate-950 font-montserrat font-bold text-2xl leading-snug lg:text-3xl mx-auto max-w-4xl px-5 md:px-10 xl:px-16"
                    : "text-slate-950 font-montserrat font-bold text-2xl lg:text-3xl leading-snug mb-6 mx-auto max-w-4xl px-5 md:px-10 xl:px-16"
                }
              >
                {domToReact(domNode.children, options)}
              </h2>
            );

          case "h3":
            return (
              <h3
                className={
                  variant === "single"
                    ? "text-slate-950 font-montserrat font-normal text-xl leading-snug lg:text-2xl mt-6 mx-auto max-w-4xl px-5 md:px-10 xl:px-16"
                    : "text-slate-950 font-montserrat font-bold text-xl lg:text-3xl leading-snug mt-6 mx-auto max-w-4xl px-5 md:px-10 xl:px-16"
                }
              >
                {domToReact(domNode.children, options)}
              </h3>
            );

          // ---------- PARAGRAPHS ----------
          case "p":
            return (
              <p
                className={
                  variant === "single"
                    ? "text-slate-600 font-baskervville font-normal text-lg/7 py-4 mx-auto max-w-4xl px-5 md:px-10 xl:px-16"
                    : "text-slate-600 font-baskervville font-normal text-lg/7 py-6 mx-auto max-w-4xl px-5 md:px-10 xl:px-16"
                }
              >
                {domToReact(domNode.children, options)}
              </p>
            );

          // ---------- LINKS ----------
          case "a":
            return (
              <a
                {...domNode.attribs}
                className="text-[#1465F5] text-lg/7 font-baskervville font-normal underline underline-offset-4 transition-colors mx-auto max-w-4xl px-2"
              >
                {domToReact(domNode.children, options)}
              </a>
            );

          // ---------- LISTS ----------
          case "ol":
            return (
              <ol className="list-decimal pl-6 ml-6 space-y-3 text-slate-600 text-lg/7 font-baskervville font-normal py-2 mx-auto max-w-4xl px-5 md:px-10 xl:px-16">
                {domToReact(domNode.children, options)}
              </ol>
            );

          case "ul":
            return (
              <ul className="ml-6 space-y-3 text-slate-600 text-lg/7 font-baskervville font-normal py-2 mx-auto max-w-4xl px-5 md:px-10 xl:px-16">
                {domToReact(domNode.children, options)}
              </ul>
            );

          case "li":
            return (
              <li className="relative pl-8 before:absolute mx-auto max-w-4xl before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20fill%3D%27none%27%3E%3Cpath%20d%3D%27M9.99999%2018.3334C14.5833%2018.3334%2018.3333%2014.5834%2018.3333%2010.0001C18.3333%205.41675%2014.5833%201.66675%209.99999%201.66675C5.41666%201.66675%201.66666%205.41675%201.66666%2010.0001C1.66666%2014.5834%205.41666%2018.3334%209.99999%2018.3334Z%27%20stroke%3D%27%23475669%27%20stroke-width%3D%271.25%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27/%3E%3Cpath%20d%3D%27M6.45834%209.99993L8.81668%2012.3583L13.5417%207.6416%27%20stroke%3D%27%23475669%27%20stroke-width%3D%271.25%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27/%3E%3C/svg%3E')] before:bg-contain before:bg-no-repeat">
                {domToReact(domNode.children, options)}
              </li>
            );

          // ---------- BLOCKQUOTE ----------
          case "blockquote":
          return (
            <div className="mx-auto max-w-4xl py-4 px-5 md:px-10 xl:px-16">
              <blockquote
                className={
                  variant === "single"
                    ? "italic font-medium border-slate-200 border-l-4 pl-4 xl:pl-7 py-3 px-4"
                    : "text-lg/7 font-sourcecodepro text-slate-600 font-normal border-brand-2-50 border-l-4 py-3 px-4"
                }
              >
                {domToReact(domNode.children, {
                  ...options,
                  // Override <p> style inside blockquote
                  replace: (childNode: any) => {
                    if (childNode.name === "p") {
                      return (
                        <p className="text-slate-600 font-baskervville text-lg/7 m-0 py-4">
                          {domToReact(childNode.children, options)}
                        </p>
                      );
                    }
                  },
                })}
              </blockquote>
            </div>
          );

          // ---------- IMAGE (with caption + type) ----------
          case "figure": {
            const imgNode = domNode.children.find((c: any) => c.name === "img");
            const captionNode = domNode.children.find(
              (c: any) => c.name === "figcaption"
            );

            // const imgClass = imgNode?.attribs?.class || "";
            // const isFullWidth = imgClass.includes("fullwidth");
            // const isLarge = imgClass.includes("large");
            // const isSmall = imgClass.includes("small");

            let figureClass = "my-8 ";
            // if (isFullWidth) {
            //   figureClass +=
            //     "relative w-screen max-w-full mx-auto full-width-img";
            // } else if (isLarge) {
            //   figureClass +=
            //     "mx-auto max-w-6xl px-4 md:px-8 large-img"; // larger than text width
            // } else if (isSmall) {
            //   figureClass +=
            //     "mx-auto max-w-4xl px-5 md:px-10 xl:px-16 small-img"; // narrower
            // } else {
            //   figureClass +=
            //     "relative w-screen max-w-full mx-auto full-width-img"; // default text-aligned
            // }

            return (
              <figure className={figureClass}>
                {domToReact([imgNode], options)}

                {captionNode && (
                <figcaption className="mt-3 text-sm text-slate-500 font-baskervville font-normal xl:text-base/6 text-start flex items-center justify-start gap-2 mx-auto max-w-4xl px-5 md:px-10 xl:px-16">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="11"
                    viewBox="0 0 12 11"
                    fill="none"
                    className="text-slate-400 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1.7999 2.0001C1.0267 2.0001 0.399902 2.6269 0.399902 3.4001V9.0001C0.399902 9.7733 1.0267 10.4001 1.7999 10.4001H10.1999C10.9731 10.4001 11.5999 9.7733 11.5999 9.0001V3.4001C11.5999 2.6269 10.9731 2.0001 10.1999 2.0001H9.08985C8.9042 2.0001 8.72615 1.92635 8.59488 1.79507L7.80995 1.01015C7.5474 0.747597 7.19131 0.600098 6.82 0.600098H5.1798C4.8085 0.600098 4.4524 0.747597 4.18985 1.01015L3.40493 1.79507C3.27365 1.92635 3.0956 2.0001 2.90995 2.0001H1.7999ZM5.9999 8.3001C7.1597 8.3001 8.0999 7.3599 8.0999 6.2001C8.0999 5.0403 7.1597 4.1001 5.9999 4.1001C4.8401 4.1001 3.8999 5.0403 3.8999 6.2001C3.8999 7.3599 4.8401 8.3001 5.9999 8.3001Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="leading-snug">
                    {domToReact(captionNode.children, options)}
                  </span>
                </figcaption>
                )}
              </figure>
            );
          }

          case "img": {
            // const classAttr = domNode.attribs.class || "";
            // const isFullWidth = classAttr.includes("fullwidth");
            // const isLarge = classAttr.includes("large");
            // const isSmall = classAttr.includes("small");

            // let imgClass = "h-auto object-cover ";

            // if (isFullWidth) {
            //   imgClass += "w-screen";
            // } else if (isLarge) {
            //   imgClass += "w-full max-w-full mx-auto";
            // } else if (isSmall) {
            //   imgClass += "w-full max-w-2xl mx-auto";
            // } else {
            //   imgClass += "w-full  mx-auto";
            // }

            return (
            <div className="relative flex justify-center w-full">
              <img
                {...domNode.attribs}
                className="h-auto object-cover w-full block "
                alt={domNode.attribs.alt || ""}
                loading={domNode.attribs.loading || "lazy"}
                decoding={domNode.attribs.decoding || "async"}
              />
              {/* <div
                className="absolute inset-0  pointer-events-none"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(235, 26, 82, 0.16) 0%, rgba(235, 26, 82, 0.16) 100%)",
                }}
              /> */}
            </div>
            );
          }


        }
      }
    },
  };

  return <div>{parse(content, options)}</div>;
}
