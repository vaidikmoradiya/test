import React, { useRef, useState } from 'react'
import { Offcanvas } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ViewStatus = () => {

const [show, setShow] = useState(false)
const [deletePopup, setDeletePopup] = useState(false)
const [currentPage,setCurrentPage] = useState(1);
const navigate = useNavigate()
const dateRef = useRef()
const [selectedDate, setSelectedDate] = useState('');

// Filter states
const [filterProductName, setFilterProductName] = useState('');
const [filterDate, setFilterDate] = useState('');
const [filterStatus, setFilterStatus] = useState('');

// Temporary filter states (for the form inputs)
const [tempFilterProductName, setTempFilterProductName] = useState('');
const [tempFilterDate, setTempFilterDate] = useState('');
const [tempFilterStatus, setTempFilterStatus] = useState('');

const returnOrderData = useSelector((state)=> state?.returnOrder?.ReturnOrderData)
const returnOrderStatus = useSelector((state) => state?.returnOrder?.ReturnOrderStatus);

// Filter the data based on filter values (applied filters only)
const filteredData = returnOrderData?.filter(item => {
    // Filter by product name
    if (filterProductName && item.orderData && item.orderData.length > 0) {
        const productMatch = item.orderData.some(order => 
            order.product.productDetail?.productName?.toLowerCase().includes(filterProductName.toLowerCase()) ||
            order.product.productId?.toLowerCase().includes(filterProductName.toLowerCase())
        );
        if (!productMatch) return false;
    }

    // Filter by date
    if (filterDate && item.createdAt) {
        const itemDate = new Date(item.createdAt);
        const formattedItemDate = `${itemDate.getDate().toString().padStart(2, '0')}/${(itemDate.getMonth() + 1).toString().padStart(2, '0')}/${itemDate.getFullYear()}`;
        if (formattedItemDate !== filterDate) return false;
    }

    // Filter by status
    if (filterStatus && returnOrderStatus[item._id] !== filterStatus) {
        return false;
    }

    return true;
});

const itemPerPage = 10;
const totalPages = Math.ceil(filteredData?.length / itemPerPage);

const startIndex = (currentPage - 1) * itemPerPage;
const endIndex = startIndex + itemPerPage;
const data = filteredData?.slice(startIndex, endIndex);

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

const handleDatePicker = () => {
    if(dateRef.current){
        dateRef.current.showPicker();
    }
}

const handleDateChange = (e) => {
    const value = e.target.value;
    if (value) {
        const date = new Date(value);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
        setSelectedDate(formattedDate);
        setTempFilterDate(formattedDate);
    } else {
        setSelectedDate('');
        setTempFilterDate('');
    }
};

// Filter functions
const handleProductNameChange = (e) => {
    setTempFilterProductName(e.target.value);
};

const handleStatusChange = (e) => {
    setTempFilterStatus(e.target.value);
};

const handleApplyFilter = () => {
    setFilterProductName(tempFilterProductName);
    setFilterDate(tempFilterDate);
    setFilterStatus(tempFilterStatus);
    setCurrentPage(1); // Reset to first page when applying filter
    setShow(false);
};

const handleClearFilter = () => {
    setFilterProductName('');
    setFilterDate('');
    setFilterStatus('');
    setTempFilterProductName('');
    setTempFilterDate('');
    setTempFilterStatus('');
    setSelectedDate('');
    setCurrentPage(1);
    setShow(false);
};

  return (
    <div className='px-sm-4 px-3 mx-sm-3'>
         <div className='d-flex align-items-center flex-wrap justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Return Order</h4>
                   <p className='ds_text ds_font'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Return Order</span></p>
                </div>
                <button onClick={()=> setShow(true)} className='ds_category_filter'><FaFilter className='me-1' /> Filter</button>
        </div>

        <div className='ds_customer_table  overflow-x-auto position-relative mt-3'>
           <table className="w-100 ds_customer_manage">
               <thead className=''>
                   <tr className=''>
                       <th>ID</th>
                       <th>Customer Name</th>
                       <th>Product</th>
                       <th>Date</th>
                       <th>Status</th>
                       <th>Reason</th>
                   </tr>
               </thead>
               <tbody>
                   {data?.map((item, index) => (
                       <tr key={item._id || index}>
                           <td>{((currentPage - 1) * itemPerPage) + (index + 1)}</td>
                           <td>
                               {item.userData && item.userData.length > 0 &&
                                   `${item.userData[0].firstName} ${item.userData[0].lastName}`}
                           </td>
                           <td>
                               {item.orderData && item.orderData.length > 0 &&
                                   item.orderData.map((order, i) => (
                                       <div key={order.product.productId}>
                                           <b>{order.product.productDetail?.productName || order.product.productId}</b>
                                       </div>
                                   ))}
                           </td>
                           <td>
                               {item.createdAt && (() => {
                                   const date = new Date(item.createdAt);
                                   return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                               })()}
                           </td>
                           <td>
                               <div className='d-flex'>
                                   {returnOrderStatus[item._id] === "Accept" && (
                                       <span className='ds_returnorder_btn me-2'>Accept</span>
                                   )}
                                   {returnOrderStatus[item._id] === "Reject" && (
                                       <span className='ds_returnorder_btn2'>Reject</span>
                                   )}
                               </div>
                           </td>
                           <td>{item.reason}</td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>

       <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end px-5">
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
                            <label className='ds_login_label' style={{fontSize:"15px"}} >Product Name</label>
                            <input type="text" style={{fontSize:"15px"}} value={tempFilterProductName} className="form-control ds_login_input mt-1" placeholder='Enter Product Name' id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleProductNameChange}/>
                </div>
                <div className="form-group mt-4">
                        <div className='position-relative'>
                           <label className='ds_login_label' style={{fontSize:"15px"}} >Date</label>
                            <input type="text" style={{fontSize:"15px"}} value={selectedDate} className="form-control ds_login_input mt-1" placeholder='Select Date' id="exampleInputEmail1" aria-describedby="emailHelp" readOnly/>
                            <input type="date"  ref={dateRef} onChange={handleDateChange} className='position-absolute' style={{visibility:'hidden' , bottom:'0'}}/>
                            <FaCalendarAlt onClick={handleDatePicker} className='ds_view_cal ds_cursor' />
                        </div> 
                </div>
                <div className="form-group mt-4">
                     <label className='ds_login_label' style={{fontSize:"15px"}}>Status</label>
                     <select className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}} value={tempFilterStatus} onChange={handleStatusChange}>
                       <option value="">Select</option>
                       <option value="Accept">Accept</option>
                       <option value="Reject">Reject</option>
                    </select>
                </div>
             <div className='mt-auto mb-2 d-flex justify-content-between '>
                <button onClick={handleClearFilter} className='ds_off_cancel'>Clear</button>
                <button onClick={handleApplyFilter} className='ds_off_apply'>Apply</button>
             </div>
           </div>
        </Offcanvas.Body>
        </Offcanvas>

    </div>
  )
}

export default ViewStatus
