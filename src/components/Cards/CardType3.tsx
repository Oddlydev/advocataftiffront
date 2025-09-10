import React from "react";
import WhiteButton from "../Buttons/WhiteBtn";

const CardType3: React.FC = () => {
  return (
    <div className="">
      <a href="#" className="group">
        <div className="relative flex flex-col h-full overflow-hidden transition-all duration-500 ease-in-out cursor-pointer rounded-lg border border-slate-400 text-slate-50 bg-brand-black hover:border-slate-200 hover:shadow-lg hover:-translate-y-1.5 focus-within:border-brand-1-900 focus-within:shadow-lg">
          <div className="flex flex-col justify-between xl:px-12 xl:pt-12 md:px-9 md:pt-9 px-6 pt-6">
            <div className="flex-1">
              <div className="mt-1 block max-w-2xl">
                <h2 className="text-2xl md:text-3xl xl:text-4xl leading-snug font-bold font-family-montserrat pb-2 transition-colors duration-500 ease-in-out line-clamp-3">
                  Transparency in government institutions
                </h2>
                <p className="text-base/6 font-normal font-family-sourcecodepro transition-colors duration-500 ease-in-out">
                  Transparency in government institutions refers to the open and
                  accessible sharing of information about financial activities.
                </p>
              </div>
            </div>

            <div className="mt-4 mb-7 font-semibold font-family-sourcecodepro transition-all duration-500 ease-in-out">
              <WhiteButton>
                Learn more
                <svg
                  className="text-gray-600 hidden size-3.5 transition-all duration-500 ease-in-out group-hover:block group-focus:block"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M12.025 4.94165L17.0833 9.99998L12.025 15.0583"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.91667 10H16.9417"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </WhiteButton>
            </div>
          </div>

          <div className="flex-shrink-0">
            <img
              className="relative w-full h-full object-cover rounded-xl xl:left-12 md:left-9 left-6 top-4 transition-all duration-500 ease-in-out group-focus-within:rounded-none"
              src="/assets/images/card-imgs/card-img-3.jpg"
              width={300}
              height={200}
              alt="card-type-3 img"
              loading="lazy"
            />
          </div>
        </div>
      </a>
    </div>
  );
};

export default CardType3;
