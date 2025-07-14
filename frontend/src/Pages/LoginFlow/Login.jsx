import { Formik, Form, Field, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { GoogleUser, LoginUser } from "../../Redux-Toolkit/ToolkitSlice/User/LoginSlice";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch()
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    remember: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const LoginFormik = useFormik({
    initialValues:initialValues,
    validationSchema:validationSchema,
    onSubmit:(values)=>{
      console.log(values); 
        dispatch(LoginUser(values))
        .then((response)=>{
        console.log(response);
          if (response.payload.status) {
            setShowSuccessModal(true);
            setTimeout(() => {
              navigate("/layout/home");
            }, 2000);
          } else {
            setShowErrorModal(true);
            setTimeout(() => {
              setShowErrorModal(false);
            }, 2000);
          }
        })
    }
  })

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
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Login Successful!</h3>
          {/* <p style={{ color: '#666', marginBottom: '20px' }}>Redirecting to home page...</p> */}
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
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Login Failed</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Invalid email or password. Please try again.</p>
          {/* <button
            className="s_blue_button"
            onClick={() => setShowErrorModal(false)}
          >
            Try Again
          </button> */}
        </div>
      </div>
    </div>
  );

  const handleSuccess = async (response) => {
    try {
      const token = response.credential;
      const user = jwtDecode(token);
      if (!user?.email || !user?.name) throw new Error("Invalid Google payload");
  
      const result = await dispatch(GoogleUser({ email: user.email, fullName: user.name }));
      console.log('data',result.meta?.requestStatus)
      if (result.meta?.requestStatus === "fulfilled") {
        navigate("/layout/home");
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Google login failed:", error);
      setShowErrorModal(true);
    }
  };
  


  const handleFailure = (error) => {
    console.error("Login Failed:", error);    
  };

  return (
    <div className="main_div" >
      <div className="inner_div" >
        <h3 className="text-center mb-2 fw-bold">Login</h3>
        <p className="text-center text-secondary mb-4">Welcome Back!</p>
        
            <form onSubmit={LoginFormik.handleSubmit} autoComplete="off">
              <div className="mb-2">
                <label className="s_label" htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={LoginFormik.values.email}
                  onChange={LoginFormik.handleChange}
                  onBlur={LoginFormik.handleBlur}
                  placeholder="Your email"
                  className="input s_input mb-1"
                />
                {LoginFormik.touched.email && LoginFormik.errors.email && (
                  <div className="s_error">{LoginFormik.errors.email}</div>
                )}
              </div>

              <div className="mb-0 position-relative">
              <label className="s_label">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={LoginFormik.values.password}
                  onChange={LoginFormik.handleChange}
                  onBlur={LoginFormik.handleBlur}
                  placeholder="Password"
                  className="input s_input mb-1"
                />
                <span className="s_password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ?  <IoEye /> : <IoEyeOff /> }
                </span>
              </div>
                {LoginFormik.touched.password && LoginFormik.errors.password && (
                  <div className="s_error mb-2">{LoginFormik.errors.password}</div>
                )}

              <div className="d-flex justify-content-between mb-5">
                <label>
                  <input
                    type="checkbox"
                    {...LoginFormik.getFieldProps('remember')}
                    className="me-2"
                  />Remember Me
                </label>
                <Link to={'/forgotpassword'} className="s_error text-decoration-none">Forgot Password?</Link>
              </div>

              <button
                type="submit"
                className="s_blue_button mb-3"
                disabled={LoginFormik.isSubmitting || !LoginFormik.isValid}
              >
                {LoginFormik.isSubmitting ? 'Logging in...' : 'Login'}
              </button>

              {/* OR divider */}
              <div className="d-flex align-items-center mb-3">
                <hr style={{ flex: 1 }} />
                <span className="mx-2 text-secondary">OR</span>
                <hr style={{ flex: 1 }} />
              </div>

              {/* Google Login */}
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleFailure}
                width="100%"
                useOneTap
              />
 
              {/* Bottom Link */}
              <p className="text-center mt-3">
                Don’t have any account? <Link to={'/signin'} style={{color:'#1e2131', fontWeight:'600'}}>Create Account</Link>
              </p>
            </form>
      </div>

      {showSuccessModal && <SuccessModal />}
      {showErrorModal && <ErrorModal />}
      
    </div>
  );
}

export default Login;
