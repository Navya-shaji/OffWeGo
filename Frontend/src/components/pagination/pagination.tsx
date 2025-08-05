import React from "react";

interface PaginationProps {
  total: number; // Total number of pages
  current: number; // Current active page
  setPage: (page: number) => void; // Function to update current page
}

const Pagination: React.FC<PaginationProps> = ({ total, current, setPage }) => {
  const visiblePages = () => {
    const pages = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        pages.push(1, 2, 3, 4, "...", total);
      } else if (current >= total - 2) {
        pages.push(1, "...", total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        disabled={current === 1}
        onClick={() => setPage(current - 1)}
        className={`px-3 py-1 rounded border ${
          current === 1
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-700"
        }`}
      >
        Previous
      </button>

      {visiblePages().map((page, index) => (
        <button
          key={index}
          disabled={page === "..."}
          onClick={() => typeof page === "number" && setPage(page)}
          className={`px-3 py-1 rounded border ${
            page === current
              ? "bg-blue-600 text-white"
              : page === "..."
              ? "cursor-default bg-white"
              : "hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={current === total}
        onClick={() => setPage(current + 1)}
        className={`px-3 py-1 rounded border ${
          current === total
            ? "bg-gray-200 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-700"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default React.memo(Pagination);
