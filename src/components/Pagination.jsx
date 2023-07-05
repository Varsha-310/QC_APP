import React, { useMemo, useState } from "react";
import {
  BiChevronsRight,
  BiChevronsLeft,
  BiChevronRight,
  BiChevronLeft,
} from "react-icons/bi";
import "./styles/Pagination.css";

const Pagination = ({ total, perPage, currentPage, setCurrentPage }) => {
  const totalPages = useMemo(() => {
    return Math.ceil(total / perPage);
  }, [total, perPage]);

  const [currentPagesIndex, setCurrentPagesIndex] = useState(1);
  // total page 20
  // pages to show 5

  const pagesIndexSize = 5;

  const startPagesIndex = useMemo(() => {
    return (currentPagesIndex - 1) * pagesIndexSize;
  }, []);

  const endPagesIndex = startPagesIndex + pagesIndexSize;

  return (
    <div className="pagination__container">
      <BiChevronLeft
        className="pagination__chevrons"
        onClick={() =>
          currentPage > 1
            ? setCurrentPage(currentPage - 1)
            : alert("You are already in First Page")
        }
      />
      <BiChevronsLeft
        className="pagination__chevrons"
        onClick={() =>
          currentPagesIndex > 1
            ? setCurrentPagesIndex(currentPagesIndex - 1)
            : ""
        }
      />
      {currentPagesIndex > 1 ? <span className="index-dots">...</span> : ""}

      {Array.from({ length: totalPages }, (_, index) => index + 1)
        .slice(startPagesIndex, endPagesIndex)
        .map((page, index) => {
          return (
            <div
              key={index}
              className={`pagination__page-btn ${
                currentPage == page ? "activePage" : ""
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </div>
          );
        })}

      {/* Math.ceil(totalPages / pagesIndexSize) >= 2 && */}
      {currentPagesIndex < Math.ceil(totalPages / pagesIndexSize) ? (
        <span className="index-dots">...</span>
      ) : (
        ""
      )}

      <BiChevronsRight
        className="pagination__chevrons"
        onClick={() =>
          currentPagesIndex < Math.ceil(totalPages / pagesIndexSize)
            ? setCurrentPagesIndex(currentPagesIndex + 1)
            : ""
        }
      />
      <BiChevronRight
        className="pagination__chevrons"
        onClick={() =>
          currentPage < totalPages
            ? setCurrentPage(currentPage + 1)
            : alert("You are already in Last Page")
        }
      />
    </div>
  );
};

export default Pagination;
