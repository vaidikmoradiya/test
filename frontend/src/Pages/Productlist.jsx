import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { GetAllProduct } from '../Redux-Toolkit/ToolkitSlice/User/ProductSlice';
import { Link } from 'react-router-dom';
import { Createcart } from '../Redux-Toolkit/ToolkitSlice/User/CartSlice';

function Productlist() {
    const { id } = useParams();
    console.log(id)

    const navigate = useNavigate();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortMethod, setSortMethod] = useState('default');
    const [activeSortOption, setActiveSortOption] = useState('Sort by');
    const [sortedProducts, setSortedProducts] = useState([]);

    const ProductData = useSelector((state) => state.product.allProductData)
    // console.log("ProductData",ProductData);
    
    const dispatch = useDispatch()
    const Back_URL = 'http://localhost:5000/'

    useEffect(() => {
        dispatch(GetAllProduct())
    }, [])

    // Toggle dropdown visibility
    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent immediate closure on toggle click
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Apply sorting and update products state
    const handleSort = (method, displayText) => {
        setSortMethod(method);
        setActiveSortOption(displayText);
        setIsDropdownOpen(false);
        
        let sortedItems = [...ProductData];
        
        switch (method) {
            case 'price-low-high':
                sortedItems.sort((a, b) => a.discountedPrice - b.discountedPrice);
                break;
            case 'price-high-low':
                sortedItems.sort((a, b) => b.discountedPrice - a.discountedPrice);
                break;
            case 'discount-low-high':
                sortedItems.sort((a, b) => {
                    const discountA = a.discount || 0;
                    const discountB = b.discount || 0;
                    return discountA - discountB;
                });
                break;
            case 'discount-high-low':
                sortedItems.sort((a, b) => {
                    const discountA = a.discount || 0;
                    const discountB = b.discount || 0;
                    return discountB - discountA;
                });
                break;
            default:
                sortedItems = [...ProductData];
                break;
        }
        
        setSortedProducts(sortedItems);
    };

    // Update sortedProducts when ProductData changes
    useEffect(() => {
        setSortedProducts(ProductData);
    }, [ProductData]);

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

    // Define sort options
    const sortOptions = [
        { method: 'price-low-high', display: 'Price: Low to High' },
        { method: 'price-high-low', display: 'Price: High to Low' },
        { method: 'discount-low-high', display: 'Discount: Low to High' },
        { method: 'discount-high-low', display: 'Discount: High to Low' }
    ];

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
            <div className='mv_product_list_main_bg'>
                <div className="m_container">
                    <div className="row">
                        <div className="col-12">
                            <div className='mv_relay_main'>
                                <div>
                                    <h2 className='mv_relay_text'>Relay Nozzle</h2>
                                </div>
                                <div className="mv_dropdown">
                                    <button className="mv_dropbtn" onClick={toggleDropdown}>
                                        {activeSortOption}<MdKeyboardArrowDown className='ms-2' />
                                    </button>
                                    {isDropdownOpen && (
                                        <div className="mv_dropcon">
                                            {sortOptions.map((option, index) => (
                                                <p 
                                                    key={index} 
                                                    onClick={() => handleSort(option.method, option.display)}
                                                    className={sortMethod === option.method ? 'active-sort' : ''}
                                                >
                                                    {option.display}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mv_product_main_mar">
                        {(sortedProducts.length > 0 ? sortedProducts : ProductData).map((item, index) => (
                            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                                <div className="mv_main_card">
                                    <Link to={`/layout/Detailpage/${item._id}`} className='mv_product_img text-decoration-none'>
                                    <img src={`${Back_URL}${item.productImage[0]}`} className='' />
                                    </Link>
                                    <Link to={`/layout/Detailpage/${item._id}`} className='mv_name_dis text-decoration-none'>
                                        <div>
                                            <p className='mv_pro_name'>{item.productName}</p>
                                        </div>
                                        {item.discount && (
                                            <div>
                                                <p className='mv_dis_per'>{item.discount}% off</p>
                                            </div>
                                        )}
                                    </Link>
                                    <Link to={`/layout/Detailpage/${item._id}`} className='mv_main_pro_price text-decoration-none'>
                                        <div className=''>
                                            <p className='mv_product_price'>₹{item.discountedPrice}</p>
                                        </div>
                                        <div>
                                            <p className='mv_dis_price'><strike>₹{item.price}</strike></p>
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

export default Productlist;