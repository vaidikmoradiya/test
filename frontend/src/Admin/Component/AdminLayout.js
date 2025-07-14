import React, { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Sidebar from "../AdminPanel/Sidebar";

const AdminLayout = () => {

const [mainToggle, setMainToggle] = useState(false)

  return (
    <div className="d-flex">
         <div className={`${mainToggle ? ' sp_activeSidebar' : 'sp_sidebar' }`}>
           <Sidebar />
        </div>
      <div className={`${mainToggle ? 'sp_activeMainsec' : ' sp_mainsec'}`}>
          <Header mainToggle={mainToggle} setMainToggle={setMainToggle} userType="admin" />
          <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout
