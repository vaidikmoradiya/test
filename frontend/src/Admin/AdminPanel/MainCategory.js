import React, { useEffect, useState } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { CreateMainCate, DeleteMainCate, EditMainCate, EditStatusMainCate, GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice';
import { useFormik } from 'formik';
import { MainCateSchema } from '../Formik';
import search from '../Image/Savani/search_icon.svg'


const MainCategory = () => {

    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [editData, setEditData] = useState("")
    const [deleteId, setDeleteId] = useState(null)
    const [searchInput, setSearchInput] = useState("")

    useEffect(()=>{
        dispatch(GetMainCateData())
    },[])
   
    var itemPerPage = 10;
    var totalPages = Math.ceil(mainCateData?.length / itemPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;   // 0 * 10
        const endIndex = startIndex + itemPerPage;            // 0 + 10
        const paginatedData = mainCateData?.slice(startIndex, endIndex);
        let filter = paginatedData?.filter((element)=>{
          return  element?.mainCategoryName?.toLowerCase().includes(searchInput?.toLowerCase())
        })
        setData(filter);
    }, [currentPage, mainCateData , searchInput]);


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

    const mainCateVal = {
        mainCategoryName:""
    }

    const CreateMainCateFormik = useFormik({
        initialValues:mainCateVal,
        validationSchema:MainCateSchema,
        onSubmit:(values , action)=>{
            dispatch(CreateMainCate(values))
            .then(()=>{
                dispatch(GetMainCateData())
                setAddShow(false)
            }).catch((error)=>{
                alert(error)
            })
            action.resetForm()
        }
    })

    const editMainCateVal = {
        mainCategoryName:editData?.mainCategoryName
    }

    const EditMainCateFormik = useFormik({
        enableReinitialize: true,
        initialValues:editMainCateVal,
        validationSchema:MainCateSchema,
        onSubmit:(values , action)=>{
            dispatch(EditMainCate({values , editData}))
            .then(()=>{
               dispatch(GetMainCateData())
               setEditShow(false)
            }).catch((error)=>{
               alert(error)
            })

            action.resetForm()
        }
    })

    const handleStatusChange = (e, id) => {
        const status = e.target.checked
        dispatch(EditStatusMainCate({status , id}))
        .then(()=>{
            dispatch(GetMainCateData())
        })
        .catch((error)=>{
            alert(error)
        })
    }
     
    const handleDelete = () => {
       dispatch(DeleteMainCate(deleteId))
       .then(()=>{
          dispatch(GetMainCateData())
          setDeleteShow(false)
       })
       .catch((error)=>{
         alert(error)
       })
    }

    return (
        <div className='sp_main sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>Main Category</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / Main Category</span></span>

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
                <table className='w-100'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th className='sp_th_action'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((element , index)=>{
                            return(
                                <tr key={element?._id}>
                                   <td>{((currentPage - 1) * 10) + ( index + 1 )}</td>
                                   <td>{element?.mainCategoryName}</td>
                                   <td><label className="sp_switch">
                                       <input type="checkbox" checked={element?.status ? true : false} onChange={(e)=>handleStatusChange(e , element?._id)}/>
                                           <span className="sp_slider sp_round"></span>
                                   </label></td>
                                   <td>
                                       <div className=' sp_table_action d-flex'>
                                           <div onClick={() => {setEditShow(true); setEditData(element)}}><img src={editImg} ></img></div>
                                           <div onClick={() => {setDeleteShow(true); setDeleteId(element?._id)}}><img src={deleteImg} ></img></div>
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
                <Modal.Body>
                    <h4 className='text-center'>Add Main Category</h4>
                    <form onSubmit={CreateMainCateFormik.handleSubmit}>
                       <div className='spmodal_main_div'>
                           <small>Main Category</small><br></br>
                           <input className='mb-1' type='text' name='mainCategoryName' value={CreateMainCateFormik.values.mainCategoryName} onChange={CreateMainCateFormik.handleChange} onBlur={CreateMainCateFormik.handleBlur} placeholder='Enter main category'></input>
                           {CreateMainCateFormik.touched.mainCategoryName && CreateMainCateFormik.errors.mainCategoryName && (<div className="ds_forget">{CreateMainCateFormik.errors.mainCategoryName}</div>)}
                       </div>
                       <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                          <button type='button' className='ds_user_cancel' onClick={() => setAddShow(false)}>Cancel</button>
                          <button type='submit' className='ds_user_add'>Add</button>
                       </div>
                    </form>
                </Modal.Body>
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
                <Modal.Body>
                    <h4 className='text-center'>Edit Main Category</h4>
                    <form onSubmit={EditMainCateFormik.handleSubmit}>
                      <div className='spmodal_main_div'>
                          <small>Main Category</small><br></br>
                          <input className='mb-1' type='text' name='mainCategoryName' value={EditMainCateFormik.values.mainCategoryName} onChange={EditMainCateFormik.handleChange} onBlur={EditMainCateFormik.handleBlur}></input>
                          {EditMainCateFormik.touched.mainCategoryName && EditMainCateFormik.errors.mainCategoryName && (<div className="ds_forget">{EditMainCateFormik.errors.mainCategoryName}</div>)}
                      </div>
                      <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                         <button type='button' className='ds_user_cancel' onClick={() => setEditShow(false)}>Cancel</button>
                         <button type='submit' className='ds_user_add'>Update</button>
                      </div>
                    </form>
                </Modal.Body>
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
                        <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Nitish Shah ?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                       <button  className='ds_user_cancel' onClick={() => setDeleteShow(false)}>Cancel</button>
                       <button onClick={handleDelete} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default MainCategory
