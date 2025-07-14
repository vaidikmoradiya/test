import React from 'react'
import { useNavigate } from 'react-router-dom'
import pro from '../Image/Savani/pro.png'

const CustomerViewOrder = () => {

const navigate = useNavigate()

  return (
    <div>
      <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
        <div className='d-flex flex-wrap justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>View Order</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard  <span onClick={()=> navigate("/customer/order")}>/  Order </span> <span style={{color:'rgba(20, 20, 20, 1)'}}>  / View Order</span></p>
                </div>
        </div>
            <div className="row align-items-stretch">
                <div className="col-xl-8 col-lg-12 col-md-12 col-sm-12  mt-2">
                    <div className='ds_view_box overflow-x-auto h-100'>
                       <div className='ds_vieworder_manage'>
                         <div className='d-flex justify-content-between' style={{borderBottom: '0.6px solid rgba(20, 20, 20, 0.2)'}}>
                            <div>
                                <p>Order ID : <span className='fw-bolder' >#51641684166514</span></p>
                            </div>
                            <div className='d-flex'>
                               <p className='mb-0 d-flex'>18/02/2025 <span className='ds_view_border'></span></p>
                               <p className='mb-0 d-flex ms-2'>3 Items<span className='ds_view_border'></span></p>
                               <p className='mb-0 d-flex ms-2'>Txn ID : <span className='fw-bolder ms-1' > 51684561</span></p>
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
                            <tr>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <div>
                                            <img src={pro} alt="" className='ds_vieworder_img'/>
                                        </div>
                                        <p className='mb-0 ms-3 ds_600'>Delta Omni 0.4X19 Relay Nozzle </p>
                                    </div>
                                </td>
                                <td className='ds_600'>$6000</td>
                                <td className='ds_600'>01</td>
                                <td className='ds_600'>$600</td>
                            </tr>
                            <tr>
                                <td>
                                    <div className='d-flex align-items-center'>
                                        <div>
                                            <img src={pro} alt="" className='ds_vieworder_img'/>
                                        </div>
                                        <p className='mb-0 ms-3 ds_600'>Delta Omni 0.4X19 Relay Nozzle </p>
                                    </div>
                                </td>
                                <td className='ds_600'>$6000</td>
                                <td className='ds_600'>01</td>
                                <td className='ds_600'>$600</td>
                            </tr>
                            <tr style={{borderBottom:'none'}}>
                                <td >
                                    <div className='d-flex align-items-center'>
                                        <div>
                                            <img src={pro} alt="" className='ds_vieworder_img'/>
                                        </div>
                                        <p className='mb-0 ms-3 ds_600'>Delta Omni 0.4X19 Relay Nozzle </p>
                                    </div>
                                </td>
                                <td className='ds_600'>$6000</td>
                                <td className='ds_600'>01</td>
                                <td className='ds_600'>$600</td>
                            </tr>
                          </tbody>
                         </table>
                       </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-12 mt-xl-2 mt-4">
                   <div className='ds_view_box h-100'>
                     <h6 className='ds_600 ds_vieworder_title'>Summary</h6>
                     <p className='mt-3 mb-0' style={{color: '#14141499'}}>Order ID : <span className='ds_600' style={{color: '#141414'}}>#51641684166514</span> </p>
                     <p className='mt-2 mb-0' style={{color: '#14141499'}}>Order Date : <span className='ds_600' style={{color: '#141414'}}>18/02/2025</span> </p>
                     <p className='mt-2 mb-0' style={{color: '#14141499'}}>Order Total : <span className='ds_600' style={{color: '#141414'}}>$5000</span> </p>

                     <div className='mt-4'>
                        <h6 className='ds_600 ds_vieworder_title mb-3'>Shipping Address</h6>
                        <p style={{fontSize:"14px"}}>Ehrenkranz 13 Washington Square S, New York, Wangton Square, NY 10012, USA</p>
                        <div className='d-flex'>
                            <p className='d-flex ds_600'>Johan Patel <span className='ds_view_border'></span></p>
                            <span className='ms-2'>+91 3698527412</span>
                        </div>
                     </div>

                     <div className='mt-3'>
                        <h6 className='ds_600 ds_vieworder_title mb-3'>Price Details</h6>
                         <div className='d-flex justify-content-between '>
                             <p className='mb-2' style={{color:'#14141499'}}>Sub Total</p>
                             <p className='ds_600 mb-2'>$4900</p>
                         </div>
                         <div className='d-flex justify-content-between '>
                             <p className='mb-2' style={{color:'#14141499'}}>Discount</p>
                             <p className='ds_600 mb-2'>$100</p>
                         </div>
                         <div className='d-flex justify-content-between '>
                             <p className='mb-2' style={{color:'#14141499'}}>Tax</p>
                             <p className='ds_600 mb-2'>$50</p>
                         </div>
                         <div className='d-flex justify-content-between '>
                             <p className='mb-2' style={{color:'#14141499'}}>Delivery Charge</p>
                             <p className='ds_600 mb-2'>$150</p>
                         </div>
                         <div style={{borderBottom: "0.6px solid #14141433"}}></div>
                         <div className='d-flex justify-content-between mt-3'>
                            <h6>Total Amount</h6>   
                            <p className='mb-0 ds_600'>$5000</p>
                         </div>
                     </div>
                   </div>
                </div>
            </div>
       </div>
    </div>
  )
}

export default CustomerViewOrder
