import React, { useState, useEffect } from 'react'
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import imagePro from '../Image/Savani/product.png'
import eye from '../Image/Savani/eye.svg'
import { Modal, Offcanvas } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useNavigate } from 'react-router-dom'
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { GetAllProduct, EditStatusProductData, DeleteProductData } from '../../Redux-Toolkit/ToolkitSlice/User/ProductSlice'

const Products = () => {

    const [show, setShow] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [value, setValue] = useState(50);
    const [range, setRange] = useState([100, 50000]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [data, setData] = useState()
    const [filteredData, setFilteredData] = useState([])
    const [searchInput, setSearchInput] = useState("")
    const [deleteId, setDeleteId] = useState(null)

    // Filter state variables
    const [filterMainCategory, setFilterMainCategory] = useState("")
    const [filterCategory, setFilterCategory] = useState("")
    const [filterSubCategory, setFilterSubCategory] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [filterPriceRange, setFilterPriceRange] = useState([100, 50000])

    // Temporary filter state variables (for UI selections)
    const [tempFilterMainCategory, setTempFilterMainCategory] = useState("")
    const [tempFilterCategory, setTempFilterCategory] = useState("")
    const [tempFilterSubCategory, setTempFilterSubCategory] = useState("")
    const [tempFilterStatus, setTempFilterStatus] = useState("")
    const [tempFilterPriceRange, setTempFilterPriceRange] = useState([100, 50000])

    const Back_URL = 'http://localhost:5000/'

    const ProductData = useSelector((state) => state.product.allProductData)
    console.log("ProductData", ProductData);

    useEffect(() => {
        dispatch(GetAllProduct())
    }, [])

    // Filter ProductData based on search and filters, then set filteredData
    useEffect(() => {
        let filtered = ProductData || [];

        // Search filter (on multiple fields)
        if (searchInput && searchInput.trim() !== "") {
            filtered = filtered.filter((element) =>
            (element?.mainCategoryData[0]?.mainCategoryName?.toLowerCase().includes(searchInput.toLowerCase()) ||
                element?.categoryData[0]?.categoryName?.toLowerCase().includes(searchInput.toLowerCase()) ||
                element?.subCategoryData[0]?.subCategoryName?.toLowerCase().includes(searchInput.toLowerCase()) ||
                element?.productName?.toLowerCase().includes(searchInput.toLowerCase()) ||
                (element?.price && element?.price.toString().toLowerCase().includes(searchInput.toLowerCase()))
            )
            );
        }

        // Other filters
        if (filterMainCategory) {
            filtered = filtered.filter((element) =>
                element?.mainCategoryData[0]?.mainCategoryName === filterMainCategory
            );
        }
        if (filterCategory) {
            filtered = filtered.filter((element) =>
                element?.categoryData[0]?.categoryName === filterCategory
            );
        }
        if (filterSubCategory) {
            filtered = filtered.filter((element) =>
                element?.subCategoryData[0]?.subCategoryName === filterSubCategory
            );
        }
        if (filterStatus) {
            const statusValue = filterStatus === "Available" ? true : false;
            filtered = filtered.filter((element) =>
                element?.status === statusValue
            );
        }
        if (filterPriceRange[0] !== 100 || filterPriceRange[1] !== 50000) {
            filtered = filtered.filter((element) =>
                element?.price >= filterPriceRange[0] && element?.price <= filterPriceRange[1]
            );
        }
        setFilteredData(filtered);
    }, [ProductData, searchInput, filterMainCategory, filterCategory, filterSubCategory, filterStatus, filterPriceRange]);

    // Paginate filteredData
    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        setData(filteredData?.slice(startIndex, endIndex) || []);
    }, [currentPage, filteredData]);

    var itemPerPage = 10;
    var totalPages = Math.ceil(filteredData?.length / itemPerPage);

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

    // Filter functions
    const handleFilterApply = () => {
        setFilterMainCategory(tempFilterMainCategory);
        setFilterCategory(tempFilterCategory);
        setFilterSubCategory(tempFilterSubCategory);
        setFilterStatus(tempFilterStatus);
        setFilterPriceRange(tempFilterPriceRange);
        setCurrentPage(1);
        setShow(false);
    };

    const handleFilterReset = () => {
        setFilterMainCategory("");
        setFilterCategory("");
        setFilterSubCategory("");
        setFilterStatus("");
        setFilterPriceRange([100, 50000]);

        // Reset temporary states
        setTempFilterMainCategory("");
        setTempFilterCategory("");
        setTempFilterSubCategory("");
        setTempFilterStatus("");
        setTempFilterPriceRange([100, 50000]);
        setRange([100, 50000]);
        setCurrentPage(1);
        setShow(false);
    };

    // Get unique values for dropdowns
    const getUniqueMainCategories = () => {
        const categories = ProductData?.map(item => item.mainCategoryData[0]?.mainCategoryName).filter(Boolean) || [];
        return [...new Set(categories)];
    };

    const getUniqueCategories = () => {
        const categories = ProductData?.map(item => item.categoryData[0]?.categoryName).filter(Boolean) || [];
        return [...new Set(categories)];
    };

    const getUniqueSubCategories = () => {
        const categories = ProductData?.map(item => item.subCategoryData[0]?.subCategoryName).filter(Boolean) || [];
        return [...new Set(categories)];
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


    const MIN = 100;
    const MAX = 50000;
    const STEP = 5;

    const handleDelete = () => {
        dispatch(DeleteProductData(deleteId))
            .then(() => {
                dispatch(GetAllProduct())
                setDeletePopup(false)
            })
            .catch((error) => {
                alert(error)
            })
    }

    const handleStatusChange = (e, id) => {
        const status = e.target.checked
        console.log(status);

        dispatch(EditStatusProductData({ status, id }))
            .then(() => {
                dispatch(GetAllProduct())
            })
            .catch((error) => {
                alert(error)
            })
    }

    return (
        <div className='px-sm-4 px-3 mx-sm-3 sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between '>
                <div className='mt-3'>
                    <h4 className='ds_600 mb-0'>Products</h4>
                    <p className='ds_text ds_font ds_cursor mb-0'>Dashboard <span onClick={() => navigate("/admin/product")} style={{ color: 'rgba(20, 20, 20, 1)' }}> / Products</span></p>
                </div>
                <div className='d-flex flex-wrap'>
                    <div className='position-relative me-4 mt-3'>
                        <input type="text" value={searchInput} onChange={e => { setSearchInput(e.target.value); setCurrentPage(1); }} className='ds_page_input' placeholder='Search... ' />
                        <img src={search} alt="" className='ds_page_icon' />
                    </div>
                    <button onClick={() => setShow(true)} className='ds_category_filter mt-3'><FaFilter className='me-1' /> Filter</button>
                    <div onClick={() => navigate("/admin/addproduct")} className="sp_Add_btn ds_cursor ds_btn_manage mt-3"><span>+ Add</span></div>
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
                        <th>Name</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {data?.map((item , index)=>{
                    return(
                        <tr key={item?._id}>
                            <td>{((currentPage - 1) * 10) + ( index + 1 )}</td>
                            <td>{item.mainCategoryData[0]?.mainCategoryName}</td>
                            <td>{item.categoryData[0]?.categoryName}</td>
                            <td>{item.subCategoryData[0]?.subCategoryName}</td>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <div>
                                        <img src={`${Back_URL}${item.productImage[0]}`} alt='' className='ds_pro_img' />
                                    </div>
                                    <p className='mb-0 ms-2'>{item.productName}</p>
                                </div>
                            </td>
                            <td>₹{item.price}</td>
                            <td>
                                <label className='sp_switch'>
                                    <input type='checkbox' checked={item?.status ? true : false} onChange={(e)=>handleStatusChange(e , item?._id)} />
                                    <span className='sp_slider sp_round'></span>
                                </label>
                            </td>
                            <td>
                                <div className='sp_table_action d-flex'>
                                    <div onClick={() => {navigate('/admin/viewproduct'); localStorage.setItem("Getid" , item._id)}}><img src={eye} alt='view' /></div>
                                    <div onClick={() => {navigate('/admin/editproduct'); localStorage.setItem("Editid" , item._id)}}><img src={editImg} alt='edit' /></div>
                                    <div onClick={() => {setDeletePopup(true); setDeleteId(item?._id)}}><img src={deleteImg} alt='delete' /></div>
                                </div>
                            </td>
                        </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>

        <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end">
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
                 <label className='ds_login_label' style={{fontSize:"15px"}}>Status</label>
                 <select 
                     className='ds_user_select w-100 mt-2' 
                     style={{fontSize:"15px"}}
                     value={tempFilterStatus}
                     onChange={(e) => setTempFilterStatus(e.target.value)}
                 >
                   <option value="">Select</option>
                   <option value="Available">Available</option>
                   <option value="Unavailable">Unavailable</option>
                 </select>
              </div>
              <div className="form-group mt-4">
                  <label className="ds_login_label mb-3" style={{ fontSize: '15px' }}>
                    Price Range
                  </label>
                  <RangeSlider className="ds_range" min={MIN} max={MAX} step={STEP} value={range} onInput={(value) => { setRange(value); setTempFilterPriceRange(value); }} />
                  <div className='d-flex justify-content-between mt-2'>
                     <div className='ds_600' style={{color:'rgba(30, 33, 49, 1)'}}>₹{range[0]}</div>
                     <div className='ds_600' style={{color:'rgba(30, 33, 49, 1)'}}>₹{range[1]}</div>
                  </div>
              </div>
             <div className='mt-auto mb-2 d-flex justify-content-between '>
                <button onClick={handleFilterReset} className='ds_off_cancel'>Reset</button>
                <button onClick={handleFilterApply} className='ds_off_apply'>Apply</button>
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

export default Products