import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import '../Css/mv_style.css';
import { GetOrderData } from '../Redux-Toolkit/ToolkitSlice/User/OrderSlice';
import { CreateReturnOrder, ReturnOrderOTP } from '../Redux-Toolkit/ToolkitSlice/Admin/ReturnOrderSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Deliveredorder = () => {
  const { id } = useParams();
  console.log(id);
  
  const Deliveredorderdata = useSelector((state) => state.order.GetSingleOrderData)
  console.log("Deliveredorderdata",Deliveredorderdata);

  const dispatch = useDispatch()
  const Back_URL = 'http://localhost:5000/'

  useEffect(() => {
    dispatch(GetOrderData(id))
  }, [])

  const returnOrderOTP = useSelector((state)=> state?.returnOrder?.ReturnOrderData)
  console.log("returnOrderOTP",returnOrderOTP);

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelComments, setCancelComments] = useState('');
  const [showOrderCancelledModal, setShowOrderCancelledModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [returnReason, setReturnReason] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpRequested, setOtpRequested] = useState(false);

  const handleOpenModal = () => setShowCancelModal(true);
  const handleCloseModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
    setCancelComments('');
  };
  const handleContinue = () => {
    setShowCancelModal(false);
    setShowOrderCancelledModal(true);
  };

  const handleOtpChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (val.length > 1) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    
    // Handle backspace
    if (e.nativeEvent.inputType === "deleteContentBackward" && !val && idx > 0) {
      const prev = document.querySelectorAll('input[type="text"][maxLength="1"]')[idx - 1];
      if (prev) prev.focus();
    }
    // Move to next input if value entered
    else if (val && idx < otp.length - 1) {
      const next = document.querySelectorAll('input[type="text"][maxLength="1"]')[idx + 1];
      if (next) next.focus();
    }
  };

  const handleRequestOtp = () => {
    // Implement OTP request logic here
    setOtpRequested(true);
  };

  // New modal component for return product request success
  function MvReturnRequestSuccessModal({ onClose }) {
    return (
      <div className="mv_cancel_modal_overlay" onClick={onClose}>
        <div className="mv_order_cancelled_modal mv_return_success_modal" onClick={e => e.stopPropagation()}>
          <button className="mv_cancel_modal_close" onClick={onClose}>&times;</button>
          <div>
            <img src={require('../assets/return_success_illustration.png')} alt="Return Success" className="mv_return_success_image" />
          </div>
          <div>
            <div className="mv_return_success_title">Your request for return product has been successfully received</div>
          </div>
          <div className="mv_return_success_buttons">
            <button
              className="mv_return_success_back_home"
              onClick={() => { window.location.href = '/layout/Trackorder'; }}
            >
              Back to Home
            </button>
            <button
              className="mv_return_success_track_refund"
              onClick={() => { window.location.href = `/layout/Trackreturnrefund/${id}`; }}
            >
              Track Return / Refund
            </button>
          </div>
        </div>
      </div>
    );
  }

  const orderStatus = "shipped";

  return (
    <div className='mv_track_order_padd'>
      <div className="m_container">
        <p className='mv_track_order_title'>Track Order</p>

        <div className="col-lg-12 py-3 pt-lg-0 pt-xl-3 mv_subtrack position-relative VK_padding overflow-auto">
          <div className='mv_back_line mv_solid_line'></div>
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
              <img src={require('../assets/Out for Delivery logo.png')} alt="" className='py-2' style={{ opacity: orderStatus === "shipped" ? 1 : 0.5 }} />
              <p className='mv_confirmed'>Out for Delivery</p>
            </div>

            {/* Delivered Step */}
            <div className={`text-center mt-3`}>
              <img src={require('../assets/delivered logo.png')} alt="" className='py-2' style={{ opacity: orderStatus === "shipped" ? 1 : 0.5 }} />
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
                Return Order
              </button>
            </div>
          </div>

          {Deliveredorderdata.map((item,ind)=>(
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
                      <p className='mv_product_heading'>Delivery Address</p>
                  </div>
                  <div className='mv_track_text_padd'>
                      <div className="mv_track_product_name">{item?.userData.firstName}</div>
                      <div className="mv_track_address_phone">+91 {item?.userData.mobileNo}</div>
                      <div className="mv_track_address_text">
                      {item?.addressData?.address}, {item?.addressData?.city}, {item?.addressData?.pincode}, {item?.addressData?.country}
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

      {/* Return Order Modal */}
      {showCancelModal && (
        <div className="mv_return_modal_overlay" onClick={handleCloseModal}>
          <div className="mv_return_modal" onClick={e => e.stopPropagation()}>
            <div className="mv_return_modal_header">
              <span className="mv_return_modal_title">Return Order</span>
              <button className="mv_return_modal_close" onClick={handleCloseModal}>&times;</button>
            </div>
            <Formik
              initialValues={{
                orderId: orderId,
                returnReason: returnReason,
                mobile: mobile,
                otp: otp,
              }}
              validationSchema={Yup.object({
                orderId: Yup.string().required('Order ID is required'),
                returnReason: Yup.string().required('Reason is required'),
                mobile: Yup.string()
                  .matches(/^\+?\d{12}$/, 'Mobile No must be a valid international number'),
                // OTP is not required for requesting OTP, only for confirm
              })}
              onSubmit={(values, { setSubmitting }) => {
                if (!otpRequested) {
                  handleRequestOtp();
                  dispatch(ReturnOrderOTP(values))
                  setSubmitting(false);
                } else {
                  dispatch(CreateReturnOrder(values))
                  setShowCancelModal(false);
                  setShowOrderCancelledModal(true);
                  setSubmitting(false);
                }
                setOrderId(values.orderId);
                setReturnReason(values.returnReason);
                setMobile(values.mobile);
                setOtp(values.otp);
              }}
              enableReinitialize
            >
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="mv_return_modal_body">
                    <div className="mv_return_modal_group">
                      <label>Order ID<span style={{color:'red'}}>*</span></label>
                      <Field
                        className="mv_return_modal_input"
                        type="text"
                        name="orderId"
                        placeholder="Enter order id"
                      />
                      <ErrorMessage name="orderId" component="div" style={{color:'red', fontSize:12}} />
                    </div>
                    <div className="mv_return_modal_group">
                      <label>Reason for Return<span style={{color:'red'}}>*</span></label>
                      <Field
                        className="mv_return_modal_input"
                        type="text"
                        name="returnReason"
                        placeholder="Enter reason"
                      />
                      <ErrorMessage name="returnReason" component="div" style={{color:'red', fontSize:12}} />
                    </div>
                    <div className="mv_return_modal_group">
                      <label>Mobile No<span style={{color:'red'}}>*</span></label>
                      <Field
                        className="mv_return_modal_input"
                        type="text"
                        name="mobile"
                        placeholder="Contact no."
                        maxLength={16}
                        onInput={e => {
                          e.target.value = e.target.value.replace(/[^0-9+-]/g, '');
                        }}
                      />
                      <ErrorMessage name="mobile" component="div" style={{color:'red', fontSize:12}} />
                    </div>
                    <div className="mv_return_modal_group">
                      <label>Enter OTP to Return</label>
                      <div className="mv_return_modal_otp_row">
                        {values.otp.map((digit, idx) => (
                          <input
                            key={idx}
                            type="text"
                            maxLength={1}
                            className="mv_return_modal_otp_input"
                            value={digit}
                            onChange={e => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              if (val.length > 1) return;
                              const newOtp = [...values.otp];
                              newOtp[idx] = val;
                              setFieldValue('otp', newOtp);
                              // Handle backspace
                              if (e.nativeEvent.inputType === "deleteContentBackward" && !val && idx > 0) {
                                const prev = document.querySelectorAll('input[type="text"][maxLength="1"]')[idx - 1];
                                if (prev) prev.focus();
                              }
                              // Move to next input if value entered
                              else if (val && idx < values.otp.length - 1) {
                                const next = document.querySelectorAll('input[type="text"][maxLength="1"]')[idx + 1];
                                if (next) next.focus();
                              }
                            }}
                            onFocus={e => e.target.select()}
                            onPaste={idx === 0 ? (e => {
                              e.preventDefault();
                              const paste = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
                              if (!paste) return;
                              const pasteArr = paste.split('').slice(0, values.otp.length);
                              const newOtp = [...values.otp];
                              for (let i = 0; i < pasteArr.length; i++) {
                                newOtp[i] = pasteArr[i];
                              }
                              setFieldValue('otp', newOtp);
                              // Optionally, focus the last filled input
                              setTimeout(() => {
                                const inputs = document.querySelectorAll('input[type="text"][maxLength="1"]');
                                if (inputs[pasteArr.length - 1]) {
                                  inputs[pasteArr.length - 1].focus();
                                }
                              }, 0);
                            }) : undefined}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mv_return_modal_footer" style={{flexDirection: 'column', alignItems: 'center'}}>
                    {!otpRequested ? (
                      <div style={{display: 'flex', width: '100%', gap: 12, marginBottom: 12}}>
                        <button type="button" className="mv_return_modal_cancel" style={{flex: 1}} onClick={handleCloseModal}>Cancel</button>
                        <button type="submit" className="mv_return_modal_submit" style={{width: '100%'}} disabled={isSubmitting}>Request for OTP</button>
                      </div>
                    ) : (
                      <>
                        <div style={{display: 'flex', width: '100%', gap: 12, marginBottom: 12}}>
                          <button type="button" className="mv_return_modal_cancel" style={{flex: 1}} onClick={handleCloseModal}>Cancel</button>
                          <button type="submit" className="mv_return_modal_submit" style={{flex: 1}} disabled={isSubmitting}>Confirm Return</button>
                        </div>
                        <div style={{textAlign: 'center', width: '100%', color: '#23243599', fontSize: 16}}>
                          Didn't received code? <span style={{color: '#232435', textDecoration: 'underline', cursor: 'pointer'}} onClick={handleRequestOtp}>Resend</span>
                        </div>
                      </>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {showOrderCancelledModal && (
        <MvReturnRequestSuccessModal onClose={() => setShowOrderCancelledModal(false)} />
      )}

    </div>
  );
};

export default Deliveredorder;
