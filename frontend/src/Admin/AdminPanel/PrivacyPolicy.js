import React, { useEffect, useState } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button, Alert } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import search from '../Image/Savani/search_icon.svg'
import { editPrivacyPolicySchema, privacyPolicySchema } from '../Formik';
import { useFormik } from 'formik';
import { createPrivacyPolicy, DeletePrivacyPolicy, EditPrivacyPolicy, getAllPrivacyPolicy, clearError } from '../../Redux-Toolkit/ToolkitSlice/Admin/PrivacyPolicySlice';
import { useDispatch, useSelector } from 'react-redux';


const PrivacyPolicy = () => {
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteId, setDeleteId] = useState(null);
    const [editData, setEditData] = useState("")
    const [searchInput, setSearchInput] = useState("");
    const [data, setData] = useState([]);
    var itemPerPage = 10;

    const dispatch = useDispatch();
    const getPrivacyPolicy = useSelector((state) => state?.privacyPolicy?.allPrivacyPolicy);
    const loading = useSelector((state) => state?.privacyPolicy?.loading);
    const error = useSelector((state) => state?.privacyPolicy?.error);
    const message = useSelector((state) => state?.privacyPolicy?.message);

    useEffect(() => {
        dispatch(getAllPrivacyPolicy());
    }, [dispatch])

    useEffect(() => {
        setCurrentPage(1)
    }, [searchInput])

    // Auto-hide success/error messages after 5 seconds
    useEffect(() => {
        if (message && !loading) {
            const timer = setTimeout(() => {
                dispatch(clearError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message, loading, dispatch]);

    const filteredPrivacyPolicy = getPrivacyPolicy?.filter((element) => {
        const search = searchInput?.toLowerCase();
        return (
            String(element?.title || "").toLowerCase().includes(search) ||
            String(element?.description || "").toLowerCase().includes(search)
        );
    })

    var totalPages = Math.ceil((filteredPrivacyPolicy?.length || 0) / itemPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        const filtered = getPrivacyPolicy?.filter((element) => {
            const search = searchInput?.toLowerCase();
            return (
                String(element?.title || "").toLowerCase().includes(search) ||
                String(element?.description || "").toLowerCase().includes(search)
            );
        })
        const paginatedData = filtered?.slice(startIndex, endIndex);
        setData(paginatedData);
    }, [currentPage, getPrivacyPolicy, searchInput]);

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


    const privacyPolicyVal = {
        title: "",
        description: ""
    }

    const createPrivacyPolicyFormik = useFormik({
        initialValues: privacyPolicyVal,
        validationSchema: privacyPolicySchema,
        onSubmit: ((values, action) => {
            // Convert description to array if it's a string
            const formattedValues = {
                ...values,
                description: Array.isArray(values.description) ? values.description : [values.description]
            };
            
            dispatch(createPrivacyPolicy(formattedValues)).then(() => {
                dispatch(getAllPrivacyPolicy());
                setAddShow(false);
                action.resetForm();
            }).catch((error) => {
                console.log(error);
            });
        })
    })

    const editPrivacyPolicy = {
        title: editData?.title || "",
        description: editData?.description || ""
    }

    const editPrivacyPolicyFormik = useFormik({
        enableReinitialize: true,
        initialValues: editPrivacyPolicy,
        validationSchema: editPrivacyPolicySchema,
        onSubmit: ((values, action) => {
            // Convert description to array if it's a string
            const formattedValues = {
                ...values,
                description: Array.isArray(values.description) ? values.description : [values.description]
            };
            
            dispatch(EditPrivacyPolicy({ values: formattedValues, editData })).then(() => {
                dispatch(getAllPrivacyPolicy());
                setEditShow(false);
                action.resetForm();
            }).catch((error) => {
                console.log(error);
            });
        })
    }) 

    const handleDeletePrivacyPolicy = () => {
        dispatch(DeletePrivacyPolicy(deleteId));
        setDeleteShow(false);
        dispatch(getAllPrivacyPolicy());
    }

    const handleEditClick = (item) => {
        setEditData(item);
        setEditShow(true);
    }

    const handleAddClick = () => {
        setAddShow(true);
        createPrivacyPolicyFormik.resetForm();
    }

    const handleCloseModal = (modalType) => {
        if (modalType === 'add') {
            setAddShow(false);
            createPrivacyPolicyFormik.resetForm();
        } else if (modalType === 'edit') {
            setEditShow(false);
            editPrivacyPolicyFormik.resetForm();
        } else if (modalType === 'delete') {
            setDeleteShow(false);
        }
        dispatch(clearError());
    }

    return (
        <div className='sp_main sp_height pt-2'>
            {/* Success/Error Messages */}
            {message && (
                <Alert 
                    variant={error ? 'danger' : 'success'} 
                    onClose={() => dispatch(clearError())}
                    dismissible
                    className='mb-3'
                >
                    {message}
                </Alert>
            )}

            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>Privacy Policy</h4>
                    <span><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link><span> / Privacy Policy</span></span>
                </div>
                <div className='d-flex flex-wrap '>
                    <div className='position-relative me-4 mt-3'>
                       <input type="text" className='ds_page_input' placeholder='Search... ' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                       <img src={search} alt="" className='ds_page_icon' />
                    </div>
                    <Link className='mt-3 me-3' to='/admin/viewPrivacypolicy'>
                        <div className='sp_View_btn'><span>View</span></div>
                    </Link>
                    <div className='mt-3' onClick={handleAddClick}>
                        <div className='sp_Add_btn' style={{cursor: 'pointer'}}><span>+ Add</span></div>
                    </div>
                </div>

            </div>
            {loading ? (
                <div className='text-center py-5'>
                    <div className='spinner-border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </div>
                </div>
            ) : searchInput.trim() && (data?.length === 0) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>No data available</div>
                </div>
            ) : (
                <div className='sp_table'>
                    <table className='w-100 '>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th className='sp_th_action'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item, index) => {
                                return (
                                    <tr key={item?._id}>
                                        <td>{((currentPage - 1) * itemPerPage) + (index + 1)}</td>
                                        <td>{item?.title || 'No Title'}</td>
                                        <td>
                                            {Array.isArray(item?.description) ? 
                                                (item?.description[0]?.length > 120 ? 
                                                    `${item?.description[0]?.slice(0, 120)}...` : 
                                                    item?.description[0] || 'No Description'
                                                ) : 
                                                (item?.description?.length > 120 ? 
                                                    `${item?.description?.slice(0, 120)}...` : 
                                                    item?.description || 'No Description'
                                                )
                                            }
                                        </td>
                                        <td>
                                            <div className=' sp_table_action d-flex'>
                                                <div><img src={editImg} onClick={() => handleEditClick(item)} alt="Edit" style={{cursor: 'pointer'}} /></div>
                                                <div><img src={deleteImg} onClick={() => {setDeleteShow(true); setDeleteId(item._id)}} alt="Delete" style={{cursor: 'pointer'}} /></div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* PAGINATION CODE */}
            {!searchInput.trim() && (filteredPrivacyPolicy?.length > 0) && (
                <div className="py-3 d-flex justify-content-center justify-content-md-end">
                    {renderPagination()}
                </div>
            )}
            {/* add role modal  */}
            <Modal
                show={addShow}
                onHide={() => handleCloseModal('add')}
                aria-labelledby="contained-modal-title-vcenter "
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <form onSubmit={createPrivacyPolicyFormik.handleSubmit}>
                <Modal.Body>
                    <h4 className='text-center'>Add Privacy Policy</h4>
                    <div className='spmodal_main_div'>
                        <small>Title <span className='text-danger'>*</span></small><br></br>
                        <input 
                            type='text' 
                            placeholder='Enter Title' 
                            className='mb-4' 
                            name="title" 
                            value={createPrivacyPolicyFormik.values.title}
                            onChange={createPrivacyPolicyFormik.handleChange}
                            onBlur={createPrivacyPolicyFormik.handleBlur}
                        />
                        {createPrivacyPolicyFormik.touched.title && createPrivacyPolicyFormik.errors.title && (
                            <p className="text-danger mb-0 text-start ps-1 pt-1" style={{ fontSize: "14px" }}>
                                {createPrivacyPolicyFormik.errors.title}
                            </p>
                        )}
                        <small>Description <span className='text-danger'>*</span></small><br></br>
                        <textarea 
                            placeholder='Enter Description'
                            name="description" 
                            value={createPrivacyPolicyFormik.values.description}
                            onChange={createPrivacyPolicyFormik.handleChange}
                            onBlur={createPrivacyPolicyFormik.handleBlur}
                            rows="4"
                        />
                        {createPrivacyPolicyFormik.touched.description && createPrivacyPolicyFormik.errors.description && (
                            <p className="text-danger mb-0 text-start ps-1 pt-1" style={{ fontSize: "14px" }}>
                                {createPrivacyPolicyFormik.errors.description}
                            </p>
                        )}
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button type='button' className='ds_user_cancel' onClick={() => handleCloseModal('add')}>Cancel</button>
                        <button type='submit' className='ds_user_add' disabled={loading}>Add</button>
                    </div>
                </Modal.Body>
                </form>
            </Modal>

            {/* edit role modal  */}
            <Modal
                show={editShow}
                onHide={() => handleCloseModal('edit')}
                aria-labelledby="contained-modal-title-vcenter "
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <form onSubmit={editPrivacyPolicyFormik.handleSubmit}>
                <Modal.Body>
                    <h4 className='text-center'>Edit Privacy Policy</h4>
                    <div className='spmodal_main_div'>
                        <small>Title <span className='text-danger'>*</span></small><br></br>
                        <input 
                            type='text' 
                            className='mb-4'
                            name="title" 
                            value={editPrivacyPolicyFormik.values.title}
                            onChange={editPrivacyPolicyFormik.handleChange}
                            onBlur={editPrivacyPolicyFormik.handleBlur}
                        />
                        {editPrivacyPolicyFormik.touched.title && editPrivacyPolicyFormik.errors.title && (
                            <p className="text-danger mb-0 text-start ps-1 pt-1" style={{ fontSize: "14px" }}>
                                {editPrivacyPolicyFormik.errors.title}
                            </p>
                        )}
                        <small>Description <span className='text-danger'>*</span></small><br></br>
                        <textarea
                            name="description" 
                            value={editPrivacyPolicyFormik.values.description}
                            onChange={editPrivacyPolicyFormik.handleChange}
                            onBlur={editPrivacyPolicyFormik.handleBlur}
                            rows="4"
                        />
                        {editPrivacyPolicyFormik.touched.description && editPrivacyPolicyFormik.errors.description && (
                            <p className="text-danger mb-0 text-start ps-1 pt-1" style={{ fontSize: "14px" }}>
                                {editPrivacyPolicyFormik.errors.description}
                            </p>
                        )}
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button type='button' className='ds_user_cancel' onClick={() => handleCloseModal('edit')}>Cancel</button>
                        <button type='submit' className='ds_user_add' disabled={loading}>Update</button>
                    </div>
                </Modal.Body>
                </form>
            </Modal>

            {/* delete Modal */}
            <Modal
                show={deleteShow}
                onHide={() => handleCloseModal('delete')}
                aria-labelledby="contained-modal-title-vcenter "
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Delete</h4>
                    <div className='spmodal_main_div'>
                        <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Privacy Policy ?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button type='button' className='ds_user_cancel' onClick={() => handleCloseModal('delete')}>Cancel</button>
                        <button onClick={handleDeletePrivacyPolicy} className='ds_user_add' disabled={loading}>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PrivacyPolicy
