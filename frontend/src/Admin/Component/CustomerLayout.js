import React, { useState } from "react";
import Sidebar from "../CustomerPanel/Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
  const [mainToggle, setMainToggle] = useState(false);
  return (
    <>
      <div className="d-flex">
        <div className={`${mainToggle ? " sp_activeSidebar" : "sp_sidebar"}`}>
          <Sidebar />
        </div>
        <div className={`${mainToggle ? "sp_activeMainsec" : " sp_mainsec"}`}>
          <Header mainToggle={mainToggle} setMainToggle={setMainToggle} userType="customer" />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default CustomerLayout;
