import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import '../Css/mv_style.css';
import { GetOrderData } from '../Redux-Toolkit/ToolkitSlice/User/OrderSlice';
import { cancleOrder } from '../Redux-Toolkit/ToolkitSlice/User/CancelOrderSlice';

const Trackorder = () => {
  const { id } = useParams();
  console.log(id);
  
  const TrackOrderData = useSelector((state) => state.order.allOrderData)
  console.log("TrackOrderData",TrackOrderData);

  const dispatch = useDispatch()
  const Back_URL = 'http://localhost:5000/'

  useEffect(() => {
    dispatch(GetOrderData(id))
  }, [])

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelComments, setCancelComments] = useState('');
  const [showOrderCancelledModal, setShowOrderCancelledModal] = useState(false);
  const [cancelorder, setCancelorder] = useState({
    reason:'',
    comment: ''
  });

  const handleOpenModal = () => setShowCancelModal(true);
  const handleCloseModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
    setCancelComments('');
  };
  const handleContinue = () => {
    setShowCancelModal(false);
    setShowOrderCancelledModal(true);
    dispatch(cancleOrder({
      orderId: id,
      reason: cancelorder.reason,
      comment: cancelorder.comment
    }));
    setCancelorder({ reason: '', comment: '' });
  };

  // New modal component for order cancelled
  function MvOrderCancelledModal({ onClose }) {
    return (
      <div className="mv_cancel_modal_overlay" onClick={onClose}>
        <div className="mv_order_cancelled_modal" onClick={e => e.stopPropagation()}>
          <button className="mv_cancel_modal_close" onClick={onClose}>&times;</button>
          <div>
            <img src={require('../assets/track_refund_successfully.png')} alt="Cancelled" />
          </div>
          <div style={{marginBottom: 32}}>
            <div className="mv_cancelled_title">Your order has been cancelled <br />successfully</div>
          </div>
          <div className="mv_cancelled_buttons">
            <button className="mv_order_cancelled_back_home" onClick={() => { window.location.href = '/layout/Trackorder'; }}>Back to Home</button>
            <button className="mv_order_cancelled_track_refund" onClick={() => { window.location.href = '/layout/Trackrefund'; }}>Track Refund</button>
          </div>
        </div>
      </div>
    );
  }

  // Assuming you have a status variable to determine the order status
  const orderStatus = "shipped"; // Example status, replace with actual logic

  return (
    <div className='mv_track_order_padd'>
      <div className="m_container">
        <p className='mv_track_order_title'>Track Order</p>
        
        <div className="py-3 pt-xl-3 mv_subtrack position-relative VK_padding overflow-auto">
          {/* Track line */}
          {/* <div className='mv_back_line'></div> */}
          <div className={`mv_line line_1 ${["shipped", "outForDelivery", "delivered"].includes(orderStatus) ? "solid" : "dashed"}`}></div>
          <div className={`mv_line line_2 ${["outForDelivery", "delivered"].includes(orderStatus) ? "solid" : "dashed"}`}></div>
          <div className={`mv_line line_3 ${orderStatus === "delivered" ? "solid" : "dashed"}`}></div>
          
          <div className="d-flex justify-content-between px-md-3 px-lg-5">
            {/* Order Confirmed Step */}
            <div className={`text-center mt-3`}>
              <img src={require('../assets/ordered confirmed.png')} alt="" className='py-2' style={{ opacity: orderStatus === "shipped" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Order Confirmed</p>
            </div>

            {/* Shipped Step */}
            <div className={`text-center mt-3`}>
              <img src={require('../assets/shipped.png')} alt="" className='py-2' style={{ opacity: orderStatus === "shipped" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Shipped</p>
            </div>

            {/* Out for Delivery Step */}
            <div className={`text-center mt-3`}>
              <img src={require('../assets/Out for Delivery logo.png')} alt="" className='py-2' style={{ opacity: orderStatus === "delivered" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Out for Delivery</p>
            </div>

            {/* Delivered Step */}
            <div className={`text-center mt-3`}>
              <img src={require('../assets/delivered logo.png')} alt="" className='py-2' style={{ opacity: orderStatus === "delivered" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Delivered</p>
            </div>
          </div>
        </div>

        <div className='mv_order_details_padd'>
          <div className='mv_order_header_wrapper'>
            <div>
              <p className='mv_order_details_heading'>Order Details</p>
            </div>
            <div>
              <button className="mv_cancel_order_btn" onClick={handleOpenModal}>
                Cancel Order
              </button>
            </div>
          </div>

          {TrackOrderData.map((item,ind)=>(
            <div key={ind} className="mv_main_card mv_track_order_card">
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
                      <p className='mv_product_heading'>Delivery Address</p>
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
                      <p className='mv_product_heading'>Payment Details</p>
                  </div>
                  <div className='mv_track_text_padd'>
                      <div className="mv_track_product_name">{item?.method}</div>
                      <div className='mv_track_order_info mt-2'>
                          <p className='mb-2 mv_track_order_heading'>Card Name : </p>
                          <p className='mb-2 mv_track_order_text'>{item?.cardName}</p>
                        </div>
                        <div className='mv_track_order_info'>
                          <p className='mb-2 mv_track_order_heading'>Transaction ID : </p>
                          <p className='mb-2 mv_track_order_text'>{item?.transactionId}</p>
                        </div>
                      <div className="mv_track_payment_detail"><span></span></div>
                      <div className="mv_track_payment_transaction"><span></span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCancelModal && (
        <div className="mv_cancel_modal_overlay" onClick={handleCloseModal}>
          <div className="mv_cancel_modal" onClick={e => e.stopPropagation()}>
            <div className="mv_cancel_modal_header">
              <span className="mv_cancel_modal_title">Cancel Order</span>
              <button className="mv_cancel_modal_close" onClick={handleCloseModal}>&times;</button>
            </div>
            <div className="mv_cancel_modal_body">
              <div className="mv_cancel_modal_group">
                <label>Reason for Cancellation<span style={{color:'red'}}>*</span></label>
                <select
                  className="mv_cancel_modal_select"
                  value={cancelorder.reason}
                  // onChange={e => setCancelReason(e.target.value)}
                  onChange={(e) => setCancelorder({ reason: e.target.value})}
                >
                  <option value="">Select</option>
                  <option value="I was hopping for a shorter delivery time">I was hopping for a shorter delivery time</option>
                  <option value="Product quality does not match the level of its worth">Product quality does not match the level of its worth</option>
                  <option value="The product doesn't look like the online picture">The product doesn't look like the online picture</option>
                  <option value="The product was damaged in transit or was poorly made">The product was damaged in transit or was poorly made</option>
                  <option value="The product information was misleading">The product information was misleading</option>
                  <option value="My reason are not listed here">My reason are not listed here</option>
                </select>
              </div>
              <div className="mv_cancel_modal_group">
                <label>Comments<span style={{color:'red'}}>*</span></label>
                <textarea className="mv_cancel_modal_textarea" 
                value={cancelorder.comment} 
                // onChange={e => setCancelComments(e.target.value)}
                onChange={(e) => setCancelorder({comment: e.target.value })} 
                placeholder="Enter comments" />
              </div>
            </div>
            <div className="mv_cancel_modal_footer">
              <button className="mv_cancel_modal_cancel" onClick={handleCloseModal}>Cancel</button>
              <button className="mv_cancel_modal_submit" onClick={handleContinue}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {showOrderCancelledModal && (
        <MvOrderCancelledModal onClose={() => setShowOrderCancelledModal(false)} />
      )}

    </div>
  );
};

export default Trackorder;
