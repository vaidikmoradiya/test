import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPrivacyPolicy } from '../../Redux-Toolkit/ToolkitSlice/Admin/PrivacyPolicySlice';
import { Link, useNavigate } from 'react-router-dom';

const ViewPrivacyPolicy = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const getPrivacyPolicy = useSelector((state) => state?.privacyPolicy?.allPrivacyPolicy);
    const loading = useSelector((state) => state?.privacyPolicy?.loading);
    console.log("getPrivacyPolicy",getPrivacyPolicy);
    
    useEffect(() => {
        dispatch(getAllPrivacyPolicy());
    }, [dispatch])

    // Check if data exists and is an array
    const privacyPolicyData = Array.isArray(getPrivacyPolicy) ? getPrivacyPolicy : [];

    return (
        <div className='sp_main sp_height'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div >
                    <h4>View Privacy Policy</h4>
                    <p className='ds_text ds_font ds_cursor'>
                        <Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link>
                        <span onClick={()=> navigate("/admin/privacypolicy")}> / Privacy Policy </span>
                        <span style={{color:'rgba(20, 20, 20, 1)'}}> / View Privacy Policy</span>
                    </p>
                </div>
            </div>
            <div className='sp_view'>
                {loading ? (
                    <div className='text-center py-5'>
                        <div className='spinner-border' role='status'>
                            <span className='visually-hidden'>Loading...</span>
                        </div>
                    </div>
                ) : privacyPolicyData.length > 0 ? (
                    privacyPolicyData.map((item, index) => (
                        <div key={item._id || index} className='mb-4'>
                            <h5 className='mb-3'>{item.title || 'No Title'}</h5>
                            <div className='mb-3'>
                                {Array.isArray(item.description) ? (
                                    item.description.map((desc, descIndex) => (
                                        <p key={descIndex} className='mb-2'>{desc}</p>
                                    ))
                                ) : (
                                    <p className='mb-2'>{item.description || 'No Description'}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='text-center py-5'>
                        <h5 className='text-muted'>No Privacy Policy Found</h5>
                        <p className='text-muted'>Please add some privacy policy content.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewPrivacyPolicy
