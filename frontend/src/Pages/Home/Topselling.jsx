import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { GetBestSeller } from '../../Redux-Toolkit/ToolkitSlice/User/TopSellingSlice';
import { Link } from 'react-router-dom';
import { Createcart } from '../../Redux-Toolkit/ToolkitSlice/User/CartSlice';

function Topselling() {
    const { id } = useParams();
    console.log(id)

    const navigate = useNavigate();

    const TopsellingData = useSelector((state) => state.topselling.allTopSellingData)
    // console.log("TopsellingData",TopsellingData);
    
    const dispatch = useDispatch()
    const Back_URL = 'http://localhost:5000/'

    useEffect(() => {
        dispatch(GetBestSeller())
    }, [])

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Toggle dropdown visibility
    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent immediate closure on toggle click
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleContinue = (e, itemId) => {
        e.preventDefault();
        dispatch(Createcart({
            id: itemId
        })).then(() => {
            navigate('/layout/Cart')
        }).catch((error) => {
            alert('Failed to add product to cart: ' + error.message);
        });
    };

    return (
        <>  
            <div className='mv_top_selling_main_bg'>
                <div className="m_container">
                    <div className="row">
                        <div className="col-12">
                            <div className='mv_relay_main justify-content-center'>
                                <div className='text-center'>
                                    <h6 className='mv_section_subtitle'>Products</h6>
                                    <h2 className='mv_relay_text'>Explore our top selling products</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mv_product_main_mar">
                        {TopsellingData?.map((item, index) => (
                            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                                <div className="mv_main_card">
                                    <Link to={`/layout/Detailpage/${item._id}`} className='mv_product_img text-decoration-none'>
                                        <img src={`${Back_URL}${item?.productDetails?.productImage[0]}`} className='' />
                                    </Link>
                                    <Link to={`/layout/Detailpage/${item._id}`} className='mv_name_dis text-decoration-none'>
                                        <div>
                                            <p className='mv_pro_name'>{item.productDetails.productName}</p>
                                        </div>
                                        {item.productDetails.discount && (
                                            <div>
                                                <p className='mv_dis_per'>{item.productDetails.discount}% off</p>
                                            </div>
                                        )}
                                    </Link>
                                    <Link to={`/layout/Detailpage/${item._id}`} className='mv_main_pro_price text-decoration-none'>
                                        <div className=''>
                                            <p className='mv_product_price'>${item.productDetails.discountedPrice}</p>
                                        </div>
                                        <div>
                                            <p className='mv_dis_price'><strike>${item.productDetails.price}</strike></p>
                                        </div>
                                    </Link>
                                    <div className='mv_main_add_cart_btn mv_add_cart_btn'>
                                        <a className='' href="#" onClick={(e) => handleContinue(e, item._id)}>Add to Cart</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Topselling;