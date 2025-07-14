import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import eye from '../Image/Savani/eye.svg'
import print from '../Image/Savani/print.svg'
import { FaAngleLeft, FaAngleRight, FaFilter, FaStar } from 'react-icons/fa6';
import { Modal } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import deleteImg from '../Image/Sujal/delete.svg'

const CustomerReview = () => {

const [show, setShow] = useState(false)
const [deletePopup, setDeletePopup] = useState(false)
const [currentPage,setCurrentPage] = useState(1);
const navigate = useNavigate()


var totalPages =10;
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
    <div>
       <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
        <div className='d-flex flex-wrap justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Review</h4>
                   <p className='ds_text ds_font'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Review</span></p>
                </div>
        </div>

        <div className='ds_customer_table  overflow-x-auto position-relative mt-2'>
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
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
                   <tr>
                       <td>01</td>
                       <td>Johan Desai</td>
                       <td>Delta Omni 0.4X19 </td>
                       <td>02/09/1994</td>
                       <td>
                          <div className='d-flex'>
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ds_review_color' />
                             <FaStar className='ds_review_star ' />
                          </div>
                       </td>
                       <td>
                          Lorem ipsum dolor sit amet
                       </td>
                       <td>
                           <div className='sp_table_action d-flex'>
                               <div onClick={()=> navigate("/customer/viewreview")}><img src={eye} ></img></div>
                               <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                           </div>
                       </td>
                   </tr>
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
                     <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Nitish Shah ?</p>
                   </div>
                   <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                      <button onClick={()=> setDeletePopup(false)} className='ds_user_cancel'>Cancel</button>
                      <button className='ds_user_add'>Delete</button>
                   </div>
               </Modal.Body>
       </Modal>
      </div>
    </div>
  )
}

export default CustomerReview
