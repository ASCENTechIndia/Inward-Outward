import React, { useState, useMemo, useEffect } from "react";

const Table = ({
  headers = [],
  data = [],
  headerlabel,
  columnStyles = [],
  showUpload = false,
  onFileUpload = () => {},
  rowsPerPage = 10,
  showSearch = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 Filtered data based on search
  const filteredData = useMemo(() => {
    if (!showSearch || !searchTerm.trim()) return data;
    return data.filter((row) =>
      row.some(
        (cell) =>
          cell &&
          cell.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [data, searchTerm]);

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const newTotalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
    if (currentPage > newTotalPages) {
      setCurrentPage(1);
    }
  }, [data, rowsPerPage, currentPage]);

  // Page number buttons (compact pagination)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, "…", totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        "…",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      pages.push(
        1,
        "…",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "…",
        totalPages,
      );
    }
    return pages;
  };

  return (
    <div className="mt-4">
      <div className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {/* ---------- Header: Title + Search + Upload ---------- */}
        {(headerlabel || showSearch || showUpload) && (
          <div className="flex flex-wrap justify-between items-center gap-3 px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/60">
            {/* Title */}
            {headerlabel && (
              <h2 className="text-sm font-semibold text-slate-700 tracking-tight">
                {headerlabel}
              </h2>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search Box */}
              {showSearch && (
                <div className="relative">
                  <svg
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full sm:w-56 pl-9 pr-3 py-1.5 rounded-lg text-sm
                      bg-white border border-slate-300 text-slate-700
                      placeholder:text-slate-400
                      focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                      transition-all"
                  />
                </div>
              )}

              {/* Upload Button */}
              {showUpload && (
                <label
                  className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-medium
                    bg-blue-600 text-white px-3 py-1.5 rounded-lg
                    hover:bg-blue-700 active:scale-[0.98]
                    shadow-sm transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => onFileUpload(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {/* ---------- Table ---------- */}
        <div className="w-full overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full table-fixed border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100/95 backdrop-blur-sm">
                <tr className="border-b border-slate-200">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className={`px-4 py-3 text-left text-[13px] font-bold
                        uppercase tracking-wider text-slate-600 break-words
                        ${columnStyles[idx] || ""}`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {paginatedData.length > 0 ? (
                  paginatedData.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className="hover:bg-slate-50/80 transition-colors duration-150"
                    >
                      {headers.map((_, colIdx) => (
                        <td
                          key={colIdx}
                          className={`px-4 py-3 text-sm text-slate-700 align-middle
                            break-words
                            ${columnStyles[colIdx] || ""}`}
                        >
                          {row[colIdx]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="text-center py-12 text-slate-400 text-sm"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-10 h-10 text-slate-300"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M4 7h16M4 12h16M4 17h10"
                            strokeLinecap="round"
                          />
                        </svg>
                        No record found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {filteredData.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {startIndex + 1}–
                {Math.min(startIndex + rowsPerPage, filteredData.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredData.length}
              </span>{" "}
              {filteredData.length === 1 ? "entry" : "entries"}
            </span>

            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${
                      currentPage === 1
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 active:scale-[0.97]"
                    }`}
                >
                  Prev
                </button>

                {/* Page numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {getPageNumbers().map((page, i) =>
                    page === "…" ? (
                      <span
                        key={`dot-${i}`}
                        className="px-2 text-slate-400 text-sm"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`min-w-[34px] h-8 rounded-md text-sm font-medium transition-all
                          ${
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 active:scale-[0.97]"
                          }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                {/* Mobile compact page indicator */}
                <span className="sm:hidden text-sm text-slate-600 px-2">
                  {currentPage} / {totalPages}
                </span>

                {/* Next */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all
                    ${
                      currentPage === totalPages
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 active:scale-[0.97]"
                    }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
