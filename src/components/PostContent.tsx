// components/PostContent.tsx
import parse, { domToReact } from "html-react-parser";

type Props = {
  content: string;
  variant?: "single" | "wysiwyg"; // allow both style sets
};

export default function PostContent({ content, variant = "single" }: Props) {
  const options = {
    replace: (domNode: any) => {
      if (domNode.type === "tag") {
        switch (domNode.name) {
          case "h2":
            return (
              <h2
                className={
                  variant === "single"
                    ? "text-slate-950 font-montserrat font-bold text-2xl leading-8 lg:leading-10 lg:text-4xl"
                    : "text-slate-950 font-montserrat font-bold text-2xl lg:text-3xl leading-snug mb-6"
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
                    ? "text-slate-950 font-montserrat font-normal text-xl leading-7 lg:leading-8 lg:text-2xl mt-6"
                    : "text-slate-950 font-montserrat font-bold text-xl lg:text-3xl leading-snug mt-6"
                }
              >
                {domToReact(domNode.children, options)}
              </h3>
            );

          case "p":
            return (
              <p
                className={
                  variant === "single"
                    ? "text-slate-600 font-baskervville font-normal text-base/6 py-4"
                    : "text-slate-600 font-baskervville font-normal text-lg/7 py-6"
                }
              >
                {domToReact(domNode.children, options)}
              </p>
            );

          case "a":
            return (
              <a
                {...domNode.attribs}
                className="text-secondary underline underline-offset-4 transition-colors"
              >
                {domToReact(domNode.children, options)}
              </a>
            );

          case "ol":
            return (
              <ol className="list-decimal pl-6 ml-6 space-y-3 text-slate-600 text-lg/7 font-sourcecodepro font-normal py-2">
                {domToReact(domNode.children, options)}
              </ol>
            );

          case "ul":
            return (
              <ul className="ml-6 space-y-3 text-slate-600 text-lg/7 font-sourcecodepro font-normal py-2">
                {domToReact(domNode.children, options)}
              </ul>
            );

          case "li":
            return (
              <li className="relative pl-8 before:absolute before:left-0 before:top-1 before:w-5 before:h-5 before:bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20fill%3D%27none%27%3E%3Cpath%20d%3D%27M9.99999%2018.3334C14.5833%2018.3334%2018.3333%2014.5834%2018.3333%2010.0001C18.3333%205.41675%2014.5833%201.66675%209.99999%201.66675C5.41666%201.66675%201.66666%205.41675%201.66666%2010.0001C1.66666%2014.5834%205.41666%2018.3334%209.99999%2018.3334Z%27%20stroke%3D%27%23475669%27%20stroke-width%3D%271.25%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27/%3E%3Cpath%20d%3D%27M6.45834%209.99993L8.81668%2012.3583L13.5417%207.6416%27%20stroke%3D%27%23475669%27%20stroke-width%3D%271.25%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27/%3E%3C/svg%3E')] before:bg-contain before:bg-no-repeat">
                {domToReact(domNode.children, options)}
              </li>
            );

          case "blockquote":
            return (
              <blockquote
                className={
                  variant === "single"
                    ? "italic font-medium border-slate-200 border-l-4 lg:pl-8 py-3"
                    : "text-lg/7 font-sourcecodepro text-slate-600 font-normal border-brand-2-50 border-l-4 lg:pl-8 py-3"
                }
              >
                {domToReact(domNode.children, options)}
              </blockquote>
            );

          case "span":
            return (
              <span className="flex items-center gap-1 text-slate-500 text-xs leading-4 font-sourcecodepro mb-2">
                {domToReact(domNode.children, options)}
              </span>
            );

          case "img":
            return (
              <img
                {...domNode.attribs}
                className="w-full h-auto object-cover rounded-lg my-6"
              />
            );
        }
      }
    },
  };

  return <div>{parse(content, options)}</div>;
}
