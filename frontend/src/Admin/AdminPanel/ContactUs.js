import React, { useState, useEffect } from 'react'
import '../Css/Sujal.css'
import viewImg from '../Image/Sujal/view.png'
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import { Modal, Button } from 'react-bootstrap';
import { FaAngleRight } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { DeleteContactUsData, GetContactusData } from '../../Redux-Toolkit/ToolkitSlice/User/ContactusSlice'

const ContactUs = () => {
  const navigate = useNavigate();
  const [deleteShow, setDeleteShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState([]);
  const itemPerPage = 10;
  const dispatch = useDispatch()
  const [deleteId, setDeleteId] = useState(null)

  const contactUsData = useSelector((state)=> state?.contact?.getContactData)
  console.log("contactUsData",contactUsData);
  
  useEffect(()=>{
    dispatch(GetContactusData())
  },[])

  // Calculate filtered and paginated data
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemPerPage;
    const endIndex = startIndex + itemPerPage;
    let filtered = contactUsData?.filter((item) => {
      return (
        item?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
        item?.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
        item?.phoneNo?.toString().includes(searchInput) ||
        item?.subject?.toLowerCase().includes(searchInput.toLowerCase()) ||
        item?.message?.toLowerCase().includes(searchInput.toLowerCase())
      );
    });
    setData(filtered?.slice(startIndex, endIndex));
  }, [contactUsData, searchInput, currentPage]);

  const totalPages = Math.ceil((contactUsData?.filter((item) => {
    return (
      item?.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.email?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.phoneNo?.toString().includes(searchInput) ||
      item?.subject?.toLowerCase().includes(searchInput.toLowerCase()) ||
      item?.message?.toLowerCase().includes(searchInput.toLowerCase())
    );
  })?.length || 0) / itemPerPage);

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
    dispatch(DeleteContactUsData(deleteId))
        .then(() => {
            dispatch(GetContactusData())
            setDeleteShow(false)
        })
        .catch((error) => {
            alert(error)
        })
  }

  return (
    <div className='sp_main sp_height pt-2'>
      <div className='d-flex flex-wrap justify-content-between align-items-center'>
        <div className='mt-3'>
          <h4>Contact Us</h4>
          <span><a className='sp_text_gray'>Dashboard</a><span> / Contact Us</span></span>
        </div>
        <div className='position-relative me-4 mt-3'>
            <input type="text" className='ds_page_input' placeholder='Search... ' value={searchInput} onChange={e => { setSearchInput(e.target.value); setCurrentPage(1); }} />
            <img src={search} alt="" className='ds_page_icon' />
         </div>

      </div>
      <div className='sp_table'>
        <table className='w-100 '>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Subject</th>
              <th>Message</th>
              <th className='sp_th_action'>Action</th>
            </tr>
          </thead>
          <tbody>
          {data?.map((item , index) => (
            <tr key={item._id || index}>
              <td>{(currentPage - 1) * itemPerPage + (index + 1)}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.phoneNo}</td>
              <td>{item.subject}</td>
              <td>{item.message}</td>
              <td>
                <div className=' sp_table_action d-flex'>
                  <div onClick={()=>{navigate('/admin/viewcontactus'); localStorage.setItem("Getid" , item._id);}}><img src={viewImg} alt="view" /></div>
                  <div onClick={()=> {setDeleteShow(true); setDeleteId(item?._id)}}><img src={deleteImg} alt="delete" /></div>
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CODE */}
      <div className="py-3 d-flex justify-content-center justify-content-md-end">
        {renderPagination()}
      </div>


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
            <p className='mb-0 sp_text_gray text-center'>Are you sure you want to delete Contact Us ?</p>
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

export default ContactUs
