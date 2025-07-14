import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import '../Css/mv_style.css';
import received from '../assets/Received.svg'
import check from '../assets/Refund Credited.svg'
import refundcredited from '../assets/RR_Refund_Credited.svg'
import { GetOrderData } from '../Redux-Toolkit/ToolkitSlice/User/OrderSlice';

const Trackreturnrefund = () => {
  const { id } = useParams();
  console.log(id);
  
  const Trackreturnrefunddata = useSelector((state) => state.order.allOrderData)
  console.log("Trackreturnrefunddata",Trackreturnrefunddata);
  
  const dispatch = useDispatch()
  const Back_URL = 'http://localhost:5000/'
  
  useEffect(() => {
    dispatch(GetOrderData(id))
  }, [])
  
  const orderStatus = "Initiated";

  return (
    <div className='mv_track_order_padd'>
      <div className="m_container">
        <p className='mv_track_order_title'>Track Return / Refund</p>

        <div className="col-lg-12 py-3 pt-lg-0 pt-xl-3 mv_subtrack position-relative VK_padding overflow-auto">
          {/* <div className='mv_track_returnrefund_back_line'></div> */}

          <div className={`mv_rr_line mv_rr_line_1 ${["Initiated", "Picked Up", "Received", "Refund Initiated", "Refund Credited"].includes(orderStatus) ? "solid" : "dashed"}`}></div>
          <div className={`mv_rr_line mv_rr_line_2 ${["Initiated", "Picked Up", "Received", "Refund Initiated", "Refund Credited"].includes(orderStatus) ? "solid" : "dashed"}`}></div>
          <div className={`mv_rr_line mv_rr_line_3 ${["Received", "Refund Initiated", "Refund Credited"].includes(orderStatus) ? "solid" : "dashed"}`}></div>
          <div className={`mv_rr_line mv_rr_line_4 ${orderStatus === "Refund Credited" ? "solid" : "dashed"}`}></div>

          <div className="d-flex justify-content-between px-md-3 px-lg-5">
            {/* Initiated Step */}
            <div className={`text-center mt-3`}>
              <img src={require('../assets/ordered confirmed.png')} alt="" className='py-2' style={{ opacity: orderStatus === "Initiated" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Initiated</p>
            </div>

            {/* Picked Up Process */}
            <div className={`text-center mt-3`}>
              <img src={require('../assets/Out for Delivery logo.png')} alt="" className='py-2' style={{ opacity: orderStatus === "Initiated" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Picked Up</p>
            </div>

            {/* Received */}
            <div className={`text-center mt-3`}>
              <img src={received} alt="" className='py-2' style={{ opacity: orderStatus === "Initiated" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Received</p>
            </div>

            {/* Refund Initiated */}
            <div className={`text-center mt-3`}>
              <img src={check} alt="" className='py-2' style={{ opacity: orderStatus === "Refund Credited" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Refund Initiated</p>
            </div>

            {/* Refund Credited */}
            <div className={`text-center mt-3`}>
              <img src={refundcredited} alt="" className='py-2' style={{ opacity: orderStatus === "Refund Credited" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Refund Credited</p>
            </div>

          </div>
        </div>

        <div className='mv_order_details_padd'>
          <div className='mv_order_header_wrapper'>
            <div>
              <p className='mv_order_details_heading'>Order Details</p>
            </div>
          </div>

          {Trackreturnrefunddata.map((item,ind)=>(
            <div className="mv_main_card mv_track_order_card">
              <div className="row mv_track_order_row">
                {/* Product Details */}
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mv_track_order_col">
                  <div>
                      <p className='mv_product_heading'>Product Details</p>
                  </div>
                  {item.products.map((it, ind) => (
                    <div className="mv_track_product_wrapper mv_track_text_padd">
                      <div className="mv_track_product_img_container">
                        <img src={`${Back_URL}${it?.details.productImage[0]}`} alt="product" className="mv_track_product_img" />
                      </div>
                      <div>
                        <div className="mv_track_product_name">{it?.details.productName}</div>
                        <div className="mv_track_product_price">₹ {it?.details.price}</div>
                        <div className="mv_track_order_details">
                          <div className='mv_track_order_info'>
                            <p className='mb-2 mv_track_order_heading'>Order ID : </p>
                            <p className='mb-2 mv_track_order_text'>{item?._id}</p>
                          </div>
                          <div className='mv_track_order_info'>
                            <p className='mb-2 mv_track_order_heading'>Order Date : </p>
                            <p className='mb-2 mv_track_order_text'>
                            {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              }).replace(/\s/g, ' ')}
                            </p>
                          </div>
                          <div className='mv_track_order_info'>
                            <p className='mb-2 mv_track_order_heading'>Expected Date : </p>
                            <p className='mb-2 mv_track_order_text'>{item?.expectedDate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Delivery Address */}
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mv_track_order_col mv_track_address_section">
                  <div>
                      <p className='mv_product_heading'>Pickup Address</p>
                  </div>
                  <div className='mv_track_text_padd'>
                      <div className="mv_track_product_name">{item?.userData.firstName}</div>
                      <div className="mv_track_address_phone">+91 {item?.userData.mobileNo}</div>
                      <div className="mv_track_address_text">
                      {item?.addressData.address}, {item?.addressData.city}, {item?.addressData.pincode}, {item?.addressData.country}
                      </div>
                  </div>
                </div>
                {/* Payment Details */}
                <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 mv_track_order_col">
                  <div>
                      <p className='mv_product_heading'>Pickup Instruction</p>
                  </div>
                  <div className='mv_track_text_padd'>
                      <div className="mv_track_address_text mb-2">{item?.time}</div>
                      <div className="mv_track_address_text">{item?.address}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
        </div>
      </div>

    </div>
  );
};

export default Trackreturnrefund;
