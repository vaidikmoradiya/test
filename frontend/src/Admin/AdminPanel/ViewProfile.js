import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import "../Css/Umang.css";
import { useDispatch, useSelector } from 'react-redux';
import profileImg from "../Image/Umang/profileImg.png";
import { EditUserData, GetSingleUserData } from "../../Redux-Toolkit/ToolkitSlice/Admin/ViewProfileSlice";
import { ChangePassword } from "../../Redux-Toolkit/ToolkitSlice/User/LoginSlice";
import * as Yup from 'yup'
import axios from 'axios';
import { IoEye, IoEyeOff } from "react-icons/io5";

const ViewProfile = () => {
  const dispatch = useDispatch();
  const viewProfileData = useSelector((state) => state?.profile?.GetSingleUserData);
  const EditData = useSelector((state) => state?.profile?.GetSingleUserData);
  const { success } = useSelector((state) => state.profile);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  console.log("EditData",EditData);
  const Back_URL = 'http://localhost:5000/'
  
  useEffect(() => {
    dispatch(GetSingleUserData());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      dispatch(GetSingleUserData());
      // Optionally show a toast or message here
    }
  }, [success, dispatch]);

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Success Modal Component
  const SuccessModal = () => (
    <div className="mv_modal_overlay">
      <div className="mv_modal_content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#4CAF50',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
            </svg>
          </div>
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Password Changed Successfully!</h3>
        </div>
      </div>
    </div>
  );

  // Error Modal Component
  const ErrorModal = () => (
    <div className="mv_modal_overlay">
      <div className="mv_modal_content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#f44336',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
            </svg>
          </div>
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Password Change Failed</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Please check your old password and try again.</p>
        </div>
      </div>
    </div>
  );

  // Prepare initial values for Formik
  const initialValues = {
    name: [viewProfileData?.firstName, viewProfileData?.lastName].filter(Boolean).join(" ") || "",
    email: viewProfileData?.email || "",
    contactNo: viewProfileData?.mobileNo || "",
    gender: viewProfileData?.gender || "",
  };

  const formik = useFormik({
    enableReinitialize: true,

    initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      email: Yup.string().required('Email is required'),
      contactNo: Yup.string()
      .matches(/^[0-9]{10}$/, 'Contact No must be 10 digits')
      .required('Contact No is required'),
      gender: Yup.string().required('Gender is required'),
    }),
    onSubmit: (values) => {
      const [firstName, ...lastNameArr] = values.name.split(" ");
      const lastName = lastNameArr.join(" ");
      dispatch(EditUserData({
        values: {
          firstName,
          lastName,
          email: values.email,
          contactNo: values.contactNo,
          gender: values.gender,
          profilePhotoFile: selectedImage
        },
        editData: viewProfileData
      })).then((response)=>{
        console.log("response.type",response.type)
        if(response.type === "edituserdata/fulfilled")
        dispatch(GetSingleUserData());
      });
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('Old password is required'),
      newPassword: Yup.string()
        .min(6, 'New password must be at least 6 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      dispatch(ChangePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      })).then((response) => {
        if (response.payload?.status === 200) {
          setShowSuccessModal(true);
          resetForm();
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 2000);
        } else {
          setShowErrorModal(true);
          setTimeout(() => {
            setShowErrorModal(false);
          }, 2000);
        }
      }).catch((error) => {
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
      });
    },
  });

  return (
    <div className="sp_height">
      <div className="uprofile_header">View Profile</div>
      
      <div className="d-flex p-4">

    
        <div className="uprofile_container">
          <div className="uprofile_image_container">
            <img
              className="uprofile_image"
              src={imagePreview || `${Back_URL}${viewProfileData?.image}` || profileImg}
              alt="Profile Photo"
            />
          </div>
          <div className="uprofile_name">{initialValues.name}</div>
          <div className="uprofile_email">{initialValues.email}</div>
          <div className="uprofile_divider"></div>
          <div className="uprofile_info_section">
            <div className="uprofile_info_header">Personal Information</div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Role :</div>
              <div className="uprofile_info_value">{viewProfileData?.role || "Admin"}</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Name :</div>
              <div className="uprofile_info_value">{initialValues.name}</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Email :</div>
              <div className="uprofile_info_value">{initialValues.email}</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Contact No :</div>
              <div className="uprofile_info_value">{initialValues.contactNo}</div>
            </div>
            <div className="uprofile_info_row">
              <div className="uprofile_info_label">Gender :</div>
              <div className="uprofile_info_value">{initialValues.gender}</div>
            </div>
          </div>
        </div>

        <div className="ucontainer">
          <form onSubmit={formik.handleSubmit}>
            <div className="uheader">
              <h1 className="mb-0">Account Settings</h1>
              <div className="ubutton_group">
                <button type="button" className="ubtn ubtn_cancel">Cancel</button>
                <button type="submit" className="ubtn ubtn_save">Save Changes</button>
              </div>
            </div>

            <div className="usection">
              <h2 className="usection_title">Edit Profile</h2>

              <div className="uprofile_pic_container">
                <div className="uprofile_pic">
                  <img 
                    src={imagePreview || `${Back_URL}${viewProfileData?.image}` || profileImg} 
                    alt="Profile"
                  />
                  <div className="ucamera_icon">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                      <path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 384c-53 0-96-43-96-96s43-96 96-96s96 43 96 96s-43 96-96 96z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="uform_grid ">
                <div className="uform_group">
                  <label className="uform_label">Name</label>
                  <input
                    type="text"
                    className="uform_control"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.name && formik.errors.name && (<div className="uform_error text-danger">{formik.errors.name}</div>)}
                </div>
                
                <div className="uform_group">
                  <label className="uform_label">Email</label>
                  <input
                    type="email"
                    className="uform_control"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.email && formik.errors.email && (<div className="uform_error text-danger">{formik.errors.email}</div>)}
                </div>

                <div className="uform_group">
                  <label className="uform_label">Contact No.</label>
                  <input
                    type="tel"
                    className="uform_control"
                    name="contactNo"
                    value={formik.values.contactNo}
                    onChange={(e) => {
                      // Only allow numbers
                      const value = e.target.value.replace(/\D/g, "");
                      // Limit to 10 digits
                      if (value.length <= 10) {
                        formik.setFieldValue("contactNo", value);
                      }
                    }}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    minLength={10}
                    placeholder="Enter 10 digit number"
                  />
                  {formik.touched.contactNo && formik.errors.contactNo && (
                    <div className="uform_error text-danger">{formik.errors.contactNo}</div>
                  )}
                </div>

                <div className="uform_group">
                  <label className="uform_label">Gender</label>
                  <input
                    type="text"
                    className="uform_control"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                  />
                  {formik.touched.gender && formik.errors.gender && (<div className="uform_error text-danger">{formik.errors.gender}</div>)}
                </div>
              </div>
            </div>
          </form>

          <form onSubmit={passwordFormik.handleSubmit}>
            <div className="usection">
              <h2 className="usection_title">Change Password</h2>
              <div className="uform_group">
                <label className="uform_label">Old Password</label>
                <div className="password-input position-relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    className="uform_control"
                    name="oldPassword"
                    placeholder="Enter Old Password"
                    value={passwordFormik.values.oldPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  <span className="mv_password_toggle" onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <IoEye /> : <IoEyeOff />}
                  </span>
                </div>
                {passwordFormik.touched.oldPassword && passwordFormik.errors.oldPassword && (
                  <div className="uform_error text-danger">{passwordFormik.errors.oldPassword}</div>
                )}
              </div>
              <div className="uform_group">
                <label className="uform_label">New Password</label>
                <div className="password-input position-relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    className="uform_control"
                    name="newPassword"
                    placeholder="Enter New Password"
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  <span className="mv_password_toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <IoEye /> : <IoEyeOff />}
                  </span>
                </div>
                {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && (
                  <div className="uform_error text-danger">{passwordFormik.errors.newPassword}</div>
                )}
              </div>
              <div className="uform_group">
                <label className="uform_label">Confirm New Password</label>
                <div className="password-input position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="uform_control"
                    name="confirmPassword"
                    placeholder="Enter Confirm Password"
                    value={passwordFormik.values.confirmPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                  />
                  <span className="mv_password_toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <IoEye /> : <IoEyeOff />}
                  </span>
                </div>
                {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword && (
                  <div className="uform_error text-danger">{passwordFormik.errors.confirmPassword}</div>
                )}
              </div>
              <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                <button type='button' className='ds_user_cancel' onClick={passwordFormik.handleReset}>Cancel</button>
                <button type='submit' className='ds_user_add'>Changes</button>
              </div>
            </div>
          </form>

        </div>
      </div>
      {showSuccessModal && <SuccessModal />}
      {showErrorModal && <ErrorModal />}
    </div>
  );
};

export default ViewProfile;
