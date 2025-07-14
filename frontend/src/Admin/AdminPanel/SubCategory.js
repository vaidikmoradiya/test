import React, { useEffect, useState } from 'react'
import { Modal, Offcanvas } from 'react-bootstrap'
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6'
import editImg from '../Image/Sujal/edit.svg'
import { useDispatch, useSelector } from 'react-redux'
import deleteImg from '../Image/Sujal/delete.svg'
import { IoClose } from 'react-icons/io5'
import search from '../Image/Savani/search_icon.svg'
import { useFormik } from 'formik'
import { CreateSubCateData, DeleteSubCateData, EditStatusSubCateData, EditSubCateData, GetSubCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice'
import { SubCateSchema } from '../Formik'
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice'
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice'

const SubCategory = () => {

const [deletePopup, setDeletePopup] = useState(false)
const [show, setShow] = useState(false)
const [addPopup, setAddPopup] = useState(false)
const [editPopup, setEditPopup] = useState(false)
const [currentPage,setCurrentPage] = useState(1);
const [filterMainCategory, setFilterMainCategory] = useState("")
const [filterCategory, setFilterCategory] = useState("")
const [filterStatus, setFilterStatus] = useState("")
const [filteredData, setFilteredData] = useState([])
const [data, setData] = useState([])
const [totalPages, setTotalPages] = useState(1)
const dispatch = useDispatch()
const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
const cateMap = useSelector((state)=> state?.category?.getCategoryData)
const subCateData = useSelector((state)=> state?.subcategory?.getSubCategoryData)
const [editData, setEditData] = useState("")
const [deleteId, setDeleteId] = useState(null)
const [searchInput, setSearchInput] = useState("")
const [filteredCategories, setFilteredCategories] = useState([]);
const [filteredEditCategories, setFilteredEditCategories] = useState([]);
const [filteredFilterCategories, setFilteredFilterCategories] = useState([]);

useEffect(()=>{
    dispatch(GetCateData())
    dispatch(GetMainCateData())
    dispatch(GetSubCateData())
},[])

var itemPerPage = 10;

useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    
    // First filter all data based on search
    let filtered = filteredData?.filter((element) => {
        return element?.subCategoryName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
               element?.mainCategoryData[0]?.mainCategoryName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
               element?.categoryData[0]?.categoryName?.toLowerCase().includes(searchInput?.toLowerCase())
    });
    
    // Then apply pagination to the filtered results
    const paginatedData = filtered?.slice(startIndex, endIndex);
    setData(paginatedData);
    
    // Update total pages based on filtered results
    const newTotalPages = Math.ceil(filtered?.length / itemPerPage);
    setTotalPages(newTotalPages);
    
    // Reset to page 1 if current page is greater than new total pages
    if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(1);
    }
}, [currentPage, filteredData, searchInput]);

useEffect(() => {
    setFilteredData(subCateData || []);
    // Reset to page 1 when data changes
    setCurrentPage(1);
}, [subCateData]);

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

const createSubCateVal = {
    mainCateId:"",
    cateName:"",
    SubcateName:"",
}
const CreateSubCateFormik = useFormik({
    initialValues:createSubCateVal,
    validationSchema:SubCateSchema,
    onSubmit:(values , action)=>{
        dispatch(CreateSubCateData(values))
        .then((response)=>{
            if(response?.meta?.requestStatus === "fulfilled"){
                setAddPopup(false)
                dispatch(GetSubCateData())
            }
        })
        action.resetForm()
    }
})

useEffect(() => {
    if (CreateSubCateFormik.values.mainCateId) {
        setFilteredCategories(
            cateMap?.filter(
                (cat) => cat.mainCategoryId === CreateSubCateFormik.values.mainCateId
            ) || []
        );
    } else {
        setFilteredCategories([]);
    }
}, [CreateSubCateFormik.values.mainCateId, cateMap]);

const editCateVal = {
    mainCateId:editData?.mainCategoryId,
    cateName:editData?.categoryId,
    SubcateName:editData?.subCategoryName,
}

const EditSubCateFormik = useFormik({
    enableReinitialize: true,
    initialValues:editCateVal,
    validationSchema:SubCateSchema,
    onSubmit:(values , action)=>{
        dispatch(EditSubCateData({values, id:editData?._id}))
        .then((response)=>{
            if(response?.meta?.requestStatus === "fulfilled"){
                setEditPopup(false)
                dispatch(GetSubCateData())
            }
        })
        action.resetForm()
    }
})

useEffect(() => {
    if (EditSubCateFormik.values.mainCateId) {
        setFilteredEditCategories(
            cateMap?.filter(
                (cat) => cat.mainCategoryId === EditSubCateFormik.values.mainCateId
            ) || []
        );
    } else {
        setFilteredEditCategories([]);
    }
}, [EditSubCateFormik.values.mainCateId, cateMap]);

const handleDelete = () => {
    dispatch(DeleteSubCateData(deleteId))
    .then(()=>{
       dispatch(GetSubCateData())
       setDeletePopup(false)
    })
    .catch((error)=>{
      alert(error)
    })
}

