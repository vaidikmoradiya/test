import React, { useEffect, useState, useRef } from 'react'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6'
import { Modal, Offcanvas } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { CreateCateData, DeleteCateData, EditCateData, EditStatusCateData, GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice'
import search from '../Image/Savani/search_icon.svg'
import { useFormik } from 'formik'
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice'
import { CateSchema } from '../Formik'

const Category = () => {

const [deletePopup, setDeletePopup] = useState(false)
const [show, setShow] = useState(false)
const [addPopup, setAddPopup] = useState(false)
const [editPopup, setEditPopup] = useState(false)
const [currentPage,setCurrentPage] = useState(1);
const [filterMainCategory, setFilterMainCategory] = useState("")
const [filterStatus, setFilterStatus] = useState("")
const [filteredData, setFilteredData] = useState([])
const dispatch = useDispatch()
const cateMap = useSelector((state)=> state?.category?.getCategoryData)
console.log("cateMap",cateMap);

const [data, setData] = useState([])
const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
const [editData, setEditData] = useState("")
const [deleteId, setDeleteId] = useState(null)
const [searchInput, setSearchInput] = useState("")
const [totalPages, setTotalPages] = useState(1);
const [selectedAddImages, setSelectedAddImages] = useState([]);
const [selectedEditImages, setSelectedEditImages] = useState([]);
const addFileInputRef = useRef(null);
const editFileInputRef = useRef(null);
const [fileName, setFileName] = useState("Choose Image");
const Back_URL = 'http://localhost:5000/'

useEffect(()=>{
  dispatch(GetCateData())
},[])

useEffect(()=>{
    dispatch(GetMainCateData())
},[])

var itemPerPage = 10;

useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    
    // First filter all data based on search
    let filtered = filteredData?.filter((element) => {
        return element?.categoryName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
               element?.mainCategoryData[0]?.mainCategoryName?.toLowerCase().includes(searchInput?.toLowerCase())
    });
    
    // Then apply pagination to the filtered results
    const paginatedData = filtered?.slice(startIndex, endIndex);
    setData(paginatedData);
    
    // Update total pages based on filtered results
    setTotalPages(Math.ceil(filtered?.length / itemPerPage));
}, [currentPage, filteredData, searchInput]);

useEffect(() => {
    setFilteredData(cateMap || []);
}, [cateMap]);

useEffect(() => {
  if (editData && editData.image) {
    // If image is a string, convert to array
    const imagesArray = Array.isArray(editData.image) ? editData.image : [editData.image];
    const existingImages = imagesArray.map((imgPath, index) => {
      // Remove 'public/image/' and any prefix before the actual file name
      const fileName = imgPath.split('/').pop().replace(/^\d+-/, '');
      return {
        name: fileName,
        path: imgPath,
        isExisting: true
      };
    });
    setSelectedEditImages(existingImages);
  } else {
    setSelectedEditImages([]);
  }
}, [editData]);

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

const handleApplyFilter = () => {
    let filtered = [...cateMap];
    
    if (filterMainCategory) {
        filtered = filtered.filter(item => 
            item.mainCategoryData[0]?._id === filterMainCategory
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
    setFilterStatus("");
    setFilteredData(cateMap || []);
    setCurrentPage(1);
    setShow(false);
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

const handleAddBrowseClick = () => {
  addFileInputRef.current.click();
};

const handleEditBrowseClick = () => {
  editFileInputRef.current.click();
};

const handleAddImageSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    const file = files[0];
    const newImage = [{
      name: file.name,
      file: file,
      isExisting: false
    }];
    setSelectedAddImages(newImage);
    CreateCateFormik.setFieldValue('img', newImage);
  }
};

const handleEditImageSelect = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    const file = files[0];
    const newImage = [{
      name: file.name,
      file: file,
      isExisting: false
    }];
    setSelectedEditImages(newImage);
    EditCateFormik.setFieldValue && EditCateFormik.setFieldValue('img', newImage);
  }
};

const removeAddImage = (index) => {
  const newImages = selectedAddImages.filter((_, i) => i !== index);
  setSelectedAddImages(newImages);
  CreateCateFormik.setFieldValue('img', newImages);
};

const removeEditImage = (index) => {
  const newImages = selectedEditImages.filter((_, i) => i !== index);
  setSelectedEditImages(newImages);
  EditCateFormik.setFieldValue && EditCateFormik.setFieldValue('img', newImages);
};

const createCateVal = {
    mainCateId:"",
    cateName:"",
    img: []
}
const CreateCateFormik = useFormik({
    initialValues:createCateVal,
    validationSchema:CateSchema,
    onSubmit:(values , action)=>{
        const imageData = selectedAddImages.map(img => {
            if (img.isExisting) {
                return img.path;
            } else {
                return img.file;
            }
        });
        const submitData = {
            ...values,
            img: imageData
        };
        dispatch(CreateCateData(submitData))
        .then((response)=>{
            if(response?.meta?.requestStatus === "fulfilled"){
                setAddPopup(false)
                dispatch(GetCateData())
                setSelectedAddImages([]);
            }
        })
        action.resetForm()
    }
})

const editCateVal = {
    mainCateId:editData?.mainCategoryId,
    cateName:editData?.categoryName,
    img: editData?.image || []
}

const EditCateFormik = useFormik({
    enableReinitialize: true,
    initialValues:editCateVal,
    validationSchema:CateSchema,
    onSubmit:(values , action)=>{
        const imageData = selectedEditImages.map(img => {
            if (img.isExisting) {
                return img.path;
            } else {
                return img.file;
            }
        });
        const submitData = {
            ...values,
            img: imageData
        };
        dispatch(EditCateData({values: submitData, id:editData?._id}))
        .then((response)=>{
            if(response?.meta?.requestStatus === "fulfilled"){
                setEditPopup(false)
                dispatch(GetCateData())
                setSelectedEditImages([]);
            }
        })
        action.resetForm()
    }
})

