import React, { useState, useEffect } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { EditReturnOrder, GetReturnOrderData, setReturnOrderStatus } from '../../Redux-Toolkit/ToolkitSlice/Admin/ReturnOrderSlice';


const ReturnOrder = () => {

    const [show, setShow] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [currentPage,setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [data, setData] = useState([]);
    const [clickedButtons, setClickedButtons] = useState({});
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const returnOrderData = useSelector((state)=> state?.returnOrder?.ReturnOrderData)
    const returnOrderStatus = useSelector((state) => state?.returnOrder?.ReturnOrderStatus);
    console.log("returnOrderData",returnOrderData);
    
    useEffect(()=>{
        dispatch(GetReturnOrderData())
    },[])
    
    const itemPerPage = 10;
    const totalPages = Math.ceil(returnOrderData?.length / itemPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        // Filter by customer name (you can change to other fields if needed)
        const filtered = returnOrderData?.filter(item => {
            const name = item.userData && item.userData.length > 0
                ? `${item.userData[0].firstName} ${item.userData[0].lastName}`.toLowerCase()
                : "";
            return name.includes(searchInput.toLowerCase());
        });
        setData(filtered?.slice(startIndex, endIndex));
    }, [currentPage, returnOrderData, searchInput]);
    
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
    
    const handleStatusClick = (orderId, status) => {
        dispatch(EditReturnOrder({ id: orderId, status }));
        dispatch(setReturnOrderStatus({ orderId, status }));
        setClickedButtons(prev => ({
            ...prev,
            [orderId]: true
        }));
    };

  return (
    <div className='px-sm-4 px-3 mx-sm-3 pt-2'>
         <div className='d-flex align-items-center flex-wrap justify-content-between '>
                <div className='mt-3'>
                   <h4 className='ds_600 mb-0'>Return Order</h4>
                   <p className='ds_text ds_font mb-0'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Return Order</span></p>
                </div>
                <div className='d-flex flex-wrap'>
                     <div className='position-relative me-4 mt-3'>
                         <input
                           type="text"
                           className='ds_page_input'
                           placeholder='Search... '
                           value={searchInput}
                           onChange={e => { setSearchInput(e.target.value); setCurrentPage(1); }}
                         />
                         <img src={search} alt="" className='ds_page_icon' />
                     </div>
                     <button className='ds_category_filter mt-3' onClick={()=> navigate("/admin/viewstatus")}>View Status</button>
                </div>
        </div>

        <div className='ds_customer_table  overflow-x-auto position-relative mt-4'>
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
                                   {!returnOrderStatus[item._id] && !clickedButtons[item._id] &&
                                       <>
                                           <button
                                               className='ds_returnorder_btn me-2'
                                               onClick={() => handleStatusClick(item._id, "Accept")}
                                           >
                                               Accept
                                           </button>
                                           <button
                                               className='ds_returnorder_btn2'
                                               onClick={() => handleStatusClick(item._id, "Reject")}
                                           >
                                               Reject
                                           </button>
                                       </>
                                   }
                               </div>
                           </td>
                           <td>{item.reason}</td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>

       <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end ">
           {renderPagination()}
       </div>
    </div>
  )
}

export default ReturnOrder
