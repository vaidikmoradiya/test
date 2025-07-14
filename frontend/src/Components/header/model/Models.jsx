import { useFormik } from 'formik'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux';

const Register_model = (props) => {

   const dispatch = useDispatch()
    // register model 
    var init_register = {
        name: "",
        mobile: "",
        password: ""
    }

    var register_validation = Yup.object({
        name: Yup.string().min(2, "At least 2 characters required").max(25, "Too long for a name").required("Name is required"),
        mobile: Yup.string("Mobile Number Must Be in Digit").min(10, "Must be 10 digits").max(10, "Must be 10 digits").required("Mobile is required"),
        password: Yup.string().min(8, "At least 8 characters required").max(20, "Too long for a password").required("Password is required")
    })

    let { values, handleBlur, handleChange, handleSubmit, errors, touched } = useFormik({
        initialValues: init_register,
        validationSchema: register_validation,
        onSubmit: (values) => {
            register_submit(values)
        }
    })

    const register_submit = (values) => {
         console.log("hello" ,values);
        //  dispatch(RegisterUser(values))
        props.setmodel(true);
        setloginmodel(false);
    }



    // login model
    var init_login = {
        mobile: ""
    }

    var login_validation = Yup.object({
        mobile: Yup.string().min(10, "Must be 10 digits").max(10, "Must be 10 digits").required("Mobile is required"),
    })

    let loginFormik = useFormik({
        initialValues: init_login,
        validationSchema: login_validation,
        onSubmit: (values) => {
            login_submit(values)
        }
    })

    const login_submit = (values) => {
        console.log(values);
        setloginmodel(false);
        setLoginpassword(true);
    }



    // login password
    var init_password_login = {
        password: ""
    }

    var password_login_validation = Yup.object({
        password: Yup.string().min(8, "At least 8 characters required").max(20, "Too long for a password").required("Password is required")
    })

    let passwordLoginFormik = useFormik({
        initialValues: init_password_login,
        validationSchema: password_login_validation,
        onSubmit: (values) => {
            password_login_submit(values);
        }
    })

    const password_login_submit = (values) => {
        console.log(values);
        setLoginpassword(false);
        setotpmodel(true)
    }



    // otp model
    const otp_validation = Yup.object({
        otp1: Yup.string().required('Required').matches(/^[0-9]$/, 'Must be a number'),
        otp2: Yup.string().required('Required').matches(/^[0-9]$/, 'Must be a number'),
        otp3: Yup.string().required('Required').matches(/^[0-9]$/, 'Must be a number'),
        otp4: Yup.string().required('Required').matches(/^[0-9]$/, 'Must be a number'),
    });

    const otpFormik = useFormik({
        initialValues: {
            otp1: '',
            otp2: '',
            otp3: '',
            otp4: ''
        },
        validationSchema: otp_validation,
        onSubmit: (values) => {
            otp_submit(values);
        }
    });

    const otp_submit = (values) => {
        const otp = values.otp1 + values.otp2 + values.otp3 + values.otp4;
        console.log('OTP Submitted:', otp);
        if (change) {
            setresetpassword(true)
        }
        setotpmodel(false);
    };



    // forget password
    var init_forget_password = {
        mobile: ""
    }

    var forget_password_validation = Yup.object({
        mobile: Yup.string().min(10, "Must be 10 digits").max(10, "Must be 10 digits").required("Mobile is required"),
    })

    let forgetFormik = useFormik({
        initialValues: init_forget_password,
        validationSchema: forget_password_validation,
        onSubmit: (values) => {
            forget_submit(values);
        }
    })

    const forget_submit = (values) => {
        console.log(values);
        setforget(false);
        setotpmodel(true)
        setchange(true)
    }



    // reset password

    const init_reset_password = {
        password: "",
        confirm_password: ""
    };

    const reset_password_validation = Yup.object({
        password: Yup.string()
            .min(8, "At least 8 characters required")
            .max(20, "Too long for a password")
            .required("Password is required"),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')
    });

    let resetFormik = useFormik({
        initialValues: init_reset_password,
        validationSchema: reset_password_validation,
        onSubmit: (values) => {
            reset_submit(values);
        }
    });

    const reset_submit = (values) => {
        console.log(values);
        setchange(false)
        setresetpassword(false);
    };




    // Other state and logic
    const [loginmodel, setloginmodel] = useState(false);
    const [Loginpassword, setLoginpassword] = useState(false);
    const [forget, setforget] = useState(false);
    const [otpmodel, setotpmodel] = useState(false);
    const [resetpassword, setresetpassword] = useState(false)
    const [type, setType] = useState('password')
    const [change, setchange] = useState(false)


    const handleInputType = () => {
        setType(type === 'password' ? 'text' : 'password');
    }


    // otp model focus
    const handleInput = (e, index) => {
        const input = e.target;
        const nextInput = input.nextElementSibling;
        const prevInput = input.previousElementSibling;

        if (input.value.length === 1 && nextInput) {
            nextInput.focus();
        } else if (input.value.length === 0 && prevInput) {
            prevInput.focus();
        }
    };


    return (
        <React.Fragment>

            {/* Register Modal */}
            {/* <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='register_model'
            >
                <Modal.Body className='inter model_padding'>
                    <h4 className='text-black text-center model_heading fw-600 mb-3'>Register</h4>
                    <p className='text-center font_18 light_color fw-500 mb-3'>
                        Register & get access to the exclusive collection!
                    </p>
                    <div className='mt-lg-5'>
                        <form method='post' onSubmit={handleSubmit}>
                            <div className='mb-4'>
                                <input type="text" placeholder='Name' name='name' value={values.name} className='w-100 model_input' onChange={handleChange} onBlur={handleBlur} />
                                {errors.name && touched.name ? (<span className='VK_error_text'>{errors.name}</span>) : null}
                            </div>
                            <div className='mb-4'>
                                <input type="text" placeholder='Mobile no.' name='mobile' value={values.mobile} className='w-100 model_input' onChange={handleChange} onBlur={handleBlur} />
                                {errors.mobile && touched.mobile ? (<span className='VK_error_text'>{errors.mobile}</span>) : null}
                            </div>
                            <div className='mb-4'>
                                <div className='input_password'>
                                    <input type={type} placeholder='Password' name='password' value={values.password} className='w-100 model_input' onChange={handleChange} onBlur={handleBlur} />
                                    <button type='button' className='bg-transparent VK_eyes border-0' onClick={handleInputType}>
                                        {type === 'password' ? (<img src={require('../../../assets/eye_close.png')} alt="Hide Password" />) : (<img src={require('../../../assets/eye_open.png')} alt="Show Password" />)}
                                    </button>
                                </div>
                                {errors.password && touched.password ? (<span className='VK_error_text'>{errors.password}</span>) : null}
                            </div>
                            <div className='mb-4'>
                                <p className='light_color model_p fw-400'>
                                    To verify your number, we will send you a text message with a temporary code to your mobile No.
                                </p>
                            </div>
                            <div>
                                <input type="submit" value={"Verify"} className='w-100 inter model_theme' />
                            </div>
                        </form>
                        <div className='mt-md-4 mt-2'>
                            <p className='m-0 pt-2 text-center text-black fw-500 font_18'>
                                Already have an account?
                                <button className='bg-transparent border-0 text-black fw-500 font_18' onClick={() => {
                                    props.setmodel(false)
                                    setloginmodel(true);
                                }}>
                                    Login Now
                                </button>
                            </p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal> */} 

            {/* Login Modal */}
            <Modal
                show={loginmodel}
                onHide={() => setloginmodel(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='login_model'
            >
                <Modal.Body className='inter model_padding'>
                    <h4 className='text-black text-center model_heading fw-600 mb-3'>Login</h4>
                    <p className='text-center font_18 light_color fw-500 mb-3'>Log in to continue</p>
                    <div className='mt-lg-4'>
                        <form method='post' onSubmit={loginFormik.handleSubmit}>
                            <div className='mb-4 pb-sm-3'>
                                <input type="text" placeholder='Mobile no.' name='mobile' value={loginFormik.values.mobile} className='w-100 model_input' onChange={loginFormik.handleChange} onBlur={loginFormik.handleBlur} />
                                {loginFormik.errors.mobile && loginFormik.touched.mobile ? (<span className='VK_error_text'>{loginFormik.errors.mobile}</span>) : null}
                            </div>
                            <div className='mb-4'>
                                <input type="submit" value={"Continue"} className='w-100 inter model_theme' />
                            </div>
                            <div className='mb-4'>
                                <p className='light_color model_p fw-400'>
                                    By continuing, you agree to our
                                    <span className='px-1 text-black VK_underline d-inline-block'>Terms of Use</span>
                                    and
                                    <span className='px-1 text-black VK_underline d-inline-block'>Privacy Policy</span>.
                                </p>
                            </div>
                        </form>
                        <div className='mt-md-5 mt-2'>
                            <p className='m-0 pt-2 text-center text-black fw-500 font_18'>
                                Don't have an account?
                                <button className='bg-transparent border-0 text-black fw-500 font_18' onClick={() => {
                                    props.setmodel(true)
                                    setloginmodel(false);
                                }}>
                                    Create Now
                                </button>
                            </p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Password Login Modal */}
            <Modal
                show={Loginpassword}
                onHide={() => setLoginpassword(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='login_model'
            >
                <Modal.Body className='inter model_padding'>
                    <h4 className='text-black text-center model_heading fw-600 mb-3'>Login</h4>
                    <p className='text-center font_18 light_color fw-500 mb-3'>Log in to continue</p>
                    <div className='mt-lg-4'>
                        <form method='post' onSubmit={passwordLoginFormik.handleSubmit}>
                            <div className='input_password'>
                                <input type={type} placeholder='Password' name='password' value={passwordLoginFormik.values.password} className='w-100 model_input' onChange={passwordLoginFormik.handleChange} onBlur={passwordLoginFormik.handleBlur} />
                                <button type='button' className='bg-transparent VK_eyes border-0' onClick={handleInputType}>
                                    {type === 'password' ? (<img src={require('../../../assets/eye_close.png')} alt="Hide Password" />) : (<img src={require('../../../assets/eye_open.png')} alt="Show Password" />)}
                                </button>
                            </div>
                            {passwordLoginFormik.errors.password && passwordLoginFormik.touched.password ? (<span className='VK_error_text'>{passwordLoginFormik.errors.password}</span>) : null}
                            <div className='text-end mb-4 mt-2'>
                                <button onClick={() => {
                                    setLoginpassword(false)
                                    setforget(true)
                                }} type='button' className='bg-transparent border-0'>
                                    <p className='VK_forget_link m-0'>Forget Password?</p>
                                </button>
                            </div>
                            <div className='mb-4 pt-2'>
                                <input type="submit" value={"Continue"} className='w-100 inter model_theme' />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            {/* otp validation */}
            <Modal
                show={otpmodel}
                onHide={() => setotpmodel(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='otp_model'
            >
                <Modal.Body className='inter model_padding'>
                    <h4 className='text-black text-center model_heading fw-600 mb-3'>
                        Verify
                    </h4>
                    <p className='text-center light_color fw-500 mb-md-5 mb-3'>
                        Enter the 4 digit verification code that we’ve sent to your phone
                    </p>
                    <div className='mt-lg-4'>
                        <form method='post' onSubmit={otpFormik.handleSubmit}>
                            <div className='mb-md-5 mb-4 d-flex gap-3 justify-content-center'>
                                <input
                                    type="text"
                                    className='VK_otp_input'
                                    maxLength="1"
                                    name="otp1"
                                    value={otpFormik.values.otp1}
                                    onChange={otpFormik.handleChange}
                                    onBlur={otpFormik.handleBlur}
                                    onInput={(e) => handleInput(e, 0)}
                                />
                                <input
                                    type="text"
                                    className='VK_otp_input'
                                    maxLength="1"
                                    name="otp2"
                                    value={otpFormik.values.otp2}
                                    onChange={otpFormik.handleChange}
                                    onBlur={otpFormik.handleBlur}
                                    onInput={(e) => handleInput(e, 1)}
                                />
                                <input
                                    type="text"
                                    className='VK_otp_input'
                                    maxLength="1"
                                    name="otp3"
                                    value={otpFormik.values.otp3}
                                    onChange={otpFormik.handleChange}
                                    onBlur={otpFormik.handleBlur}
                                    onInput={(e) => handleInput(e, 2)}
                                />
                                <input
                                    type="text"
                                    className='VK_otp_input'
                                    maxLength="1"
                                    name="otp4"
                                    value={otpFormik.values.otp4}
                                    onChange={otpFormik.handleChange}
                                    onBlur={otpFormik.handleBlur}
                                    onInput={(e) => handleInput(e, 3)}
                                />
                            </div>

                            {/* Display validation errors */}
                            <div className='text-center'>
                                {(otpFormik.touched.otp1 && otpFormik.errors.otp1) ||
                                    (otpFormik.touched.otp2 && otpFormik.errors.otp2) ||
                                    (otpFormik.touched.otp3 && otpFormik.errors.otp3) ||
                                    (otpFormik.touched.otp4 && otpFormik.errors.otp4) ? (
                                    <span className='VK_error_text'>
                                        Please fill all OTP fields correctly
                                    </span>
                                ) : null}
                            </div>

                            <div className='mb-4 pt-2'>
                                <input type="submit" value={"Submit OTP"} className='w-100 inter model_theme' />
                            </div>
                        </form>

                        <div>
                            <p className='text-center text-black'>
                                Didn’t receive code yet? <button type='button' className='bg-transparent border-0'>Resend</button>
                            </p>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Forget Password Modal */}
            <Modal
                show={forget}
                onHide={() => setforget(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='login_model'
            >
                <Modal.Body className='inter model_padding'>
                    <h4 className='text-black text-center model_heading fw-600 mb-3'>Forgot Password</h4>
                    <p className='text-center font_18 light_color fw-500 mb-3'>Enter details below to recover your password</p>
                    <div className='mt-lg-4'>
                        <form method='post' onSubmit={forgetFormik.handleSubmit}>
                            <div className='mb-4 pb-sm-3'>
                                <input type="text" placeholder='Mobile no.' name='mobile' value={forgetFormik.values.mobile} className='w-100 model_input' onChange={forgetFormik.handleChange} onBlur={forgetFormik.handleBlur} />
                                {forgetFormik.errors.mobile && forgetFormik.touched.mobile ? (<span className='VK_error_text'>{forgetFormik.errors.mobile}</span>) : null}
                            </div>
                            <div className='mb-4 pt-2'>
                                <input type="submit" value={"Get code"} className='w-100 inter model_theme' />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Reset Password Modal */}
            <Modal
                show={resetpassword}
                onHide={() => setresetpassword(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='login_model'
            >
                <Modal.Body className='inter model_padding'>
                    <h4 className='text-black text-center model_heading fw-600 mb-3'>
                        Reset Password
                    </h4>
                    <p className='text-center font_18 px-5 light_color mb-md-5 mb-3'>
                        Reset your password and login with a new password
                    </p>
                    <div className='mt-lg-4'>
                        <form method='post' onSubmit={resetFormik.handleSubmit}>
                            <div className='mb-4'>
                                <div className='input_password'>
                                    <input
                                        type={type}
                                        placeholder='New password'
                                        name='password'
                                        value={resetFormik.values.password}
                                        className='w-100 model_input'
                                        onChange={resetFormik.handleChange}
                                        onBlur={resetFormik.handleBlur}
                                    />
                                    <button
                                        type='button'
                                        className='bg-transparent VK_eyes border-0'
                                        onClick={handleInputType}
                                    >
                                        {type === 'password'
                                            ? <img src={require('../../../assets/eye_close.png')} alt="Hide Password" />
                                            : <img src={require('../../../assets/eye_open.png')} alt="Show Password" />}
                                    </button>
                                </div>
                                {resetFormik.touched.password && resetFormik.errors.password ? (
                                    <div className="error">{resetFormik.errors.password}</div>
                                ) : null}
                            </div>
                            <div className='mb-md-5 mb-2'>
                                <div className='input_password'>
                                    <input
                                        type={type}
                                        placeholder='Confirm password'
                                        name='confirm_password'
                                        value={resetFormik.values.confirm_password}
                                        className='w-100 model_input'
                                        onChange={resetFormik.handleChange}
                                        onBlur={resetFormik.handleBlur}
                                    />
                                    <button
                                        type='button'
                                        className='bg-transparent VK_eyes border-0'
                                        onClick={handleInputType}
                                    >
                                        {type === 'password'
                                            ? <img src={require('../../../assets/eye_close.png')} alt="Hide Password" />
                                            : <img src={require('../../../assets/eye_open.png')} alt="Show Password" />}
                                    </button>
                                </div>
                                    {resetFormik.touched.confirm_password && resetFormik.errors.confirm_password ? (
                                        <div className="error">{resetFormik.errors.confirm_password}</div>
                                    ) : null}
                            </div>
                            <div className='mb-4 pt-2'>
                                <input
                                    type="submit"
                                    value={"Update Password"}
                                    className='w-100 inter model_theme'
                                />
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

        </React.Fragment>
    )
}

export default Register_model;