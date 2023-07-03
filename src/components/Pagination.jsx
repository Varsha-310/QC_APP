import React, { useMemo } from "react";
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

  return (
    <div className="pagination__container">
      <BiChevronLeft className="pagination__chevrons" />
      <BiChevronsLeft className="pagination__chevrons" />
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page, index) => {
          return (
            <button key={index} className="pagination__page-btn" onClick={()=> console.log("hhh")}>
              {page}
            </button>
          );
        }
      )}
      <BiChevronsRight className="pagination__chevrons" />
      <BiChevronRight
        className="pagination__chevrons"
        onClick={() => setCurrentPage("2")}
      />
    </div>
  );
};

export default Pagination;
