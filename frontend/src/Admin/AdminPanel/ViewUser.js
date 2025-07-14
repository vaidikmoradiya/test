import React from 'react'
import profile from '../Image/Sujal/user.jpg'

const ViewUser = () => {
  return (
    <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
        <div className='ds_viewuser_box mt-4'>
           <div className="row">
              <div className="col-xl-2">
                   <div>
                      <img src={profile} alt="" className='ds_viewuser_img'/>
                   </div>
              </div>
              <div className="col-xl-3">
                 <div className="row">
                    <div className="col-xl-8">
                        <div className='d-flex  justify-content-between'>
                           <p className='mb-1'>First Name  :</p>
                           <p className='ds_600 mb-2'>Patel</p>
                        </div>
                        <div className='d-flex justify-content-between'>
                           <p className='mb-1'>Last Name  :</p>
                           <p className='ds_600 mb-2'>John</p>
                        </div>
                       <div className='d-flex justify-content-between'>
                           <p className='mb-1'>Gender  :</p>
                           <p className='ds_600 mb-2'>Male</p>
                        </div>
                    </div>
                 </div>
              </div>
              <div className="col-xl-3">
                <div className='d-flex justify-content-between'>
                    <p className='mb-1'>Email :</p>
                    <p className='ds_600 mb-2'>example123@gmail.com</p>
                </div>
                <div className='d-flex justify-content-between'>
                    <p className='mb-1'>Contact No.:</p>
                    <p className='ds_600 mb-2'>+91 3698527412</p>
                </div>
              </div>
           </div>
        </div>
    </div>
  )
}

export default ViewUser
