import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getallAboutUs } from '../../Redux-Toolkit/ToolkitSlice/User/AboutusSlice';
import { GetAllCompanyProfile } from '../../Redux-Toolkit/ToolkitSlice/User/CompanyProfileSlice';
import { Link } from 'react-router-dom';

const AboutUs = () => {
    const aboutData = useSelector((state) => state.about.allAbout)
    const dispatch = useDispatch()
    const Back_URL = 'http://localhost:5000/'

    useEffect(() => {
        dispatch(getallAboutUs())
    }, [])

    const companyprofileData = useSelector((state) => state.companyprofile.allCompanyProfileData)
    // console.log("AllcompanyprofileData",companyprofileData);
    
    useEffect(() => {
        dispatch(GetAllCompanyProfile())
    }, [])

    return (
        <>
            {/* About us */}
            <div>
                <div className="container s_container">
                    {aboutData.map((item, index) => (
                        <div key={index} className="row my-5 align-items-center justify-content-center">
                            <div className="col-md-6">
                                <img src={`${Back_URL}${item.image[0]}`} alt="" width={'100%'} />
                            </div>
                            <div className="col-md-6">
                                <p className='text-secondary'>About Us</p>
                                <h3 className='fw-bold'>{item.title}</h3>
                                <p className='text-secondary'>{item.description}</p>
                                <p>
                                    <ul className="list-unstyled text-secondary">
                                        {item.features && item.features.map((feature, idx) => (
                                            <li key={idx}>
                                                <img src={require('../../assets/hand.png')} alt="" className='me-2 my-2' width={20} /> 
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </p>
                                <Link to='/layout/aboutus'><button className='s_blue_btn'>Explore More</button></Link>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Have a Question */}
                <div className='s_bg_image mb-5'>
                    <div className='s_img_content '>
                        <h4 className='text-white'>Have a question?</h4>
                        <p className='text-secondary'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex consectetur impedit odit aut similique, officia dicta facere quos fuga voluptates!</p>
                        <button className='s_slider_btn'>Contact Us</button>
                    </div>
                </div>
            </div>

            <div className='my-5'>
                <div className="container s_container">
                    <div className="row align-items-center">
                        <div className="col-md-5">
                            <div>
                                <div className='s_bg_white'>
                                    <div className='d-flex align-items-center'>
                                        <h1 className='me-3 fw-bold'>{companyprofileData?.yearsOfExperience}</h1>
                                        <div>
                                            <h5>Years of Experience</h5>
                                            <p>{companyprofileData?.experienceDescription || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, earum!'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='s_bg_white'>
                                    <div className='d-flex align-items-center'>
                                        <h1 className='me-3 fw-bold'>{companyprofileData?.happyCustomer}</h1>
                                        <div>
                                            <h5>Happy Customer</h5>
                                            <p>{companyprofileData?.happyCustomersDescription || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, earum!'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <img src={require('../../assets/image.png')} alt="" width={'100%'}/>
                        </div>
                        <div className="col-md-5">
                        <div>
                                <div className='s_bg_white'>
                                    <div className='d-flex align-items-center'>
                                        <h1 className='me-3 fw-bold'>{companyprofileData?.companyGrowth}</h1>
                                        <div>
                                            <h6>Company Growth</h6>
                                            <p>{companyprofileData?.companyGrowthDescription || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, earum!'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='s_bg_white'>
                                    <div className='d-flex align-items-center'>
                                        <h1 className='me-3 fw-bold'>{companyprofileData?.teamMembers}</h1>
                                        <div>
                                            <h6>Team Member</h6>
                                            <p>{companyprofileData?.teamMembersDescription || 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, earum!'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default AboutUs;