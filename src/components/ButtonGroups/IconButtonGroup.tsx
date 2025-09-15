import React from "react";

export default function IconButtonGroup() {
  return (
    <div className="btn-group isolate relative inline-flex items-center rounded-md shadow-xs transition-all duration-500 ease-in-out cursor-pointer leading-tight">
      <button
        type="button"
        className="rounded-l-md icon-btn-group bg-brand-white py-2 px-2.5 text-gray-500 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
        aria-label="Previous"
        title="Previous"
      >
        <span className="sr-only">Previous</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          className="size-5 text-gray-500"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.7071 5.29289C13.0976 5.68342 13.0976 6.31658 12.7071 6.70711L9.41421 10L12.7071 13.2929C13.0976 13.6834 13.0976 14.3166 12.7071 14.7071C12.3166 15.0976 11.6834 15.0976 11.2929 14.7071L7.29289 10.7071C6.90237 10.3166 6.90237 9.68342 7.29289 9.29289L11.2929 5.29289C11.6834 4.90237 12.3166 4.90237 12.7071 5.29289Z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        type="button"
        className="-ml-px rounded-r-md icon-btn-group bg-brand-white py-2 px-2.5 text-gray-500 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-10"
        aria-label="Next"
        title="Next"
      >
        <span className="sr-only">Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          className="size-5 text-gray-500"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.29289 14.7071C6.90237 14.3166 6.90237 13.6834 7.29289 13.2929L10.5858 10L7.29289 6.70711C6.90237 6.31658 6.90237 5.68342 7.29289 5.29289C7.68342 4.90237 8.31658 4.90237 8.70711 5.29289L12.7071 9.29289C13.0976 9.68342 13.0976 10.3166 12.7071 10.7071L8.70711 14.7071C8.31658 15.0976 7.68342 15.0976 7.29289 14.7071Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
