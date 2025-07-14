import React, { useEffect, useState } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import search from '../Image/Savani/search_icon.svg'
import { useFormik } from 'formik';
import { FaqSchema } from '../Formik';
import { useDispatch, useSelector } from 'react-redux';
import { createFaq, DeleteFaq, EditFaq, getAllFaq } from '../../Redux-Toolkit/ToolkitSlice/Admin/FaqSlice';
import { GetFaqCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/FaqCategorySlice';

const FAQs = () => {
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");

    const [deleteId, setDeleteId] = useState(null);
    const [editData, setEditData] = useState("")
    const [data, setData] = useState([])

    const dispatch = useDispatch();
    const getFaq = useSelector((state) => state?.faq?.allFaq);
    console.log("getFaq",getFaq);

    const faqCateData = useSelector((state)=> state?.faqcategory?.getFaqCategoryData)
    // console.log("faqCateData",faqCateData);
    
    useEffect(() => {
     dispatch(getAllFaq());
     dispatch(GetFaqCateData())
    }, [])

    var itemPerPage = 10;
    var totalPages = Math.ceil(getFaq?.length / itemPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        const paginatedData = getFaq?.slice(startIndex, endIndex);
        let filter = paginatedData?.filter((element) => {
            return element?.faqQuestion?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                   element?.faqAnswer?.toLowerCase().includes(searchInput?.toLowerCase())
        })
        setData(filter);
    }, [currentPage, getFaq, searchInput]);

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


    const faqVal = {
        faqQuestion: "",
        faqAnswer: "",
        categoryName: "",
    }

    const createFaqFormik = useFormik({
        initialValues:faqVal,
        validationSchema: FaqSchema,
        onSubmit: ((values, action) => {
            dispatch(createFaq(values)) 
            .then(() => {
                dispatch(getAllFaq());
                setAddShow(false);
            }).catch ((error) =>
                console.log(error)
            );
            action.resetForm();
        })
    });

    const editFaqVal = {
        faqQuestion: editData?.faqQuestion,
        faqAnswer: editData?.faqAnswer,
        categoryName: editData?.categoryId?._id,
    }

    const editFaqFormik = useFormik({
        enableReinitialize: true,
        initialValues: editFaqVal,
        validationSchema: FaqSchema,
        onSubmit:((values, action) => {
            dispatch(EditFaq({values,editData})).then(() => {
                dispatch(getAllFaq());
                setEditShow(false);
            }).catch((error) => {
                alert(error)
            })
            action.resetForm();
        })
    });

    const handleDeleteFaq = () => {
        dispatch(DeleteFaq(deleteId));
        setDeleteShow(false);
        dispatch(getAllFaq());
    }

    return (
        <div className='sp_main sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>FAQ's</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / FAQ's</span></span>
                </div>
                <div className='d-flex flex-wrap  '>
                    <div className='position-relative me-4 mt-3'>
                        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className='ds_page_input' placeholder='Search... ' />
                       <img src={search} alt="" className='ds_page_icon' />
                    </div>
                    <Link className='mt-3 me-3' to='/admin/viewfaqs'>
                        <div className='sp_View_btn'><span>View</span></div>
                    </Link>
                    <Link className='mt-3 ' href='#' onClick={() => setAddShow(true)} >
                        <div className='sp_Add_btn'><span>+ Add</span></div>
                    </Link>
                </div>

            </div>
            <div className='sp_table'>
                <table className='w-100 '>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>FAQ's Category</th>
                            <th>FAQ's Question</th>
                            <th>Answer</th>
                            <th className='sp_th_action'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            return (
                                <tr key={item._id}>
                                    <td>{((currentPage - 1) * 10) + (index + 1)}</td>
                                    <td>{item.categoryId.categoryName}</td>
                                    <td>{item.faqQuestion?.length > 120 ? `${item.faqQuestion?.slice(0, 120)}...` : item.faqQuestion}</td>
                                    <td>{item.faqAnswer?.length > 120 ? `${item.faqAnswer?.slice(0, 120)}...` : item.faqAnswer}</td>
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
                <form onSubmit={createFaqFormik.handleSubmit}>
                    <Modal.Body>
                        <h4 className='text-center'>Add FAQ's</h4>
                        <div className='spmodal_main_div'>
                            <div className="form-group  mb-4 pt-3">
                                <label className='ds_login_label' style={{fontSize:"15px"}}>FaqCategory</label>
                                <select name='categoryName' value={createFaqFormik?.values.categoryName} onChange={createFaqFormik?.handleChange} onBlur={createFaqFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                    <option value="" disabled>Select FaqCategory</option>
                                    {faqCateData?.map((element)=>{
                                        return(
                                            <option value={element?._id}>{element?.categoryName}</option>
                                        )
                                    })}
                                </select>
                                {createFaqFormik.touched.categoryName && createFaqFormik.errors.categoryName && (
                                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{createFaqFormik.errors.categoryName}</div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <small>FAQ Question</small><br></br>
                                <input type='text' placeholder='Enter question' className='mb-0'
                                    name="faqQuestion" value={createFaqFormik.values.faqQuestion}
                                    onChange={createFaqFormik.handleChange}
                                    onBlur={createFaqFormik.handleBlur}
                                ></input>
                                <p
                                className="text-danger mb-0 text-start ps-1 pt-1"
                                style={{ fontSize: "14px" }}
                                >
                                {createFaqFormik.errors.faqQuestion}
                                </p>
                            </div>
                            <div className='mb-3'>
                                <small>Answer</small><br></br>
                                <textarea placeholder='Enter answer' className='mb-0'
                                    name="faqAnswer" value={createFaqFormik.values.faqAnswer}
                                    onChange={createFaqFormik.handleChange}
                                    onBlur={createFaqFormik.handleBlur}
                                ></textarea>
                                <p
                                className="text-danger mb-0 text-start ps-1 pt-1"
                                style={{ fontSize: "14px" }}
                                >
                                {createFaqFormik.errors.faqAnswer}
                                </p>
                            </div>
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
                <form onSubmit={editFaqFormik.handleSubmit}>
                    <Modal.Body>
                        <h4 className='text-center'>Edit FAQ's</h4>
                        <div className='spmodal_main_div'>
                            <div className="form-group  mb-4 pt-3">
                                <label className='ds_login_label' style={{fontSize:"15px"}}>FaqCategory</label>
                                <select name='categoryName' value={editFaqFormik?.values.categoryName} onChange={editFaqFormik?.handleChange} onBlur={editFaqFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                    <option value="" disabled>Select FaqCategory</option>
                                    {faqCateData?.map((element)=>{
                                        return(
                                            <option value={element?._id}>{element?.categoryName}</option>
                                        )
                                    })}
                                </select>
                                {editFaqFormik.touched.categoryName && editFaqFormik.errors.categoryName && (
                                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{editFaqFormik.errors.categoryName}</div>
                                )}
                            </div>
                            <div className='mb-3'>
                                <small>FAQ Question</small><br></br>
                                <input type='text' className='mb-0'
                                    name="faqQuestion" value={editFaqFormik.values.faqQuestion}
                                    onChange={editFaqFormik.handleChange}
                                    onBlur={editFaqFormik.handleBlur}
                                ></input>
                                <p
                                className="text-danger mb-0 text-start ps-1 pt-1"
                                style={{ fontSize: "14px" }}
                                >
                                {editFaqFormik.errors.faqQuestion}
                                </p>
                            </div>
                            <div className='mb-3'>
                                <small>Answer</small><br></br>
                                <textarea className='mb-0'
                                    name="faqAnswer" value={editFaqFormik.values.faqAnswer}
                                    onChange={editFaqFormik.handleChange}
                                    onBlur={editFaqFormik.handleBlur}
                                ></textarea>
                                <p
                                className="text-danger mb-0 text-start ps-1 pt-1"
                                style={{ fontSize: "14px" }}
                                >
                                {editFaqFormik.errors.faqAnswer}
                                </p>
                            </div>
                        </div>
                        <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                            <button className='ds_user_cancel' onClick={() => setEditShow(false)}>Cancel</button>
                            <button className='ds_user_add'>Update</button>
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
                        <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete FAQ's ?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button className='ds_user_cancel'  onClick={() => setDeleteShow(false)}>Cancel</button>
                        <button onClick={handleDeleteFaq} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default FAQs
