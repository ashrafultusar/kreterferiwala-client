import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const createPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex justify-center mt-6">
      {/* Left Arrow */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
        className={`flex items-center justify-center px-3 py-1 mx-1 rounded-md border transition-colors ${
          currentPage === 1
            ? "bg-orange-500 text-white cursor-not-allowed"
            : "text-gray-700 hover:bg-orange-400 hover:text-white"
        }`}
      >
        &#8592;
      </a>

      {/* Page Numbers */}
      {createPageNumbers().map((item, index) =>
        typeof item === "number" ? (
          <a
            key={index}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(item);
            }}
            className={`px-3 py-1 mx-1 rounded-md border transition-colors ${
              currentPage === item
                ? "bg-orange-300 text-black font-bold cursor-not-allowed"
                : "text-gray-700 hover:bg-orange-400 hover:text-white"
            }`}
          >
            {item}
          </a>
        ) : (
          <span key={index} className="px-3 py-1 text-gray-400">
            ...
          </span>
        )
      )}

      {/* Right Arrow */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
        }}
        className={`flex items-center justify-center px-3 py-1 mx-1 rounded-md border transition-colors ${
          currentPage === totalPages
            ? "bg-orange-500 text-white cursor-not-allowed"
            : "text-gray-700 hover:bg-orange-400 hover:text-white"
        }`}
      >
        &#8594;
      </a>
    </div>
  );
};

export default Pagination;
