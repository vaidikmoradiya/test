import { Formik, Field, Form, ErrorMessage } from "formik";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { verifyOtp, resendOtp } from "../../Redux-Toolkit/ToolkitSlice/User/RegisterSlice";

function VerifyOtp() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const inputRefs = useRef(Array(6).fill().map(() => React.createRef()));
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [resendMessage, setResendMessage] = useState("");
    const [resendError, setResendError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);


    const email = location.state?.email;

    const initialValues = {
        digit1: '',
        digit2: '',
        digit3: '',
        digit4: '',
        digit5: '',
        digit6: '',
    };

    const validationSchema = Yup.object(
        Array.from({ length: 6 }).reduce((acc, _, i) => {
            acc[`digit${i + 1}`] = Yup.string()
                .required('Required')
                .matches(/^[0-9]$/, 'Must be a digit');
            return acc;
        }, {})
    );

    React.useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setInterval(() => {
            setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [resendCooldown]);

    const handleResend = async () => {
        if (!email || resendCooldown > 0) return;
        setResendMessage("");
        setResendError("");
        try {
            const action = await dispatch(resendOtp(email));
            if (action.payload?.status) {
                setResendMessage("OTP resent successfully.");
                setResendCooldown(60);
            } else {
                setResendError(action.payload?.message || "Failed to resend OTP");
            }
        } catch (e) {
            setResendError("Failed to resend OTP");
        }
    };

    const handleSubmit = (values) => {
        const fullCode = Object.values(values).join('');
        if (fullCode.length !== 6 || isVerifying) return;
        setIsVerifying(true);
        dispatch(verifyOtp({ email, otp: fullCode })).then((response) => {
            if (response.payload?.status) {
                setShowSuccessModal(true);
                setTimeout(() => {
                    navigate("/layout/home");
                }, 1500);
            } else {
                setShowErrorModal(true);
                setTimeout(() => {
                    setShowErrorModal(false);
                }, 1500);
            }
        }).finally(() => setIsVerifying(false));
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
                    <h3 style={{ marginBottom: '10px', color: '#141414' }}>OTP Verified Successfully!</h3>
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
                    <h3 style={{ marginBottom: '10px', color: '#141414' }}>Invalid OTP</h3>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Please check your OTP and try again</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="main_div">
            <div className="inner_div">
                <h3 className="text-center mb-2 fw-bold">Verify OTP</h3>
                <p className="text-center text-secondary mb-0">Please verify your email by entering the code we just sent</p>
                <p className="text-center fw-semibold text-decoration-underline link-offset-2">{email}</p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="d-flex justify-content-between py-3">
                                {['digit1', 'digit2', 'digit3', 'digit4', 'digit5', 'digit6'].map((digit, index) => (
                                    <Field name={digit} key={digit}>
                                        {({ field }) => (
                                            <input
                                                {...field}
                                                maxLength="1"
                                                className="s_otp_input"
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (/^[0-9]?$/.test(value)) {
                                                        setShowErrorModal(false);
                                                        const nextValues = { ...values, [digit]: value };
                                                        setFieldValue(digit, value);
                                                        if (value && index < 5) {
                                                            inputRefs.current[index + 1].current.focus();
                                                        }
                                                        const candidate = Object.values(nextValues).join('');
                                                        if (candidate.length === 6 && /^[0-9]{6}$/.test(candidate)) {
                                                            handleSubmit(nextValues);
                                                        }
                                                    }
                                                }}
                                                onPaste={(e) => {
                                                    e.preventDefault();
                                                    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
                                                    if (pastedData.length > 0) {
                                                        pastedData.split('').forEach((digit, idx) => {
                                                            if (idx < 6) {
                                                                setFieldValue(`digit${idx + 1}`, digit);
                                                            }
                                                        });
                                                        const nextFocusIndex = Math.min(pastedData.length, 5);
                                                        inputRefs.current[nextFocusIndex].current.focus();
                                                        if (pastedData.length === 6) {
                                                            const nextValues = { ...values };
                                                            pastedData.split('').forEach((d, idx) => { nextValues[`digit${idx + 1}`] = d; });
                                                            handleSubmit(nextValues);
                                                        }
                                                    }
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Backspace' && !values[digit] && index > 0) {
                                                        inputRefs.current[index - 1].current.focus();
                                                    }
                                                }}
                                                ref={inputRefs.current[index]}
                                            />
                                        )}
                                    </Field>
                                ))}
                            </div>
                            <ErrorMessage name="digit1" component="div" className="s_error" />
                            <button
                                type="submit"
                                disabled={isSubmitting || isVerifying}
                                className="s_blue_button my-3"
                            >
                                {isVerifying ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="text-center text-secondary mt-2">
                    {resendCooldown > 0 ? (
                        <p className="mb-1">Resend available in {resendCooldown}s</p>
                    ) : (
                        <button type="button" onClick={handleResend} className="btn btn-link p-0" style={{ textDecoration: 'underline', color: '#1e2131', fontWeight: 600 }}>Resend</button>
                    )}
                    {resendMessage && <div className="text-success" style={{ fontSize: '0.9rem' }}>{resendMessage}</div>}
                    {resendError && <div className="text-danger" style={{ fontSize: '0.9rem' }}>{resendError}</div>}
                </div>
            </div>


            {showSuccessModal && <SuccessModal />}
            {showErrorModal && <ErrorModal />}
        </div>
    );
}

export default VerifyOtp;
