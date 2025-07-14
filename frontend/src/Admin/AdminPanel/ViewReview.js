import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import deleteImg from '../Image/Sujal/delete.svg'
import eye from '../Image/Savani/eye.svg'
import { Modal } from 'react-bootstrap'
import { FaAngleLeft, FaAngleRight, FaStar } from 'react-icons/fa6'
import order from '../Image/Savani/order.png'
import order2 from '../Image/Savani/order2.png'
import profile from '../Image/Savani/profile.png'
import { useDispatch, useSelector } from 'react-redux';
import { GetSingleReviewData } from '../../Redux-Toolkit/ToolkitSlice/User/ReviewSlice'


const ViewReview = () => {

const navigate = useNavigate()
const [deletePopup, setDeletePopup] = useState(false)
const Back_URL = 'http://localhost:5000/'
const editid = localStorage.getItem("Getid")
const dispatch = useDispatch()

const SingleReviewData = useSelector((state) => state.review.GetSingleReviewData)
console.log("SingleReviewData", SingleReviewData);

useEffect(() => {
    dispatch(GetSingleReviewData(editid))
}, [editid])

  return (
    <div>
      <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
        <div className='d-flex flex-wrap justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>View Review</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard <span onClick={()=> navigate("/admin/review")}> / Review</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / View Review</span></p>
                </div>
        </div>

        {SingleReviewData?.map((item, index) => (
          <div key={index} className='row'>
              <div className="col-xl-5 col-lg-10 col-md-12">
                  <div className='ds_view_box mt-2'>
                      <div className='d-flex pt-2'>
                          {item.productData?.[0]?.productImage?.length > 0 ? (
                              item.productData[0].productImage.map((img, idx) => (
                                  <div className='me-3' key={idx}>
                                      <img src={`${Back_URL}${img}`} alt="" className='ds_viewreview_img' />
                                  </div>
                              ))
                          ) : (
                              <div className='me-3'>
                                  <img src={order} alt="" className='ds_viewreview_img' />
                              </div>
                          )}
                      </div>

                      <div className='row  mt-4 pt-2'>
                          <div className="col-xl-5 col-lg-5 col-md-5 col-sm-5 col-5">
                                <p>Profile :</p>
                                <p className='mt-4 pt-1 mb-0'>Name :</p>
                                <p className='mt-2 mb-0'>Date :</p>
                                <p className='mt-2 mb-0'>Rating  :</p>
                                <p className='mt-2'>Message :</p>
                          </div>
                          <div className="col-xl-7 col-lg-7 col-md-7 col-sm-7 col-7">
                                <div>
                                    <img src={item.userData?.[0]?.image ? `${Back_URL}${item.userData[0].image}` : profile} alt="" className='ds_viewprofile' />
                                    <p className='mt-2 pt-1 mb-2'>{item.userData?.[0]?.firstName} {item.userData?.[0]?.lastName}</p>
                                    <p className='mb-0 '>{new Date(item.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}</p>
                                    <p className='pt-2 mb-0'>
                                      {[1,2,3,4,5].map((star) => (
                                        <FaStar key={star} className={`ds_review_star ${star <= item.rate ? 'ds_review_color' : ''}`} />
                                      ))}
                                    </p>
                                    <p className='pt-2'>{item.description}</p>
                                </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        ))}
      
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

export default ViewReview
