import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { GetSingleContactUsData } from '../../Redux-Toolkit/ToolkitSlice/User/ContactusSlice';
import { Link } from 'react-router-dom';

const ViewContactUs = () => {

    const navigate = useNavigate()
    const editid = localStorage.getItem("Getid")
    const dispatch = useDispatch()

    const SingleContactUsData = useSelector((state) => state.contact.getSingleContactData)
    console.log("SingleContactUsData", SingleContactUsData);

    useEffect(() => {
        dispatch(GetSingleContactUsData(editid))
    }, [editid])

    return (
        <div className='sp_main sp_height'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div >
                    <h4>View Contact Us</h4>
                    <p className='ds_text ds_font ds_cursor'><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link><span onClick={()=> navigate("/admin/contactus")}> / Contact Us </span><span style={{color:'rgba(20, 20, 20, 1)'}}> / View Contact Us</span></p>
                </div>
            </div>
            <div className='sp_spec_view' >
                <h5 >Contact Details</h5>
                {SingleContactUsData && (
                    <div className='p-3' style={{ minWidth: '300px' }}>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Name :</h6></div>
                            <div className='w-50 '><p className='mb-0 mv_textwrap'>{SingleContactUsData.name}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Email :</h6></div>
                            <div className='w-50 '><p className='mb-0 mv_textwrap'>{SingleContactUsData.email}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Contact No :</h6></div>
                            <div className='w-50 '><p className='mb-0 mv_textwrap'>{SingleContactUsData.phoneNo}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Subject :</h6></div>
                            <div className='w-50 '><p className='mb-0 mv_textwrap'>{SingleContactUsData.subject}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Message :</h6></div>
                            <div className='w-50 '><p className='mb-0 mv_textwrap'>{SingleContactUsData.message}</p></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewContactUs
