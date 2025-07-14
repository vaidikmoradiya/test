import React, { useState, useEffect } from 'react'
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6';
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Offcanvas } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteStockData, GetAllStock } from '../../Redux-Toolkit/ToolkitSlice/Admin/StockSlice';

const Stock = () => {

const [show, setShow] = useState(false)
const [deletePopup, setDeletePopup] = useState(false)
const [currentPage,setCurrentPage] = useState(1);
const [data, setData] = useState();
const [filteredData, setFilteredData] = useState([]);
const [deleteId, setDeleteId] = useState(null)
const itemPerPage = 10;
const dispatch = useDispatch()

const StockData = useSelector((state) => state.stock.StockData)
console.log("StockData",StockData);

// Filter state variables
const [searchInput, setSearchInput] = useState("");
const [filterMainCategory, setFilterMainCategory] = useState("");
const [filterCategory, setFilterCategory] = useState("");
const [filterSubCategory, setFilterSubCategory] = useState("");
const [filterProduct, setfilterProduct] = useState("");
const [filterStatus, setFilterStatus] = useState("");
// Temporary filter state variables (for Offcanvas UI)
const [tempFilterMainCategory, setTempFilterMainCategory] = useState("");
const [tempFilterCategory, setTempFilterCategory] = useState("");
const [tempFilterSubCategory, setTempFilterSubCategory] = useState("");
const [tempFilterProduct, setTempFilterProduct] = useState("");
const [tempFilterStatus, setTempFilterStatus] = useState("");

useEffect(() => {
    dispatch(GetAllStock())
}, [])

// Filtering logic
useEffect(() => {
    let filtered = StockData || [];
    if (searchInput && searchInput.trim() !== "") {
        filtered = filtered.filter((item) =>
            (item?.mainCategory?.mainCategoryName?.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.category?.categoryName?.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.subCategory?.subCategoryName?.toLowerCase().includes(searchInput.toLowerCase()) ||
            item?.product?.productName?.toLowerCase().includes(searchInput.toLowerCase()) ||
            (item?.qty && item?.qty.toString().toLowerCase().includes(searchInput.toLowerCase()))
            )
        );
    }
    if (filterMainCategory) {
        filtered = filtered.filter((item) =>
            item?.mainCategory?.mainCategoryName === filterMainCategory
        );
    }
    if (filterCategory) {
        filtered = filtered.filter((item) =>
            item?.category?.categoryName === filterCategory
        );
    }
    if (filterSubCategory) {
        filtered = filtered.filter((item) =>
            item?.subCategory?.subCategoryName === filterSubCategory
        );
    }
    if (filterProduct) {
        filtered = filtered.filter((item) =>
            item?.product?.productName === filterProduct
        );
    }
    if (filterStatus) {
        const statusValue = filterStatus === "Available" ? true : false;
        filtered = filtered.filter((item) =>
            (item?.qty > 0) === statusValue
        );
    }
    setFilteredData(filtered);
}, [StockData, searchInput, filterMainCategory, filterCategory, filterSubCategory, filterProduct, filterStatus]);

// Pagination
useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    setData(filteredData?.slice(startIndex, endIndex) || []);
}, [currentPage, filteredData]);

const totalPages = Math.ceil(filteredData.length / itemPerPage);

const navigate = useNavigate();

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

const handleDelete = () => {
    dispatch(DeleteStockData(deleteId))
    .then(()=>{
       dispatch(GetAllStock())
       setDeletePopup(false)
    })
    .catch((error)=>{
      alert(error)
    })
}

// Get unique values for dropdowns
const getUniqueMainCategories = () => {
    const categories = StockData?.map(item => item.mainCategory?.mainCategoryName).filter(Boolean) || [];
    return [...new Set(categories)];
};
const getUniqueCategories = () => {
    const categories = StockData?.map(item => item.category?.categoryName).filter(Boolean) || [];
    return [...new Set(categories)];
};
const getUniqueSubCategories = () => {
    const categories = StockData?.map(item => item.subCategory?.subCategoryName).filter(Boolean) || [];
    return [...new Set(categories)];
};

const getUniqueProduct = () => {
    const categories = StockData?.map(item => item.product?.productName).filter(Boolean) || [];
    return [...new Set(categories)];
};

