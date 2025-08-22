import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getallAboutUs } from '../../Redux-Toolkit/ToolkitSlice/User/AboutusSlice';
import { Link, useNavigate } from 'react-router-dom';

const ViewaboutUs = () => {
    const navigate = useNavigate()
    const aboutData = useSelector((state) => state.about.allAbout)
    const dispatch = useDispatch()

    console.log("aboutData", aboutData);

    const Back_URL = 'http://localhost:5000/'
    
    useEffect(() => {
        dispatch(getallAboutUs())
    }, [])

    return (
        <div className='sp_main sp_height'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div >
                    <h4>View About Us</h4>
                    <p className='ds_text ds_font ds_cursor'><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link><span onClick={()=> navigate("/admin/aboutus")}> / About Us </span><span style={{color:'rgba(20, 20, 20, 1)'}}> / View About Us</span></p>
                </div>
            </div>
            <div className='sp_view'>
                {/* Who We Are Section - Single Image */}
                {aboutData.filter(item => item.image.length === 1).map((item, index) => (
                    <div key={index} className="row mv_our_singleimg_row align-items-center">
                        <div className="col-xl-5 py-2 mv_viewaboutus_img">
                            <img src={`${Back_URL}${item.image[0]}`} className='w-100' alt={item.title} />
                        </div>
                        <div className="col-xl-7">
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}

                {/* Our Story Section with Multiple Images */}
                {aboutData.filter(item => item.image.length > 1).map((item, index) => (
                    <div key={index} className='row mv_our_multipleimg_row align-items-center justify-content-between'>
                        <div className='col-xl-7'>
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                        </div>
                        <div className='col-xl-5'>
                            <div className='row order-0 order-xl-1'>
                                {item.image.map((img, i) => (
                                    <div key={i} className='col-6 py-2 mv_viewaboutus_four_img mb-2'>
                                        <img src={`${Back_URL}${img}`} className='w-100' alt={`${item.title} ${i + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ViewaboutUs
