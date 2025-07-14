import React, { useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";

const CancelOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  var totalPages = 10;
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const renderPagination = () => {
    let pages = [];

    pages.push(
      <div
        key="prev"
        className={`sp_pagination text-center ${
          currentPage === 1 ? "disabled" : ""
        }`}
        onClick={handlePrev}
      >
        <FaAngleLeft />
      </div>
    );

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(
          <div
            key={i}
            onClick={() => handlePageChange(i)}
            className={`text-center ${
              currentPage === i ? "sp_pagination1" : "sp_pagination"
            }`}
          >
            {i}
          </div>
        );
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        pages.push(
          <div key={`dots-${i}`} className="sp_pagination text-center">
            ...
          </div>
        );
      }
    }

    pages.push(
      <div
        key="next"
        className={`sp_pagination text-center ${
          currentPage === totalPages ? "disabled" : ""
        }`}
        onClick={handleNext}
      >
        <FaAngleRight />
      </div>
    );

    return pages;
  };
  return (
    <div className="sp_main sp_height">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h4>Cancel Order</h4>
          <span>
            <a className="sp_text_gray">Dashboard</a>
            <span> / Cancel Order</span>
          </span>
        </div>
      </div>
      <div className="sp_table">
        <table className="w-100">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Product</th>
              <th>Date</th>
              <th>Description</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>8</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>{" "}
            <tr>
              <td>9</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
            <tr>
              <td>10</td>
              <td>Johan Desai</td>
              <td>Delta Omni 0.4X19</td>
              <td>02/09/1994</td>
              <td>Lorem ipsum dolor sit amet</td>
              <td>I was hopping for a shorter delivery time</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAGINATION CODE */}
      <div className="py-3 d-flex justify-content-center justify-content-md-end px-5">
        {renderPagination()}
      </div>
    </div>
  );
};

export default CancelOrder;
