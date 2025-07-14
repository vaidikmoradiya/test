import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import '../Css/mv_style.css'
import { getallAboutUs } from '../Redux-Toolkit/ToolkitSlice/User/AboutusSlice';
import { GetAllCompanyProfile } from '../Redux-Toolkit/ToolkitSlice/User/CompanyProfileSlice';

const stats = [
  { number: '10+', label: 'Years of Experience' },
  { number: '612', label: 'Happy Customers' },
  { number: '75%', label: 'Company Growth' },
  { number: '175', label: 'Team Member' }
];

const Aboutus = () => {

  const aboutData = useSelector((state) => state.about.allAbout)
  const dispatch = useDispatch()

  console.log("aboutData", aboutData);

  const Back_URL = 'http://localhost:5000/'

  const companyprofileData = useSelector((state) => state.companyprofile.allCompanyProfileData)
  // console.log("AllcompanyprofileData",companyprofileData);
  
  useEffect(() => {
    dispatch(getallAboutUs())
    dispatch(GetAllCompanyProfile())
  }, [])

  return (
    <>
      <div className="mv_about_main_padd">
        {/* Hero Section */}
        <div className="m_container">
          <div className="row">
            <div className="col-12 text-center mb-4">
              <h1 className="mv_about_title">About Us</h1>
              <p className="mv_about_subtitle">From vision to reality - our story, mission & people behind it</p>
            </div>
          </div>

          {/* Who We Are Section */}
          {aboutData.filter(item => item.image.length === 1).map((item, index) => (
            <div key={index} className="row align-items-center mv_who_we_are_section">
              <div className="col-lg-5 mb-4 mb-lg-0">
                <div className="mv_about_image_container">
                  <img src={`${Back_URL}${item.image[0]}`} alt="Manufacturing Facility" className="mv_about_image" />
                </div>
              </div>
              <div className="col-lg-7">
                <h2 className="mv_about_section_title">{item.title}</h2>
                <p className="mv_section_text">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Stats Section */}
        <div className="mv_values_padd">
          <div className="m_container">
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                  <p className='mv_value_number'>{companyprofileData?.yearsOfExperience}</p>
                  <p className='mv_value_text'>Years of Experience</p>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                  <p className='mv_value_number'>{companyprofileData?.happyCustomer}</p>
                  <p className='mv_value_text'>Happy Customer</p>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                  <p className='mv_value_number'>{companyprofileData?.companyGrowth}</p>
                  <p className='mv_value_text'>Company Growth</p>
                </div>
                <div className="col-lg-3 col-md-3 col-sm-6 col-6">
                  <p className='mv_value_number'>{companyprofileData?.teamMembers}</p>
                  <p className='mv_value_text'>Team Member</p>
                </div>
            </div>
          </div>
        </div>

        {/* Our Story Section */}
        <div className="m_container">
          <div className="mv_our_story_padd">
          {aboutData.filter(item => item.image.length > 1).map((item, index) => (
            <div className="row mb-5" key={index}>
              <div className="col-lg-7 col-md-12 align-content-center">
                <h2 className="mv_about_section_title">{item.title}</h2>
                <p className="mv_section_text">{item.description}</p>
              </div>
              <div className="col-lg-5 col-md-12 align-content-center">
                <div className="row">
                {item.image.map((img, i) => (
                    <div className="col-sm-6 col-6 mv_our_story_grid d-flex justify-content-${index % 2 === 0 ? 'end' : 'start'} mb-4" key={i}>
                      <img src={`${Back_URL}${img}`} alt="Manufacturing Facility" className="mv_our_story_image" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Aboutus
