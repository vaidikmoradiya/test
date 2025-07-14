import React, { useEffect, useState } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import search from '../Image/Savani/search_icon.svg'
import { editPrivacyPolicySchema, privacyPolicySchema } from '../Formik';
import { useFormik } from 'formik';
import { createPrivacyPolicy, DeletePrivacyPolicy, EditPrivacyPolicy, getAllPrivacyPolicy } from '../../Redux-Toolkit/ToolkitSlice/Admin/PrivacyPolicySlice';
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
    const totalPages = Math.ceil((getPrivacyPolicy?.length || 0) / itemPerPage);

    useEffect(() => {
        dispatch(getAllPrivacyPolicy());
    }, [])

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        const paginatedData = getPrivacyPolicy?.slice(startIndex, endIndex);
        let filter = paginatedData?.filter((element) => {
            const search = searchInput?.toLowerCase();
            return (
                String(element?.title || "").toLowerCase().includes(search) ||
                String(element?.description || "").toLowerCase().includes(search)
            );
        });
        setData(filter);
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
        description:""
    }

    const createPrivacyPolicyFormik = useFormik({
        initialValues: privacyPolicyVal,
        validationSchema: privacyPolicySchema,
        onSubmit: ((values, action) => {
            dispatch(createPrivacyPolicy(values)).then(() => {
                dispatch(getAllPrivacyPolicy());
                setAddShow(false);
            }).catch ((error) =>
                console.log(error)
            );
            action.resetForm();
        })
    })

    const editPrivacyPolicy = {
        title: editData?.title,
        description: editData?.description
    }

    const editPrivacyPolicyFormik = useFormik({
        enableReinitialize: true,
        initialValues: editPrivacyPolicy,
        validationSchema: editPrivacyPolicySchema,
        onSubmit: ((values, action) => {
            dispatch(EditPrivacyPolicy({ values, editData })).then(() => {
                dispatch(getAllPrivacyPolicy());
                setEditShow(false);
            }).catch ((error) =>
                console.log(error)
            );
            action.resetForm();
        })
    }) 

    const handleDeletePrivacyPolicy = () => {
        dispatch(DeletePrivacyPolicy(deleteId));
        setDeleteShow(false);
        dispatch(getAllPrivacyPolicy());
    }

    return (
        <div className='sp_main sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>Privacy Policy</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / Privacy Policy</span></span>
                </div>
                <div className='d-flex flex-wrap '>
                    <div className='position-relative me-4 mt-3'>
                       <input type="text" className='ds_page_input' placeholder='Search... ' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                       <img src={search} alt="" className='ds_page_icon' />
                    </div>
                    <Link className='mt-3 me-3' to='/admin/viewPrivacypolicy'>
                        <div className='sp_View_btn'><span>View</span></div>
                    </Link>
                    <Link className=' mt-3' href='#' onClick={() => setAddShow(true)} >
                        <div className='sp_Add_btn'><span>+ Add</span></div>
                    </Link>
                </div>

            </div>
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
                                    <td>{item?.title}</td>
                                    <td>{item?.description[0]?.length > 120 ? `${item?.description[0]?.slice(0, 120)}...` : item?.description[0] ?? ''}</td>
                                    <td>
                                        <div className=' sp_table_action d-flex'>
                                            <div><img src={editImg} onClick={() => {setEditShow(true); setEditData(item)}}></img></div>
                                            <div><img src={deleteImg} onClick={() => {setDeleteShow(true); setDeleteId(item._id)}}></img></div>
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
                <form onSubmit={createPrivacyPolicyFormik.handleSubmit}>
                <Modal.Body>
                    <h4 className='text-center'>Add Privacy Policy</h4>
                    <div className='spmodal_main_div'>
                        <small>Title</small><br></br>
                        <input type='text' placeholder='Enter Title' className='mb-4' 
                            name="title" value={createPrivacyPolicyFormik.values.title}
                            onChange={createPrivacyPolicyFormik.handleChange}
                            onBlur={createPrivacyPolicyFormik.handleBlur}
                        ></input>
                        <p
                            className="text-danger mb-0 text-start ps-1 pt-1"
                            style={{ fontSize: "14px" }}
                            >
                            {createPrivacyPolicyFormik.errors.title}
                        </p>
                        <small>Description</small><br></br>
                        <textarea placeholder='Enter Description'
                            name="description" value={createPrivacyPolicyFormik.values.description}
                            onChange={createPrivacyPolicyFormik.handleChange}
                            onBlur={createPrivacyPolicyFormik.handleBlur}
                        ></textarea>
                        <p
                            className="text-danger mb-0 text-start ps-1 pt-1"
                            style={{ fontSize: "14px" }}
                            >
                            {createPrivacyPolicyFormik.errors.description}
                        </p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button className='ds_user_cancel' onClick={() => setAddShow(false)}>Cancel</button>
                        <button type='submit' className='ds_user_add'>Add</button>
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
                <form onSubmit={editPrivacyPolicyFormik.handleSubmit}>
                <Modal.Body>
                    <h4 className='text-center'>Edit Privacy Policy</h4>
                    <div className='spmodal_main_div'>
                        <small>Title</small><br></br>
                        <input type='text' className='mb-4'
                            name="title" value={editPrivacyPolicyFormik.values.title}
                            onChange={editPrivacyPolicyFormik.handleChange}
                            onBlur={editPrivacyPolicyFormik.handleBlur}
                        ></input>
                        <p
                            className="text-danger mb-0 text-start ps-1 pt-1"
                            style={{ fontSize: "14px" }}
                            >
                            {editPrivacyPolicyFormik.errors.title}
                        </p>
                        <small>Description</small><br></br>
                        <textarea
                            name="description" value={editPrivacyPolicyFormik.values.description}
                            onChange={editPrivacyPolicyFormik.handleChange}
                            onBlur={editPrivacyPolicyFormik.handleBlur}
                        ></textarea>
                        <p
                            className="text-danger mb-0 text-start ps-1 pt-1"
                            style={{ fontSize: "14px" }}
                            >
                            {editPrivacyPolicyFormik.errors.description}
                        </p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button className='ds_user_cancel' onClick={() => setEditShow(false)}>Cancel</button>
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
                        <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Privacy Policy ?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button className='ds_user_cancel'>Cancel</button>
                        <button onClick={handleDeletePrivacyPolicy} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default PrivacyPolicy
