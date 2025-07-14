import React, { useEffect, useState } from "react";
import "../Css/Umang.css";

import dashboard1 from "../Image/Umang/dashBoard.svg";
import order from "../Image/Umang/order.svg";
import review from "../Image/Umang/review.svg";
import returnOrder from "../Image/Umang/returnOrder.svg";
import cancelOrder from "../Image/Umang/cancelOrder.svg";
import { Link, useLocation } from "react-router-dom";
import dashboard from "../Image/Umang/dashboard1.svg";
import order1 from "../Image/Umang/order1.svg";
import review1 from "../Image/Umang/review1.svg";
import returnOrder1 from "../Image/Umang/returnOrder1.svg";
import cancelOrder1 from "../Image/Umang/cancleOrder1.svg";

const Sidebar = () => {

  const [activeLocation,setActiveLocation] = useState('dashboard');

  const location = useLocation(); 
  useEffect(() => {
    setActiveLocation(location.pathname);
    console.log('data',location.pathname)
  }, [location.pathname]);

  return (
    <>
      <div className="w-100" id="sidebar">
        <div className="usidebar_header">
          <div className="ulogo">LOGO</div>
        </div>
        <div className="menu-items">
          <Link to='dashboard' className={`umenu_item ${activeLocation === '/customer/dashboard' ? 'uactive' :''}`}>
             <img src={activeLocation === '/customer/dashboard' ? dashboard1 : dashboard}></img>
            <span>Dashboard</span>
          </Link>
          <Link to='order' className={`umenu_item ${(activeLocation === '/customer/order' || activeLocation==='/customer/vieworder') ? 'uactive' :''}`}>
              <img src={(activeLocation === '/customer/order' || activeLocation==='/customer/vieworder') ? order1 : order} />
            <span>Order</span>
          </Link>
          <Link to='review' className={`umenu_item ${(activeLocation === '/customer/review' || activeLocation === '/customer/viewreview') ? 'uactive' :''}`}>
              <img src={(activeLocation === '/customer/review' || activeLocation === '/customer/viewreview') ? review1 : review} />
            <span>Review</span>
          </Link>
          <Link to='returnorder' className={`umenu_item ${(activeLocation === '/customer/returnorder' || activeLocation === '/customer/viewstatus') ? 'uactive' :''}`}>
              <img src={(activeLocation === '/customer/returnorder' || activeLocation === '/customer/viewstatus') ?returnOrder1 :returnOrder} />
            <span>Return Order</span>
          </Link>
           <Link to='cancelorder' className={`umenu_item ${activeLocation === '/customer/cancelorder' ? 'uactive' :''}`}>
              <img src={activeLocation === '/customer/cancelorder' ? cancelOrder1 : cancelOrder} />
             <span>Cancel Order</span>
           </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
