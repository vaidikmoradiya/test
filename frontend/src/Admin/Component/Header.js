import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import "../Css/Umang.css";
import { IoMenu } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { FaAngleDown } from "react-icons/fa6";
import Offcanvas from "react-bootstrap/Offcanvas";

import dashboard1 from "../Image/Umang/dashBoard.svg";
import dashboard from "../Image/Umang/dashboard1.svg";
import role from "../Image/Umang/role.svg";
import role1 from "../Image/Umang/role1.svg"
import user from "../Image/Umang/user.svg";
import user1 from "../Image/Umang/user1.svg"
import customer from "../Image/Umang/customer.svg";
import customer1 from "../Image/Umang/customer1.svg";
import mainCategory from "../Image/Umang/mainCategory.svg";
import mainCategory1 from "../Image/Umang/mainCategory1.svg"
import category from "../Image/Umang/category.svg";
import category1 from "../Image/Umang/category1.svg";
import subCategory from "../Image/Umang/subCategory.svg";
import subCategory1 from "../Image/Umang/subCategory1.svg";
import products from "../Image/Umang/products.svg";
import products1 from "../Image/Umang/product1.svg";
import unit from "../Image/Umang/unit.svg";
import unit1 from "../Image/Umang/unit1.svg";
import size from "../Image/Umang/size.svg";
import size1 from "../Image/Umang/size.svg";
import stock from "../Image/Umang/stock.svg";
import stock1 from "../Image/Umang/stock1.svg";
import order from "../Image/Umang/order.svg";
import order1 from "../Image/Umang/order1.svg";
import review from "../Image/Umang/review.svg";
import review1 from "../Image/Umang/review1.svg";
import returnOrder from "../Image/Umang/returnOrder.svg";
import returnOrder1 from "../Image/Umang/returnOrder1.svg";
import cancelOrder from "../Image/Umang/cancelOrder.svg";
import cancelOrder1 from "../Image/Umang/cancleOrder1.svg";
import resonCancellation from "../Image/Umang/resonCancellation.svg";
import resonCancellation1 from "../Image/Umang/cancellation1.svg"
import termCondition from "../Image/Umang/termCondition.svg";
import termCondition1 from "../Image/Umang/termCondition1.svg";
import faq from "../Image/Umang/faq.svg";
import faq1 from "../Image/Umang/faqs1.svg";
import privacyPolicy from "../Image/Umang/privacyPolicy.svg";
import privacyPolicy1 from "../Image/Umang/privacy1.svg";
import contact from "../Image/Umang/contact.svg";
import contact1 from "../Image/Umang/contactus1.svg";
import aboutUs from "../Image/Umang/aboutUs.svg";
import aboutUs1 from "../Image/Umang/aboutus1.svg";
import profileimg from '../Image/Savani/profile_icon.svg'
import logout from '../Image/Savani/logout.svg'
import { Modal } from "react-bootstrap";


