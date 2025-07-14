import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getallAboutUs } from '../../Redux-Toolkit/ToolkitSlice/User/AboutusSlice';

const ViewaboutUs = () => {
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
                    <span><a className='sp_text_gray'>Dashboard</a><a className='sp_text_gray'> / About Us</a><span> / View About Us</span></span>
                </div>
            </div>
            <div className='sp_view'>
                {/* Who We Are Section - Single Image */}
                {aboutData.filter(item => item.image.length === 1).map((item, index) => (
                    <div key={index} className="row align-items-center mb-5">
                        <div className="col-xl-4">
                            <img src={`${Back_URL}${item.image[0]}`} className='w-100' alt={item.title} />
                        </div>
                        <div className="col-xl-8">
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}

                {/* Our Story Section with Multiple Images */}
                {aboutData.filter(item => item.image.length > 1).map((item, index) => (
                    <div key={index} className='row align-items-center justify-content-between gx-0 mb-5'>
                        <div className='col-xl-8 order-1 order-xl-0'>
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                        </div>
                        <div className='col-xl-4 px-0 row order-0 order-xl-1'>
                            {item.image.map((img, i) => (
                                <div key={i} className='col-6 py-2'>
                                    <img src={`${Back_URL}${img}`} className='w-100 h-100' alt={`${item.title} ${i + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ViewaboutUs
