import React, { useRef, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {

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
    <div className='sp_height'>
        <div className='px-sm-4 px-3 mx-sm-3'>
            <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Add User</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard / <span onClick={()=> navigate("/admin/user")}>User</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / Add User</span></p>
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
                            <div className='ds_user_browse ds_cursor' onClick={handleBrowseClick}>Browse</div>
                       </div>
                  </div>
               </div>
               <div className='text-center mt-5 mb-4 pb-1'>
                 <button className='ds_user_cancel'>Cancel</button>
                 <button className='ds_user_add'>Add</button>
               </div>
            </div>
        </div>

            {/* <Modal show={deleteShow} onHide={() => setDeleteShow(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Delete</h4>
                    <div className='spmodal_main_div'>
                      <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Nitish Shah ?</p>
                    </div>
                    <div className='d-flex justify-content-around py-2'>
                        <button type='submit' className='sp_cancle_btn' onClick={() => setDeleteShow(false)}>Cancel</button>
                        <button type='submit' className='sp_add_btn'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal> */}
    </div>
  )
}

export default AddUser
