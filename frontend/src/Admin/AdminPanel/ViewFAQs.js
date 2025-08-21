import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllFaq } from '../../Redux-Toolkit/ToolkitSlice/Admin/FaqSlice';
import { Link, useNavigate } from 'react-router-dom';

const ViewFAQs = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch();

    const getFaq = useSelector((state) => state?.faq?.allFaq);
    console.log(getFaq);
    
    // Group FAQs by category
    const groupFAQsByCategory = (faqs) => {
        const grouped = {};
        faqs.forEach(faq => {
            const categoryName = faq.categoryId?.categoryName || 'Uncategorized';
            if (!grouped[categoryName]) {
                grouped[categoryName] = [];
            }
            grouped[categoryName].push(faq);
        });
        return grouped;
    };

    useEffect(() => {
        dispatch(getAllFaq());
    }, [])
    
    const groupedFAQs = groupFAQsByCategory(getFaq || []);
    
    return (
        <div className='sp_main sp_height'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div >
                    <h4>View FAQ's</h4>
                    <p className='ds_text ds_font ds_cursor'><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link><span onClick={()=> navigate("/admin/faqs")}> / FAQ's </span><span style={{color:'rgba(20, 20, 20, 1)'}}> / View FAQ's</span></p>
                </div>
            </div>
            <div className='sp_view'>
            {Object.entries(groupedFAQs).map(([categoryName, faqs], categoryIndex) => (
                <div key={categoryIndex} className='mb-4'>
                    <h3 className='mb-3'>{categoryName}</h3>
                    {faqs.map((item, index) => (
                        <div key={index} className='mb-3 ms-4'>
                            <h5 className='mb-0'>{item.faqQuestion}</h5>
                            <ul className='text-wrap'>
                                <li className=''>{item.faqAnswer}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            ))}
                {/* <div>
                    <h5>Lorem ipsum dolor sit amet ?</h5>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <ul className='text-wrap'>
                        <li className='py-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
                        <li className='py-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
                        <li className='py-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
                    </ul>
                </div> */}
            </div>
        </div>
    )
}

export default ViewFAQs
