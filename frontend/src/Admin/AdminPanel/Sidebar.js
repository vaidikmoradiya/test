import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import "../Css/Umang.css";

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
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
const Sidebar = () => {
  
  const [activeLocation,setActiveLocation] = useState('dashboard');

  const location = useLocation(); //
  useEffect(() => {
    setActiveLocation(location.pathname);
    // console.log('data',location.pathname)
  }, [location.pathname]);

  return (
    <>
      <div className="w-100" id="sidebar">
        <div className="usidebar_header">
          <div className="ulogo">LOGO</div>
        </div>
        <div className="menu-items">
          <Link to='dashboard' className={`umenu_item ${activeLocation === '/admin/dashboard' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/dashboard' ? dashboard1 : dashboard}></img>
            <span>Dashboard</span>
          </Link>
          {/* <Link to='role' className={`umenu_item ${activeLocation === '/admin/role' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/role' ? role1 : role} />
            <span>Role</span>
          </Link> */}
          <Link to='user' className={`umenu_item ${activeLocation === '/admin/user' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/user' ? user1 : user} />
            <span>User</span>
          </Link>
          {/* <Link to='customer' className={`umenu_item ${activeLocation === '/admin/customer' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/customer' ? customer1 : customer} />
            <span>Customer</span>
          </Link> */}
          <Link to='maincategory' className={`umenu_item ${activeLocation === '/admin/maincategory' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/maincategory' ?mainCategory1 : mainCategory} />
            <span>Main Category</span>
          </Link>
          <Link to='category' className={`umenu_item ${activeLocation === '/admin/category' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/category' ? category1 : category} />
            <span>Category</span>
          </Link>
          <Link to='subcategory' className={`umenu_item ${activeLocation === '/admin/subcategory' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/subcategory' ? subCategory1 : subCategory} />
            <span>Sub Category</span>
          </Link>
          <Link to='product' className={`umenu_item ${(activeLocation === '/admin/product' || activeLocation === '/admin/addproduct' || activeLocation === '/admin/editproduct' || activeLocation ==='/admin/viewproduct')  ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/product' || activeLocation === '/admin/addproduct' || activeLocation === '/admin/editproduct' || activeLocation ==='/admin/viewproduct')  ? products1 : products} />
            <span>Products</span>
          </Link>
          <Link to='unit' className={`umenu_item ${activeLocation === '/admin/unit' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/unit' ? unit1 : unit} />
            <span>Unit</span>
          </Link>
          <Link to='size' className={`umenu_item ${(activeLocation === '/admin/size' || activeLocation === '/admin/addsize' || activeLocation=='/admin/editsize' ) ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/size' || activeLocation === '/admin/addsize' || activeLocation=='/admin/editsize' ) ? size1 : size} />
            <span>Size</span>
          </Link>
          <Link to='stock' className={`umenu_item ${(activeLocation === '/admin/stock' || activeLocation === '/admin/addStock' || activeLocation === '/admin/editStock' ) ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/stock' || activeLocation === '/admin/addStock' || activeLocation === '/admin/editStock' ) ? stock1 : stock} />
            <span>Stock</span>
          </Link>
          <Link to='order' className={`umenu_item ${(activeLocation === '/admin/order' || activeLocation==='/admin/vieworder') ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/order' || activeLocation==='/admin/vieworder') ? order1 : order} />
            <span>Order</span>
          </Link>
          <Link to='expence' className={`umenu_item ${activeLocation === '/admin/expence' ? 'uactive' :''}`}>
            {activeLocation === '/admin/expence' ?<RiMoneyRupeeCircleFill  className="mv_icon_size"/> : <RiMoneyRupeeCircleLine className="mv_icon_size" />}
            <span>Expence</span>
          </Link>
          <Link to='review' className={`umenu_item ${(activeLocation === '/admin/review' || activeLocation === '/admin/viewreview') ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/review' || activeLocation === '/admin/viewreview') ? review1 : review} />
            <span>Review</span>
          </Link>
          <Link to='returnorder' className={`umenu_item ${(activeLocation === '/admin/returnorder' || activeLocation === '/admin/viewstatus') ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/returnorder' || activeLocation === '/admin/viewstatus') ?returnOrder1 :returnOrder} />
            <span>Return Order</span>
          </Link>
          <Link to='cancleorder' className={`umenu_item ${activeLocation === '/admin/cancleorder' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/cancleorder' ? cancelOrder1 : cancelOrder} />
            <span>Cancel Order</span>
          </Link>
          <Link to='reasonofcancellation' className={`umenu_item ${activeLocation === '/admin/reasonofcancellation' ? 'uactive' :''}`}>
            <img src={activeLocation === '/admin/reasonofcancellation' ? resonCancellation1 : resonCancellation} />
            <span>Reason for Cancellation</span>
          </Link>
          <Link to='tandc' className={`umenu_item ${(activeLocation === '/admin/tandc' || activeLocation === '/admin/viewtandc'  ) ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/tandc' || activeLocation === '/admin/viewtandc'  ) ?  termCondition1 : termCondition} />
            <span>Terms & Conditions</span>
          </Link>
          <Link to='FaqCat' className={`umenu_item ${(activeLocation === '/admin/FaqCat' ) ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/FaqCat' ) ? faq1 : faq} />
            <span>FAQ's Category</span>
          </Link>
          <Link to='faqs' className={`umenu_item ${(activeLocation === '/admin/faqs' || activeLocation === '/admin/viewfaqs' ) ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/faqs' || activeLocation === '/admin/viewfaqs' ) ? faq1 : faq} />
            <span>FAQ's</span>
          </Link>
          <Link to='privacypolicy' className={`umenu_item ${(activeLocation === '/admin/privacypolicy' || activeLocation === '/admin/viewPrivacypolicy') ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/privacypolicy' || activeLocation === '/admin/viewPrivacypolicy') ? privacyPolicy1 : privacyPolicy} />
            <span>Privacy Policy</span>
          </Link>
          <Link to='contactus' className={`umenu_item ${(activeLocation === '/admin/contactus' || activeLocation === '/admin/viewcontactus' ) ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/contactus' || activeLocation === '/admin/viewcontactus' ) ? contact1 : contact} />
            <span>Contact Us</span>
          </Link>
          <Link to='aboutus' className={`umenu_item ${(activeLocation === '/admin/aboutus' || activeLocation==='/admin/ViewaboutUs') ? 'uactive' :''}`}>
            <img src={(activeLocation === '/admin/aboutus' || activeLocation==='/admin/ViewaboutUs') ? aboutUs1 :aboutUs} />
            <span>About Us</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
