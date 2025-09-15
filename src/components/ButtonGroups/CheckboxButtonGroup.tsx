import React from "react";

export default function CheckboxDropdownButton() {
  return (
    <div className="inline-flex">
      <div className="checkbox-dropdown-btn inline-flex shrink-0 items-center rounded-l-md border border-gray-300 bg-brand-white py-2 px-3.5 leading-tight">
        <div className="group grid size-4 grid-cols-1">
          <input
              type="checkbox"
              name="select-all"
              aria-label="Select all"
              className="checkbox-input col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-brand-white checked:border-brand-2-900 checked:bg-brand-2-900
              indeterminate:border-brand-2-900 indeterminate:bg-brand-2-900
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-2-900
              disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100
              forced-colors:appearance-auto"
            />
            <svg className="checkbox-icon pointer-events-none col-start-1 row-start-1 size-3 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25" viewBox="0 0 14 14" fill="none">
              <path
              className="opacity-0 group-has-checked:opacity-100"
              d="M3 8L6 11L11 3.5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              />
              <path
              className="ogroup-has-indeterminate:opacity-100"
              d="M3 7H11"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
                                />
          </svg>
        </div>
      </div>

      <div className="-ml-px grid grid-cols-1">
        <select
          id="message-type"
          name="message-type"
          aria-label="Select message type"
          className="checkbox-select col-start-1 row-start-1 appearance-none w-full rounded-r-md bg-brand-white py-2 pr-8 pl-3 text-sm/tight font-medium font-family-sourcecodepro text-slate-800 outline-1 -outline-offset-1 outline-gray-300 focus:outline-1 focus:-outline-offset-1 focus:outline-gray-300"
          defaultValue="Unread messages"
        >
          <option className="checkbox-select-item text-xs xl:text-sm leading-tight text-slate-800 hover:bg-gray-100">Unread messages</option>
          <option className="checkbox-select-item text-xs xl:text-sm leading-tight text-slate-800 hover:bg-gray-100">Sent messages</option>
          <option className="checkbox-select-item text-xs xl:text-sm leading-tight text-slate-800 hover:bg-gray-100">All messages</option>
        </select>

        <svg
          className="checkbox-dropdown-icon pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.29288 7.29289C5.6834 6.90237 6.31657 6.90237 6.70709 7.29289L9.99998 10.5858L13.2929 7.29289C13.6834 6.90237 14.3166 6.90237 14.7071 7.29289C15.0976 7.68342 15.0976 8.31658 14.7071 8.70711L10.7071 12.7071C10.3166 13.0976 9.6834 13.0976 9.29287 12.7071L5.29288 8.70711C4.90235 8.31658 4.90235 7.68342 5.29288 7.29289Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
