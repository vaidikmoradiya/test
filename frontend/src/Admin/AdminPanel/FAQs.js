import React, { useEffect, useState, useRef } from 'react'
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
import arrowdown from '../../Admin/Image/Savani/arrow.svg';

const FAQs = () => {
    const [addShow, setAddShow] = useState(false);
    const [editShow, setEditShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");

    const [deleteId, setDeleteId] = useState(null);
    const [editData, setEditData] = useState("")
    const [data, setData] = useState([])
    const prevTotalCountRef = useRef(0);

    const dispatch = useDispatch();
    const getFaq = useSelector((state) => state?.faq?.allFaq);
    console.log("getFaq",getFaq);

    const faqCateData = useSelector((state)=> state?.faqcategory?.getFaqCategoryData)
    // console.log("faqCateData",faqCateData);
    
    const skipAutoJumpRef = useRef(false);
    const initialLoadRef = useRef(true);

    useEffect(() => {
     dispatch(getAllFaq());
     dispatch(GetFaqCateData())
    }, [])

    var itemPerPage = 10;

    useEffect(() => {
        setCurrentPage(1)
    }, [searchInput])

    // Restore pagination page only when returning from edit (refresh opens page 1)
    useEffect(() => {
        const cameFromEdit = sessionStorage.getItem('FaqsReturnFromEdit');
        const storedPage = sessionStorage.getItem('FaqsCurrentPage');
        if (cameFromEdit && storedPage) {
            const parsed = parseInt(storedPage, 10);
            const total = Math.max(1, Math.ceil(((getFaq?.length) || 0) / itemPerPage));
            const clampedPage = Math.min(Math.max(1, isNaN(parsed) ? 1 : parsed), total);
            skipAutoJumpRef.current = true;
            initialLoadRef.current = false;
            setCurrentPage(clampedPage);
            sessionStorage.removeItem('FaqsCurrentPage');
            sessionStorage.removeItem('FaqsReturnFromEdit');
        }
    }, [getFaq?.length]);

    // Auto-jump to last page when FAQs grow and no search is active
    useEffect(() => {
        const isSearching = !!searchInput.trim();
        const newCount = (getFaq?.length) || 0;
        const prevCount = prevTotalCountRef.current;
    if (skipAutoJumpRef.current) {
        prevTotalCountRef.current = newCount;
        skipAutoJumpRef.current = false;
        return;
    }
    // Skip auto-jump on initial load (e.g., page refresh)
    if (initialLoadRef.current) {
        prevTotalCountRef.current = newCount;
        initialLoadRef.current = false;
        return;
    }
    const shouldJumpLast = sessionStorage.getItem('StockJumpLastOnce') === '1';
    if (!isSearching && shouldJumpLast) {
        const targetPage = Math.max(1, Math.ceil(newCount / itemPerPage));
        setCurrentPage(targetPage);
        sessionStorage.removeItem('StockJumpLastOnce');
    }
        prevTotalCountRef.current = newCount;
    }, [getFaq?.length, searchInput]);

    const filteredFaq = getFaq?.filter((element) => {
        return element?.faqQuestion?.toLowerCase().includes(searchInput?.toLowerCase()) ||
               element?.faqAnswer?.toLowerCase().includes(searchInput?.toLowerCase())
    })

    var totalPages = Math.ceil((filteredFaq?.length || 0) / itemPerPage);

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemPerPage;
        const endIndex = startIndex + itemPerPage;
        const filtered = getFaq?.filter((element) => {
            return element?.faqQuestion?.toLowerCase().includes(searchInput?.toLowerCase()) ||
                   element?.faqAnswer?.toLowerCase().includes(searchInput?.toLowerCase())
        })
        const paginatedData = filtered?.slice(startIndex, endIndex);
        setData(paginatedData);
    }, [currentPage, getFaq, searchInput]);

    // Reset form when modal opens
    useEffect(() => {
        if (addShow) {
            createFaqFormik.resetForm();
        }
    }, [addShow]);

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
            const isSearching = !!searchInput.trim();
            const currentFilteredLength = filteredFaq?.length || 0;
            const targetPage = !isSearching ? Math.max(1, Math.ceil((currentFilteredLength + 1) / itemPerPage)) : currentPage;

            dispatch(createFaq(values)) 
            .then(() => {
                dispatch(getAllFaq()).then(() => {
                    if (!isSearching) {
                        setCurrentPage(targetPage);
                    }
                    setAddShow(false);
                });
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
        const isSearching = !!searchInput.trim();
        const currentFilteredLength = (filteredFaq?.length) || 0;
        const newCount = Math.max(0, currentFilteredLength - 1);
        const newTotal = Math.max(1, Math.ceil(newCount / itemPerPage));
        const currentStartIndex = (currentPage - 1) * itemPerPage;

        dispatch(DeleteFaq(deleteId)).then(() => {
            dispatch(getAllFaq()).then(() => {
                if (!isSearching) {
                    if (currentPage > newTotal) {
                        setCurrentPage(newTotal);
                    } else if (newCount <= currentStartIndex && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                }
                setDeleteShow(false);
            });
        });
    }

    // Function to handle opening Add FAQ modal
    const handleAddShow = () => {
        setAddShow(true);
        // Reset form when opening modal
        createFaqFormik.resetForm();
    }

    // Function to handle closing Add FAQ modal
    const handleAddClose = () => {
        setAddShow(false);
        // Reset form when closing modal
        createFaqFormik.resetForm();
    }

    // Function to handle closing Edit FAQ modal
    const handleEditClose = () => {
        setEditShow(false);
        // Reset edit form to original data
        editFaqFormik.resetForm();
    }

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

    const faqCategoryOptions = [
      { value: '', label: 'Select FaqCategory' },
      ...(faqCateData?.map(element => ({ value: element?._id, label: element?.categoryName })) || [])
    ];

    return (
        <div className='sp_main sp_height pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>FAQ's</h4>
                    <span><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link><span> / FAQ's</span></span>
                </div>
                <div className='d-flex flex-wrap  '>
                    <div className='position-relative me-4 mt-3'>
                        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className='ds_page_input' placeholder='Search... ' />
                       <img src={search} alt="" className='ds_page_icon' />
                    </div>
                    <Link className='mt-3 me-3' to='/admin/viewfaqs'>
                        <div className='sp_View_btn'><span>View</span></div>
                    </Link>
                    <Link className='mt-3 ' href='#' onClick={handleAddShow} >
                        <div className='sp_Add_btn'><span>+ Add</span></div>
                    </Link>
                </div>

            </div>
            {(data?.length === 0) ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80%' }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>No data available</div>
                </div>
            ) : (
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
                                        <td>{item?.categoryId?.categoryName}</td>
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
            )}

            {/* PAGINATION CODE */}
            {!searchInput.trim() && (filteredFaq?.length > itemPerPage) && (
                <div className="py-3 d-flex justify-content-center justify-content-md-end">
                    {renderPagination()}
                </div>
            )}
            {/* add role modal  */}
            <Modal
                show={addShow}
                onHide={handleAddClose}
                aria-labelledby="contained-modal-title-vcenter "
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <form key={`add-faq-form-${addShow}`} onSubmit={createFaqFormik.handleSubmit}>
                    <Modal.Body>
                        <h4 className='text-center'>Add FAQ's</h4>
                        <div className='spmodal_main_div'>
                            <div className="form-group  mb-4 pt-3">
                                <label className='ds_login_label' style={{fontSize:"15px"}}>FaqCategory</label>
                                <div className='mt-2'>
                                  <CustomSelect
                                    options={faqCategoryOptions}
                                    value={createFaqFormik?.values.categoryName}
                                    onChange={(val) => createFaqFormik.setFieldValue('categoryName', val)}
                                    placeholder="Select FaqCategory"
                                  />
                                </div>
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
                                {createFaqFormik.touched.faqQuestion && createFaqFormik.errors.faqQuestion && (
                                    <p
                                    className="text-danger mb-0 text-start ps-1 pt-1"
                                    style={{ fontSize: "14px" }}
                                    >
                                    {createFaqFormik.errors.faqQuestion}
                                    </p>
                                )}
                            </div>
                            <div className='mb-3'>
                                <small>Answer</small><br></br>
                                <textarea placeholder='Enter answer' className='mb-0'
                                    name="faqAnswer" value={createFaqFormik.values.faqAnswer}
                                    onChange={createFaqFormik.handleChange}
                                    onBlur={createFaqFormik.handleBlur}
                                ></textarea>
                                {createFaqFormik.touched.faqAnswer && createFaqFormik.errors.faqAnswer && (
                                    <p
                                    className="text-danger mb-0 text-start ps-1 pt-1"
                                    style={{ fontSize: "14px" }}
                                    >
                                    {createFaqFormik.errors.faqAnswer}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                            <button className='ds_user_cancel' onClick={handleAddClose}>Cancel</button>
                            <button type='submit' className='ds_user_add'>Add</button>
                        </div>
                    </Modal.Body>
                </form>
            </Modal>

            {/* edit role modal  */}
            <Modal
                show={editShow}
                onHide={handleEditClose}
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
                                <div className='mt-2'>
                                  <CustomSelect
                                    options={faqCategoryOptions}
                                    value={editFaqFormik?.values.categoryName}
                                    onChange={(val) => editFaqFormik.setFieldValue('categoryName', val)}
                                    placeholder="Select FaqCategory"
                                  />
                                </div>
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
                                {editFaqFormik.touched.faqQuestion && editFaqFormik.errors.faqQuestion && (
                                    <p
                                    className="text-danger mb-0 text-start ps-1 pt-1"
                                    style={{ fontSize: "14px" }}
                                    >
                                    {editFaqFormik.errors.faqQuestion}
                                    </p>
                                )}
                            </div>
                            <div className='mb-3'>
                                <small>Answer</small><br></br>
                                <textarea className='mb-0'
                                    name="faqAnswer" value={editFaqFormik.values.faqAnswer}
                                    onChange={editFaqFormik.handleChange}
                                    onBlur={editFaqFormik.handleBlur}
                                ></textarea>
                                {editFaqFormik.touched.faqAnswer && editFaqFormik.errors.faqAnswer && (
                                    <p
                                    className="text-danger mb-0 text-start ps-1 pt-1"
                                    style={{ fontSize: "14px" }}
                                    >
                                    {editFaqFormik.errors.faqAnswer}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                            <button className='ds_user_cancel' onClick={handleEditClose}>Cancel</button>
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
