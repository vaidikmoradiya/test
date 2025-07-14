import React, { useRef, useState } from "react";
import { Modal, Offcanvas } from "react-bootstrap";
import { FaAngleLeft, FaAngleRight, FaFilter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import RangeSlider from "react-range-slider-input";
import eye from "../Image/Savani/eye.svg";
import print from "../Image/Savani/print.svg";

const Order = () => {
  const [show, setShow] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const dateRef = useRef();
  const [range, setRange] = useState([100, 5000]);

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

  const handleDatePicker = () => {
    if (dateRef.current) {
      dateRef.current.showPicker();
    }
  };

  const MIN = 100;
  const MAX = 5000;
  const STEP = 5;

  return (
    <>
      <div>
        <div className="px-sm-4 px-3 mx-sm-3 sp_height">
          <div className="d-flex flex-wrap justify-content-between mt-sm-4 mt-3">
            <div>
              <h4 className="ds_600 mb-0">Order</h4>
              <p className="ds_text ds_font">
                Dashboard
                <span style={{ color: "rgba(20, 20, 20, 1)" }}> / Order</span>
              </p>
            </div>
            <div className="d-flex">
              <button className="ds_order_calender position-relative">
                <input
                  ref={dateRef}
                  type="date"
                  className="w-100 h-100"
                  style={{ border: "none" }}
                />
                <FaCalendarAlt
                  onClick={handleDatePicker}
                  className="ds_order_icon"
                />
              </button>
              <button
                onClick={() => setShow(true)}
                className="ds_category_filter"
              >
                <FaFilter className="me-1" /> Filter
              </button>
            </div>
          </div>

          <div className="ds_customer_table  overflow-x-auto position-relative mt-3">
            <table className="w-100 ds_customer_manage">
              <thead className="">
                <tr className="">
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Order Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_pen">Pending</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_can">Cancelled</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>18/02/2025</td>
                  <td>$5000</td>
                  <td>
                    <div className="ds_order_deli">Delivered</div>
                  </td>
                  <td>
                    <div className="sp_table_action d-flex">
                      <div onClick={() => navigate("/admin/vieworder")}>
                        <img src={eye}></img>
                      </div>
                      <div onClick={() => setDeletePopup(true)}>
                        <img src={print}></img>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end px-5">
            {renderPagination()}
          </div>

          {/* ************ Offcanvas *************** */}
          <Offcanvas
            show={show}
            onHide={() => setShow(false)}
            className="ds_offcanvas"
            placement="end"
          >
            <Offcanvas.Header
              className="d-flex justify-content-between px-3 mx-2"
              style={{ borderBottom: " 1px solid rgba(20, 20, 20, 0.2)" }}
            >
              <Offcanvas.Title className="ds_600">Filter</Offcanvas.Title>
              <IoClose
                onClick={() => setShow(false)}
                className="fs-4 ds_cursor"
              />
            </Offcanvas.Header>
            <Offcanvas.Body className="px-3 mx-2">
              <div className="d-flex flex-column h-100">
                <div className="form-group mt-2">
                  <label
                    className="ds_login_label"
                    style={{ fontSize: "15px" }}
                  >
                    Order Status
                  </label>
                  <select
                    className="ds_user_select w-100 mt-2"
                    style={{ fontSize: "15px" }}
                  >
                    <option value="">Select</option>
                  </select>
                </div>
                <div className="form-group mt-4">
                  <label
                    className="ds_login_label mb-3"
                    style={{ fontSize: "15px" }}
                  >
                    Price Range
                  </label>
                  <RangeSlider
                    className="ds_range"
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    value={range}
                    onInput={(value) => setRange(value)}
                  />
                  <div className="d-flex justify-content-between mt-2">
                    <div
                      className="ds_600"
                      style={{ color: "rgba(30, 33, 49, 1)" }}
                    >
                      ${range[0]}
                    </div>
                    <div
                      className="ds_600"
                      style={{ color: "rgba(30, 33, 49, 1)" }}
                    >
                      ${range[1]}
                    </div>
                  </div>
                </div>
                <div className="mt-auto mb-2 d-flex justify-content-between ">
                  <button
                    onClick={() => setShow(false)}
                    className="ds_off_cancel"
                  >
                    Cancel
                  </button>
                  <button className="ds_off_apply">Apply</button>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>

          {/* **************** Delete Category *************** */}
          <Modal
            show={deletePopup}
            onHide={() => setDeletePopup(false)}
            aria-labelledby="contained-modal-title-vcenter "
            className="sp_add_modal"
            centered
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <h4 className="text-center">Delete</h4>
              <div className="spmodal_main_div">
                <p className="mb-0 sp_text_gray text-center">
                  Are you sure you want to delete Nitish Shah ?
                </p>
              </div>
              <div className="d-flex justify-content-center py-2 mt-sm-3 mt-3">
                <button
                  onClick={() => setDeletePopup(false)}
                  className="ds_user_cancel"
                >
                  Cancel
                </button>
                <button className="ds_user_add">Delete</button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Order;
