import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import pro from '../Image/Savani/pro.png'
import { GetOrderData } from '../../Redux-Toolkit/ToolkitSlice/User/OrderSlice';

const ViewOrder = () => {

const navigate = useNavigate()
const dispatch = useDispatch()
const editid = localStorage.getItem("Getid")
const Back_URL = 'http://localhost:5000/'

const SingleOrderData = useSelector((state) => state.order.GetSingleOrderData)
console.log("SingleOrderData", SingleOrderData);

useEffect(() => {
    dispatch(GetOrderData(editid))
}, [editid])

  return (
    <div>
       <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
        <div className='d-flex flex-wrap justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>View Order</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard  <span onClick={()=> navigate("/admin/order")}>/  Order </span> <span style={{color:'rgba(20, 20, 20, 1)'}}>  / View Order</span></p>
                </div>
        </div>
        {SingleOrderData?.map((item, index) => (
            <div key={index} className="row align-items-stretch">
                <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12  mt-2">
                    <div className='ds_view_box overflow-x-auto'>
                        <div className='ds_vieworder_manage'>
                            <div className='d-flex justify-content-between' style={{ borderBottom: '0.6px solid rgba(20, 20, 20, 0.2)' }}>
                                <div>
                                    <p>Order ID : <span className='fw-bolder' >#{item._id}</span></p>
                                </div>
                                <div className='d-flex'>
                                    <p className='mb-0 d-flex'>{new Date(item.createdAt).toLocaleDateString()} <span className='ds_view_border'></span></p>
                                    <p className='mb-0 d-flex ms-2'>{item.products.length} Items<span className='ds_view_border'></span></p>
                                    <p className='mb-0 d-flex ms-2'>Txn ID : <span className='fw-bolder ms-1' > </span></p>
                                </div>
                            </div>
                            <table className='w-100 ds_vieworder_table mt-sm-5 mt-4'>
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {item.products?.map((p, i) => (
                                        <tr key={i} style={i === item.products.length - 1 ? { borderBottom: 'none' } : {}}>
                                            <td>
                                                <div className='d-flex align-items-center'>
                                                    <div>
                                                        <img src={`${Back_URL}${p?.details.productImage[0]}`} alt="" className='ds_vieworder_img' />
                                                    </div>
                                                    <p className='mb-0 ms-3 ds_600'>{p.details.productName}</p>
                                                </div>
                                            </td>
                                            <td className='ds_600'>₹{p.details.discountedPrice}</td>
                                            <td className='ds_600'>{p.qty}</td>
                                            <td className='ds_600'>₹{p.details.discountedPrice * p.qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-12 mt-xl-2 mt-4">
                    <div className='ds_view_box h-100'>
                        <h6 className='ds_600 ds_vieworder_title'>Summary</h6>
                        <p className='mt-3 mb-0' style={{ color: '#14141499' }}>Order ID : <span className='ds_600' style={{ color: '#141414' }}>#{item._id}</span> </p>
                        <p className='mt-2 mb-0' style={{ color: '#14141499' }}>Order Date : <span className='ds_600' style={{ color: '#141414' }}>{new Date(item.createdAt).toLocaleDateString()}</span> </p>
                        <p className='mt-2 mb-0' style={{ color: '#14141499' }}>Order Total : <span className='ds_600' style={{ color: '#141414' }}>₹{item.totalAmount}</span> </p>

                        <div className='mt-4'>
                            <h6 className='ds_600 ds_vieworder_title mb-3'>Shipping Address</h6>
                            {item.addressData ? (
                                <>
                                    <p style={{ fontSize: "14px" }}>{`${item.addressData?.address}, ${item.addressData?.city}, ${item.addressData?.state}, ${item.addressData?.country}, ${item.addressData?.pinCode}`}</p>
                                    <div className='d-flex'>
                                        <p className='d-flex ds_600'>{item.userData?.firstName} {item.userData?.lastName} <span className='ds_view_border'></span></p>
                                        <span className='ms-2'>+91{item.userData?.mobileNo}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {item.userData && (
                                        <div className='d-flex'>
                                            <p className='d-flex ds_600'>{item.userData?.firstName} {item.userData?.lastName} <span className='ds_view_border'></span></p>
                                            <span className='ms-2'>+91 {item.userData?.mobileNo}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className='mt-3'>
                            <h6 className='ds_600 ds_vieworder_title mb-3'>Price Details</h6>
                            <div className='d-flex justify-content-between '>
                                <p className='mb-2' style={{ color: '#14141499' }}>Sub Total</p>
                                <p className='ds_600 mb-2'>₹{item.subTotal}</p>
                            </div>
                            <div className='d-flex justify-content-between '>
                                <p className='mb-2' style={{ color: '#14141499' }}>Discount</p>
                                <p className='ds_600 mb-2'>₹{item.discount}</p>
                            </div>
                            <div className='d-flex justify-content-between '>
                                <p className='mb-2' style={{ color: '#14141499' }}>Tax</p>
                                <p className='ds_600 mb-2'>₹{item.tax}</p>
                            </div>
                            <div className='d-flex justify-content-between '>
                                <p className='mb-2' style={{ color: '#14141499' }}>Delivery Charge</p>
                                <p className='ds_600 mb-2'>₹{item.deliveryCharge}</p>
                            </div>
                            <div style={{ borderBottom: "0.6px solid #14141433" }}></div>
                            <div className='d-flex justify-content-between mt-3'>
                                <h6>Total Amount</h6>
                                <p className='mb-0 ds_600'>₹{item.totalAmount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
       </div>
    </div>
  )
}

export default ViewOrder
