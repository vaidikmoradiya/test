import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { register } from "../../Redux-Toolkit/ToolkitSlice/User/RegisterSlice";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { GoogleUser } from "../../Redux-Toolkit/ToolkitSlice/User/LoginSlice";

function SignIn() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const initialValues = {
    firstname:'',
    lastname:'',
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = (values) => {
    dispatch(register(values)).then((response)=> {
      console.log(response);
      if (response.payload.status) {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/verifyotp', { state: { email: values.email } });
        }, 2000);
      } else {
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 2000);
      }
    })
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const token = response.credential;
      const user = jwtDecode(token);
      if (!user?.email || !user?.name) throw new Error("Invalid Google payload");

      const result = await dispatch(GoogleUser({ email: user.email, fullName: user.name }));
      if (result.meta?.requestStatus === "fulfilled") {
        setShowSuccessModal(true);
        setTimeout(() => {
          navigate('/verifyotp', { state: { email: user.email } });
        }, 2000);
      } else {
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 2000);
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 2000);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error("Google Sign-In Failed:", error);
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
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Account Created Successfully!</h3>
          {/* <p style={{ color: '#666', marginBottom: '20px' }}>Redirecting to OTP verification...</p> */}
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
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Registration Failed</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>User already exists</p>
        </div>
      </div>
    </div>
  );

  // const handleNavigate = () => {
  //     navigate('/verifyotp');
  // }

  return (
    <div className="main_div" >
      <div className="inner_div" >
        <h3 className="text-center mb-2 fw-bold">Create Account</h3>
        <p className="text-center text-secondary mb-4">Create an account</p>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-2">
                <label className="s_label">First name</label>
                <Field
                  type="text"
                  name="firstname"
                  placeholder="Your First Name"
                  className="input s_input mb-1"
                />
                <ErrorMessage name="firstname" component="div" className="s_error" />
              </div>

              <div className="mb-2">
                <label className="s_label">Last name</label>
                <Field
                  type="text"
                  name="lastname"
                  placeholder="Your Last Name"
                  className="input s_input mb-1"
                />
                <ErrorMessage name="lastname" component="div" className="s_error" />
              </div>

              <div className="mb-2">
                <label className="s_label">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="input s_input mb-1"
                />
                <ErrorMessage name="email" component="div" className="s_error" />
              </div>

              <div className="position-relative">
              <label className="s_label">Password</label>
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="input s_input mb-1"
                />
                <span className="s_password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ?  <IoEye /> : <IoEyeOff /> }
                </span>
              </div>
                <ErrorMessage name="password" component="div" className="s_error mb-2" />

              {/* Login button */}
              <button
                type="submit"
                disabled={isSubmitting} 
                className="s_blue_button  my-3"
                // onClick={handleNavigate}
              >
                Create Account
              </button>

              {/* OR divider */}
              <div className="d-flex align-items-center mb-3">
                <hr style={{ flex: 1 }} />
                <span className="mx-2 text-secondary">OR</span>
                <hr style={{ flex: 1 }} />
              </div>

              {/* Google Login */}
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                width="100%"
                useOneTap
              />

              {/* Bottom Link */}
              <p className="text-center mt-3">
                Already have an account? <Link to={'/'} style={{color:'#1e2131', fontWeight:'600'}}>Login</Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>

      {showSuccessModal && <SuccessModal />}
      {showErrorModal && <ErrorModal />}
    </div>
  );
}

export default SignIn;
