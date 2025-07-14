import React from "react";

import profileImg from "../Image/Umang/profileImg.png";

const ViewProfile = () => {
  return (
    <div className="sp_height">
      <div className="uprofile_header">View Profile</div>

      <div className="d-flex p-4">
        <div className="uprofile_container">
          <div className="uprofile_image_container">
            <img
              className="uprofile_image"
              src={profileImg}
              alt="Profile Photo"
            />
          </div>
          <div className="uprofile_name">Johan Patel</div>
          <div className="uprofile_email">example@gmail.com</div>
          <div className="uprofile_divider"></div>
          <div className="uprofile_info_section">
            <div className="uprofile_info_header">Personal Information</div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Role :</div>
              <div className="uprofile_info_value">Customer</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Name :</div>
              <div className="uprofile_info_value">Johan Patel</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Email :</div>
              <div className="uprofile_info_value">example@gmail.com</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Contact No :</div>
              <div className="uprofile_info_value">+91 9652012000</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Gender :</div>
              <div className="uprofile_info_value">Male</div>
            </div>
          </div>
        </div>

        <div className="ucontainer">
          <div className="uheader">
            <h1 className="mb-0">Account Settings</h1>
            <div className="ubutton_group">
              <button className="ubtn ubtn_cancel">Cancel</button>
              <button className="ubtn ubtn_save">Save Changes</button>
            </div>
          </div>

          <div className="usection">
            <h2 className="usection_title">Edit Profile</h2>

            <div className="uprofile_pic_container">
              <div className="uprofile_pic">
                <img src={profileImg} />
                <div className="ucamera_icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="uform_grid ">
              <div className="uform_group">
                <label className="uform_label">Name</label>
                <input type="text" className="uform_control" />
              </div>

              <div className="uform_group">
                <label className="uform_label">Email</label>
                <input type="email" className="uform_control" />
              </div>

              <div className="uform_group">
                <label className="uform_label">Contact No.</label>
                <input type="tel" className="uform_control" />
              </div>

              <div className="uform_group">
                <label className="uform_label">Gender</label>
                <input type="text" className="uform_control" />
              </div>
            </div>
          </div>

          <div className="usection">
            <h2 className="usection_title">Change Password</h2>

            <div className="uform_group">
              <label className="uform_label">Old Password</label>
              <input
                type="password"
                className="uform_control"
                placeholder="Enter Old Password"
              />
            </div>

            <div className="uform_group">
              <label className="uform_label">New Password</label>
              <input
                type="password"
                className="uform_control"
                placeholder="Enter New Password"
              />
            </div>

            <div className="uform_group">
              <label className="uform_label">Confirm New Password</label>
              <input
                type="password"
                className="uform_control"
                placeholder="Enter Confirm Password"
              />
            </div>
          </div>
        </div>  
      </div>
    </div>
  );
};

export default ViewProfile;
