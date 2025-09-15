import React from "react";
import { DownloadIcon, useDownload } from "./DownloadCards";

const DownloadCard2: React.FC = () => {
  const card8 = useDownload("/assets/files/example-data.pdf", "data-2023.pdf");

  return (
    <a
      href="#"
      onClick={card8.handleDownload}
      className="relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-xl bg-white border border-gray-300 hover:border-gray-300 hover:shadow-lg hover:-translate-y-1.5 focus:border-brand-2-100 focus:shadow-inner-md"
    >
      <div className="flex flex-1 flex-col justify-between bg-white p-5">
        <div>
          <span className="text-xs/4 font-medium font-sourcecodepro text-slate-800">
            Statistical release 28 September 2023
          </span>
          <h2 className="mt-1 text-2xl leading-snug font-semibold font-montserrat text-slate-800 line-clamp-3">
            Digital Health Maturity Data 2023
          </h2>
          <p className="mt-2 text-base/6 leading-tight font-normal font-sourcecodepro text-slate-950 line-clamp-3">
            Download Country-Level Digital Health Indicators for Analysis and
            Reporting
          </p>
        </div>
      </div>

      <div className="md:absolute md:right-5 top-[30%] -translate-y-[30%] md:top-[35%] md:-translate-y-[35%]">
        <DownloadIcon status={card8.status} />
      </div>
    </a>
  );
};

export default DownloadCard2;