const handleStatusChange = (e, id) => {
    const status = e.target.checked
    dispatch(EditStatusSubCateData({status , id}))
    .then(()=>{
        dispatch(GetSubCateData())
    })
    .catch((error)=>{
        alert(error)
    })
}

const handleApplyFilter = () => {
    let filtered = [...subCateData];
    
    if (filterMainCategory) {
        filtered = filtered.filter(item => 
            item.mainCategoryData[0]?._id === filterMainCategory
        );
    }
    
    if (filterCategory) {
        filtered = filtered.filter(item => 
            item.categoryData[0]?._id === filterCategory
        );
    }
    
    if (filterStatus !== "") {
        const statusValue = filterStatus === "Available";
        filtered = filtered.filter(item => item.status === statusValue);
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
    setShow(false);
};

const handleResetFilter = () => {
    setFilterMainCategory("");
    setFilterCategory("");
    setFilterStatus("");
    setFilteredData(subCateData || []);
    setCurrentPage(1);
    setShow(false);
};

useEffect(() => {
    if (filterMainCategory) {
        setFilteredFilterCategories(
            cateMap?.filter(
                (cat) => cat.mainCategoryId === filterMainCategory
            ) || []
        );
    } else {
        setFilteredFilterCategories([]);
    }
}, [filterMainCategory, cateMap]);

  return (
    <div className='px-sm-4 px-3 mx-sm-3 sp_height pt-2'>
         <div className='d-flex flex-wrap justify-content-between '>
                <div className='mt-3'>
                   <h4 className='ds_600 mb-0'>Sub Category</h4>
                   <p className='ds_text ds_font mb-0'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Sub Category</span></p>
                </div>
                <div className='d-flex flex-wrap'>
                   <div className='position-relative me-4 mt-3'>
                        <input type="text" value={searchInput} onChange={(e)=> setSearchInput(e.target.value)} className='ds_page_input' placeholder='Search... ' />
                        <img src={search} alt="" className='ds_page_icon' />
                   </div>
                   <button onClick={()=> setShow(true)} className='ds_category_filter mt-3'><FaFilter className='me-1' /> Filter</button>
                   <div onClick={()=> setAddPopup(true)} className="sp_Add_btn ds_cursor ds_btn_manage mt-3"><span>+ Add</span></div>
                </div>
        </div>
        <div className='ds_customer_table  overflow-x-auto position-relative mt-4'>
            <table className="w-100 ds_customer_manage">
                <thead className=''>
                    <tr className=''>
                        <th>ID</th>
                        <th>Main Category</th>
                        <th>Category</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {data?.map((element , index)=>{
                    return(
                        <tr key={element?._id}>
                            <td>{((currentPage - 1) * 10) + ( index + 1 )}</td>
                            <td>{element?.mainCategoryData[0]?.mainCategoryName}</td>
                            <td>{element?.categoryData[0]?.categoryName}</td>
                            <td>{element?.subCategoryName}</td>
                            <td>
                                <label className="sp_switch">
                                    <input type="checkbox" checked={element?.status ? true : false} onChange={(e)=>handleStatusChange(e , element?._id)}/>
                                    <span className="sp_slider sp_round"></span>
                                </label>
                            </td>
                            <td>
                                <div className='sp_table_action d-flex'>
                                    <div onClick={()=> {setEditPopup(true); setEditData(element)}}><img src={editImg} ></img></div>
                                    <div onClick={()=> {setDeletePopup(true); setDeleteId(element?._id)}}><img src={deleteImg}></img></div>
                                </div>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
  
        <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end ">
            {renderPagination()}
        </div>

        {/* ************ Offcanvas *************** */}
        <Offcanvas show={show} onHide={()=> setShow(false)} className="ds_offcanvas" placement='end' >
        <Offcanvas.Header className='d-flex justify-content-between px-3 mx-2' style={{borderBottom:" 1px solid rgba(20, 20, 20, 0.2)"}}>
          <Offcanvas.Title className='ds_600'>Filter</Offcanvas.Title>
          <IoClose onClick={()=> setShow(false)} className='fs-4 ds_cursor' />
        </Offcanvas.Header>
        <Offcanvas.Body className='px-3 mx-2'>
           <div className='d-flex flex-column h-100'>
              <div className="form-group mt-2">
                    <label className='ds_login_label' style={{fontSize:"15px"}}>Main Category</label>
                    <select 
                        className='ds_user_select w-100 mt-2' 
                        style={{fontSize:"15px"}}
                        value={filterMainCategory}
                        onChange={(e) => setFilterMainCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {mainCateData?.map((element) => (
                          <option key={element._id} value={element._id}>
                              {element.mainCategoryName}
                          </option>
                      ))}
                    </select>
               </div>
               <div className="form-group mt-4">
                    <label className='ds_login_label' style={{fontSize:"15px"}}>Category</label>
                    <select 
                        className='ds_user_select w-100 mt-2' 
                        style={{fontSize:"15px"}}
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {filteredFilterCategories?.map((element) => (
                          <option key={element._id} value={element._id}>
                              {element.categoryName}
                          </option>
                      ))}
                    </select>
               </div>
              <div className="form-group mt-4">
                 <label className='ds_login_label' style={{fontSize:"15px"}}>Status</label>
                 <select 
                     className='ds_user_select w-100 mt-2' 
                     style={{fontSize:"15px"}}
                     value={filterStatus}
                     onChange={(e) => setFilterStatus(e.target.value)}
                 >
                   <option value="">Select</option>
                   <option value="Available">Available</option>
                   <option value="Unavailable">Unavailable</option>
                 </select>
              </div>
             <div className='mt-auto mb-2 d-flex justify-content-between '>
                <button onClick={handleResetFilter} className='ds_off_cancel'>Reset</button>
                <button onClick={handleApplyFilter} className='ds_off_apply'>Apply</button>
             </div>
           </div>
        </Offcanvas.Body>
        </Offcanvas>

        {/* ************ Add Category *************** */}
        <Modal show={addPopup} onHide={() => setAddPopup(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <h4 className='text-center'>Add Sub Category</h4>
                <form onSubmit={CreateSubCateFormik.handleSubmit}>
                    <div className='mx-sm-3 mx-1'>
                        <div className="form-group  mt-4 pt-3">
                            <label className='ds_login_label' style={{fontSize:"15px"}}>Main Category</label>
                            <select name='mainCateId' value={CreateSubCateFormik?.values.mainCateId} onChange={CreateSubCateFormik?.handleChange} onBlur={CreateSubCateFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="" disabled>Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateSubCateFormik.touched.mainCateId && CreateSubCateFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSubCateFormik.errors.mainCateId}</div>
                            )}
                        </div>
                        <div className="form-group  mt-4 ">
                            <label className='ds_login_label' style={{fontSize:"15px"}}>Category</label>
                            <select name='cateName' value={CreateSubCateFormik?.values.cateName} onChange={CreateSubCateFormik?.handleChange} onBlur={CreateSubCateFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredCategories?.map((element) => (
                                    <option value={element?._id}>{element?.categoryName}</option>
                                ))}
                            </select>
                            {CreateSubCateFormik.touched.cateName && CreateSubCateFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSubCateFormik.errors.cateName}</div>
                            )}
                        </div>
                        <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Sub Category</label>
                            <input type="text" name='SubcateName' value={CreateSubCateFormik.values?.SubcateName} onChange={CreateSubCateFormik?.handleChange} onBlur={CreateSubCateFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter category' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {CreateSubCateFormik.touched.SubcateName && CreateSubCateFormik.errors.SubcateName && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSubCateFormik.errors.SubcateName}</div>
                        )}
                    </div>   
                    <div className='d-flex justify-content-center py-2 mt-sm-5 mt-4'>
                        <button type='button' onClick={()=> setAddPopup(false)} className='ds_user_cancel'>Cancel</button>
                        <button type='submit' className='ds_user_add'>Add</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>

        {/* ************ Edit Category *************** */}
        <Modal show={editPopup} onHide={() => setEditPopup(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>
                <h4 className='text-center'>Edit Sub Category</h4>
                <form onSubmit={EditSubCateFormik.handleSubmit}>
                    <div className='mx-sm-3 mx-1'>
                        <div className="form-group  mt-4 pt-3">
                            <label className='ds_login_label' style={{fontSize:"15px"}}>Main Category</label>
                            <select name='mainCateId' value={EditSubCateFormik?.values.mainCateId} onChange={EditSubCateFormik?.handleChange} onBlur={EditSubCateFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="" disabled>Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {EditSubCateFormik.touched.mainCateId && EditSubCateFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSubCateFormik.errors.mainCateId}</div>
                            )}
                        </div>
                        <div className="form-group  mt-4 ">
                            <label className='ds_login_label' style={{fontSize:"15px"}}>Category</label>
                            <select name='cateName' value={EditSubCateFormik?.values.cateName} onChange={EditSubCateFormik?.handleChange} onBlur={EditSubCateFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredEditCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.categoryName}</option>
                                    )
                                })}
                            </select>
                            {EditSubCateFormik.touched.cateName && EditSubCateFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSubCateFormik.errors.cateName}</div>
                            )}
                        </div>
                        <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Sub Category</label>
                            <input type="text" name='SubcateName' value={EditSubCateFormik.values?.SubcateName} onChange={EditSubCateFormik?.handleChange} onBlur={EditSubCateFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter category' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {EditSubCateFormik.touched.SubcateName && EditSubCateFormik.errors.SubcateName && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSubCateFormik.errors.SubcateName}</div>
                        )}
                    </div>   
                    <div className='d-flex justify-content-center py-2 mt-sm-5 mt-4'>
                        <button type='button' onClick={()=> setEditPopup(false)} className='ds_user_cancel'>Cancel</button>
                        <button type='submit' className='ds_user_add'>Upadte</button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>

         {/* **************** Delete Category *************** */}
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
                       <button onClick={handleDelete} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
         </Modal>
    </div>
  )
}

export default SubCategory
