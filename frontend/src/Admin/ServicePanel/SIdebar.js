import React, { useEffect, useState } from "react";

import dashboard from "../Image/Umang/dashBoard.svg";
import order from "../Image/Umang/order.svg";
import review from "../Image/Umang/review.svg";
import returnOrder from "../Image/Umang/returnOrder.svg";
import cancelOrder from "../Image/Umang/cancelOrder.svg";
import { Link, useLocation } from "react-router-dom";
import order1 from "../Image/Umang/order1.svg";
import returnOrder1 from "../Image/Umang/returnOrder1.svg";
import cancelOrder1 from "../Image/Umang/cancleOrder1.svg";

const SIdebar = () => {

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
          <Link to='order' className={`umenu_item ${(activeLocation === '/service/order' || activeLocation==='/service/vieworder') ? 'uactive' :''}`}>
            <img src={(activeLocation === '/service/order' || activeLocation==='/service/vieworder') ? order1 : order} />
            <span>Order</span>
          </Link>
          <Link to='returnorder' className={`umenu_item ${(activeLocation === '/service/returnorder' || activeLocation === '/service/viewstatus') ? 'uactive' :''}`}>
            <img src={(activeLocation === '/service/returnorder' || activeLocation === '/service/viewstatus') ?returnOrder1 :returnOrder} />
            <span>Return Order</span>
          </Link>
          <Link to='cancelorder' className={`umenu_item ${activeLocation === '/service/cancelorder' ? 'uactive' :''}`}>
            <img src={activeLocation === '/service/cancelorder' ? cancelOrder1 : cancelOrder} />
            <span>Cancel Order</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SIdebar;
