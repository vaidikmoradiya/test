import React, { useState, useEffect } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { GetAllCancelOrder } from "../../Redux-Toolkit/ToolkitSlice/User/CancelOrderSlice";

const CancleOrder = () => {

    const dispatch = useDispatch()

    const CancelOrderData = useSelector((state) => state.cancelorder.cancleOrderData)
    // console.log("CancelOrderData", CancelOrderData);

    useEffect(() => {
        dispatch(GetAllCancelOrder())
    }, [])

    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        setCurrentPage(1);
    }, [searchInput]);

    const filteredData = CancelOrderData?.filter(item => {
        const fullName = `${item.userData?.[0]?.firstName} ${item.userData?.[0]?.lastName}`.toLowerCase();
        const productName = item.orderData?.product?.[0]?.productName?.toLowerCase();
        const comment = item.comment?.toLowerCase();
        const reason = item.reason?.toLowerCase();
        const orderDate = item.orderData?.createdAt ? new Date(item.orderData.createdAt).toLocaleDateString('en-GB') : null;
        const search = searchInput.toLowerCase();
        return fullName.includes(search) || (productName && productName.includes(search)) || comment?.includes(search) || reason?.includes(search) || orderDate?.includes(search);
    }) || [];
    
    // Pagination logic for CancelOrderData
    const itemPerPage = 10;
    const paginatedData = filteredData.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);
    var totalPages = Math.ceil((filteredData?.length || 0) / itemPerPage) || 1;
    
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

    return (
        <div className='sp_main sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center '>
                <div className='mt-3'>
                    <h4>Cancel Order</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / Cancel Order</span></span>
                </div>
                <div className='position-relative mt-3'>
                     <input type="text" value={searchInput} onChange={(e)=> setSearchInput(e.target.value)} className='ds_page_input' placeholder='Search... ' />
                    <img src={search} alt="" className='ds_page_icon' />
                </div>
            </div>
            <div className='sp_table'>
                <table className='w-100'>
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
                    {paginatedData?.map((item, index) => (
                        <tr key={item._id || index}>
                            <td>{((currentPage - 1) * itemPerPage) + (index + 1)}</td>
                            <td>{item.userData?.[0]?.firstName} {item.userData?.[0]?.lastName}</td>
                            <td>{item.orderData?.product[0]?.productName}</td>
                            <td>{new Date(item.orderData?.createdAt).toLocaleDateString('en-GB')}</td>
                            <td>{item.comment}</td>
                            <td>{item.reason}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CODE */}
            <div className="py-3 d-flex justify-content-center justify-content-md-end">
                {renderPagination()}
            </div>
        </div>
    )
}

export default CancleOrder
