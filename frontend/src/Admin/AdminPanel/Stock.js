import React, { useState, useEffect, useRef } from 'react'
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6';
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Offcanvas } from 'react-bootstrap'
import { IoClose } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteStockData, GetAllStock } from '../../Redux-Toolkit/ToolkitSlice/Admin/StockSlice';
import { Link } from 'react-router-dom';
import arrowdown from '../../Admin/Image/Savani/arrow.svg';

const Stock = () => {

const [show, setShow] = useState(false)
const [deletePopup, setDeletePopup] = useState(false)
const [currentPage,setCurrentPage] = useState(1);
const [data, setData] = useState();
const [filteredData, setFilteredData] = useState([]);
const [deleteId, setDeleteId] = useState(null)
const itemPerPage = 10;
const dispatch = useDispatch()
const prevTotalCountRef = useRef(0);

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

// Auto-jump to last page when stock list grows and no search is active
useEffect(() => {
    const isSearching = !!searchInput.trim();
    const newCount = (StockData?.length) || 0;
    const prevCount = prevTotalCountRef.current;
    if (!isSearching && newCount > prevCount) {
        const targetPage = Math.max(1, Math.ceil(newCount / itemPerPage));
        setCurrentPage(targetPage);
    }
    prevTotalCountRef.current = newCount;
}, [StockData?.length, searchInput]);

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
    const isSearching = !!searchInput.trim();
    const currentFilteredLength = filteredData?.length || 0;
    const newCount = Math.max(0, currentFilteredLength - 1);
    const newTotal = Math.max(1, Math.ceil(newCount / itemPerPage));
    const currentStartIndex = (currentPage - 1) * itemPerPage;

    dispatch(DeleteStockData(deleteId))
    .then(()=>{
       dispatch(GetAllStock()).then(() => {
           if (!isSearching) {
               if (currentPage > newTotal) {
                   setCurrentPage(newTotal);
               } else if (newCount <= currentStartIndex && currentPage > 1) {
                   setCurrentPage(currentPage - 1);
               }
           }
           setDeletePopup(false)
           setDeleteId(null)
       })
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

// Reusable Custom Select (aligned with Category page)
const CustomSelect = ({ options, value, onChange, placeholder = 'Select' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <div
        className='mv_category_modal_select'
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setIsOpen(prev => !prev);
          if (e.key === 'Escape') setIsOpen(false);
        }}
      >
        <span style={{ color: selected && selected.value !== '' ? '#111' : '#14141499' }}>
          {selected && selected.value !== '' ? selected.label : placeholder}
        </span>
        <span style={{ marginLeft: 8 }}><img src={arrowdown}/></span>
      </div>
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            zIndex: 20,
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 0,
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
            maxHeight: 220,
            overflowY: 'auto',
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none',
          }}
        >
          {options.filter(o => o.value !== '').map(opt => (
            <li
              className='mv_category_modal_select_option'
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '3px 12px',
                borderRadius: 0,
                background: opt.value === value ? '#1E2131' : 'transparent',
                color: opt.value === value ? '#fff' : '',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const mainCategoryOptions = [
  { value: '', label: 'Select' },
  ...getUniqueMainCategories().map(c => ({ value: c, label: c }))
];
const categoryOptions = [
  { value: '', label: 'Select' },
  ...getUniqueCategories().map(c => ({ value: c, label: c }))
];
const subCategoryOptions = [
  { value: '', label: 'Select' },
  ...getUniqueSubCategories().map(c => ({ value: c, label: c }))
];
const productOptions = [
  { value: '', label: 'Select' },
  ...getUniqueProduct().map(c => ({ value: c, label: c }))
];

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
                   <p className='ds_text ds_font mb-0'><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link><span style={{color:'rgba(20, 20, 20, 1)'}}> / Stock</span></p>
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

        {(data?.length === 0) ? (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                 <div style={{ fontSize: '20px', fontWeight: 'bold' }}>No data available</div>
             </div>
         ) : (
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
                                        {/* <div onClick={() => {navigate("/admin/editStock"); localStorage.setItem("Editid" , item._id)}}> <img src={editImg} alt="edit" /> </div> */}
                                        <div onClick={() => {setDeletePopup(true); setDeleteId(item?._id)}}> <img src={deleteImg} alt="delete" /> </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         )}

        {/* PAGINATION CODE */}
        {!searchInput.trim() && (filteredData?.length > itemPerPage) && (
            <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end ">
                {renderPagination()}
            </div>
        )}

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
                   <div className='mt-2'>
                     <CustomSelect
                       options={mainCategoryOptions}
                       value={tempFilterMainCategory}
                       onChange={(val) => setTempFilterMainCategory(val)}
                       placeholder="Select"
                     />
                   </div>
              </div>
              <div className="form-group mt-4">
                   <label className='ds_login_label' style={{fontSize:"15px"}}>Category</label>
                   <div className='mt-2'>
                     <CustomSelect
                       options={categoryOptions}
                       value={tempFilterCategory}
                       onChange={(val) => setTempFilterCategory(val)}
                       placeholder="Select"
                     />
                   </div>
              </div>
              <div className="form-group mt-4">
                   <label className='ds_login_label' style={{fontSize:"15px"}}>Sub Category</label>
                   <div className='mt-2'>
                     <CustomSelect
                       options={subCategoryOptions}
                       value={tempFilterSubCategory}
                       onChange={(val) => setTempFilterSubCategory(val)}
                       placeholder="Select"
                     />
                   </div>
              </div>
             <div className="form-group mt-4">
                <label className='ds_login_label' style={{fontSize:"15px"}}>Product</label>
                <div className='mt-2'>
                  <CustomSelect
                    options={productOptions}
                    value={tempFilterProduct}
                    onChange={(val) => setTempFilterProduct(val)}
                    placeholder="Select"
                  />
                </div>
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
                      <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete stock?</p>
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
