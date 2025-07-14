import React, { useEffect, useState } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { CreateUnitData, DeleteUnitData, EditUnitData, EditUnitStatusData, GetUnitData } from '../../Redux-Toolkit/ToolkitSlice/Admin/UnitSlice';
import { useFormik } from 'formik';
import { UnitSchema } from '../Formik';
import '../Css/Savani.css'
import { EditMainCate } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice';
import search from '../Image/Savani/search_icon.svg'

const Unit = () => {

    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch()
    const unitMap = useSelector((state)=> state?.unit?.getUnitData)
    const [data, setData] = useState([])
    const [editData, setEditData] = useState("")
    const [deleteId, setdeleteId] = useState(null)
     
    useEffect(()=>{
       dispatch(GetUnitData())
    },[])

    var itemPerPage = 10;
    var totalPages = Math.ceil(unitMap?.length / itemPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;   // 0 * 10
        const endIndex = startIndex + itemPerPage;            // 0 + 10
        const paginatedData = unitMap?.slice(startIndex, endIndex);
        setData(paginatedData);
    }, [currentPage, unitMap]);

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

    const addUnitVal = {
        unitName:"",
        shortName:""
    }
    const CreateUnitFormik = useFormik({
        initialValues:addUnitVal,
        validationSchema:UnitSchema,
        onSubmit:(values , action)=>{
           dispatch(CreateUnitData(values))
           .then(()=>{
               dispatch(GetUnitData())
               setAddShow(false)
           })
           action.resetForm()
        }
    })

    const editUnitVal = {
        unitName:editData?.unitName,
        shortName:editData?.shortName
    }
    const EditUnitFormik = useFormik({
        enableReinitialize: true,
        initialValues:editUnitVal,
        validationSchema:UnitSchema,
        onSubmit:(values , action)=>{
           dispatch(EditUnitData({values , editData}))
           .then(()=>{
              dispatch(GetUnitData())
              setEditShow(false)
           }) 
           action.resetForm();
        }
    })

    const handleChangeStatus = (e , id) => {
       const status = e.target.checked
       dispatch(EditUnitStatusData({status , id}))
       .then(()=>{
         dispatch(GetUnitData())
       })
    }

    const handleDeleteUnit = () => {
        dispatch(DeleteUnitData(deleteId))
        .then((response) => {
            dispatch(GetUnitData());
            setDeleteShow(false);
            setdeleteId(null);
        })
        .catch((error) => {
            alert("Failed to delete unit. Please try again.");
        });
    }

    return (
        <div className='sp_main sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>Unit</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / Unit</span></span>

                </div>
                <div className='d-flex flex-wrap '>
                   <div className='position-relative me-4 mt-3'>
                        <input type="text" className='ds_page_input' placeholder='Search... ' />
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
                            <th>Short Name</th>
                            <th>Status</th>
                            <th className='sp_th_action'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((element , index)=>{
                            return(
                                <tr key={element?._id}>
                                   <td>{((currentPage - 1) * 10) + ( index + 1 )}</td>
                                   <td>{element?.unitName}</td>
                                   <td>{element?.shortName}</td>
                                   <td><label className="sp_switch">
                                       <input type="checkbox" checked={element?.status ? true : false} onChange={(e)=> handleChangeStatus(e , element?._id)}/>
                                           <span className="sp_slider sp_round"></span>
                                   </label></td>
                                   <td>
                                       <div className=' sp_table_action d-flex'>
                                           <div onClick={() => {setEditShow(true); setEditData(element)}}><img src={editImg} ></img></div>
                                           <div onClick={() => {setDeleteShow(true); setdeleteId(element?._id)}}><img src={deleteImg} ></img></div>
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
                    <h4 className='text-center'>Add Unit</h4>
                    <form onSubmit={CreateUnitFormik.handleSubmit} className='mx-sm-3 mx-1'>
                       <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Name</label>
                            <input type="text" name='unitName' value={CreateUnitFormik.values.unitName} onChange={CreateUnitFormik.handleChange} onBlur={CreateUnitFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            {CreateUnitFormik.touched.unitName && CreateUnitFormik.errors.unitName && (<div className="ds_forget mt-1">{CreateUnitFormik.errors.unitName}</div>)}
                       </div>
                       <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Short Name</label>
                            <input type="text" name='shortName' value={CreateUnitFormik.values.shortName} onChange={CreateUnitFormik.handleChange} onBlur={CreateUnitFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter short name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            {CreateUnitFormik.touched.shortName && CreateUnitFormik.errors.shortName && (<div className="ds_forget mt-1">{CreateUnitFormik.errors.shortName}</div>)}
                       </div>
                        <div className='d-flex justify-content-center py-2 mt-sm-5 mt-3 '>
                           <button type='button' onClick={()=> setAddShow(false)}  className='ds_user_cancel'>Cancel</button>
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
                    <h4 className='text-center'>Edit Unit</h4>
                    <form onSubmit={EditUnitFormik.handleSubmit} className='mx-sm-3 mx-1'>
                       <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Name</label>
                            <input type="text" name='unitName' value={EditUnitFormik.values.unitName} onChange={EditUnitFormik.handleChange} onBlur={EditUnitFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            {EditUnitFormik.touched.unitName && EditUnitFormik.errors.unitName && (<div className="ds_forget mt-1">{EditUnitFormik.errors.unitName}</div>)}
                       </div>
                       <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Short Name</label>
                            <input type="text" name='shortName' value={EditUnitFormik.values.shortName} onChange={EditUnitFormik.handleChange} onBlur={EditUnitFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter short name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            {EditUnitFormik.touched.shortName && EditUnitFormik.errors.shortName && (<div className="ds_forget mt-1">{EditUnitFormik.errors.shortName}</div>)}
                       </div>
                        <div className='d-flex justify-content-center py-2 mt-sm-5 mt-3 '>
                           <button type='button' onClick={()=> setEditShow(false)}  className='ds_user_cancel'>Cancel</button>
                           <button type='submit' className='ds_user_add'>Add</button>
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
                    <h4 className='text-center'>Delete Unit</h4>
                    <div className='spmodal_main_div'>
                        <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete this unit?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                       <button className='ds_user_cancel' onClick={() => setDeleteShow(false)}>Cancel</button>
                       <button className='ds_user_add' onClick={handleDeleteUnit}>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Unit