const handleDelete = () => {
    dispatch(DeleteCateData(deleteId))
    .then(()=>{
       dispatch(GetCateData())
       setDeletePopup(false)
    })
    .catch((error)=>{
      alert(error)
    })
 }

 const handleStatusChange = (e, id) => {
    const status = e.target.checked
    dispatch(EditStatusCateData({status , id}))
    .then(()=>{
        dispatch(GetCateData())
    })
    .catch((error)=>{
        alert(error)
    })
}

  return (
    <div className='px-sm-4 px-3 mx-sm-3 sp_height pt-2'>
         <div className='d-flex flex-wrap justify-content-between  '>
                <div className='mt-3'>
                   <h4 className='ds_600 mb-0'>Category</h4>
                   <p className='ds_text ds_font mb-0'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Category</span></p>
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
                        <th>Image</th>
                        <th>Main Category</th>
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
                               <td className='sp_table_img'><img src={`${Back_URL}${element.image}`}/></td>
                               <td>{element?.mainCategoryData[0]?.mainCategoryName}</td>
                               <td>{element?.categoryName}</td>
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
                <h4 className='text-center'>Add Category</h4>
                <form onSubmit={CreateCateFormik.handleSubmit}>
                    <div className='mx-sm-3 mx-1'>
                        <div className="form-group  mt-4 pt-3">
                            <label className='ds_login_label' style={{fontSize:"15px"}}>Main Category</label>
                            <select name='mainCateId' value={CreateCateFormik?.values.mainCateId} onChange={CreateCateFormik?.handleChange} onBlur={CreateCateFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="" disabled>Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateCateFormik.touched.mainCateId && CreateCateFormik.errors.mainCateId && (
                                    <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateCateFormik.errors.mainCateId}</div>
                            )}
                        </div>
                        <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Category</label>
                            <input type="text" name='cateName' value={CreateCateFormik.values?.cateName} onChange={CreateCateFormik?.handleChange} onBlur={CreateCateFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter category' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {CreateCateFormik.touched.cateName && CreateCateFormik.errors.cateName && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateCateFormik.errors.cateName}</div>
                        )}
                        <div className="form-group position-relative mt-4">
                            <label className='ds_login_label' >Image</label>
                            <div style={{ background: '#1414140F', borderRadius: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: "4px", padding: "8px 12px", minHeight: "40px" }}>
                              {selectedAddImages.map((image, index) => (
                                <div key={index} 
                                  style={{ 
                                    background: '#14141426', 
                                    borderRadius: '2px',
                                    padding: '0px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    }}>
                                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      {image.isExisting ? image.name : image.name}
                                  </span>
                                  <span style={{ color: 'red', marginLeft: 8, fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} onClick={() => removeAddImage(index)}>✕</span>
                                </div>
                              ))}
                            </div>
                            <input
                              type="file"
                              ref={addFileInputRef}
                              name="img"
                              accept="image/*"
                              onBlur={CreateCateFormik.handleBlur}
                              onChange={handleAddImageSelect}
                              className='d-none'
                            />
                            <div className='ds_user_browse ds_cursor' onClick={handleAddBrowseClick}>Browse</div>
                        </div>
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
                <h4 className='text-center'>Edit Category</h4>
                <form onSubmit={EditCateFormik.handleSubmit}>
                    <div className='mx-sm-3 mx-1'>
                        <div className="form-group  mt-4 pt-3">
                            <label className='ds_login_label' style={{fontSize:"15px"}}>Main Category</label>
                            <select name='mainCateId' value={EditCateFormik?.values.mainCateId} onChange={EditCateFormik?.handleChange} onBlur={EditCateFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="" disabled>Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                       <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {EditCateFormik.touched.mainCateId && EditCateFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditCateFormik.errors.mainCateId}</div>
                            )}
                        </div>
                        <div className="form-group mt-4 ">
                            <label className='ds_popup_label'>Category</label>
                            <input type="text" name='cateName' value={EditCateFormik.values?.cateName} onChange={EditCateFormik?.handleChange} onBlur={EditCateFormik.handleBlur} className="form-control ds_popup_input mt-1" placeholder='Enter category' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {EditCateFormik.touched.cateName && EditCateFormik.errors.cateName && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditCateFormik.errors.cateName}</div>
                        )}
                        <div className="form-group position-relative mt-4">
                            <label className='ds_login_label' >Image</label>
                            <div style={{ background: '#1414140F', borderRadius: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: "4px", padding: "8px 12px", minHeight: "40px" }}>
                              {selectedEditImages.map((image, index) => (
                                <div key={index} 
                                  style={{ 
                                    background: '#14141426', 
                                    borderRadius: '2px',
                                    padding: '0px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                    }}>
                                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                      {image.isExisting ? image.name : image.name}
                                  </span>
                                  <span style={{ color: 'red', marginLeft: 8, fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} onClick={() => removeEditImage(index)}>✕</span>
                                </div>
                              ))}
                            </div>
                            <input
                              type="file"
                              ref={editFileInputRef}
                              name="img"
                              accept="image/*"
                              onBlur={EditCateFormik.handleBlur}
                              onChange={handleEditImageSelect}
                              className='d-none'
                            />
                            <div className='ds_user_browse ds_cursor' onClick={handleEditBrowseClick}>Browse</div>
                        </div>
                    </div>   
                    <div className='d-flex justify-content-center py-2 mt-sm-5 mt-4'>
                        <button type='button' onClick={()=> setEditPopup(false)} className='ds_user_cancel'>Cancel</button>
                        <button type='submit' className='ds_user_add'>Update</button>
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

export default Category
