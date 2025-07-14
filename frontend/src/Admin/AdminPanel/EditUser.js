import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const EditUser = () => {

const fileInputRef = useRef(null);
const [fileName, setFileName] = useState("Choose Image")
const navigate = useNavigate()

const handleBrowseClick = () => {
  fileInputRef.current.click(); 
};

const handleFileChange = (event) => {
  const fileName = event.target.files[0]?.name || '';
  setFileName(fileName)
};

  return (
    <div>
        <div className='px-sm-4 px-3 mx-sm-3'>
            <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Edit User</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard / <span onClick={()=> navigate("/admin/user")}>User</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / Edit User</span></p>
                </div>
            </div>
            <div className='ds_user_box mt-2'>
               <div className="row">
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                            <label className='ds_login_label' >Name</label>
                            <input type="text" className="form-control ds_login_input mt-1" placeholder='Enter Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                            <label className='ds_login_label' >Email</label>
                            <input type="text" className="form-control ds_login_input mt-1" placeholder='Enter Email' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label ' >Role</label>
                        <select className='ds_user_select w-100 mt-1'>
                          <option value="">Select</option>
                        </select>
                      </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                            <label className='ds_login_label' >Password</label>
                            <input type="password" className="form-control ds_login_input mt-1" placeholder='Enter Password' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                       <div className="form-group position-relative">
                            <label className='ds_login_label' >Image</label>
                            <input type="text" value={fileName} className="form-control ds_login_input mt-1" placeholder='Choose Image' id="exampleInputEmail1" aria-describedby="emailHelp" readOnly/>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className='d-none'/>
                            <div className='ds_user_browse ds_cursor' onClick={handleBrowseClick}>Change</div>
                       </div>
                  </div>
               </div>
               <div className='text-center mt-5 mb-4 pb-1'>
                 <button className='ds_user_cancel'>Cancel</button>
                 <button className='ds_user_add'>Update</button>
               </div>
            </div>
        </div>
    </div>
  )
}

export default EditUser
