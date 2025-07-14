import React, { useEffect, useRef, useState } from 'react'
import '../Css/Savani.css'
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'
import { useFormik } from "formik";
import { ForgetPassSchema, LoginSchema, ResetPassSchema, VerifyOtpSchema } from '../Formik';
import { useDispatch } from 'react-redux';
import { ForgetPass, LoginAdmin, ResendOtp, ResetPass, VerifyOtp } from '../../Redux-Toolkit/ToolkitSlice/Admin/LoginSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {

const [type, setType] = useState("password")
const [type2, setType2] = useState("password")
const [toggle, setToggle] = useState("login")
const inputs = useRef([]);
const dispatch = useDispatch()
const navigate = useNavigate()
const token = localStorage.getItem("login");

useEffect(() => {
   if (token) {
     navigate("/admin/dashboard", { replace: true });
   }
 }, [token, navigate]);

const loginVal = {
   email:"",
   password:""
}
const LoginFormik = useFormik({
    initialValues:loginVal,
    validationSchema:LoginSchema,
    onSubmit:(values , action)=>{
       dispatch(LoginAdmin(values))
       .then(() => {
         navigate("/admin/dashboard", { replace: true });
       })
       .catch((error) => {
         console.error("Login failed:", error);
       });  
       action.resetForm();   
    }
})

const forgetVal = {
   email:""
}

const ForgetPassFormik = useFormik({
   initialValues:forgetVal,
   validationSchema:ForgetPassSchema,
   onSubmit:(values , action)=>{
      dispatch(ForgetPass(values))
      .then(()=>{
         setToggle("otp")
      }).catch((error)=>{
         alert(error)
      })
      action.resetForm();
   }
})


const VerifyOtpFormik = useFormik({
    initialValues:{
      otp0:"",
      otp1:"",
      otp2:"",
      otp3:"",
      otp4:"",
      otp5:"",
    },
    validationSchema:VerifyOtpSchema,
    onSubmit:(values)=>{
       const finalOtp = parseFloat(values.otp0 + values.otp1 + values.otp2 + values.otp3 + values.otp4 + values.otp5);
       dispatch(VerifyOtp(finalOtp))
       .then(()=>{
         setToggle("resetpassword")
       }).catch((error)=>{
          alert("VerifyOtp" , error)
       })
    }
})

const handleChange = (index, e) => {
   const { value } = e.target;

   if (/^\d?$/.test(value)) {
      VerifyOtpFormik.setFieldValue(`otp${index}`, value);

     if (value && index < 5) {
       inputs.current[index + 1]?.focus();
     }
   }
 };

 const handleKeyDown = (index, e) => {
   if (e.key === "Backspace" && !VerifyOtpFormik.values[`otp${index}`] && index > 0) {
      inputs.current[index - 1]?.focus();
   }
 };

const resetPassVal = {
   newPass:"",
   confirmPass:""
} 
const ResetPassFormik = useFormik({
    initialValues:resetPassVal,
    validationSchema:ResetPassSchema,
    onSubmit:(values)=>{
        dispatch(ResetPass(values))
        .then((response)=>{
          alert(response)
          setToggle("login")
        }).catch((error)=>{
          alert(error)
        })
    }
}) 

