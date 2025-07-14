import React, { useEffect, useState } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { useFormik } from 'formik';
import { editReasonCancellationSchema, reasonCancellationSchema } from '../Formik';
import { useDispatch, useSelector } from 'react-redux';
import { createReasonCancellation, DeleteReasonCancellation, EditReasonCancellation, EditStatusReasonCancellation, getAllReasonCancellation } from '../../Redux-Toolkit/ToolkitSlice/Admin/ReasonCancellationSlice';
import search from '../Image/Savani/search_icon.svg'


const ReasonofCancellation = () => {
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState(null);
    const [editData, setEditData] = useState("")
    const [searchInput, setSearchInput] = useState("");
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const reasonCancel = useSelector((state) => state?.reasonCancel?.allReason);
    var itemPerPage = 10;
    const totalPages = Math.ceil((reasonCancel?.length || 0) / itemPerPage);

    useEffect(() => {
        dispatch(getAllReasonCancellation());
    }, [])

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        const paginatedData = reasonCancel?.slice(startIndex, endIndex);
        let filter = paginatedData?.filter((element) => {
            return element?.reasonCancel?.toLowerCase().includes(searchInput?.toLowerCase());
        });
        setData(filter);
    }, [currentPage, reasonCancel, searchInput]);

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


    const reasonCancelVal = {
        reasonCancel: ""
    }
    const createReasonCancelFormik = useFormik({
        initialValues: reasonCancelVal,
        validationSchema: reasonCancellationSchema,
        onSubmit: (values, action) => {
            console.log(values);
            dispatch(createReasonCancellation(values)).then(() => {
                dispatch(getAllReasonCancellation());
                setAddShow(false);
            }).catch((error) => {
                alert(error)
            })
            action.resetForm();
        }
    })
    const handleDeleteRole = () => {
        dispatch(DeleteReasonCancellation(deleteId))
        .then(()=>{
            dispatch(getAllReasonCancellation())
            setDeleteShow(false)
         })
         .catch((error)=>{
           alert(error)
         })
    }


    const editReasonVal = {
        reasonCancel: editData?.reasonCancel
    }

    const editReasonCancelFormik = useFormik({
        enableReinitialize: true,
        initialValues: editReasonVal,
        validationSchema: editReasonCancellationSchema,
        onSubmit: (values, action) => {
            dispatch(EditReasonCancellation({values , editData}))
            .then(()=>{
               setEditShow(false)
               dispatch(getAllReasonCancellation())
            }).catch((error)=>{
               alert(error)
            })
            action.resetForm()
        }
    })

    const handleStatusChange = (e, id) => {
        const status = e.target.checked
        dispatch(EditStatusReasonCancellation({status , id}))
        .then(()=>{
            dispatch(getAllReasonCancellation())
        })
        .catch((error)=>{
            alert(error)
        })
    }

    return (
        <div className='sp_main sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>Reason For Cancellation</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / Reason For Cancellation</span></span>
                </div>
                <div className='d-flex flex-wrap '>
                    <div className='position-relative me-4 mt-3'>
                        <input type="text" value={searchInput} onChange={(e)=> setSearchInput(e.target.value)} className='ds_page_input' placeholder='Search... ' />
                        <img src={search} alt="" className='ds_page_icon' />
                    </div>
                    <a className='mt-3' href='#' onClick={() => setAddShow(true)}>
                        <div className='sp_Add_btn'><span>+ Add</span></div>
                    </a>
                </div>
                
            </div>
            <div className='sp_table'>
                <table className='w-100 '>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th className='sp_th_action'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((ele, ind) => {
                            return (
                                <tr key={ele?._id}>
                                    <td>{((currentPage - 1) * itemPerPage) + (ind + 1)}</td>
                                    <td>{ele?.reasonCancel}</td>
                                    <td><label className="sp_switch">
                                        <input type="checkbox" checked={ele?.status ? true : false} onChange={(e)=>handleStatusChange(e , ele?._id)}/>
                                            <span className="sp_slider sp_round"></span>
                                    </label></td>
                                    <td>
                                        <div className=' sp_table_action d-flex'>
                                            <div><img src={editImg} onClick={() => {setEditShow(true); setEditData(ele)}}></img></div>
                                            <div><img src={deleteImg} onClick={() => {setDeleteShow(true); setDeleteId(ele?._id)}}></img></div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION CODE */}
            <div className="py-3 d-flex justify-content-center justify-content-md-end">
                {renderPagination()}
            </div>
            {/* add role modal  */}
            <Modal
                show={addShow}
                onHide={() => setAddShow(false)}
                aria-labelledby="contained-modal-title-vcenter "
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <form onSubmit={createReasonCancelFormik.handleSubmit}>
                    <Modal.Body>
                        <h4 className='text-center'>Add Reason</h4>
                        <div className='spmodal_main_div'>
                            <small>Reason For Cancelllation</small><br></br>
                            <textarea placeholder='Enter reason for cancellation' name="reasonCancel" value={createReasonCancelFormik.values.reasonCancel}
                            onChange={createReasonCancelFormik.handleChange}
                            onBlur={createReasonCancelFormik.handleBlur}
                            ></textarea>
                            <p
                            className="text-danger mb-0 text-start ps-1 pt-1"
                            style={{ fontSize: "14px" }}
                            >
                            {createReasonCancelFormik.errors.reasonCancel}
                            </p>
                        </div>
                        <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                            <button  className='ds_user_cancel' onClick={() => setAddShow(false)}>Cancel</button>
                            <button className='ds_user_add'>Add</button>
                        </div>
                    </Modal.Body>
                </form>
            </Modal>

            {/* edit role modal  */}
            <Modal
                show={editShow}
                onHide={() => setEditShow(false)}
                aria-labelledby="contained-modal-title-vcenter "
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <form onSubmit={editReasonCancelFormik.handleSubmit}>
                <Modal.Body>

                    <h4 className='text-center'>Edit Reason</h4>
                    <div className='spmodal_main_div'>
                        <small>Reason For Cancelllation</small><br></br>
                        <textarea  name="reasonCancel" value={editReasonCancelFormik.values.reasonCancel}
                            onChange={editReasonCancelFormik.handleChange}
                            onBlur={editReasonCancelFormik.handleBlur}></textarea>
                            <p
                                className="text-danger mb-0 text-start ps-1 pt-1"
                                style={{ fontSize: "14px" }}
                                >
                                {editReasonCancelFormik.errors.reasonCancel}
                            </p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                       <button  className='ds_user_cancel' onClick={() => setEditShow(false)}>Cancel</button>
                       <button type='submit' className='ds_user_add'>Update</button>
                    </div>
                </Modal.Body>
                </form>
            </Modal>

            {/* delete Modal */}
            <Modal
                show={deleteShow}
                onHide={() => setDeleteShow(false)}
                aria-labelledby="contained-modal-title-vcenter "
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Delete</h4>
                    <div className='spmodal_main_div'>
                        <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete reason for cancellation ?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                       <button onclick={() => setDeleteShow(false)} className='ds_user_cancel'>Cancel</button>
                       <button onClick={handleDeleteRole} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default ReasonofCancellation
