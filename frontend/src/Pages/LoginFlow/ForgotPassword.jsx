import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ForgetPassword } from "../../Redux-Toolkit/ToolkitSlice/User/LoginSlice";

function ForgotPassword() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, message, success } = useSelector((state) => state.login);

    const initialValues = {
        email: ''
    }

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required')
    });

    const handleSubmit = async (values) => {
        const result = await dispatch(ForgetPassword(values));
        if (result.payload?.status) {
            navigate('/verifyemail', { state: { email: values.email } });
        }
    }

    return(
       <div className="main_div">
        <div className="inner_div">
            <h3 className="text-center mb-2 fw-bold">Forgot Password?</h3>
            <p className="text-center text-secondary mb-4">Recover your account easily enter your email below</p>

            <Formik 
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            >
                {({isSubmitting}) => (
                    <Form>
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
                           Send Code
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
       </div>
    )
}

export default ForgotPassword;