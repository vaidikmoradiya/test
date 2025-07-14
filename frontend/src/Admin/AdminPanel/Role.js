import React, { useEffect, useState } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { useFormik } from 'formik';
import { RoleSchema } from '../Formik';
import { useDispatch, useSelector } from 'react-redux';
import { CreateRole, DeleteRole, EditRole, GetRoleData } from '../../Redux-Toolkit/ToolkitSlice/Admin/RoleSlice';

const Role = () => {
    const [addShow, setAddShow] =useState(false);
    const [editShow, setEditShow] =useState(false);
    const [deleteShow, setDeleteShow] =useState(false);
    const [currentPage,setCurrentPage] = useState(1);
    const roleData = useSelector((state)=> state?.role?.roleData)
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const [editData, setEditData] = useState("")
    const [deleteId, setDeleteId] = useState(null)

    useEffect(()=>{
        dispatch(GetRoleData())
    },[])

    var itemPerPage = 10;
    
    var totalPages = Math.ceil(roleData.length / itemPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;   // 0 * 10
        const endIndex = startIndex + itemPerPage;            // 0 + 10
        const paginatedData = roleData?.slice(startIndex, endIndex);
        setData(paginatedData);
    }, [currentPage, roleData]);

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

    const roleVal = {
       roleName:""
    }

    const CreateRollFormik = useFormik({
       initialValues:roleVal,
       validationSchema:RoleSchema,
       onSubmit:(values , action)=>{
          dispatch(CreateRole(values))
          .then(()=>{
            dispatch(GetRoleData())
            setAddShow(false)
          })
          .catch((error)=>{
            alert(error)
          })
          action.resetForm()
       }
    })

    const editRoleVal = {
        roleName:editData?.roleName
    }
    
    const EditRoleFormik = useFormik({
        enableReinitialize: true,
        initialValues:editRoleVal,
        validationSchema:RoleSchema,
        onSubmit:(values , action)=>{
           dispatch(EditRole({values , editData}))
           .then(()=>{
              setEditShow(false)
              dispatch(GetRoleData())
           }).catch((error)=>{
              alert(error)
           })
           action.resetForm()
        }
    })

    const handleDeleteRole = () => {
       dispatch(DeleteRole(deleteId))
       setDeleteShow(false)
       dispatch(GetRoleData())
    }

   
    return (
        <div className='sp_main sp_height'>
            <div className='d-flex justify-content-between align-items-center'>
                <div >
                    <h4>Role</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / Role</span></span>

                </div>
                <a href='#' onClick={() => setAddShow(true)}>
                    <div className='sp_Add_btn'><span>+ Add</span></div>
                </a>
            </div>
            <div className='sp_table'>
                <table className='w-100'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th className='sp_th_action'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((element , index)=>{
                            return(
                                <tr key={element?._id}>
                                   <td>{((currentPage - 1) * 10) + ( index + 1 )}</td>
                                   <td>{element?.roleName}</td>
                                   <td>
                                       <div className=' sp_table_action d-flex'>
                                           <div onClick={() => {setEditShow(true) ; setEditData(element)}}><img src={editImg} ></img></div>
                                           <div onClick={()=> {setDeleteShow(true); setDeleteId(element?._id)}}><img src={deleteImg} ></img></div>
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
                    <h4 className='text-center'>Add Role</h4>
                    <form onSubmit={CreateRollFormik.handleSubmit}>
                      <div className='spmodal_main_div'>
                          <small>Name</small><br></br>
                          <input type='text' name='roleName' value={CreateRollFormik.values.roleName} onChange={CreateRollFormik.handleChange} onBlur={CreateRollFormik.handleBlur} className='mb-1' placeholder='Enter name'></input>
                          {CreateRollFormik.touched.roleName && CreateRollFormik.errors.roleName && (<div className="ds_forget">{CreateRollFormik.errors.roleName}</div>)}
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
                    <h4 className='text-center'>Edit Role</h4>
                    <form onSubmit={EditRoleFormik.handleSubmit}>
                      <div className='spmodal_main_div'>
                          <small>Name</small><br></br>
                          <input type='text' name='roleName' value={EditRoleFormik.values.roleName} onChange={EditRoleFormik.handleChange} onBlur={EditRoleFormik.handleBlur}></input>
                          {EditRoleFormik.touched.roleName && EditRoleFormik.errors.roleName && (<div className="ds_forget">{EditRoleFormik.errors.roleName}</div>)}
                      </div>
                      <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                         <button type='button'  className='ds_user_cancel' onClick={() => setEditShow(false)}>Cancel</button>
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
                       <button onClick={()=> setDeleteShow(false)} className='ds_user_cancel'>Cancel</button>
                       <button onClick={handleDeleteRole} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Role
