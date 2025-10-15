import React from "react";

type Props = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const DOTS = "…";

function usePageRange(current: number, totalPages: number, siblingCount = 1) {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPageNumbers >= totalPages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(current - siblingCount, 1);
  const rightSiblingIndex = Math.min(current + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  const firstPage = 1;
  const lastPage = totalPages;

  if (!showLeftDots && showRightDots) {
    const leftRange = Array.from(
      { length: 3 + 2 * siblingCount },
      (_, i) => i + 1
    );
    return [...leftRange, DOTS, totalPages - 1, totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const count = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: count },
      (_, i) => totalPages - count + 1 + i
    );
    return [firstPage, firstPage + 1, DOTS, ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSiblingIndex - leftSiblingIndex + 1 },
    (_, i) => leftSiblingIndex + i
  );
  return [firstPage, DOTS, ...middleRange, DOTS, lastPage];
}

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className = "",
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)));
  const pages = usePageRange(currentPage, totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return (
    <div
      className={[
        "pagination-container",
        "flex items-center justify-between border-t border-gray-200 py-3 font-sourcecodepro",
        className,
      ].join(" ")}
    >
      <div className="pagination-mobile flex flex-1 justify-between sm:hidden px-4">
        {canPrev ? (
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            className="pagination-mobile-btn relative inline-flex items-center rounded-md shadow-sm border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium font-sourcecodepro text-gray-600 uppercase"
          >
            Previous
          </button>
        ) : (
          <span className="pagination-mobile-btn  relative inline-flex items-center rounded-md shadow-sm border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium font-sourcecodepro text-gray-600 uppercase">
            Previous
          </span>
        )}

        {canNext ? (
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            className="pagination-mobile-btn relative inline-flex items-center rounded-md shadow-sm border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium font-sourcecodepro text-gray-600 uppercase"
          >
            Next
          </button>
        ) : (
          <span className="pagination-mobile-btn relative inline-flex items-center rounded-md shadow-sm border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium font-sourcecodepro text-gray-600 uppercase">
            Next
          </span>
        )}
      </div>

      <div className="pagination-desktop hidden sm:flex sm:flex-1 sm:items-center sm:justify-between font-sourcecodepro font-medium uppercase">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{start}</span> to{" "}
          <span className="font-medium">{end}</span> of{" "}
          <span className="font-medium">{totalItems}</span> results
        </p>

        <nav
          className="pagination-nav isolate inline-flex items-center -space-x-px text-center"
          aria-label="Pagination"
        >
          <button
            type="button"
            onClick={() => canPrev && onPageChange(currentPage - 1)}
            aria-label="Previous"
            disabled={!canPrev}
            className={[
              "pagination-nav-button px-2 mt-1 relative inline-flex items-center py-2 justify-center text-gray-500 focus:z-20 focus:outline-none rounded-xl",
              !canPrev ? "opacity-50 pointer-events-none" : "",
            ].join(" ")}
          >
            <span className="sr-only">Previous</span>
            <svg className="size-5" viewBox="0 0 20 20" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.707 5.293c.391.39.391 1.024 0 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                fill="currentColor"
              />
            </svg>
          </button>

          {pages.map((p, i) =>
            p === DOTS ? (
              <span
                key={`dots-${i}`}
                className="pagination-nav-ellipsis relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium font-sourcecodepro text-gray-500 focus:outline-none"
              >
                ...
              </span>
            ) : (
              <button
                type="button"
                key={p as number}
                onClick={() => onPageChange(p as number)}
                aria-current={currentPage === p ? "page" : undefined}
                className={
                  currentPage === p
                    ? "pagination-nav-page-current relative z-10 inline-flex items-center justify-center px-4 py-2 text-sm font-medium font-sourcecodepro text-slate-50 bg-brand-1-800 hover:bg-brand-1-800 focus:z-20 focus:outline-none rounded-xl"
                    : "pagination-nav-page relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium font-sourcecodepro text-gray-500 focus:z-20 focus:outline-none rounded-xl focus:border-0"
                }
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => canNext && onPageChange(currentPage + 1)}
            aria-label="Next"
            disabled={!canNext}
            className={[
              "pagination-nav-buttonrelative inline-flex items-center px-2 mt-1 py-2 justify-center text-gray-500 focus:z-20 focus:outline-none rounded-xl",
              !canNext ? "opacity-50 pointer-events-none" : "",
            ].join(" ")}
          >
            <span className="sr-only">Next</span>
            <svg className="size-5" viewBox="0 0 20 20" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707A1 1 0 118.707 5.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                fill="currentColor"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  );
}