const handleResendOtp = () => {
   dispatch(ResendOtp())
   .then(()=>{
      alert("Please Check Email")
   })
   .catch((error)=>{
      alert("Resend Otp" , error)
   })
}


  return (
    <div>
       <div className='d-flex flex-wrap' style={{height:"100vh"}}>
            <div className="col-xl-3 col-lg-4 col-md-12 col-sm-12 col-12 position-relative">
                <div className='d-flex flex-column justify-content-center align-item   s-center h-100'>

                    {toggle === "login" && <div className='ds_login_box'>
                      <h5 className='mb-0 fw-bold'>LOGIN</h5>
                      <p className='ds_text ds_login_text mt-1'>Welcome back! Login to your account</p>
                      <form onSubmit={LoginFormik.handleSubmit} className='mt-5'>
                          <div className="form-group">
                            <label className='ds_login_label' >Email</label>
                            <input type="email" name='email' value={LoginFormik.values.email} onChange={LoginFormik.handleChange} onBlur={LoginFormik.handleBlur}  className="form-control ds_login_input mt-1" placeholder='Enter Email'/>
                            {LoginFormik.touched.email && LoginFormik.errors.email && (<div className="ds_forget mt-1">{LoginFormik.errors.email}</div>)}
                          </div>
                          <div className="form-group mt-3">
                             <div className='position-relative'>
                                <label className='ds_login_label' >Password</label>
                                <input type={type} name={type} value={LoginFormik.values.password} onChange={LoginFormik.handleChange} onBlur={LoginFormik.handleBlur}  className="form-control ds_login_input mt-1" placeholder='Enter Password' />
                                {LoginFormik.touched.password && LoginFormik.errors.password && (<div className="ds_forget mt-1">{LoginFormik.errors.password}</div>)}
                                {type === "password" ? <IoIosEyeOff onClick={()=> setType("text")} className="ds_login_eye" /> : <IoIosEye onClick={()=> setType("password")} className='ds_login_eye' /> }
                             </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mt-2 w-100">
                             <div>
                                <input type="checkbox" className="form-check-input ds_login_check" id="exampleCheck1"/>
                                <label className="form-check-label ds_login_label ds_text ms-2" htmlFor="exampleCheck1">Remember Me</label>
                             </div>
                             <p className='ds_forget mb-0 ds_cursor' onClick={()=> setToggle("forgetpassword")}>Forgot Password?</p>
                          </div>
                          <div className='mt-5 mb-2 '>
                             <button type='submit' className='ds_login_submit' > Login</button>
                          </div>
                       </form>
                   </div>}

                   {toggle === "forgetpassword" && <div className='ds_login_box'>
                      <h5 className='mb-0 fw-bold text-uppercase'>Forgot password</h5>
                      <p className='ds_text ds_login_text mt-1'>Enter your email below to recover your password</p>
                      <form onSubmit={ForgetPassFormik.handleSubmit} className='mt-5'>
                          <div className="form-group">
                            <label className='ds_login_label' >Email</label>
                            <input type="email" name='email' value={ForgetPassFormik.values.email} onChange={ForgetPassFormik.handleChange} onBlur={ForgetPassFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Email' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                            {ForgetPassFormik.touched.email && ForgetPassFormik.errors.email && (<div className="ds_forget mt-1">{ForgetPassFormik.errors.email}</div>)}
                          </div>
                          <div className='mt-5 mb-2 '>
                             <button type='submit' className='ds_login_submit' >Send Code</button>
                          </div>
                       </form>
                   </div>}

                   {toggle === "otp" && <div className='ds_login_box'>
                      <h5 className='mb-0 fw-bold text-uppercase'>Verify otp</h5>
                      <p className='ds_text ds_login_text mt-1'>Enter verification code to reset your password</p>
                      <form onSubmit={VerifyOtpFormik?.handleSubmit} className='mt-5'>
                          <div className='d-flex justify-content-between'>
                          {[0 , 1 , 2 , 3 , 4 , 5]?.map((i) => (
                            <input
                               key={i}
                               type="text"
                               name={`otp${i}`}
                               id={`otp-${i}`}
                               className='ds_otp_input'
                               maxLength="1"
                               value={VerifyOtpFormik.values[`otp${i}`]}
                               onChange={(e) => handleChange(i, e)}
                               onBlur={VerifyOtpFormik.handleBlur}
                               onKeyDown={(e) => handleKeyDown(i, e)}
                               ref={(el) => (inputs.current[i] = el)}
                            />
                           ))}
                          </div>
                           {(['otp0', 'otp1', 'otp2', 'otp3' , 'otp4' , 'otp5'].some(field => VerifyOtpFormik.errors[field] && VerifyOtpFormik.touched[field])) && (
                             <p className="ds_forget mt-1" style={{fontSize:"14px"}}>All OTP fields are required</p>
                           )}
                          <div className='mt-5 mb-2 '>
                             <button type='submit' className='ds_login_submit' >Verify</button>
                          </div>
                          <p className='text-center ds_text ds_login_text'>Didn’t received code? <span onClick={handleResendOtp} style={{color:"rgba(30, 33, 49, 1)"}} className='text-decoration-underline ds_cursor fw-bold'>Resend</span></p>
                      </form>
                   </div>}

                   {toggle === "resetpassword" && <div className='ds_login_box'>
                      <h5 className='mb-0 fw-bold'>Reset password</h5>
                      <p className='ds_text ds_login_text mt-1'>Reset your password here & login with new password</p>
                      <form onSubmit={ResetPassFormik.handleSubmit} className='mt-5'>
                        <div className="form-group mt-3">
                             <div className='position-relative'>
                                <label className='ds_login_label' >Password</label>
                                <input type={type} name="newPass" value={ResetPassFormik.values.newPass} onChange={ResetPassFormik.handleChange} onBlur={ResetPassFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Password' id="exampleInputPassword1"/>
                                {type === "password" ? <IoIosEyeOff onClick={()=> setType("text")} className="ds_login_eye" /> : <IoIosEye onClick={()=> setType("password")} className='ds_login_eye' /> }
                                {ResetPassFormik.touched.newPass && ResetPassFormik.errors.newPass && (<div className="ds_forget mt-1">{ResetPassFormik.errors.newPass}</div>)}
                             </div>
                          </div>
                          <div className="form-group mt-3">
                             <div className='position-relative'>
                                <label className='ds_login_label' >Confirm Password</label>
                                <input type={type2} name='confirmPass' value={ResetPassFormik.values.confirmPass} onChange={ResetPassFormik.handleChange} onBlur={ResetPassFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Confirm Password' id="exampleInputPassword1"/>
                                {type2 === "password" ? <IoIosEyeOff onClick={()=> setType2("text")} className="ds_login_eye" /> : <IoIosEye onClick={()=> setType2("password")} className='ds_login_eye' /> }
                                {ResetPassFormik.touched.confirmPass && ResetPassFormik.errors.confirmPass && (<div className="ds_forget mt-1">{ResetPassFormik.errors.confirmPass}</div>)}
                             </div>
                          </div>
                          <div className='mt-5 mb-2 '>
                             <button type='submit' className='ds_login_submit' >Reset Password</button>
                          </div>
                      </form>
                   </div>}
                </div>
            </div>
            <div className="col-xl-9 col-lg-8 col-md-12 col-sm-12 col-12">
                <div className='ds_login_img'>
                    <div className='d-flex justify-content-center align-items-center h-100'>
                        <div className="col-xl-6 col-lg-10 col-md-10 col-sm-10 col-11">
                            <div className='text-white ms-xl-0 ps-xl-0 ps-lg-5 ms-lg-5 px-sm-0 px-2'>
                                <h2 className='text-uppercase ds_login_title'>Welcome back </h2>
                                <h1>to your Admin Dashboard</h1>
                                <p className='ds_login_para mt-3'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
       </div>
    </div>
  )
}

export default Login
