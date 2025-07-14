import React, { useRef, useState, useEffect } from 'react'
import { Modal, Offcanvas } from 'react-bootstrap'
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { IoClose } from 'react-icons/io5'
import { FaCalendarAlt } from 'react-icons/fa'
import RangeSlider from "react-range-slider-input";
import eye from '../Image/Savani/eye.svg'
import print from '../Image/Savani/print.svg'
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOrderData, GetAllOrderData } from '../../Redux-Toolkit/ToolkitSlice/User/OrderSlice'

const Order = () => {

const [show, setShow] = useState(false)
const [deletePopup, setDeletePopup] = useState(false)
const [selectedOrder, setSelectedOrder] = useState(null);
const [currentPage,setCurrentPage] = useState(1);
const navigate = useNavigate()
const dateRef = useRef()
const [range, setRange] = useState([100, 5000]);
const dispatch = useDispatch()
const [data, setData] = useState([])
const [filteredData, setFilteredData] = useState([])
const [searchInput, setSearchInput] = useState("")
const [filterDate, setFilterDate] = useState("")
const [deleteId, setDeleteId] = useState(null)

// Filter state variables
const [filterOrderStatus, setFilterOrderStatus] = useState("")
const [filterPriceRange, setFilterPriceRange] = useState([100, 5000])

// Temporary filter state variables (for UI selections)
const [tempFilterOrderStatus, setTempFilterOrderStatus] = useState("")
const [tempFilterPriceRange, setTempFilterPriceRange] = useState([100, 5000])

const OrderData = useSelector((state) => state.order.allOrderData)
console.log("OrderData", OrderData);

useEffect(() => {
    dispatch(GetAllOrderData())
}, [])

// Filter OrderData based on search and filters, then set filteredData
useEffect(() => {
    let filtered = OrderData || [];

    // Search filter (on multiple fields)
    if (searchInput && searchInput.trim() !== "") {
        filtered = filtered.filter((element) =>
        (element?.userData?.firstName?.toLowerCase().includes(searchInput.toLowerCase()) ||
            element?.orderStatus?.toLowerCase().includes(searchInput.toLowerCase()) ||
            (element?.totalAmount && element?.totalAmount.toString().toLowerCase().includes(searchInput.toLowerCase()))
        )
        );
    }

    // Date filter
    if (filterDate) {
        filtered = filtered.filter(element => 
            new Date(element.createdAt).toISOString().split('T')[0] === filterDate
        );
    }

    // Other filters
    if (filterOrderStatus) {
        filtered = filtered.filter((element) =>
            element?.orderStatus === filterOrderStatus
        );
    }
    if (filterPriceRange[0] !== 100 || filterPriceRange[1] !== 5000) {
        filtered = filtered.filter((element) =>
            element?.totalAmount >= filterPriceRange[0] && element?.totalAmount <= filterPriceRange[1]
        );
    }
    setFilteredData(filtered);
}, [OrderData, searchInput, filterOrderStatus, filterPriceRange, filterDate]);

// Paginate filteredData
useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    setData(filteredData?.slice(startIndex, endIndex) || []);
}, [currentPage, filteredData]);

var itemPerPage = 10;
var totalPages = Math.ceil(filteredData?.length / itemPerPage);

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
            className={`sp_pagination text-center ${currentPage === 1 ? "disabled" : ""}`}
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
                    className={`text-center ${currentPage === i ? "sp_pagination1" : "sp_pagination"}`}
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
            className={`sp_pagination text-center ${currentPage === totalPages ? "disabled" : ""}`}
            onClick={handleNext}
        >
            <FaAngleRight />
        </div>
    );

    return pages;
};

const handleFilterApply = () => {
    setFilterOrderStatus(tempFilterOrderStatus);
    setFilterPriceRange(tempFilterPriceRange);
    setCurrentPage(1);
    setShow(false);
};

const handleFilterReset = () => {
    setFilterOrderStatus("");
    setFilterPriceRange([100, 5000]);

    // Reset temporary states
    setTempFilterOrderStatus("");
    setTempFilterPriceRange([100, 5000]);
    setRange([100, 5000]);
    setCurrentPage(1);
    setShow(false);
};

const handleDelete = () => {
    dispatch(DeleteOrderData(deleteId))
        .then(() => {
            dispatch(GetAllOrderData())
            setDeletePopup(false)
        })
        .catch((error) => {
            alert(error)
        })
}

const handleDatePicker = () => {
    if(dateRef.current){
        dateRef.current.showPicker()
    }
}

