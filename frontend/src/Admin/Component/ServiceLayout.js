import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import SIdebar from '../ServicePanel/SIdebar';
import Header from './Header';

const ServiceLayout = () => {
    const [mainToggle, setMainToggle] = useState(false);
  return (
    <>
    <div className="d-flex">
        <div className={`${mainToggle ? " sp_activeSidebar" : "sp_sidebar"}`}>
          <SIdebar />
        </div>
        <div className={`${mainToggle ? "sp_activeMainsec" : " sp_mainsec"}`}>
          <Header mainToggle={mainToggle} setMainToggle={setMainToggle} userType="service" />
          <Outlet />
        </div>
      </div>
    
    </>
  )
}

export default ServiceLayout
