import React, { useState, useEffect } from 'react'
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Offcanvas } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteSizeData, GetSizeData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SizeSlice'


const Size = () => {

const [show, setShow] = useState(false)
const [deletePopup, setDeletePopup] = useState(false)
const [currentPage,setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const navigate = useNavigate()
const dispatch = useDispatch()
const [data, setData] = useState([])
const [searchInput, setSearchInput] = useState("")
const [filteredData, setFilteredData] = useState([]);
const [filterMainCategory, setFilterMainCategory] = useState("");
const [filterCategory, setFilterCategory] = useState("");
const [filterSubCategory, setFilterSubCategory] = useState("");
const [filterSizeName, setFilterSizeName] = useState("");
const [deleteId, setdeleteId] = useState(null)

const sizeData = useSelector((state) => state.size.getsizeData)
console.log("sizeData", sizeData);

useEffect(()=>{
    dispatch(GetSizeData())
},[])

useEffect(() => {
    setFilteredData(sizeData || []);
}, [sizeData]);

var itemPerPage = 10;

useEffect(() => {
    // Filter by search input
    let filtered = filteredData?.filter((item) => {
        return (
            item?.sizeName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
            item?.mainCategoryId?.mainCategoryName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
            item?.categoryId?.categoryName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
            item?.subCategoryId?.subCategoryName?.toLowerCase().includes(searchInput?.toLowerCase()) ||
            item?.size?.toString().toLowerCase().includes(searchInput?.toLowerCase()) ||
            item?.unitId?.unitName?.toLowerCase().includes(searchInput?.toLowerCase()) 
        );
    });

    // Paginate filtered results
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    const paginatedData = filtered?.slice(startIndex, endIndex);
    setData(paginatedData);

    // Update totalPages based on filtered results
    setTotalPages(Math.ceil(filtered?.length / itemPerPage) || 1);
}, [currentPage, filteredData, searchInput]);

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

const handleApplyFilter = () => {
    let filtered = sizeData || [];

    if (filterMainCategory) {
        filtered = filtered.filter(item => item.mainCategoryId?._id === filterMainCategory);
    }
    if (filterCategory) {
        filtered = filtered.filter(item => item.categoryId?._id === filterCategory);
    }
    if (filterSubCategory) {
        filtered = filtered.filter(item => item.subCategoryId?._id === filterSubCategory);
    }
    if (filterSizeName) {
        filtered = filtered.filter(item => item.sizeName === filterSizeName);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
    setShow(false);
    setTotalPages(Math.ceil(filtered.length / itemPerPage) || 1);
};

const handleResetFilter = () => {
    setFilterMainCategory("");
    setFilterCategory("");
    setFilterSubCategory("");
    setFilterSizeName("");
    setFilteredData(sizeData || []);
    setCurrentPage(1);
    setShow(false);
    setTotalPages(Math.ceil((sizeData?.length || 0) / itemPerPage) || 1);
};

const handleDeleteUnit = () => {
    dispatch(DeleteSizeData(deleteId))
    .then((response)=>{
        if(response?.meta?.requestStatus === "fulfilled"){
            dispatch(GetSizeData());
            setDeletePopup(false);
        }
    })
}

  return (
    <div className='px-sm-4 px-3 mx-sm-3 sp_height pt-2'>
        <div className='d-flex flex-wrap justify-content-between'>
                <div className='mt-3'>
                   <h4 className='ds_600 mb-0'>Size</h4>
                   <p className='ds_text ds_font mb-0'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Size</span></p>
                </div>
                <div className='d-flex flex-wrap'>
                   <div className='position-relative me-4 mt-3'>
                        <input type="text" value={searchInput} onChange={(e)=> {setSearchInput(e.target.value); setCurrentPage(1);}} className='ds_page_input' placeholder='Search... ' />
                        <img src={search} alt="" className='ds_page_icon' />
                   </div>
                   <button onClick={()=> setShow(true)} className='ds_category_filter mt-3'><FaFilter className='me-1' /> Filter</button>
                   <div onClick={()=> navigate("/admin/addsize")} className="sp_Add_btn ds_cursor ds_btn_manage mt-3"><span>+ Add</span></div>
                </div>
        </div>

         <div className='ds_customer_table  overflow-x-auto position-relative mt-4'>
            <table className="w-100 ds_customer_manage">
                <thead className=''>
                    <tr className=''>
                        <th>ID</th>
                        <th>Main Category</th>
                        <th>Category</th>
                        <th>Sub Category</th>
                        <th>Size Name</th>
                        <th>Size</th>
                        <th>Unit</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item, index) => (
                        <tr key={index}>
                            <td>{((currentPage - 1) * 10) + ( index + 1 )}</td>
                            <td>{item.mainCategoryId?.mainCategoryName}</td>
                            <td>{item.categoryId?.categoryName}</td>
                            <td>{item.subCategoryId?.subCategoryName}</td>
                            <td>{item.sizeName}</td>
                            <td>{item.size}</td>
                            <td>{item.unitId?.unitName}</td>
                            <td>
                                <div className='sp_table_action d-flex'>
                                    <div onClick={()=> {navigate("/admin/editsize"); localStorage.setItem("Editid" , item._id)}}><img src={editImg} alt="edit" /></div>
                                    <div onClick={()=> {setDeletePopup(true); setdeleteId(item?._id)}}><img src={deleteImg} alt="delete" /></div>
                                </div>
                            </td>
                        </tr>
                    ))}
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
                      onChange={e => setFilterMainCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {[...new Map(sizeData?.map(item => [item.mainCategoryId?._id, item.mainCategoryId])).values()].map(mainCat => (
                        <option key={mainCat?._id} value={mainCat?._id}>
                          {mainCat?.mainCategoryName}
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
                      onChange={e => setFilterCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {sizeData?.map(item => (
                        <option key={item.categoryId?._id} value={item.categoryId?._id}>
                          {item.categoryId?.categoryName}
                        </option>
                      ))}
                    </select>
               </div>
               <div className="form-group mt-4">
                    <label className='ds_login_label' style={{fontSize:"15px"}}>Sub Category</label>
                    <select
                      className='ds_user_select w-100 mt-2'
                      style={{fontSize:"15px"}}
                      value={filterSubCategory}
                      onChange={e => setFilterSubCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {sizeData?.map(item => (
                        <option key={item.subCategoryId?._id} value={item.subCategoryId?._id}>
                          {item.subCategoryId?.subCategoryName}
                        </option>
                      ))}
                    </select>
               </div>
              <div className="form-group mt-4">
                 <label className='ds_login_label' style={{fontSize:"15px"}}>Size Name</label>
                 <select
                   className='ds_user_select w-100 mt-2'
                   style={{fontSize:"15px"}}
                   value={filterSizeName}
                   onChange={e => setFilterSizeName(e.target.value)}
                 >
                   <option value="">Select</option>
                   {[...new Set(sizeData?.map(item => item.sizeName))].map(name => (
                     <option key={name} value={name}>{name}</option>
                   ))}
                 </select>
              </div>
             <div className='mt-auto mb-2 d-flex justify-content-between '>
                <button onClick={handleResetFilter} className='ds_off_cancel'>Reset</button>
                <button onClick={handleApplyFilter} className='ds_off_apply'>Apply</button>
             </div>
           </div>
        </Offcanvas.Body>
        </Offcanvas>

        {/* **************** Delete Category *************** */}
        <Modal show={deletePopup} onHide={() => setDeletePopup(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Delete</h4>
                    <div className='spmodal_main_div'>
                      <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                       <button onClick={()=> setDeletePopup(false)} className='ds_user_cancel'>Cancel</button>
                       <button onClick={handleDeleteUnit} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
        </Modal>
    </div>
  )
}

export default Size
