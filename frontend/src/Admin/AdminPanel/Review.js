import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import eye from '../Image/Savani/eye.svg'
import print from '../Image/Savani/print.svg'
import { FaAngleLeft, FaAngleRight, FaFilter, FaStar } from 'react-icons/fa6';
import { Modal } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import deleteImg from '../Image/Sujal/delete.svg'
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteReviewData, GetAllReview } from '../../Redux-Toolkit/ToolkitSlice/User/ReviewSlice';

const Review = () => {

    const [show, setShow] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [currentPage,setCurrentPage] = useState(1);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [deleteId, setDeleteId] = useState(null)
    const [searchInput, setSearchInput] = useState("")
    const [filteredData, setFilteredData] = useState([])
    const ReviewData = useSelector((state) => state.review.allReviewData)
    console.log("ReviewData", ReviewData);

    useEffect(() => {
        dispatch(GetAllReview())
    }, [])
    
    useEffect(() => {
        const filtered = ReviewData?.filter(element => {
            const search = searchInput.toLowerCase();
            const customerFirstName = element.userData?.[0]?.firstName?.toLowerCase();
            const customerLastName = element.userData?.[0]?.lastName?.toLowerCase();
            const productName = element.productData?.[0]?.productName?.toLowerCase();
            const description = element.description?.toLowerCase();
            const rate = element.rate?.toString();
            const reviewDate = element.createdAt ? new Date(element.createdAt).toLocaleDateString('en-GB').replace(/\//g, '/') : '';

            return (
                (customerFirstName && customerFirstName.includes(search)) ||
                (customerLastName && customerLastName.includes(search)) ||
                (productName && productName.includes(search)) ||
                (description && description.includes(search)) ||
                (rate && rate.includes(search)) ||
                (reviewDate && reviewDate.includes(searchInput))
            );
        }) || [];
        setFilteredData(filtered);
    }, [ReviewData, searchInput]);
    
    // Pagination logic for filtered ReviewData
    const itemPerPage = 10;
    const paginatedData = filteredData?.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage) || [];
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
    
    const handleDelete = () => {
        dispatch(DeleteReviewData(deleteId))
            .then(() => {
                dispatch(GetAllReview())
                setDeletePopup(false)
            })
            .catch((error) => {
                alert(error)
            })
    }
    

  return (
    <div>
      <div className='px-sm-4 px-3 mx-sm-3 sp_height pt-2'>
        <div className='d-flex flex-wrap justify-content-between '>
                <div className='mt-3'>
                   <h4 className='ds_600 mb-0'>Review</h4>
                   <p className='ds_text ds_font mb-0'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Review</span></p>
                </div>
                <div className='position-relative mt-3'>
                     <input 
                        type="text" 
                        className='ds_page_input' 
                        placeholder='Search... ' 
                        value={searchInput}
                        onChange={e => { setSearchInput(e.target.value); setCurrentPage(1); }}
                    />
                    <img src={search} alt="" className='ds_page_icon' />
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
                       <th>Rate</th>
                       <th>Description</th>
                       <th>Action</th>
                   </tr>
               </thead>
               <tbody>
                   {paginatedData?.map((item, index) => (
                       <tr key={item._id || index}>
                           <td>{((currentPage - 1) * itemPerPage) + (index + 1)}</td>
                           <td>{item.userData?.[0]?.firstName} {item.userData?.[0]?.lastName}</td>
                           <td>{item.productData?.[0]?.productName}</td>
                           <td>{new Date(item.createdAt).toLocaleDateString('en-GB').replace(/\//g, '/')}</td>
                           <td>
                              <div className='d-flex'>
                                {[1,2,3,4,5].map((star) => (
                                  <FaStar key={star} className={`ds_review_star ${star <= item.rate ? 'ds_review_color' : ''}`} />
                                ))}
                              </div>
                           </td>
                           <td>{item.description}</td>
                           <td>
                               <div className='sp_table_action d-flex'>
                                   <div onClick={()=> {navigate("/admin/viewreview"); localStorage.setItem("Getid" , item._id);}}> <img src={eye} alt="view" /> </div>
                                   <div onClick={()=> {setDeletePopup(true); setDeleteId(item?._id)}}> <img src={deleteImg} alt="delete" /> </div>
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


       {/* **************** Delete Category *************** */}
       <Modal show={deletePopup} onHide={() => setDeletePopup(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
               <Modal.Header closeButton>
               </Modal.Header>
               <Modal.Body>
                   <h4 className='text-center'>Delete</h4>
                   <div className='spmodal_main_div'>
                     <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Review?</p>
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


export default Review
