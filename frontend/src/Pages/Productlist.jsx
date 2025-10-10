import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { GetAllProduct } from '../Redux-Toolkit/ToolkitSlice/User/ProductSlice';
import { Link } from 'react-router-dom';
import { Createcart, GetCartByuser } from '../Redux-Toolkit/ToolkitSlice/User/CartSlice';
import { GetSubCateDataByCategoryId } from '../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice';

function Productlist() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const subcategoryId = searchParams.get('subcategory');
    const subcategoryName = searchParams.get('subcategoryName');
    const categoryId = searchParams.get('categoryId');
    const categoryName = searchParams.get('categoryName');
    console.log('Subcategory ID:', subcategoryId, 'Subcategory Name:', subcategoryName);
    console.log('Category ID:', categoryId, 'Category Name:', categoryName);

    const navigate = useNavigate();
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sortMethod, setSortMethod] = useState('default');
    const [activeSortOption, setActiveSortOption] = useState('Sort by');
    const [sortedProducts, setSortedProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showAll, setShowAll] = useState(false);

    const ProductData = useSelector((state) => state.product.allProductData)
    const subCategoryData = useSelector((state) => state.subcategory.getSubCategoryDataByCategoryId)
    console.log("ProductData",ProductData);
    console.log("SubCategoryData",subCategoryData);
    
    const dispatch = useDispatch()
    const Back_URL = 'http://localhost:5000/'

    useEffect(() => {
        dispatch(GetAllProduct(true))
    }, [])

    // Fetch subcategories when categoryId is present
    useEffect(() => {
        if (categoryId) {
            dispatch(GetSubCateDataByCategoryId(categoryId));
        }
    }, [categoryId, dispatch]);

    // Filter products by subcategory or category
    useEffect(() => {
        if (ProductData) {
            let filtered = [];
            
            if (subcategoryId) {
                // Filter by specific subcategory
                filtered = ProductData.filter(product => 
                    product.subCategoryId === subcategoryId
                );
            } else if (categoryId && subCategoryData.length > 0) {
                // Filter by all subcategories of the selected category
                const subcategoryIds = subCategoryData.map(sub => sub._id);
                filtered = ProductData.filter(product => 
                    subcategoryIds.includes(product.subCategoryId)
                );
            } else {
                // Show all products
                filtered = ProductData;
            }
            
            setFilteredProducts(filtered);
            setSortedProducts(filtered);
        }
    }, [ProductData, subcategoryId, categoryId, subCategoryData]);

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
        
        const baseList = (subcategoryId || categoryId) ? filteredProducts : ProductData;
        let sortedItems = [...baseList];
        
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
                sortedItems = [...baseList];
                break;
        }
        
        setSortedProducts(sortedItems);
        setShowAll(false);
    };

    // Update sortedProducts when filteredProducts changes
    useEffect(() => {
        setSortedProducts((subcategoryId || categoryId) ? filteredProducts : ProductData);
    }, [filteredProducts, ProductData, subcategoryId, categoryId]);

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
        { method: 'default', display: 'Default' },
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
            // stay on the same page; optionally show a toast here
            dispatch(GetCartByuser());
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
                            <div className='row mv_relay_main'>
                                <div className='col-8'>
                                    <h2 className='mv_relay_text'>
                                        {subcategoryName ? subcategoryName : 
                                         categoryName ? `${categoryName} Products` : 
                                         'All Products'}
                                    </h2>
                                </div>
                                <div className="mv_dropdown col-4">
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
                            {(subcategoryName || categoryName) && (
                                <div className='d-flex align-items-center gap-3 mb-3'>
                                    <p className='text-muted mb-0'>
                                        {subcategoryName ? 
                                            `Showing products in ${subcategoryName} subcategory` :
                                            `Showing products in ${categoryName} category`
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="row mv_product_main_mar">
                        {(() => {
                            const baseList = sortedProducts.length > 0 ? sortedProducts : ((subcategoryId || categoryId) ? filteredProducts : ProductData);
                            const productsToShow = showAll ? baseList : baseList?.slice(0, 8);

                            if (!baseList || baseList.length === 0) {
                                return (
                                    <div className="col-12 text-center py-5">
                                        <h3>No data available</h3>
                                    </div>
                                );
                            }

                            return productsToShow.map((item, index) => (
                                <div key={index} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                                    <div className="mv_main_card flex-column justify-content-between d-flex">
                                        <Link to={`/layout/Detailpage/${item._id}`} className='mv_product_img text-decoration-none'>
                                        <img src={`${Back_URL}${item.productImage[0]}`} className='' />
                                        </Link>
                                        <Link to={`/layout/Detailpage/${item._id}`} className='mv_name_dis text-decoration-none'>
                                            <div>
                                                <p className='mv_pro_name mv_pro_big_name'>{item.productName}</p>
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
                                        {item.stock ? (
                                            <div onClick={(e) => handleContinue(e, item._id)} className='mv_main_add_cart_btn mv_add_cart_btn'>
                                                <a className='' href="#">Add to Cart</a>
                                            </div>
                                        ) : (
                                            <div className='mv_main_add_cart_btn mv_add_cart_btn' style={{ pointerEvents: 'none', border: 'none' }}>
                                                <span style={{ color: 'red', fontWeight: 600 }}>Not Available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ));
                        })()}
                        {(() => {
                            const baseList = sortedProducts.length > 0 ? sortedProducts : ((subcategoryId || categoryId) ? filteredProducts : ProductData);
                            return (baseList?.length || 0) > 8 && (
                                <div className='col-12 d-flex justify-content-center mt-3'>
                                    {!showAll ? (
                                        <button className='mv_view_btn' onClick={() => setShowAll(true)}>View More</button>
                                    ) : (
                                        <button className='mv_view_btn' onClick={() => setShowAll(false)}>View Less</button>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Productlist;