// Filter functions
const handleFilterApply = () => {
    setFilterMainCategory(tempFilterMainCategory);
    setFilterCategory(tempFilterCategory);
    setFilterSubCategory(tempFilterSubCategory);
    setfilterProduct(tempFilterProduct);
    setFilterStatus(tempFilterStatus);
    setCurrentPage(1);
    setShow(false);
};
const handleFilterReset = () => {
    setFilterMainCategory("");
    setFilterCategory("");
    setFilterSubCategory("");
    setfilterProduct("");
    setFilterStatus("");
    setTempFilterMainCategory("");
    setTempFilterCategory("");
    setTempFilterSubCategory("");
    setTempFilterProduct("");
    setTempFilterStatus("");
    setCurrentPage(1);
    setShow(false);
};

  return (
    <div className=''>

<div className='px-sm-4 px-3 mx-sm-3 sp_height pt-2'>
        <div className='d-flex flex-wrap justify-content-between'>
                <div className='mt-3'>
                   <h4 className='ds_600 mb-0'>Stock</h4>
                   <p className='ds_text ds_font mb-0'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Stock</span></p>
                </div>
                <div className='d-flex flex-wrap'>
                   <div className='position-relative me-4 mt-3'>
                        <input type="text" className='ds_page_input' placeholder='Search... ' value={searchInput} onChange={e => { setSearchInput(e.target.value); setCurrentPage(1); }} />
                        <img src={search} alt="" className='ds_page_icon' />
                   </div>
                   <button onClick={()=> setShow(true)} className='ds_category_filter mt-3'><FaFilter className='me-1' /> Filter</button>
                   <div onClick={() =>navigate("/admin/addStock")} className="sp_Add_btn ds_cursor ds_btn_manage mt-3"><span>+ Add</span></div>
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
                        <th>Product</th>
                        <th>Qty.</th>
                        {/* <th>Stock Status</th> */}
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item, index) => (
                        <tr key={item.id + index}>
                            <td>{((currentPage - 1) * itemPerPage) + (index + 1)}</td>
                            <td>{item.mainCategory?.mainCategoryName}</td>
                            <td>{item.category?.categoryName}</td>
                            <td>{item.subCategory?.subCategoryName}</td>
                            <td>{item.product?.productName}</td>
                            <td>{item.qty}</td>
                            {/* <td>
                                <span className={item.stockStatus ? 'mv_in_stock' : 'mv_out_of_stock'}>
                                    {item.stockStatus==="In Stock" ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </td> */}
                            <td>
                                <div className='sp_table_action d-flex'>
                                    <div onClick={() => {navigate("/admin/editStock"); localStorage.setItem("Editid" , item._id)}}> <img src={editImg} alt="edit" /> </div>
                                    <div onClick={() => {setDeletePopup(true); setDeleteId(item?._id)}}> <img src={deleteImg} alt="delete" /> </div>
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
                        value={tempFilterMainCategory}
                        onChange={(e) => setTempFilterMainCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {getUniqueMainCategories().map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
               </div>
               <div className="form-group mt-4">
                    <label className='ds_login_label' style={{fontSize:"15px"}}>Category</label>
                    <select 
                        className='ds_user_select w-100 mt-2' 
                        style={{fontSize:"15px"}}
                        value={tempFilterCategory}
                        onChange={(e) => setTempFilterCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {getUniqueCategories().map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
               </div>
               <div className="form-group mt-4">
                    <label className='ds_login_label' style={{fontSize:"15px"}}>Sub Category</label>
                    <select 
                        className='ds_user_select w-100 mt-2' 
                        style={{fontSize:"15px"}}
                        value={tempFilterSubCategory}
                        onChange={(e) => setTempFilterSubCategory(e.target.value)}
                    >
                      <option value="">Select</option>
                      {getUniqueSubCategories().map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                      ))}
                    </select>
               </div>
              <div className="form-group mt-4">
                 <label className='ds_login_label' style={{fontSize:"15px"}}>Product</label>
                 <select 
                     className='ds_user_select w-100 mt-2' 
                     style={{fontSize:"15px"}}
                     value={tempFilterProduct}
                     onChange={(e) => setTempFilterProduct(e.target.value)}
                 >
                   <option value="">Select</option>
                   {getUniqueProduct().map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                      ))}
                 </select>
              </div>
             <div className='mt-auto mb-2 d-flex justify-content-between '>
                <button onClick={handleFilterReset} className='ds_off_cancel'>Reset</button>
                <button onClick={handleFilterApply} className='ds_off_apply'>Apply</button>
             </div>
           </div>
        </Offcanvas.Body>
        </Offcanvas>


        <Modal show={deletePopup} onHide={() => setDeletePopup(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Delete</h4>
                    <div className='spmodal_main_div'>
                      <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Nitish Shah ?</p>
                    </div>
                    <div className='d-flex justify-content-around py-2'>
                        <button type='submit' className='sp_cancle_btn' onClick={() => setDeletePopup(false)}>Cancel</button>
                        <button type='submit'  onClick={handleDelete} className='sp_add_btn'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>
    </div>

    
    
    </div>
  )
}

export default Stock
