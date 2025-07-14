import React, { useEffect, useRef, useState } from 'react'
import './header.css'
import { Accordion, Button, Col, Container, Dropdown, Form, Modal, Offcanvas, Row } from 'react-bootstrap'
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaBars, FaLocationCrosshairs, FaLocationDot, FaPlus, FaRegHeart, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa6'
import { IoSearch } from 'react-icons/io5'
import { BsCart3 } from 'react-icons/bs'
import Models from './model/Models'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
// import { useCart } from '../../../Context/CartContext'
import { useDispatch, useSelector } from 'react-redux';
import { ChangePassword } from '../../Redux-Toolkit/ToolkitSlice/User/LoginSlice';
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice'
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice'
import { GetSubCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice'
import { GetAllProduct } from '../../Redux-Toolkit/ToolkitSlice/User/ProductSlice'


const Header = () => {

    const BaseUrl = 'http://localhost:5000';
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // const { cartItems } = useCart();
    // login 
    const [modalShow, setModalShow] = React.useState(false);
    const [address_model, setadderss_model] = useState(false);
    const [login, setlogin] = useState(false);

    const [mainCategories, setMainCategories] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState(null);
    const [categoriesByMain, setCategoriesByMain] = useState({});
    // const [mainCategory, setMainCategory] = useState([]);
    // const [category, setCategory] = useState([]);
    // const [subCategory, setSubCategory] = useState([]);
    const [noResultsFound, setNoResultsFound] = useState(false);

    const [isSearching, setIsSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [searchResults, setSearchResults] = useState([]);

    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        contactNo: '',
        address: '',
        landmark: '',
        pincode: '',
        city: '',
        state: '',
        addressType: 'Home'
    })

    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [oldPassword, setOldPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [newPassword, setNewPassword] = useState();

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const dispatch = useDispatch();
    const { loading: changePasswordLoading, message, success } = useSelector((state) => state.login);

    const maincategoryData = useSelector((state) => state.mainCategory.getMainCategoryData)
    const categoryData = useSelector((state) => state.category.getCategoryData)
    const subcategoryData = useSelector((state) => state.subcategory.getSubCategoryData)
    const ProductData = useSelector((state) => state.product.allProductData)
    // console.log(maincategoryData);
    // console.log(categoryData);
    // console.log(subcategoryData);
    // console.log("ProductData",ProductData);

    useEffect(() => {
        dispatch(GetMainCateData())
        dispatch(GetCateData())
        dispatch(GetSubCateData())
        dispatch(GetAllProduct())
    }, [])

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    // API URL
    const API_URL = 'http://localhost:5000/api'

    // Handle radio button change for address type
    const handleAddressTypeChange = (e) => {
        setFormData({
            ...formData,
            addressType: e.target.value
        })
    }

    // Get token from localStorage
    const getToken = () => {
        return localStorage.getItem('token')
    }
    // Config for axios
    const config = {
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    }

    // Create new address
    const createAddress = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            await axios.post(`${API_URL}/createAddress`, formData, config)
            setadderss_model(false)
        } catch (error) {
            console.error('Error creating address:', error)
            setLoading(false)
        }
    }

    let login_chk = () => {
        let login = localStorage.getItem('login')

        if (login) {
            setlogin(false)
            setModalShow(false);
        } else {
            setlogin(true)
            setModalShow(true);
        }
    }


    const [IsScroll, setIsScroll] = useState(false);
    const navListRef = useRef(null);

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);

        return () => {
            window.removeEventListener('resize', checkScroll);
        };
    }, []);


    const checkScroll = () => {
        if (navListRef.current.scrollWidth > navListRef.current.clientWidth) {
            setIsScroll(true);
        } else {
            setIsScroll(false);
        }
    };


    const handleNavScroll = (direction) => {
        const scrollAmount = 100;
        if (direction === 'left') {
            navListRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            navListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };


    // search suggestions

    let [suggestion, setsuggestion] = useState(null);

    let search_sug = [
        "iphone 16 pro max",
        "Samsung Galaxy S23 Ultra 5G AI Smartphone ",
        "iphone 16 pro max",
        "Samsung Galaxy S23 Ultra 5G AI Smartphone ",
        "Samsung Galaxy S23 Ultra 5G AI Smartphone ",
        "Samsung Galaxy S23 Ultra 5G AI Smartphone "
    ]

    const handle_serachSuggestion = (event) => {
        let search_text = event.target.value.toLowerCase();
        if (search_text.length > 0) {
            const filtered = search_sug.filter((element) =>
                element.toLocaleLowerCase().includes(search_text)
            );

            setsuggestion(filtered.length > 0 ? filtered : null);

        } else {
            setsuggestion(null);
        }
    };


    // image search model
    const [imagemodel, setimagemodel] = React.useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleMainCategoryHover = (mainCategoryName) => {
        setSelectedMainCategory(mainCategoryName);
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get(`${BaseUrl}/api/getCategoryAndSubCategory`, {
    //                 headers: {
    //                     Authorization: `Bearer ${token}`
    //                 }
    //             });

    //             // console.log("response", response.data.data);

    //             if (response.data && response.data.data) {
    //                 const categoryData = response.data.data;

    //                 // Set main categories
    //                 setMainCategories(categoryData);

    //                 // Process categories by main category
    //                 const categoriesMapped = {};

    //                 categoryData.forEach(mainCategory => {
    //                     categoriesMapped[mainCategory.mainCategoryName] = {};

    //                     // Process each category under the main category
    //                     if (mainCategory.categories && mainCategory.categories.length > 0) {
    //                         mainCategory.categories.forEach(category => {
    //                             categoriesMapped[mainCategory.mainCategoryName][category.categoryName] = [];

    //                             // Process subcategories
    //                             if (category.subCategories && category.subCategories.length > 0) {
    //                                 category.subCategories.forEach(subCategory => {
    //                                     categoriesMapped[mainCategory.mainCategoryName][category.categoryName].push(
    //                                         subCategory.subCategoryName
    //                                     );
    //                                 });
    //                             }
    //                         });
    //                     }
    //                 });

    //                 setCategoriesByMain(categoriesMapped);
    //             }
    //         } catch (error) {
    //             console.error('Data fetching Error:', error);
    //         }
    //     };

    //     fetchData();
    // }, [BaseUrl, token]);

    // Fix the performGlobalSearch function to handle no results scenario
    const performGlobalSearch = () => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setNoResultsFound(false);
            return;
        }

        const filteredProducts = ProductData.filter(product => 
            product.productName.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            setSearchResults([]);
            setNoResultsFound(true);
        } else {
            setSearchResults(filteredProducts);
            setNoResultsFound(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            performGlobalSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, ProductData]);

    const handleSearchResultClick = (id) => {
        setSearchQuery('');
        setSearchResults([]);
        setNoResultsFound(false);
        navigate(`/layout/Detailpage/${id}`);
    }

    // Function to toggle password visibility
    const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    const tokan = localStorage.getItem('token')

    const handleLogout = () => {
        localStorage.removeItem('token');
        setShowLogoutModal(false);
        navigate('/');
    };

    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("New password and confirm password do not match");
            return;
        }

        const result = await dispatch(ChangePassword({
            oldPassword,
            newPassword,
            confirmPassword
        }));

        if (result.payload?.status === 200) {
            alert("Password changed successfully");
            setShowChangePasswordModal(false);
            // Clear the form
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            alert(result.payload?.message || "Failed to change password");
        }
    };

    return (
        <React.Fragment>
            <Container fluid className='p-0'>

                <nav className='mv_top_nav'>
                    <div className="m_container">
                        <div className='d-flex justify-content-end mv_main_nav'>
                            <div className='mv_mo_main mv_mo_line'>
                                <div className='me-2'>
                                    <img src={require('../../assets/phone_icon.png')} height="18px" width="18px" alt="" />
                                </div>
                                <div>
                                    <p className='mb-0 mv_mo_number'>+91 3698527412</p>
                                </div>
                            </div>
                            <div className='mv_mo_main mv_mail_line'>
                                <div className='me-2'>
                                    <img src={require('../../assets/email_icon.png')} height="18px" width="18px" alt="" />
                                </div>
                                <div>
                                    <p className='mb-0 mv_mo_number'>example123@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <header className='header py-3'>
                    <div className='m_container'>
                        <Row className='m-0 justify-content-between align-items-center'>
                            <Col xs={12} md={2} lg={2} className='p-0'>
                                <div className='d-flex align-items-center gap-3'>
                                    <h2 className='mv_logo_text m-0'>
                                        LOGO
                                    </h2>
                                    {/* <div className='d-md-block d-none'>
                                        <Dropdown className='VK_header_drop'>
                                            <Dropdown.Toggle className='bg-transparent border-0' id="dropdown-basic">
                                                <div className='d-flex align-items-center gap-2'>
                                                    <FaLocationDot />
                                                    <span>Location</span>
                                                    <FaAngleDown />
                                                </div>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu className='p-0 overflow-hidden'>
                                                <Dropdown.Item href="" className='py-3'>
                                                    <div className='d-flex align-items-center'>
                                                        <FaLocationCrosshairs className='me-2' />
                                                        Get Current location
                                                    </div>
                                                </Dropdown.Item>
                                                <hr className='m-0' />
                                                <Dropdown.Item href="" className='py-3'>
                                                    <div className='d-flex align-items-center' onClick={() => setadderss_model(true)}>
                                                        <FaPlus className='me-2' />
                                                        Add address
                                                    </div>
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div> */}
                                    <div className='d-md-none ms-auto'>
                                        {/* <Button style={{ backgroundColor: "#ECECEC", borderRadius: "0px" }} className="shadow-none border-0 font_22 text-black">
                                            <IoSearch />
                                        </Button> */}
                                        <Button style={{ backgroundColor: "#ECECEC", borderRadius: "0px" }} onClick={handleShow} className="shadow-none border-0 font_22 text-black">
                                            <FaBars />
                                        </Button>
                                        <Offcanvas show={show} onHide={handleClose} placement='end'>
                                            <Offcanvas.Header closeButton>
                                                <Offcanvas.Title>
                                                    LOGO
                                                </Offcanvas.Title>
                                            </Offcanvas.Header>
                                            <Offcanvas.Body>
                                                <div className=''>
                                                    {/* <Accordion className='header_accoridan'>
                                                        <Accordion.Item eventKey="0" className='shadow-none'>
                                                            <Accordion.Header>
                                                                <FaLocationDot className='me-2' />
                                                                Location
                                                            </Accordion.Header>
                                                            <Accordion.Body className='p-0'>
                                                                <hr className='m-0' />
                                                                <div className='px-3 py-3 d-flex align-items-center'>
                                                                    <FaLocationCrosshairs className='me-2' />
                                                                    Get Current location
                                                                </div>
                                                                <hr className='m-0' />
                                                                <div className='px-3 py-3 d-flex align-items-center'>
                                                                    <FaPlus className='me-2' />
                                                                    Add address
                                                                </div>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    </Accordion>
                                                    <hr className='m-0' />
                                                    <div className='px-3 py-3 d-flex align-items-center' onClick={() => { login_chk() }}>
                                                        <FaUser className='me-2' />
                                                        Profile
                                                    </div> */}
                                                    <hr className='m-0' />
                                                    <Link to='/cart' className='px-3 py-3 d-flex align-items-center d_theme text-decoration-none  position-relative'>
                                                        {/* <BsCart3 className='me-2 font_20' /> */}
                                                        <img className='me-2' src={require("../../assets/Cart.png")} height={22} width={22} alt="" />
                                                        {/* <span className='s_cart1'> */}
                                                        {/* {cartItems.length || 0} */}
                                                        {/* </span> */}
                                                        Cart
                                                    </Link>
                                                    <hr className='m-0' />
                                                    <Link to='/wishlist' className='px-3 py-3 d-flex align-items-center text-decoration-none d_theme'>
                                                        {/* <FaRegHeart className='me-2 font_20' /> */}
                                                        <img className='me-2' src={require("../../assets/user.png")} height={22} width={22} alt="" />
                                                        Wishlist
                                                    </Link>
                                                    <hr className='m-0' />
                                                </div>
                                            </Offcanvas.Body>
                                        </Offcanvas>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={7} className='d-flex'>
                                <div className='VK_search_parent w-100'>
                                    <div className='VK_header_search d-flex align-items-center rounded-2 overflow-hidden px-3'>
                                        <span>
                                            <img className='mv_header_search_icon' src={require("../../assets/zoom.png")} alt="" />
                                        </span>
                                        <input type="text" value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)} placeholder='Search for products, styles and more'
                                            className='VK_header_search_bar bg-transparent outline_none border-0 py-2 ps-3' />
                                        {/* <span>
                                            <button className='bg-transparent border-0' onClick={() => { setimagemodel(true) }}>
                                                <img src={require("../../assets/Frame.png")} alt="" />
                                            </button>
                                        </span> */}
                                        <ul className='VK_input_suggestion list-unstyled'>
                                            {searchResults.length > 0 ? (
                                                searchResults.map((product, index) => (
                                                    <li key={`product-${index}`} className='py-2'>
                                                        <Link className='mv_search_a' to={`/layout/Detailpage/${product._id}`} onClick={() => handleSearchResultClick(product._id)}>
                                                            <div className='d-flex align-items-center w-100'>
                                                                <div>
                                                                    <img src={require('../../assets/zoom.png')} height="22px" width="22px" alt="" />
                                                                </div>
                                                                <div className='ps-3 mv_search_text'>
                                                                    {product.productName}
                                                                </div>
                                                                <div className='ms-auto'>
                                                                    {/* <img src={require('../../assets/arrow.png')} height="20px" width="20px" alt="" /> */}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    </li>
                                                ))
                                            ) : (
                                                searchQuery.length > 0 && noResultsFound && (
                                                    <li className='text-center mv_no_result_parent'>
                                                        <div className="not-found-message">
                                                            <img className='mb-3' src={require('../../assets/No result found.png')} height="116px" width="116px" alt="" />
                                                        </div>
                                                        <h4 className='mv_no_result_heading'>No result found</h4>
                                                        <p className='mb-0 mv_no_result_text'>No results found. Please try again.</p>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </Col>
                            <Col sm={2} md={4} lg={3} className='p-0 pe-lg-3'>
                                <div className='h-100 d-none d-md-block'>
                                    <div className='d-flex align-items-center justify-content-end h-100 gap-4'>
                                        {/* <Link to='/'>
                                            <img src={require("../../assets/wishlist.png")} height={20} width={20} alt="" />
                                        </Link> */}
                                        <Link to='/layout/Cart' className='mv_cart_link'>
                                            <div className='d-flex align-items-center'>
                                                <div>
                                                    <img src={require("../../assets/Cart.png")} height={22} width={22} alt="" />
                                                    {/* <span className='s_cart'> */}
                                                    {/* {cartItems.length || 0} */}
                                                    {/* </span> */}
                                                </div>
                                                <div>
                                                    <p className='mb-0 ms-2 mv_cart_text'>Cart</p>
                                                </div>
                                            </div>
                                        </Link>
                                        <div className='d-flex align-items-center'>
                                            {
                                                tokan ? (
                                                    <Dropdown>
                                                        <Dropdown.Toggle className='mv_account_toggle bg-transparent border-0 p-0' id="dropdown-basic">
                                                            <img src={require("../../assets/user.png")} height={22} width={22} alt="" />
                                                        </Dropdown.Toggle>

                                                        <Dropdown.Menu className='mv_account_menu'>
                                                            <Dropdown.Item className='mv_account_item' href="/layout/myorder">My Profile</Dropdown.Item>
                                                            <Dropdown.Item className='mv_account_item' onClick={() => setShowChangePasswordModal(true)}>
                                                                Change Password
                                                            </Dropdown.Item>
                                                            <Dropdown.Item className='mv_account_item' onClick={() => setShowLogoutModal(true)}>Logout</Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                ) : (
                                                    <Link to={'/signin'}>
                                                        <button className='bg-transparent border-0 p-0'>
                                                            <img src={require("../../assets/user.png")} height={22} width={22} alt="" />
                                                        </button>
                                                    </Link>
                                                )
                                            }
                                            <div>
                                                <p className='mb-0 ms-2 mv_acc_text'>Account</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div >
                </header >

                <nav style={{ backgroundColor: "#FFFFFF" }}>
                    <div className="m_container">
                        <Row className='m-0'>
                            <Col className='p-0'>
                                <div className='VK_header_nav d-flex overflow-hidden'>
                                    {IsScroll && (
                                        <button className='border-0' onClick={() => handleNavScroll('left')}>
                                            <FaAngleLeft />
                                        </button>
                                    )}
                                    <ul className='w-100 VK_sub_scroll_bar list-unstyled justify-content-between m-0 p-0 d-flex flex-nowrap overflow-auto white_space'
                                        ref={navListRef}
                                        onScroll={checkScroll}>
                                        {/* <li className='VK_sub_menu'>
                                            Single Head
                                            <div className='VK_mega_menu'>
                                                <div className='VK_mega_menu_div_parent'>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Essential Spare Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Needles
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbin Cases
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbins
                                                                </li>
                                                                <li className='py-1'>
                                                                    Presser Foot
                                                                </li>
                                                                <li className='py-1'>
                                                                    Thread Stand & Holders
                                                                </li>
                                                                <li className='py-1'>
                                                                    Drive Belts
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Assembly
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Essential Spare Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Control Panel/Display Screen
                                                                </li>
                                                                <li className='py-1'>
                                                                    Motors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Sensors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Power Supply Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Main Board/PCB
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Other Important Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Thread Cutters
                                                                </li>
                                                                <li className='py-1'>
                                                                    Oiling System
                                                                </li>
                                                                <li className='py-1'>
                                                                    Cap Frame & Hoops
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbin Winder
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Double Head
                                            <div className='VK_mega_menu'>
                                                <div className='VK_mega_menu_div_parent'>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Essential Spare Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Needles
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbin Cases
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbins
                                                                </li>
                                                                <li className='py-1'>
                                                                    Presser Foot
                                                                </li>
                                                                <li className='py-1'>
                                                                    Thread Stand & Holders
                                                                </li>
                                                                <li className='py-1'>
                                                                    Drive Belts
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Assembly
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Additional Spare Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Thread Cutters
                                                                </li>
                                                                <li className='py-1'>
                                                                    Oiling System
                                                                </li>
                                                                <li className='py-1'>
                                                                    Cap Frame & Hoops
                                                                </li>
                                                                <li className='py-1'>
                                                                    Thread Guide & Tubes
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbin Winder
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Electronic Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Control Panel/Display Screen
                                                                </li>
                                                                <li className='py-1'>
                                                                    Motors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Sensors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Power Supply Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Main Board/PCB
                                                                </li>
                                                                <li className='py-1'>
                                                                    Solenoids
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Multi Head
                                            <div className='VK_mega_menu'>
                                                <div className='VK_mega_menu_div_parent'>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Mechanical Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Needles
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbin Cases
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbins
                                                                </li>
                                                                <li className='py-1'>
                                                                    Presser Foot
                                                                </li>
                                                                <li className='py-1'>
                                                                    Thread Stand & Holders
                                                                </li>
                                                                <li className='py-1'>
                                                                    Drive Belts
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Assembly
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Lubrication & Maintenance
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Oiling System
                                                                </li>
                                                                <li className='py-1'>
                                                                    Cooling Fans
                                                                </li>
                                                                <li className='py-1'>
                                                                    Filters & Dust Covers
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Threading & Trimming Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Thread Cutters
                                                                </li>
                                                                <li className='py-1'>
                                                                    Thread Guide & Tubes
                                                                </li>
                                                                <li className='py-1'>
                                                                    Embroidery Machine Frame Clamps
                                                                </li>
                                                                <li className='py-1'>
                                                                    Cap Frame & Hoops
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbin Winder
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Electronic Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Control Panel/Display Screen
                                                                </li>
                                                                <li className='py-1'>
                                                                    Motors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Sensors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Power Supply Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Main Board/PCB
                                                                </li>
                                                                <li className='py-1'>
                                                                    Solenoids
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Rapier Loom
                                            <div className='VK_mega_menu'>
                                                <div className='VK_mega_menu_div_parent'>
                                                    <div className="mv_submenu">
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Mechanical Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Rapier Head
                                                                </li>
                                                                <li className='py-1'>
                                                                    Rapier Tape
                                                                </li>
                                                                <li className='py-1'>
                                                                    Guide Hook
                                                                </li>
                                                                <li className='py-1'>
                                                                    Drop Wires
                                                                </li>
                                                                <li className='py-1'>
                                                                    Reed
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Rollers
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Electronic Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Control Panel/Display Screen
                                                                </li>
                                                                <li className='py-1'>
                                                                    Stepper Motors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Sensors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Power Supply Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Detector
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div className="mv_submenu">
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Additional Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Weft Yarn Feeders
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Selector Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Jacquard or Dobby Mechanism
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Springs & Rods
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Lubrication & Maintenance
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Oiling System
                                                                </li>
                                                                <li className='py-1'>
                                                                    Cooling Fans
                                                                </li>
                                                                <li className='py-1'>
                                                                    Filters & Dust Covers
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Jacquard Loom
                                            <div className='VK_mega_menu'>
                                                <div className='VK_mega_menu_div_parent'>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Mechanical Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Jacquard Head Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Needles
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbins
                                                                </li>
                                                                <li className='py-1'>
                                                                    Presser Foot
                                                                </li>
                                                                <li className='py-1'>
                                                                    Needle Bar
                                                                </li>
                                                                <li className='py-1'>
                                                                    Drive Belts & Pulleys
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Electronic Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Control Panel/Display Screen
                                                                </li>
                                                                <li className='py-1'>
                                                                    Stepper Motors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Sensors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Power Supply Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Detector
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Threading Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Automatic Thread Cutters
                                                                </li>
                                                                <li className='py-1'>
                                                                    Color Change Mechanism
                                                                </li>
                                                                <li className='py-1'>
                                                                    Bobbin Winder
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Lubrication & Maintenance
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Oiling System
                                                                </li>
                                                                <li className='py-1'>
                                                                    Cooling Fans
                                                                </li>
                                                                <li className='py-1'>
                                                                    Filters & Dust Covers
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Additional Parts
                                                                </b>
                                                            </p>
                                                            <div className='d-flex justify-content-between'>
                                                                <ul className='list-unstyled m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Embroidery Software Dongle
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Memory Card Reader
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Thread Stand & Holders
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Air Jet Loom
                                            <div className='VK_mega_menu mv_mega_left_menu'>
                                                <div className='VK_mega_menu_big_div_parent'>
                                                    <div className='mv_megasub_menu'>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Mechanical Parts
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Main Nozzle
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Relay Nozzle
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Weft Accumulator
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Weft Tensioner
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Temple Cylinder
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Cloth Roller
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Drop Wires
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Wrap Beam
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Selvedge Cutter
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Tension Rollers
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Pneumatic & Air System Parts
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Solenoid valves
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Air Compressor
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Air Pipes & Tubes
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Pressure Sensors
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Air Flow Controller
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Nozzle Cleaning Device
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Lubrication & Maintenance
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Oil Pump & Nozzles
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Cooling Fans
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        filters & Dust Covers
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Electronics Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Control Panel
                                                                </li>
                                                                <li className='py-1'>
                                                                    Stepper Motors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Sensor
                                                                </li>
                                                                <li className='py-1'>
                                                                    power Supply Unit
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Additional Accessories & Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Weft Selector Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Selvedge Motion Device
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Spring & Rods
                                                                </li>
                                                                <li className='py-1'>
                                                                    Fabric Density Controller
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Water Jet Loom
                                            <div className='VK_mega_menu mv_mega_left_menu'>
                                                <div className='VK_mega_menu_big_div_parent'>
                                                    <div className='mv_megasub_menu'>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Mechanical Parts
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Main Nozzle
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Relay Nozzle
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Weft Accumulator
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Weft Tensioner
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Temple Cylinder
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Cloth Roller
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Wrap Beam
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Selvedge Cutter
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Drive Gears & Chains
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Water Jet & Hydraulic System
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Water Pump
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Solenoid Valves
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Water Pipes & Tubes
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Pressure Sensors
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Jet Timing Controller
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Nozzle Cleaning Device
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Lubrication & Maintenance
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Oil Pump & Nozzles
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Cooling Fans
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        filters & Dust Covers
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Electronics Components
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Control Panel
                                                                </li>
                                                                <li className='py-1'>
                                                                    Stepper Motors
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Sensor
                                                                </li>
                                                                <li className='py-1'>
                                                                    power Supply Unit
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Additional Accessories & Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Weft Selector Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Selvedge Motion Device
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Spring & Rods
                                                                </li>
                                                                <li className='py-1'>
                                                                    Fabric Density Controller
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Shuttle  Loom
                                            <div className='VK_mega_menu mv_mega_left_menu'>
                                                <div className='VK_mega_menu_big_div_parent'>
                                                    <div className='mv_megasub_menu'>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Mechanical Parts
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Shuttle
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Picking Stick
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Warp Beam
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Drop Wires
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Heald Frames (Harness)
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Treadles
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Pim (Bobbin)
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Selvedge Cutter
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Break System
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Drive Gears & Chains
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Picking Spring
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Shuttle Motion
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Shuttle Race Board
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Picking Lever
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Box Motion Mechanism
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Let-Off Motion
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Electronics Components
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Control Panel
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Motor
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Encoder
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Power Supply Unit
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Emergency Stop Button
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Lubrication & Maintenance
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Oil Pump & Nozzles
                                                                </li>
                                                                <li className='py-1'>
                                                                    Cooling Fans
                                                                </li>
                                                                <li className='py-1'>
                                                                    Filter & Dust Covers
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Additional Accessories & Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Weft Selector Unit
                                                                </li>
                                                                <li className='py-1'>
                                                                    Selvedge Motion Device
                                                                </li>
                                                                <li className='py-1'>
                                                                    Switch Tension Spring & Rods
                                                                </li>
                                                                <li className='py-1'>
                                                                    Beat-Up Mechanism
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='VK_sub_menu'>
                                            Power  Loom
                                            <div className='VK_mega_menu mv_mega_left_menu'>
                                                <div className='VK_mega_menu_big_div_parent'>
                                                    <div className='mv_megasub_menu'>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Mechanical Parts
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Warp Beam
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Take-Up Rollers
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Left-Off Motion
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Reed (Beater)
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Heald Frames (Harness)
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Shuttle Box
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Pim (Bobbin)
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Tension Roller
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Selvedge Cutter
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Drive Gears & Chains
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Electronic Components
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Control Panel
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Servo Motors
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Weft Break Sensor
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Wrap Break Sensor
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Encoder
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Inverter
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                            <div className='VK_menu_list'>
                                                                <p className='mb-2 font_18 header_color inter'>
                                                                    <b>
                                                                        Lubrication & Maintenance
                                                                    </b>
                                                                </p>
                                                                <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                    <li className='py-1'>
                                                                        Oil Pump & Nozzels
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Automatic Lubrication System
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Smart door locks
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Cooling Fans
                                                                    </li>
                                                                    <li className='py-1'>
                                                                        Filter & Dust Covers
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Weft Insertion & Tensioning System
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Weft Tensioner
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Accumulator
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Feeder
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Selector Mechanism
                                                                </li>
                                                                <li className='py-1'>
                                                                    Weft Cutter
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className='VK_menu_list'>
                                                            <p className='mb-2 font_18 header_color inter'>
                                                                <b>
                                                                    Additional Accessories & Parts
                                                                </b>
                                                            </p>
                                                            <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                <li className='py-1'>
                                                                    Selvedge Motion Device
                                                                </li>
                                                                <li className='py-1'>
                                                                    Beat-Up Cylinder
                                                                </li>
                                                                <li className='py-1'>
                                                                    Tension Spring & Rods
                                                                </li>
                                                                <li className='py-1'>
                                                                    Fabric Density Controller
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li> */}
                                        {maincategoryData && maincategoryData.map((mainCat, index) => (
                                            <li key={mainCat._id} className='VK_sub_menu'>
                                                {mainCat.mainCategoryName}
                                                <div className={index < 5 ? 'VK_mega_menu' : 'VK_mega_menu mv_mega_left_menu'}>
                                                    <div className={index < 5 ? 'VK_mega_menu_div_parent' : 'VK_mega_menu_big_div_parent'}>
                                                        {categoryData && categoryData
                                                            .filter(cat => cat.mainCategoryId === mainCat._id)
                                                            .map((category) => (
                                                                <div key={category._id}>
                                                                    <div className='VK_menu_list'>
                                                                        <p className='mb-2 font_18 header_color inter'>
                                                                            <b>
                                                                                {category.categoryName}
                                                                            </b>
                                                                        </p>
                                                                        <ul className='list-unstyled p-0 m-0 header_light inter'>
                                                                            {subcategoryData && subcategoryData
                                                                                .filter(subCat => subCat.categoryId === category._id)
                                                                                .map((subCat) => (
                                                                                    <li key={subCat._id} className='py-1'>
                                                                                        {subCat.subCategoryName}
                                                                                    </li>
                                                                                ))}
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    {IsScroll && (
                                        <button className='border-0' onClick={() => handleNavScroll('right')}>
                                            <FaAngleRight />
                                        </button>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </nav>
            </Container>

            {/* models */}
            {
                login ? (
                    <Models onHide={() => setModalShow(false)} show={modalShow} setmodel={setModalShow} />
                ) : (null)
            }


            {/* image search model */}
            <Modal
                show={imagemodel}
                onHide={() => { setimagemodel(false) }}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='VK_image_search_model'
            >
                <Modal.Header>
                    <div className='d-flex w-100 align-items-center'>
                        <div className='w-100 text-center'>
                            <p className='m-0 VK_image_search_heading'>
                                Search a product by image
                            </p>
                        </div>
                        <div>
                            <button onClick={() => { setimagemodel(false) }} className='bg-transparent border-0'>
                                {/* <img src={require('../../assets/close.png')} alt="" /> */}
                            </button>
                    </div>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className='p-sm-4 p-2'>
                        <div>
                            <div className='mb-5'>
                                <p className='m-0 text-center fw-600'>
                                    Drag an image here or <span className='text-decoration-underline'>upload a file</span>
                                </p>
                            </div>
                            <div className='d-flex gap-4 justify-content-between align-items-center mb-4'>
                                <span className='VK_or_line'></span>
                                <span className='fw-600 light_color'>OR</span>
                                <span className='VK_or_line'></span>
                            </div>
                            <div className='mb-5'>
                                <input type="text" className='VK_from_input w-100 py-2 px-3' placeholder='Enter image url' />
                            </div>
                            <div className='text-center'>
                                <button className='VK_image_btn'>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            {/* add address model */}
            <Modal
                show={address_model}
                onHide={() => { setadderss_model(false) }}
                aria-labelledby="contained-modal-title-vcenter"
                centered
                className='VK_add_address_model_'
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h5 className='VK_add_address_model_heading'>
                            Add Address
                        </h5>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='p-2 py-3'>
                        <form onSubmit={createAddress} className='w-100 VK_address_form'>
                            <div className='VK_name mb-3'>
                                <span className='VK_input_label pb-1'>
                                    Name
                                </span>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className='VK_from_input w-100 py-2 px-3'
                                    placeholder='Enter name'
                                    required
                                />
                            </div>
                            <div className='VK_name my-3'>
                                <span className='VK_input_label pb-1'>
                                    Contact no.
                                </span>
                                <input
                                    type="text"
                                    name="contactNo"
                                    value={formData.contactNo}
                                    onChange={handleChange}
                                    className='VK_from_input w-100 py-2 px-3'
                                    placeholder='Enter Contact No.'
                                    required
                                />
                            </div>
                            <div className='VK_name my-3'>
                                <span className='VK_input_label pb-1'>
                                    Building No. /  Building Name / Street Name
                                </span>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className='VK_from_input w-100 py-2 px-3'
                                    placeholder='Enter Building No. / Building Name / Street Name'
                                    required
                                />
                            </div>
                            <div className='VK_name my-3'>
                                <span className='VK_input_label pb-1'>
                                    Landmark
                                </span>
                                <input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    className='VK_from_input w-100 py-2 px-3'
                                    placeholder='Enter Landmark'
                                />
                            </div>
                            <div className='d-flex flex-sm-nowrap flex-wrap my-3 gap-3'>
                                <div className='w-100'>
                                    <span className='VK_input_label pb-1'>
                                        Pincode
                                    </span>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={formData.pincode}
                                        onChange={handleChange}
                                        className='VK_from_input w-100 py-2 px-3'
                                        placeholder='Enter Pincode'
                                        required
                                    />
                                </div>
                                <div className='w-100'>
                                    <span className='VK_input_label pb-1'>
                                        City
                                    </span>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className='VK_from_input w-100 py-2 px-3'
                                        placeholder='Enter City'
                                        required
                                    />
                                </div>
                                <div className='w-100'>
                                    <span className='VK_input_label pb-1'>
                                        State
                                    </span>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className='VK_from_input w-100 py-2 px-3'
                                        placeholder='Enter State'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='my-4'>
                                <div className='pb-2'>
                                    <span className='text-black fw-bold'>
                                        Address Type
                                    </span>
                                </div>
                                <div className='d-flex VK_edit_radio align-items-center gap-sm-5 gap-2 w-100'>
                                    <Form.Check
                                        type="radio"
                                        id="home-radio"
                                        label="Home"
                                        name="addressType"
                                        value="Home"
                                        checked={formData.addressType === "Home"}
                                        onChange={handleAddressTypeChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="work-radio"
                                        label="Work"
                                        name="addressType"
                                        value="Work"
                                        checked={formData.addressType === "Work"}
                                        onChange={handleAddressTypeChange}
                                    />
                                    <Form.Check
                                        type="radio"
                                        id="other-radio"
                                        label="Other"
                                        name="addressType"
                                        value="Other"
                                        checked={formData.addressType === "Other"}
                                        onChange={handleAddressTypeChange}
                                    />
                                </div>
                            </div>
                            <div className='mt-4 text-center'>
                                <button type="submit" className='VK_add_address_submit' disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Change Password Modal */}
            {showChangePasswordModal && (
                <div className="mv_cngpass_modal_overlay">
                    <div className="mv_cngpass_modal_content">
                        <div className="mv_cngpass_modal_header">
                            <h3 className="mv_review_modal_heading">Change Password</h3>
                            <button className="mv_review_modal_close" onClick={() => setShowChangePasswordModal(false)}>×</button>
                        </div>
                        <div className='mv_cngpass_modal_body'>
                            <div className='mv_cngpass_form_group'>
                                <label>Old Password</label>
                                <div className="mv_change_input_group">
                                    <input
                                        type={showOldPassword ? "text" : "password"}
                                        placeholder="Enter old password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        required
                                    />
                                    <button onClick={toggleOldPasswordVisibility} className="mv_change_eye_btn">
                                        {!showOldPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className='mv_cngpass_form_group'>
                                <label>New Password</label>
                                <div className="mv_change_input_group">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                    <button onClick={toggleNewPasswordVisibility} className="mv_change_eye_btn">
                                        {!showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            <div className='mv_cngpass_form_group'>
                                <label>Confirm Password</label>
                                <div className="mv_change_input_group">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                    <button onClick={toggleConfirmPasswordVisibility} className="mv_change_eye_btn">
                                        {!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="mv_cngpass_modal_footer">
                            <button type="button" className="mv_cngpass_modal_cancel" onClick={() => setShowChangePasswordModal(false)}>Cancel</button>
                            <button
                                type="submit"
                                className="mv_cngpass_modal_submit"
                                onClick={handlePasswordChange}
                                disabled={changePasswordLoading}
                            >
                                {changePasswordLoading ? "Changing..." : "Change"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="mv_logout_modal_overlay">
                    <div className="mv_logout_modal_content">
                        <div className="mv_logout_modal_header">
                            <h3 className="mv_review_modal_heading">Logout</h3>
                            <button className="mv_review_modal_close" onClick={() => setShowLogoutModal(false)}>×</button>
                        </div>
                        <div className='mv_logout_modal_body'>
                            <p className='mv_logout_body_text'>Are you sure you want to logout?</p>
                        </div>
                        <div className="mv_logout_modal_footer">
                            <button type="button" className="mv_logout_modal_cancel" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                            <button type="button" className="mv_logout_modal_submit" onClick={handleLogout}>Logout</button>
                        </div>
                    </div>
                </div>
            )}

        </React.Fragment >
    )
}

export default Header