const Header = ({ mainToggle, setMainToggle, userType = 'admin' }) => {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(false)
  const [adminFrame, setAdminFrame] = useState(false)
  const navigate = useNavigate()
  const [logOut, setLogOut] = useState(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const toggleSidebar = () => {
    // if (window.innerWidth >= 576) {
    //   const sidebar = document.getElementById("sidebar");
    //   sidebar.classList.toggle("ucollapsed");
    // } else {
    //   handleShow();
    // }
    setMainToggle(!mainToggle)
    setShow(true);
  };

  const [activeLocation,setActiveLocation] = useState('dashboard');

  const location = useLocation(); //
  useEffect(() => {
    setActiveLocation(location.pathname);
    // console.log('data',location.pathname)
  }, [location.pathname]);

 const handlePrfileManager  = () => {
    if(userType === "customer"){
      setProfile(false)
      navigate("/customer/viewProfile")
    }
    else{
      setProfile(false)
      navigate("/admin/viewProfile")
    }
 }

 const handelLogout = () => {
    localStorage.removeItem("login")
    navigate("/admin/login")
 }

  return (
    <>
      <header className="unavbar">
        <div className="unavbar_left">
          <button className="umenu_button" onClick={toggleSidebar}>
            <IoMenu />
          </button>
          <div className="logo">Pifron</div>
        </div>

        <div className="unavbar_right">
          
          <div className="uuser_profile position-relative">
            <div className="uavatar ">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User avatar"
                onClick={()=> {setProfile(!profile); setAdminFrame(false)}}
              />
              {profile &&  <div className="ds_profile_manage">
                 <div className="d-flex" onClick={handlePrfileManager}>
                    <div>
                       <img src={profileimg} alt="" className="ds_header_profile"/>
                    </div>
                    <p className="ms-2 ds_header_text">My Profile</p>
                 </div>
                 <div className="d-flex" onClick={()=> {setProfile(false); setLogOut(true)}}>
                    <div>
                       <img src={logout} alt="" className="ds_header_profile"/>
                    </div>
                    <p className="ms-2 mb-1 ds_header_text">Logout</p>
                 </div>
              </div>}
            </div>
            <div className="uuser_info" onClick={()=> {setAdminFrame(!adminFrame); setProfile(false)}}>
              <div className="uuser_name">Johan Patel</div>
              {/* <div className="uuser_role">
                Admin <FaAngleDown className="udropdown_icon" />
              </div>

              {adminFrame && <div className="ds_profile_manage2">
                   <p onClick={()=> setAdminFrame(true)} className="mb-1">Admin</p>
                   <p onClick={()=> setAdminFrame(true)} className="mb-1">Customer</p>
                   <p onClick={()=> setAdminFrame(true)} className="mb-1">Service Incharge</p>
              </div>} */}
            </div>
          </div>
        </div>
      </header>

      <Offcanvas show={show} onHide={handleClose} placement="start" responsive='sm' className='d-sm-none sp_offcanvas'>
        <Offcanvas.Header className="pb-0 pt-0" closeButton>
          <Offcanvas.Title>
            <div className="usidebar_header">
              <div className="ulogo">LOGO</div>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-0">
          <div id="sidebar">
            <div className="menu-items">
              {userType === 'admin' ? (
                <>
                  <Link to='dashboard' className={`umenu_item ${activeLocation === '/admin/dashboard' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/dashboard' ? dashboard1 : dashboard}></img>
                    <span>Dashboard</span>
                  </Link>
                  {/* <Link to='role' className={`umenu_item ${activeLocation === '/admin/role' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/role' ? role1 : role} />
                    <span>Role</span>
                  </Link> */}
                  <Link to='user' className={`umenu_item ${activeLocation === '/admin/user' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/user' ? user1 : user} />
                    <span>User</span>
                  </Link>
                  {/* <Link to='customer' className={`umenu_item ${activeLocation === '/admin/customer' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/customer' ? customer1 : customer} />
                    <span>Customer</span>
                  </Link> */}
                  <Link to='maincategory' className={`umenu_item ${activeLocation === '/admin/maincategory' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/maincategory' ? mainCategory1 : mainCategory} />
                    <span>Main Category</span>
                  </Link>
                  <Link to='category' className={`umenu_item ${activeLocation === '/admin/category' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/category' ? category1 : category} />
                    <span>Category</span>
                  </Link>
                  <Link to='subcategory' className={`umenu_item ${activeLocation === '/admin/subcategory' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/subcategory' ? subCategory1 : subCategory} />
                    <span>Sub Category</span>
                  </Link>
                  <Link to='product' className={`umenu_item ${(activeLocation === '/admin/product' || activeLocation === '/admin/addproduct' || activeLocation === '/admin/editproduct' || activeLocation === '/admin/viewproduct') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/product' || activeLocation === '/admin/addproduct' || activeLocation === '/admin/editproduct' || activeLocation === '/admin/viewproduct') ? products1 : products} />
                    <span>Products</span>
                  </Link>
                  <Link to='unit' className={`umenu_item ${activeLocation === '/admin/unit' ? 'uactive' : ''}`}>

                    <img src={activeLocation === '/admin/unit' ? unit1 : unit} />
                    <span>Unit</span>
                  </Link>
                  <Link to='size' className={`umenu_item ${(activeLocation === '/admin/size' || activeLocation === '/admin/addsize' || activeLocation == '/admin/editsize') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/size' || activeLocation === '/admin/addsize' || activeLocation == '/admin/editsize') ? size1 : size} />
                    <span>Size</span>
                  </Link>
                  <Link to='stock' className={`umenu_item ${(activeLocation === '/admin/stock' || activeLocation === '/admin/addStock' || activeLocation === '/admin/editStock') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/stock' || activeLocation === '/admin/addStock' || activeLocation === '/admin/editStock') ? stock1 : stock} />
                    <span>Stock</span>
                  </Link>
                  <Link to='order' className={`umenu_item ${(activeLocation === '/admin/order' || activeLocation === '/admin/vieworder') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/order' || activeLocation === '/admin/vieworder') ? order1 : order} />
                    <span>Order</span>
                  </Link>
                  <Link to='review' className={`umenu_item ${(activeLocation === '/admin/review' || activeLocation === '/admin/viewreview') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/review' || activeLocation === '/admin/viewreview') ? review1 : review} />
                    <span>Review</span>
                  </Link>
                  <Link to='returnorder' className={`umenu_item ${(activeLocation === '/admin/returnorder' || activeLocation === '/admin/viewstatus') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/returnorder' || activeLocation === '/admin/viewstatus') ? returnOrder1 : returnOrder} />
                    <span>Return Order</span>
                  </Link>
                  <Link to='cancleorder' className={`umenu_item ${activeLocation === '/admin/cancleorder' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/cancleorder' ? cancelOrder1 : cancelOrder} />
                    <span>Cancel Order</span>
                  </Link>
                  <Link to='reasonofcancellation' className={`umenu_item ${activeLocation === '/admin/reasonofcancellation' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/admin/reasonofcancellation' ? resonCancellation1 : resonCancellation} />
                    <span>Reason for Cancellation</span>
                  </Link>
                  <Link to='tandc' className={`umenu_item ${(activeLocation === '/admin/tandc' || activeLocation === '/admin/viewtandc') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/tandc' || activeLocation === '/admin/viewtandc') ? termCondition1 : termCondition} />
                    <span>Terms & Conditions</span>
                  </Link>
                  <Link to='faqs' className={`umenu_item ${(activeLocation === '/admin/faqs' || activeLocation === '/admin/viewfaqs') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/faqs' || activeLocation === '/admin/viewfaqs') ? faq1 : faq} />
                    <span>FAQ's</span>
                  </Link>
                  <Link to='privacypolicy' className={`umenu_item ${(activeLocation === '/admin/privacypolicy' || activeLocation === '/admin/viewPrivacypolicy') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/privacypolicy' || activeLocation === '/admin/viewPrivacypolicy') ? privacyPolicy1 : privacyPolicy} />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link to='contactus' className={`umenu_item ${(activeLocation === '/admin/contactus' || activeLocation === '/admin/viewcontactus') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/contactus' || activeLocation === '/admin/viewcontactus') ? contact1 : contact} />
                    <span>Contact Us</span>
                  </Link>
                  <Link to='aboutus' className={`umenu_item ${(activeLocation === '/admin/aboutus' || activeLocation === '/admin/ViewaboutUs') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/admin/aboutus' || activeLocation === '/admin/ViewaboutUs') ? aboutUs1 : aboutUs} />
                    <span>About Us</span>
                  </Link>
                </>
              ) : (
                 userType === "customer" ? ( <>
                  <Link to='dashboard' className={`umenu_item ${activeLocation === '/customer/dashboard' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/customer/dashboard' ? dashboard1 : dashboard}></img>
                    <span>Dashboard</span>
                  </Link>
                  <Link to='order' className={`umenu_item ${(activeLocation === '/customer/order' || activeLocation === '/customer/vieworder') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/customer/order' || activeLocation === '/customer/vieworder') ? order1 : order} />
                    <span>Order</span>
                  </Link>
                  <Link to='review' className={`umenu_item ${(activeLocation === '/customer/review' || activeLocation === '/customer/viewreview') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/customer/review' || activeLocation === '/customer/viewreview') ? review1 : review} />
                    <span>Review</span>
                  </Link>
                  <Link to='returnorder' className={`umenu_item ${(activeLocation === '/customer/returnorder' || activeLocation === '/customer/viewstatus') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/customer/returnorder' || activeLocation === '/customer/viewstatus') ? returnOrder1 : returnOrder} />
                    <span>Return Order</span>
                  </Link>
                  <Link to='cancelorder' className={`umenu_item ${activeLocation === '/customer/cancelorder' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/customer/cancelorder' ? cancelOrder1 : cancelOrder} />
                    <span>Cancel Order</span>
                  </Link>
                </>) : ( <>
                   <Link to='order' className={`umenu_item ${(activeLocation === '/service/order' || activeLocation === '/service/vieworder') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/service/order' || activeLocation === '/service/vieworder') ? order1 : order} />
                    <span>Order</span>
                  </Link>
                  <Link to='returnorder' className={`umenu_item ${(activeLocation === '/service/returnorder' || activeLocation === '/service/viewstatus') ? 'uactive' : ''}`}>
                    <img src={(activeLocation === '/service/returnorder' || activeLocation === '/service/viewstatus') ? returnOrder1 : returnOrder} />
                    <span>Return Order</span>
                  </Link>
                  <Link to='cancelorder' className={`umenu_item ${activeLocation === '/service/cancelorder' ? 'uactive' : ''}`}>
                    <img src={activeLocation === '/service/cancelorder' ? cancelOrder1 : cancelOrder} />
                    <span>Cancel Order</span>
                  </Link>
                </>)
              )}

              
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* *************** Log Out ************** */}
      <Modal show={logOut} onHide={() => setLogOut(false)} aria-labelledby="contained-modal-title-vcenter " className='sp_add_modal' centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Logout</h4>
                    <div className='spmodal_main_div'>
                      <p className='mb-0 sp_text_gray text-center'>Are you sure you want to logout ?</p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                       <button onClick={()=> setLogOut(false)} className='ds_user_cancel'>Cancel</button>
                       <button onClick={handelLogout} className='ds_user_add'>Logout</button>
                    </div>
                </Modal.Body>
        </Modal>
    </>
  );
};

export default Header;