const MIN = 100;
const MAX = 5000;
const STEP = 5;

  return (
    <div>
          <div className='px-sm-4 px-3 mx-sm-3 sp_height pt-2'>
              <div className='d-flex flex-wrap justify-content-between'>
                      <div className='mt-3'>
                         <h4 className='ds_600 mb-0'>Order</h4>
                         <p className='ds_text ds_font mb-0'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Order</span></p>
                      </div>
                      <div className='d-flex flex-wrap'>
                         <div className='position-relative me-4 mt-3'>
                            <input type="text" value={searchInput} onChange={e => { setSearchInput(e.target.value); setCurrentPage(1); }} className='ds_page_input' placeholder='Search... ' />
                            <img src={search} alt="" className='ds_page_icon' />
                         </div>
                         <button className='ds_order_calender position-relative mt-3'>
                           <input 
                                ref={dateRef} 
                                type="date" 
                                className='w-100 h-100' 
                                style={{border:'none'}}
                                value={filterDate}
                                onChange={(e) => {setFilterDate(e.target.value); setCurrentPage(1);}}
                            />
                           <FaCalendarAlt onClick={handleDatePicker} className='ds_order_icon' />
                         </button>
                        <button onClick={()=> setShow(true)} className='ds_category_filter mt-3'><FaFilter className='me-1' /> Filter</button>
                      </div>
              </div>

         <div className='ds_customer_table  overflow-x-auto position-relative mt-4'>
            <table className="w-100 ds_customer_manage">
                <thead className=''>
                    <tr className=''>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Order Date</th>
                        <th>Total Amount</th>
                        <th>Order Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((order, index) => (
                        <tr key={order?._id || index}>
                            <td>{((currentPage - 1) * itemPerPage) + (index + 1)}</td>
                            <td>{order?.userData?.firstName}</td>
                            <td>{new Date(order?.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</td>
                            <td>₹{order?.totalAmount}</td>
                            <td>
                                <div className={
                                    order?.orderStatus === 'Delivered' ? 'ds_order_deli' :
                                    order?.orderStatus === 'Pending' ? 'ds_order_pen' :
                                            'ds_order_can'
                                }>{order?.orderStatus}</div>
                            </td>
                            <td>
                                <div className='sp_table_action d-flex'>
                                    <div onClick={() => {localStorage.setItem("Getid" , order._id); navigate("/admin/vieworder");}}><img src={eye} alt='view' ></img></div>
                                    <div onClick={() => { setDeletePopup(true); setSelectedOrder(order); setDeleteId(order?._id) }}><img src={deleteImg} alt='delete'></img></div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end ">
            {renderPagination()}
        </div>

        {/* ************ Offcanvas *************** */}
        <Offcanvas show={show} onHide={()=> setShow(false)} className="ds_offcanvas" placement='end' >
        <Offcanvas.Header className='d-flex justify-content-between px-3 mx-2' style={{borderBottom:" 1px solid rgba(20, 20, 20, 0.2)"}}>
          <Offcanvas.Title className='ds_600'>Filter</Offcanvas.Title>
          <IoClose onClick={()=> setShow(false)} className='fs-4 ds_cursor' />
        </Offcanvas.Header>
        <Offcanvas.Body className='px-3 mx-2'>
           <div className='d-flex flex-column h-100'>
              <div className="form-group mt-2">
                    <label className='ds_login_label' style={{fontSize:"15px"}}>Order Status</label>
                    <select
                        className='ds_user_select w-100 mt-2'
                        style={{ fontSize: "15px" }}
                        value={tempFilterOrderStatus}
                        onChange={(e) => setTempFilterOrderStatus(e.target.value)}
                    >
                      <option value="">Select</option>
                      <option value="Pending">Pending</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
               </div>
               <div className="form-group mt-4">
                  <label className="ds_login_label mb-3" style={{ fontSize: '15px' }}>
                    Price Range
                  </label>
                  <RangeSlider className="ds_range" min={MIN} max={MAX} step={STEP} value={range} onInput={(value) => { setRange(value); setTempFilterPriceRange(value); }} />
                  <div className='d-flex justify-content-between mt-2'>
                     <div className='ds_600' style={{color:'rgba(30, 33, 49, 1)'}}>${range[0]}</div>
                     <div className='ds_600' style={{color:'rgba(30, 33, 49, 1)'}}>${range[1]}</div>
                  </div>
              </div>
             <div className='mt-auto mb-2 d-flex justify-content-between '>
                <button onClick={handleFilterReset} className='ds_off_cancel'>Reset</button>
                <button onClick={handleFilterApply} className='ds_off_apply'>Apply</button>
             </div>
           </div>
        </Offcanvas.Body>
        </Offcanvas>

        {/* **************** Delete Category *************** */}
        <Modal show={deletePopup} onHide={() => setDeletePopup(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Delete</h4>
                    <div className='spmodal_main_div'>
                      <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete order?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                       <button onClick={()=> setDeletePopup(false)} className='ds_user_cancel'>Cancel</button>
                       <button onClick={handleDelete} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
        </Modal>
          </div>
    </div>
  )
}

export default Order
