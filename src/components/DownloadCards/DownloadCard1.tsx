import React from "react";
import { DownloadIcon, useDownload } from "./DownloadCards";

const DownloadCard1: React.FC = () => {
  const card7 = useDownload("/assets/files/example.pdf", "document.pdf");

  return (
    <a
      href="#"
      onClick={card7.handleDownload}
      className="relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-xl bg-white border border-slate-400 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1.5 focus:border-brand-2-100 focus:shadow-inner-lg"
    >
      <div className="flex flex-1 flex-col justify-between bg-white p-5">
        <div>
          <h2 className="text-2xl leading-snug font-semibold font-montserrat text-slate-800 line-clamp-3">
            PDF
          </h2>
          <p className="mt-2 text-sm leading-tight font-normal font-sourcecodepro text-slate-950 line-clamp-3">
            You can access your file via PDF
          </p>
        </div>
      </div>

      <div className="absolute right-5 top-[30%] -translate-y-[30%] md:top-[35%] md:-translate-y-[35%]">
        <DownloadIcon status={card7.status} />
      </div>
    </a>
  );
};

export default DownloadCard1;
