import React, { useState } from 'react'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Modal, Table } from 'react-bootstrap';

const Customer = () => {

    const [currentPage,setCurrentPage] = useState(1);
    const [add, setAdd] = useState(false)
    const [edit, setEdit] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)

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
    <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
       <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Customer</h4>
                   <p className='ds_text ds_font'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Customer</span></p>
                </div>
                <div>
                  <div onClick={()=> setAdd(true)} class="sp_Add_btn ds_cursor"><span>+ Add</span></div>
                </div>
        </div>
        <div className='ds_customer_table  overflow-x-auto position-relative mt-2'>
            <table className="w-100 ds_customer_manage">
                <thead className=''>
                    <tr className=''>
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Phone No.</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
                                <div onClick={()=> setDeletePopup(true)}><img src={deleteImg}></img></div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>01</td>
                        <td>Nitish Shah</td>
                        <td>+91 55555 55555</td>
                        <td>Lorem ipsum</td>
                        <td>
                            <div className=' sp_table_action d-flex'>
                                <div onClick={()=> setEdit(true)}><img src={editImg} ></img></div>
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

         {/* **************** Add *************** */}
            <Modal show={add} onHide={() => setAdd(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Add Customer</h4>
                    <div className='mx-sm-3 mx-1'>
                       <div className="form-group  mt-4 pt-3">
                            <label className='ds_popup_label'>Customer Name</label>
                            <input type="text" className="form-control ds_popup_input mt-1" placeholder='Enter Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                       </div>
                       <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Phone No.</label>
                            <input type="text" className="form-control ds_popup_input mt-1" placeholder='Enter Phone No.' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                       </div>
                       <div className="form-group  mt-4 ">
                            <label className='ds_popup_label'>Address</label>
                            <input type="text" className="form-control ds_popup_input mt-1" placeholder='Enter Address' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                       </div>
                    </div>   
                    <div className='d-flex justify-content-center py-2 mt-sm-5 mt-4'>
                       <button type='button' onClick={()=> setAdd(false)} className='ds_user_cancel'>Cancel</button>
                       <button className='ds_user_add'>Add</button>
                    </div>
                </Modal.Body>
            </Modal>

         {/* **************** Edit *************** */}
           <Modal show={edit} onHide={()=> setEdit(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Edit Customer</h4>
                    <div className='mx-sm-3 mx-1'>
                       <div className="form-group  mt-4 pt-3">
                            <label className='ds_popup_label'>Customer Name</label>
                            <input type="text" className="form-control ds_popup_input mt-1" placeholder='Enter Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                       </div>
                       <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Phone No.</label>
                            <input type="text" className="form-control ds_popup_input mt-1" placeholder='Enter Phone No.' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                       </div>
                       <div className="form-group  mt-4 ">
                            <label className='ds_popup_label'>Address</label>
                            <input type="text" className="form-control ds_popup_input mt-1" placeholder='Enter Address' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                       </div>
                    </div>   
                    <div className='d-flex justify-content-center py-2 mt-sm-5 mt-4'>
                       <button onClick={()=> setEdit(false)} className='ds_user_cancel'>Cancel</button>
                       <button className='ds_user_add'>Update</button>
                    </div>
                </Modal.Body>
            </Modal>

         {/* **************** Delete *************** */}
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
                       <button className='ds_user_add'>Add</button>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
  )
}

export default Customer
