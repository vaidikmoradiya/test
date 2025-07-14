import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { GetSingleContactUsData } from '../../Redux-Toolkit/ToolkitSlice/User/ContactusSlice';

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
                    <span><a className='sp_text_gray'>Dashboard</a><a className='sp_text_gray'> / Contact Us</a><span> / View Contact Us</span></span>
                </div>
            </div>
            <div className='sp_spec_view' >
                <h5 >Contact Details</h5>
                {SingleContactUsData && (
                    <div className='p-3' style={{ minWidth: '300px' }}>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Name :</h6></div>
                            <div className='w-50 '><p className='mb-0'>{SingleContactUsData.name}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Email :</h6></div>
                            <div className='w-50 '><p className='mb-0'>{SingleContactUsData.email}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Contact No :</h6></div>
                            <div className='w-50 '><p className='mb-0'>{SingleContactUsData.phoneNo}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Subject :</h6></div>
                            <div className='w-50 '><p className='mb-0'>{SingleContactUsData.subject}</p></div>
                        </div>
                        <div className='d-flex py-1 align-items-center'>
                            <div className='w-50 sp_text_gray'><h6 className='mb-0'>Message :</h6></div>
                            <div className='w-50 '><p className='mb-0'>{SingleContactUsData.message}</p></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ViewContactUs
