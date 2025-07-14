import React, { useRef, useState } from 'react'
import { Offcanvas } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { FaAngleLeft, FaAngleRight, FaFilter } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const CustomerReturnOrder = () => {

    const [show, setShow] = useState(false)
    const [deletePopup, setDeletePopup] = useState(false)
    const [currentPage,setCurrentPage] = useState(1);
    const navigate = useNavigate()
    const dateRef = useRef()
    const [selectedDate, setSelectedDate] = useState('');
    
    var totalPages =10;
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
    
    const handleDatePicker = () => {
        if(dateRef.current){
            dateRef.current.showPicker();
        }
    }
    
    const handleDateChange = (e) => {
        const value = e.target.value;
        setSelectedDate(value);
    };

  return (
    <div className='px-sm-4 px-3 mx-sm-3'>
    <div className='d-flex align-items-center flex-wrap justify-content-between mt-sm-4 mt-3'>
           <div>
              <h4 className='ds_600 mb-0'>Return Order</h4>
              <p className='ds_text ds_font'>Dashboard<span style={{color:'rgba(20, 20, 20, 1)'}}> / Return Order</span></p>
           </div>
           <button onClick={()=> setShow(true)} className='ds_category_filter'><FaFilter className='me-1' /> Filter</button>
   </div>

   <div className='ds_customer_table  overflow-x-auto position-relative mt-2'>
      <table className="w-100 ds_customer_manage">
          <thead className=''>
              <tr className=''>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Reason</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn2'>Reject</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>
              <tr>
                  <td>01</td>
                  <td>Johan Desai</td>
                  <td>Delta Omni 0.4X19 </td>
                  <td>02/09/1994</td>
                  <td>
                     <div className='d-flex'>
                        <span className='ds_returnorder_btn me-2'>Accept</span>
                     </div>
                  </td>
                  <td>
                     Lorem ipsum dolor sit amet
                  </td>
              </tr>        
          </tbody>
      </table>
  </div>

  <div className="py-3 mt-3 d-flex justify-content-center justify-content-md-end px-5">
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
                       <label className='ds_login_label' style={{fontSize:"15px"}} >Product Name</label>
                       <input type="text" style={{fontSize:"15px"}} className="form-control ds_login_input mt-1" placeholder='Enter Product Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
           </div>
           <div className="form-group mt-4">
                   <div className='position-relative'>
                      <label className='ds_login_label' style={{fontSize:"15px"}} >Date</label>
                       <input type="text" style={{fontSize:"15px"}} value={selectedDate} className="form-control ds_login_input mt-1" placeholder='Select Date' id="exampleInputEmail1" aria-describedby="emailHelp" readOnly/>
                       <input type="date"  ref={dateRef} onChange={handleDateChange} className='position-absolute' style={{visibility:'hidden' , bottom:'0'}}/>
                       <FaCalendarAlt onClick={handleDatePicker} className='ds_view_cal ds_cursor' />
                   </div> 
           </div>
           <div className="form-group mt-4">
                <label className='ds_login_label' style={{fontSize:"15px"}}>Status</label>
                <select className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                  <option value="">Select</option>
               </select>
           </div>
        <div className='mt-auto mb-2 d-flex justify-content-between '>
           <button onClick={()=> setShow(false)} className='ds_off_cancel'>Cancel</button>
           <button className='ds_off_apply'>Apply</button>
        </div>
      </div>
   </Offcanvas.Body>
   </Offcanvas>

</div>
  )
}

export default CustomerReturnOrder
