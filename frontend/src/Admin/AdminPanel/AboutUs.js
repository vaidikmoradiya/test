import React, { useRef, useState, useEffect } from 'react'
import '../Css/Sujal.css'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import search from '../Image/Savani/search_icon.svg'
import { useFormik } from 'formik';
import { createAboutus, DeleteAboutusData, EditAboutus, getallAboutUs } from '../../Redux-Toolkit/ToolkitSlice/User/AboutusSlice';
import { AboutusSchema } from '../Formik';

const AboutUs = () => {
  const [addShow, setAddShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);  
  const [EditAbout, setEditAbout] = useState("");
  const [deleteId, setDeleteId] = useState(null)
  
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([])
  const [searchInput, setSearchInput] = useState("")
  const addFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);
  const [fileName, setFileName] = useState("Choose Image")
  const dispatch = useDispatch()
  const Back_URL = 'http://localhost:5000/'

    const AboutUsData = useSelector((state) => state.about.allAbout)
    const CreateAboutData = useSelector((state) => state.about.allAbout)

    useEffect(() => {
        dispatch(getallAboutUs())
    }, [])
    
  const [selectedImages, setSelectedImages] = useState([]);
  const [editSelectedImages, setEditSelectedImages] = useState([]);

  // Update selectedImages when EditAbout changes
  useEffect(() => {
    if (EditAbout && EditAbout.image) {
      // Convert existing image paths to file-like objects for display
      const existingImages = EditAbout.image.map((imgPath, index) => {
        const fullName = imgPath.split('\\').pop() || `image-${index + 1}.jpg`;
        // Remove timestamp prefix (numbers followed by dash)
        const cleanName = fullName.replace(/^\d+-/, '');
        return {
          name: cleanName,
          path: imgPath,
          isExisting: true
        };
      });
      setEditSelectedImages(existingImages);
    } else {
      setEditSelectedImages([]);
    }
  }, [EditAbout]);

  const handleBrowseClick = (isEdit = false) => {
    if (isEdit) {
      editFileInputRef.current.click();
    } else {
      addFileInputRef.current.click();
    }
  };

  const handleImageSelect = (event, isEdit = false) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      name: file.name,
      file: file,
      isExisting: false
    }));
    
    if (isEdit) {
      const updatedImages = [...editSelectedImages, ...newImages];
      setEditSelectedImages(updatedImages);
      editAboutusFormik.setFieldValue('img', updatedImages);
    } else {
      const updatedImages = [...selectedImages, ...newImages];
      setSelectedImages(updatedImages);
      createAboutusFormik.setFieldValue('img', updatedImages);
    }
  };

  const removeImage = (index, isEdit = false) => {
    if (isEdit) {
      const newImages = editSelectedImages.filter((_, i) => i !== index);
      setEditSelectedImages(newImages);
      editAboutusFormik.setFieldValue('img', newImages);
    } else {
      const newImages = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(newImages);
      createAboutusFormik.setFieldValue('img', newImages);
    }
  };

  const handleFileChange = (event) => {
    const fileName = event.target.files[0]?.name || '';
    setFileName(fileName)
  };
  
  var itemPerPage = 10;

  useEffect(() => {
    setCurrentPage(1)
  }, [searchInput])

  const filteredAboutUs = AboutUsData?.filter((element)=>{
    return  element?.title?.toLowerCase().includes(searchInput?.toLowerCase()) || 
            element?.description?.toLowerCase().includes(searchInput?.toLowerCase())
  })

  var totalPages = Math.ceil((filteredAboutUs?.length || 0) / itemPerPage);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;   // 0 * 10
    const endIndex = startIndex + itemPerPage;            // 0 + 10
    const filtered = AboutUsData?.filter((element)=>{
      return  element?.title?.toLowerCase().includes(searchInput?.toLowerCase()) || 
              element?.description?.toLowerCase().includes(searchInput?.toLowerCase())
    })
    const paginatedData = filtered?.slice(startIndex, endIndex);
    setData(paginatedData);
  }, [currentPage, AboutUsData , searchInput]);

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

    const AboutusVal = {
        title: "",
        description: "",
        img: [],
    }

    const createAboutusFormik = useFormik({
        initialValues: AboutusVal,
        validationSchema: AboutusSchema,
        onSubmit: ((values, action) => {
            // Prepare the image data for submission
            const imageData = selectedImages.map(img => {
                if (img.isExisting) {
                    return img.path; // Keep existing image path
                } else {
                    return img.file; // New file object
                }
            });
            
            const submitData = {
                ...values,
                img: imageData
            };
            
            const isSearching = !!searchInput.trim();
            const currentFilteredLength = filteredAboutUs?.length || 0;
            const targetPage = !isSearching ? Math.max(1, Math.ceil((currentFilteredLength + 1) / itemPerPage)) : currentPage;
            
            dispatch(createAboutus(submitData)).then(() => {
                dispatch(getallAboutUs()).then(() => {
                    if (!isSearching) {
                        setCurrentPage(targetPage);
                    }
                    setAddShow(false);
                    setSelectedImages([]);
                    action.resetForm();
                    // Reset file input
                    if (addFileInputRef.current) {
                        addFileInputRef.current.value = '';
                    }
                });
            }).catch((error) => {
                console.error('Error creating about us:', error);
                alert('Error creating about us. Please try again.');
            })
        })
    })

    const editAboutusFormik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: EditAbout?.title || "",
            description: EditAbout?.description || "",
            img: EditAbout?.image || [],
        },
        validationSchema: AboutusSchema,
        onSubmit: ((values, action) => {
            // Prepare the image data for submission
            const imageData = editSelectedImages.map(img => {
                if (img.isExisting) {
                    return img.path; // Keep existing image path
                } else {
                    return img.file; // New file object
                }
            });
            
            const submitData = {
                ...values,
                img: imageData
            };
            
            dispatch(EditAboutus({values: submitData, id: EditAbout._id})).then(() => {
                dispatch(getallAboutUs());
                setEditShow(false);
                setEditSelectedImages([]);
                setEditAbout("");
                action.resetForm();
                // Reset file input
                if (editFileInputRef.current) {
                    editFileInputRef.current.value = '';
                }
            }).catch((error) => {
                console.error('Error updating about us:', error);
                alert('Error updating about us. Please try again.');
            })
        })
    })

    const handleDelete = () => {
       dispatch(DeleteAboutusData(deleteId))
       .then(()=>{
          // compute new pagination based on expected count after deletion
          const isSearching = !!searchInput.trim();
          const currentFilteredLength = filteredAboutUs?.length || 0;
          const newCount = Math.max(0, currentFilteredLength - 1);
          const newTotalPages = Math.max(1, Math.ceil(newCount / itemPerPage));

          dispatch(getallAboutUs()).then(() => {
            if (!isSearching) {
              if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages);
              } else {
                const startIndex = (currentPage - 1) * itemPerPage;
                if (newCount <= startIndex && currentPage > 1) {
                  setCurrentPage(currentPage - 1);
                }
              }
            }
            setDeleteShow(false)
            setDeleteId(null);
          })
       })
       .catch((error)=>{
         console.error('Error deleting about us:', error);
         alert('Error deleting about us. Please try again.');
       })
    }

    const handleAddModalClose = () => {
        setAddShow(false);
        setSelectedImages([]);
        createAboutusFormik.resetForm();
        if (addFileInputRef.current) {
            addFileInputRef.current.value = '';
        }
    }

    const handleEditModalClose = () => {
        setEditShow(false);
        setEditSelectedImages([]);
        setEditAbout("");
        editAboutusFormik.resetForm();
        if (editFileInputRef.current) {
            editFileInputRef.current.value = '';
        }
    }
    
  return (
      <div className='sp_main sp_height pt-2'>
          <div className='d-flex flex-wrap justify-content-between align-items-center'>
              <div className='mt-3' >
                  <h4>About Us</h4>
                  <span><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link><span> / About Us</span></span>
              </div>
              <div className='d-flex flex-wrap'>
                  <div className='position-relative me-4 mt-3'>
                        <input type="text" value={searchInput} onChange={(e)=> setSearchInput(e.target.value)} className='ds_page_input' placeholder='Search... ' />
                       <img src={search} alt="" className='ds_page_icon' />
                   </div>
                  <Link className='mt-3 me-3' to='/admin/ViewaboutUs'>
                      <div className='sp_View_btn'><span>View</span></div>
                  </Link>
                  <Link className='mt-3' href='#' onClick={() => setAddShow(true)} >
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
                    <th>Image</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th className='sp_th_action'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr key={index}>
                      <td>{((currentPage - 1) * 10) + ( index + 1 )}</td>
                      <td className='sp_table_img'><img src={`${Back_URL}${item.image[0]}`}/></td>
                      <td>{item.title}</td>
                      <td>{item.description}</td>
                      <td>
                        <div className=' sp_table_action d-flex'>
                          <div><img src={editImg} onClick={() => {setEditShow(true); setEditAbout(item)}} alt="Edit" /></div>
                          <div><img src={deleteImg} onClick={() => {setDeleteShow(true);  setDeleteId(item?._id)}} alt="Delete" /></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION CODE */}
          {!searchInput.trim() && (filteredAboutUs?.length > itemPerPage) && (
            <div className="py-3 d-flex justify-content-center justify-content-md-end">
              {renderPagination()}
            </div>
          )}
          
          {/* add role modal  */}
          <Modal
              show={addShow}
              onHide={handleAddModalClose}
              aria-labelledby="contained-modal-title-vcenter "
              className='sp_add_modal'
              centered
          >
              <Modal.Header closeButton>
              </Modal.Header>
                <Modal.Body>
              <form onSubmit={createAboutusFormik.handleSubmit}>

                    <h4 className='text-center'>Add About Us</h4>
                    <div className='spmodal_main_div'>
                        <div>
                            <small>Title</small><br></br>
                            <div className='mb-3'>
                                <input type='text' className='mb-0' placeholder='Enter Title'
                                    name="title" value={createAboutusFormik.values.title}
                                    onChange={createAboutusFormik.handleChange}
                                    onBlur={createAboutusFormik.handleBlur}
                                ></input>
                                {createAboutusFormik.touched.title && createAboutusFormik.errors.title && (
                                    <p
                                        className="text-danger mb-0 text-start ps-1"
                                        style={{ fontSize: "14px" }}
                                        >
                                        {createAboutusFormik.errors.title}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <small>Description</small><br></br>
                            <div className='mb-3'>
                                <textarea placeholder='Enter Description' className='mb-0'
                                    name="description" value={createAboutusFormik.values.description}
                                    onChange={createAboutusFormik.handleChange}
                                    onBlur={createAboutusFormik.handleBlur}
                                ></textarea>
                                {createAboutusFormik.touched.description && createAboutusFormik.errors.description && (
                                    <p
                                        className="text-danger mb-0 text-start ps-1"
                                        style={{ fontSize: "14px" }}
                                        >
                                        {createAboutusFormik.errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="form-group position-relative">
                                <label className='ds_login_label' >Image</label>
                                <div style={{ background: '#1414140F', borderRadius: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: "4px", padding: "8px 12px", minHeight: "40px" }}>
                                  {selectedImages.map((image, index) => (
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
                                          {image.name}
                                      </span>
                                      <span style={{ color: 'red', marginLeft: 8, fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} onClick={() => removeImage(index, false)}>✕</span>
                                    </div>
                                  ))}
                                </div>
                                <input
                                  type="file"
                                  ref={addFileInputRef}
                                  name="img"
                                  multiple
                                  accept="image/*"
                                  onBlur={createAboutusFormik.handleBlur}
                                  onChange={(e) => handleImageSelect(e, false)}
                                  className='d-none'
                                />
                            <div className='ds_user_browse ds_cursor' onClick={() => handleBrowseClick(false)}>Browse</div>
                            </div>
                            {createAboutusFormik.touched.img && createAboutusFormik.errors.img && (
                                <p
                                    className="text-danger mb-0 text-start ps-1"
                                    style={{ fontSize: "14px" }}
                                    >
                                    {createAboutusFormik.errors.img}
                                </p>
                            )}
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button type='button' className='ds_user_cancel' onClick={handleAddModalClose}>Cancel</button>
                        <button type='submit' className='ds_user_add'>Add</button>
                    </div>
              </form>

                </Modal.Body>
          </Modal>

          {/* edit role modal  */}
          <Modal
              show={editShow}
              onHide={handleEditModalClose}
              aria-labelledby="contained-modal-title-vcenter "
              className='sp_add_modal'
              centered
          >
              <Modal.Header closeButton>
              </Modal.Header>
              <Modal.Body>
              <form onSubmit={editAboutusFormik.handleSubmit}>
                <h4 className='text-center'>Edit About Us</h4>
                <div className='spmodal_main_div'>
                    <div>
                        <small>Title</small><br></br>
                        <div className='mb-3'>
                            <input type='text' className='mb-0' placeholder='Enter Title'
                                name="title" value={editAboutusFormik.values.title}
                                onChange={editAboutusFormik.handleChange}
                                onBlur={editAboutusFormik.handleBlur}
                            ></input>
                            {editAboutusFormik.touched.title && editAboutusFormik.errors.title && (
                                <p
                                    className="text-danger mb-0 text-start ps-1"
                                    style={{ fontSize: "14px" }}
                                    >
                                    {editAboutusFormik.errors.title}
                                </p>
                            )}
                        </div>
                    </div>
                    <div>
                        <small>Description</small><br></br>
                        <div className='mb-3'>
                            <textarea placeholder='Enter Description' className='mb-0'
                                name="description" value={editAboutusFormik.values.description}
                                onChange={editAboutusFormik.handleChange}
                                onBlur={editAboutusFormik.handleBlur}
                            ></textarea>
                            {editAboutusFormik.touched.description && editAboutusFormik.errors.description && (
                                <p
                                    className="text-danger mb-0 text-start ps-1"
                                    style={{ fontSize: "14px" }}
                                    >
                                    {editAboutusFormik.errors.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="form-group position-relative">
                            <label className='ds_login_label' >Image</label>
                            <div style={{ background: '#1414140F', borderRadius: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: "4px", padding: "8px 12px", minHeight: "40px" }}>
                            {editSelectedImages.map((image, index) => (
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
                                    {image.name}
                                </span>
                                <span style={{ color: 'red', marginLeft: 8, fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} onClick={() => removeImage(index, true)}>✕</span>
                                </div>
                            ))}
                            </div>
                            <input
                            type="file"
                            ref={editFileInputRef}
                            name="img"
                            multiple
                            accept="image/*"
                            onBlur={editAboutusFormik.handleBlur}
                            onChange={(e) => handleImageSelect(e, true)}
                            className='d-none'
                            />
                        <div className='ds_user_browse ds_cursor' onClick={() => handleBrowseClick(true)}>Browse</div>
                        </div>
                        {editAboutusFormik.touched.img && editAboutusFormik.errors.img && (
                            <p
                                className="text-danger mb-0 text-start ps-1"
                                style={{ fontSize: "14px" }}
                                >
                                {editAboutusFormik.errors.img}
                            </p>
                        )}
                </div>
                <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                    <button type='button' className='ds_user_cancel' onClick={handleEditModalClose}>Cancel</button>
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
                      <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete About Us ?</p>
                  </div>
                  <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                      <button className='ds_user_cancel' onClick={() => setDeleteShow(false)}>Cancel</button>
                      <button onClick={handleDelete} className='ds_user_add'>Delete</button>
                  </div>
              </Modal.Body>
          </Modal>
      </div>
  )
}

export default AboutUs 
