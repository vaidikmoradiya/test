import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { ResetPasswordd } from "../../Redux-Toolkit/ToolkitSlice/User/LoginSlice";

function ResetPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, message, success } = useSelector((state) => state.login);
    const email = location.state?.email;

    const [showPassword, setShowPassword] = useState(false);
    const [newShowPassword, setNewShowPassword] = useState(false);

    const initialValues = {
        password: '',
        newpassword: ''
    }

    const validationSchema = Yup.object({
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
        newpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required')
    });

    const handleSubmit = async (values) => {
        const result = await dispatch(ResetPasswordd({
            email,
            password: values.password,
            newpassword: values.newpassword
        }));

        if (result.payload?.status) {
            navigate('/');
        }
    }

    return (
        <div className="main_div">
            <div className="inner_div">
                <h3 className="text-center mb-2 fw-bold">Reset Password</h3>
                <p className="text-center text-secondary mb-4">Create a password that hasn't been used on this account before {email}</p>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-2">
                                <div className="position-relative">
                                    <label className="s_label">New Password</label>
                                    <Field
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        className="input s_input mb-1"
                                    />
                                    <span className="s_password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <IoEye /> : <IoEyeOff />}
                                    </span>
                                </div>
                                <ErrorMessage name="password" component="div" className="s_error mb-2" />
                            </div>
                            <div className="mb-4">
                                <div className="position-relative">
                                    <label className="s_label">Confirm Password</label>
                                    <Field
                                        type={newShowPassword ? "text" : "password"}
                                        name="newpassword"
                                        placeholder="Confirm password"
                                        className="input s_input mb-1"
                                    />
                                    <span className="s_password"
                                        onClick={() => setNewShowPassword(!newShowPassword)}
                                    >
                                        {newShowPassword ? <IoEye /> : <IoEyeOff />}
                                    </span>
                                </div>
                                <ErrorMessage name="newpassword" component="div" className="s_error mb-2" />
                            </div>

                            {message && (
                                <div className={`alert ${success ? 'alert-success' : 'alert-danger'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className="s_blue_button my-3"
                            >
                                Reset Password
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default ResetPassword;