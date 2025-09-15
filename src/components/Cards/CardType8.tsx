import React from "react";

const CardType8: React.FC = () => {
  return (
    <div>
      <a
        href="#"
        className="card card-type-8 relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-xl bg-white border border-gray-300 hover:border-gray-300 shadow-lg -translate-y-1.5 focus:border-brand-2-100 focus:shadow-inner-md"
      >
        <div className="card-body flex flex-1 flex-col justify-between bg-white p-5">
          {/* <!-- text --> */}
          <div className="flex-1">
            <span className="text-xs/4 font-medium font-sourcecodepro text-slate-800">
              Statistical release 28 September 2023
            </span>
            <h2 className="mt-1 text-2xl leading-snug font-semibold font-montserrat text-slate-800 transition-colors duration-500 ease-in-out line-clamp-3">
              Digital Health Maturity Data 2023
            </h2>
            <p className="mt-2 text-base/6 leading-tight font-normal font-sourcecodepro text-slate-950 line-clamp-3 transition-colors duration-500 ease-in-out">
              Download Country-Level Digital Health Indicators for Analysis and
              Reporting
            </p>
          </div>

          {/* <!-- download icon --> */}
          <div className="download-icon md:absolute md:right-5 top-[30%] -translate-y-[30%] md:top-[35%] md:-translate-y-[35%]">
            <svg
              className="iconmt-6 md:mt-0 size-7 text-zinc-8000"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                d="M21 15.5V19.5C21 20.0304 20.7893 20.5391 20.4142 20.9142C20.0391 21.2893 19.5304 21.5 19 21.5H5C4.46957 21.5 3.96086 21.2893 3.58579 20.9142C3.21071 20.5391 3 20.0304 3 19.5V15.5M7 10.5L12 15.5M12 15.5L17 10.5M12 15.5V3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </a>
    </div>
  );
};

export default CardType8;
