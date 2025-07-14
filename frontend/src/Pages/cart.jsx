import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Country, State, City } from 'country-state-city';
import { GetCartByuser, UpdateCartQuantity, DeleteCartItem, Createcart } from '../Redux-Toolkit/ToolkitSlice/User/CartSlice';
import { GetBestSeller } from '../Redux-Toolkit/ToolkitSlice/User/TopSellingSlice';
import { createaddress, getalladdress, updateAddress } from '../Redux-Toolkit/ToolkitSlice/User/AddressSlice';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const Cart = () => {

    const dispatch = useDispatch()
    const Back_URL = 'http://localhost:5000/'

    useEffect(() => {
        dispatch(GetCartByuser())
        dispatch(UpdateCartQuantity())
    }, [])

    const CartbyuserData = useSelector((state) => state.cart.GetCartData)
    console.log("CartbyuserData", CartbyuserData);

    const TopsellingData = useSelector((state) => state.topselling.allTopSellingData)
    // console.log("TopsellingData",TopsellingData);

    useEffect(() => {
        dispatch(GetBestSeller())
        dispatch(getalladdress())
    }, [])

    const AlladdressData = useSelector((state) => state.address.allAddress)
    console.log("AlladdressData", AlladdressData);

    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [addressData, SetAddressData] = useState([]);
    useEffect(() => {
        const user = localStorage.getItem("UserId")
        const data = AlladdressData.filter(item => item.userId === user)
        SetAddressData(data);
        localStorage.setItem('CartbyuserData',JSON.stringify(CartbyuserData))
    }, [AlladdressData])

    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            image: require('../assets/Delta Omni.png'),
            name: 'Delta Omni 0.4X19 Relay Nozzle',
            price: 6000,
            quantity: 1,
        },
        {
            id: 2,
            image: require('../assets/Delta Omni.png'),
            name: 'Delta Omni 0.4X19 Relay Nozzle',
            price: 6000,
            quantity: 1
        }
    ]);

    // Add new states for address management
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddressSelectionModal, setShowAddressSelectionModal] = useState(false);
    const [addresses, setAddresses] = useState();
    const [selectedAddress, setSelectedAddress] = useState("");

    useEffect(()=>{
        const add =  JSON.parse(localStorage.getItem('selectedaddress')) ;
        const saved =  add ? add : addressData?.[0];
        setSelectedAddress(saved)
        setAddresses(addressData);
    },[addressData])
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        address: '',
        pincode: '',
        country: '',
        state: '',
        city: '',
        contactNo: '',
        addressType: 'Home'
    });

    // Add new state to track if we're editing
    const [isEditing, setIsEditing] = useState(false);

    // Handle input changes
    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle address type selection
    const handleAddressTypeSelect = (type) => {
        setAddressForm(prev => ({
            ...prev,
            addressType: type
        }));
    };

    // Handle form submission
    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Update existing address
                const result = await dispatch(updateAddress({ 
                    id: editId, 
                    data: addressForm 
                })).unwrap();
                
                dispatch(getalladdress());
                setShowAddressModal(false);
                setIsEditing(false);
                setEditId(null);
                setAddressForm({
                    fullName: '',
                    address: '',
                    pincode: '',
                    country: '',
                    state: '',
                    city: '',
                    contactNo: '',
                    addressType: 'Home',
                });
            } else {
                // Check for duplicate address only for new addresses
                const isDuplicate = addressData.some(addr => 
                    addr.address === addressForm.address && 
                    addr.pincode === addressForm.pincode &&
                    addr.city === addressForm.city &&
                    addr.state === addressForm.state
                );
    
                if (isDuplicate) {
                    // First close the address modal
                    setShowAddressModal(false);
                    // Reset the form
                    setAddressForm({
                        fullName: '',
                        address: '',
                        pincode: '',
                        country: '',
                        state: '',
                        city: '',
                        contactNo: '',
                        addressType: 'Home',
                    });
                    // Then show error modal after a small delay
                    setTimeout(() => {
                        setErrorMessage('This address already exists!');
                        setShowErrorModal(true);
                    }, 300);
                    return;
                }
    
                // Create new address
                const result = await dispatch(createaddress(addressForm)).unwrap();
                dispatch(getalladdress());
                setShowAddressModal(false);
                setAddressForm({
                    fullName: '',
                    address: '',
                    pincode: '',
                    country: '',
                    state: '',
                    city: '',
                    contactNo: '',
                    addressType: 'Home',
                });
            }
        } catch (error) {
            console.error('Failed to handle address:', error);
            setErrorMessage(error.message || 'Failed to save address');
            setShowErrorModal(true);
            // Close the modal even if there's an error
            setShowAddressModal(false);
        }
    };

    useEffect(() => {
        let timer;
        if (showErrorModal) {
          timer = setTimeout(() => {
            setShowErrorModal(false);
          }, 2000);
        }
        return () => {
          if (timer) {
            clearTimeout(timer);
          }
        };
    }, [showErrorModal]);

    const handleEditAddress = (address) => {
        setAddressForm({
            fullName: address.fullName,
            address: address.address,
            pincode: address.pincode,
            country: address.country,
            state: address.state,
            city: address.city,
            contactNo: address.contactNo,
            addressType: address.addressType || 'Home',
        });
        setShowAddressSelectionModal(false);
        setIsEditing(true);
        setEditId(address._id);
        setShowAddressModal(true);
      };
      const handleAddNewAddress = () => {
        setAddressForm({
            fullName: '',
            address: '',
            pincode: '',
            country: '',
            state: '',
            city: '',
            contactNo: '',
            addressType: 'Home',
        });
        setShowAddressSelectionModal(false);
        setIsEditing(false);
        setEditId(null);
        setShowAddressModal(true);
      };

    // Handle address selection
    const handleAddressSelect = (address) => {
        setSelectedAddress(address);
        localStorage.setItem('selectedaddress',JSON.stringify(address))
        setShowAddressSelectionModal(false);
    };

    // Update quantity of items
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;

        const updatedItems = CartbyuserData.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
    };


    // Remove item from cart
    const removeItem = (id) => {
        dispatch(DeleteCartItem(id));
    };

    // Calculate subtotal, tax and discount whenever cart items change
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Calculate tax based on number of items (₹30 per item)
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTax = totalItems * 30;

        // Calculate discount based on number of items (₹55 per item)
        const newDiscount = totalItems * 100;
    }, [cartItems]);

    const initialProducts = [
        {
            id: 1,
            name: 'Delta Omni 0.4X19',
            price: 6000,
            originalPrice: 6800,
            discount: '20% Off',
            image: 'Delta Omni.png'
        },
        {
            id: 2,
            name: 'Relay Nozzle APOD-0004 PAT-A',
            price: 5000,
            originalPrice: 6600,
            discount: '20% Off',
            image: 'Relay Nozzle APOD.png'
        },
        {
            id: 3,
            name: 'Delta Omni 0.4X19',
            price: 6000,
            originalPrice: 6800,
            discount: '20% Off',
            image: 'Delta Omni.png'
        },
        {
            id: 4,
            name: 'Relay Nozzle APOD-0004 PAT-A',
            price: 5000,
            originalPrice: 6600,
            discount: '20% Off',
            image: 'Relay Nozzle APOD.png'
        }
    ];
    const [products, setProducts] = useState(initialProducts);

    // Country
    const allCountries = Country.getAllCountries();

    const handleQuantityChange = (itemId, qty) => {
        console.log("ssssssss", itemId, qty);

        dispatch(UpdateCartQuantity({ itemId, qty }));
    };

    const handleContinue = (e, itemId) => {
        e.preventDefault();
        dispatch(Createcart({
            id: itemId
        })).then(() => {
            dispatch(GetCartByuser());
        }).catch((error) => {
            alert('Failed to add product to cart: ' + error.message);
        });
    };
        
   const handleCheckout = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        return;
    }

    const subTotal = CartbyuserData.reduce(
        (total, item) => total + (item.productData[0]?.discountedPrice * item.qty),
        0
    );
    const tax = Math.round(subTotal * 0.28);
    const totalAmount = subTotal + tax; 

    // console.log("totalAmount",totalAmount);
    // console.log("subTotal",subTotal);
    // console.log("tax",tax);

    const options = {
        key: "rzp_test_hN631gyZ1XbXvp",
        amount: parseInt(totalAmount * 100),
        currency: "INR",
        name: "Pifron",
        description: "Pifron Payment",
        image: "https://yourdomain.com/logo.png",
        prefill: {
        //   name: values.firstName,
        //   email: values.email,
        //   contact: values.phoneNo,
        },
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: true,
        },
        // notes: {
        //   upi_id: upiId,
        // },
        theme: {
          color: "#000000",
        },
        handler: function (response) {
          const orderData = {
            // shippingInfo: values,
            paymentInfo: {
              razorpay_payment_id: response.razorpay_payment_id,
            },
            items: cartItems,
            totalPrice: parseInt(totalAmount * 100),
          };
        console.log('sdasd',orderData)
        // dispatch(CreateOrder(orderData));
        alert("Payment Successful!");
        },
        modal: {
          ondismiss: function () {
            alert("Payment popup closed");
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    //   setShowThankYou(true);
   }

    return (
        <>
            <div className='mv_cart_main_padd'>
                <div className="m_container">
                    <p className='mv_page_main_heading'>Cart</p>

                    <div className="row mv_main_product">
                        <div className="col-lg-8 col-md-12 col-sm-12">
                            <div className="cart-container">
                                <table className="mv_cart_table">
                                    <thead>
                                        <tr className="mv_art_header">
                                            <th className="mv_cart_header_item" style={{ flex: 2 }}>Product</th>
                                            <th className="mv_cart_header_item" style={{ flex: 1, textAlign: 'center' }}>Price</th>
                                            <th className="mv_cart_header_item" style={{ flex: 1, textAlign: 'center' }}>Quantity</th>
                                            <th className="mv_cart_header_item" style={{ flex: 1, textAlign: 'center' }}>Subtotal</th>
                                            <th className="mv_cart_header_item" style={{ flex: '0 0 40px' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CartbyuserData.map((item) => (
                                            console.log("bwivbweiqiqvgiqwe", item),

                                            <tr key={item.id} className="mv_cart_item">
                                                <td>
                                                    <div className="mv_cart_product_info">
                                                        <img src={`${Back_URL}${item?.productData[0]?.productImage[0]}`} alt={item.name} className="mv_product_image" />
                                                        <div>
                                                            <div className="mv_product_name">{item.productData[0]?.productName}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="mv_price_column">
                                                    ₹{item.productData[0]?.discountedPrice}
                                                </td>
                                                <td className="mv_quantity_column">
                                                    <div className="mv_quantity_controls">
                                                        <button
                                                            className="mv_quantity_btn"
                                                            onClick={() =>
                                                                handleQuantityChange(item._id, item.qty - 1)
                                                            }
                                                            disabled={item.qty <= 1}

                                                        >
                                                            <span>-</span>
                                                        </button>
                                                        <span className="mv_quantity_input">
                                                            {item.qty}
                                                        </span>
                                                        <button
                                                            className="mv_quantity_btn"
                                                            onClick={() => {
                                                                console.log("Plus clicked", item._id, item.qty + 1);  // Add this
                                                                handleQuantityChange(item._id, item.qty + 1);
                                                            }}
                                                        >
                                                            <span>+</span>
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="mv_subtotal_column">
                                                    ₹{item.productData[0]?.discountedPrice * item.qty}
                                                </td>
                                                <td>
                                                    <button className="mv_remove_btn" onClick={() => removeItem(item._id)}>×</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-12 col-sm-12">
                            <div className="mv_price_details_container">
                                <div className="mv_address_section">
                                    {(!addresses || addresses.length === 0) ? (
                                        <>
                                            <span className="mv_no_address">No saved address</span>
                                            <button
                                                className="mv_add_address_btn"
                                                onClick={() => setShowAddressModal(true)}
                                            >
                                                + Add Address
                                            </button>
                                        </>
                                    ) : !selectedAddress ? (
                                        <>
                                            <span className="mv_no_address">No address selected</span>
                                            <button
                                                className="mv_add_address_btn"
                                                onClick={() => setShowAddressSelectionModal(true)}
                                            >
                                                Select Address
                                            </button>
                                        </>
                                    ) : (
                                        <div className="mv_saved_address_card">
                                            <div className="mv_address_card_header_btn">
                                                <div className="mv_address_name">{selectedAddress.fullName}</div>
                                                <div className="mv_address_type_btn">{selectedAddress.addressType}</div>
                                            </div>
                                            <div className="mv_address_phone">+91 {selectedAddress.contactNo}</div>
                                            <div className="mv_address_text">
                                                {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.pincode}
                                                {selectedAddress.country ? `, ${selectedAddress.country}` : ''}
                                            </div>
                                            <button
                                                className="mv_address_change_btn"
                                                onClick={() => setShowAddressSelectionModal(true)}
                                            >
                                                Change
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="mv_price_details_section">
                                    <h3 className="mv_price_details_heading">Price details</h3>

                                    <div className='mv_main_price_row'>
                                        <div className="mv_price_row mt-4">
                                            <span className="mv_price_label">Sub Total</span>
                                            <span className="mv_price_value">₹{CartbyuserData.reduce((total, item) => total + (item.productData[0]?.discountedPrice * item.qty), 0)}</span>
                                        </div>

                                        <div className="mv_price_row">
                                            <span className="mv_price_label">Tax (28%)</span>
                                            <span className="mv_price_value">₹{Math.round(CartbyuserData.reduce((total, item) => total + (item.productData[0]?.discountedPrice * item.qty), 0) * 0.28)}</span>
                                        </div>

                                        <div className="mv_price_row mb-3">
                                            <span className="mv_price_label">Delivery Charge</span>
                                            <span className="mv_discount_value">FREE</span>
                                        </div>
                                    </div>

                                    <div className="mv_total_row">
                                        <span className='mv_total_amount'>Total Amount</span>
                                        <span className='mv_total_amount'>₹{Math.round(CartbyuserData.reduce((total, item) => total + (item.productData[0]?.discountedPrice * item.qty), 0) * 1.28)}</span>
                                    </div>

                                    <button
                                        className="mv_checkout_btn"
                                        onClick={handleCheckout}
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Explore Other Products */}
            <div className='mv_product_des_padd'>
                <div className="m_container">
                    <div className="row">
                        <div className="col-12">
                            <div className='mv_relay_main mt-0'>
                                <div className=''>
                                    <h2 className='mv_relay_text'>Explore Other Products</h2>
                                    <h6 style={{ color: '#14141499' }}>Explore our top selling products</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mv_product_main_mar">
                        {TopsellingData?.map((item, index) => (
                            <div key={index} className="col-lg-3 col-md-4 col-sm-6">
                                <div className="mv_main_card">
                                    <div
                                        className='mv_product_img text-decoration-none'
                                        onClick={() => window.location.href = `/layout/Detailpage/${item._id}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src={`${Back_URL}${item?.productDetails?.productImage[0]}`} className='' />
                                    </div>
                                    <div
                                        className='mv_name_dis text-decoration-none'
                                        onClick={() => window.location.href = `/layout/Detailpage/${item._id}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div>
                                            <p className='mv_pro_name'>{item.productDetails?.productName}</p>
                                        </div>
                                        {item.productDetails.discount && (
                                            <div>
                                                <p className='mv_dis_per'>{item.productDetails?.discount}% off</p>
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className='mv_main_pro_price text-decoration-none'
                                        onClick={() => window.location.href = `/layout/Detailpage/${item._id}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className=''>
                                            <p className='mv_product_price'>${item.productDetails?.discountedPrice}</p>
                                        </div>
                                        <div>
                                            <p className='mv_dis_price'><strike>${item.productDetails?.price}</strike></p>
                                        </div>
                                    </div>
                                    <div className='mv_main_add_cart_btn mv_add_cart_btn'>
                                        <a className='' href="#" onClick={(e) => handleContinue(e, item._id)}>Add to Cart</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Address Form Modal */}
            {showAddressModal && (
                <div className="mv_modal_overlay">
                    <div className="mv_modal_content">
                        <div className="mv_modal_header">
                            <h3 className="mv_modal_heading">
                                {isEditing ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button
                                className="mv_modal_close"
                                onClick={() => {
                                    setShowAddressModal(false);
                                    setIsEditing(false);
                                }}
                            >
                                ×
                            </button>
                        </div>
                        {showAddressModal && (
                            <div className="mv_modal_overlay">
                                <div className="mv_modal_content">
                                    <div className="mv_modal_header">
                                        <h3 className="mv_modal_heading">{isEditing ? 'Edit Address' : 'Add New Address'}</h3>
                                        <button className="mv_modal_close" onClick={() => {
                                            setShowAddressModal(false);
                                            setIsEditing(false);
                                            setEditId(null);
                                            setAddressForm({
                                                fullName: '',
                                                address: '',
                                                pincode: '',
                                                country: '',
                                                state: '',
                                                city: '',
                                                contactNo: '',
                                                addressType: 'Home',
                                            });
                                        }}>×</button>
                                    </div>
                                    <div className="mv_modal_body">
                                        <form onSubmit={handleAddressSubmit}>
                                            <div className="mv_form_section">
                                                <h4 className="mv_section_title">Area Details</h4>
                                                <div className="mv_form_group">
                                                    <label>Address (House no, Building, Street, Area)</label>
                                                    <input
                                                        type="text"
                                                        name="address"
                                                        value={addressForm.address}
                                                        onChange={handleAddressInputChange}
                                                        placeholder="Address (House no, Building, Street, Area)"
                                                        required
                                                    />
                                                </div>
                                                <div className="mv_cart_form_row">
                                                    <div className="mv_form_group">
                                                        <label>Pincode</label>
                                                        <input
                                                            type="text"
                                                            name="pincode"
                                                            value={addressForm.pincode}
                                                            onChange={handleAddressInputChange}
                                                            placeholder="Pincode"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mv_form_group">
                                                        <label>Country</label>
                                                        <input
                                                            type="text"
                                                            name="country"
                                                            value={addressForm.country}
                                                            onChange={handleAddressInputChange}
                                                            placeholder="Country"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mv_cart_form_row">
                                                    <div className="mv_form_group">
                                                        <label>State</label>
                                                        <input
                                                            type="text"
                                                            name="state"
                                                            value={addressForm.state}
                                                            onChange={handleAddressInputChange}
                                                            placeholder="State"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mv_form_group">
                                                        <label>City</label>
                                                        <input
                                                            type="text"
                                                            name="city"
                                                            value={addressForm.city}
                                                            onChange={handleAddressInputChange}
                                                            placeholder="City"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mv_form_section">
                                                <h4 className="mv_section_title">Contact Details</h4>
                                                <div className="mv_cart_form_row">
                                                    <div className="mv_form_group">
                                                        <label>Full Name</label>
                                                        <input
                                                            type="text"
                                                            name="fullName"
                                                            value={addressForm.fullName}
                                                            onChange={handleAddressInputChange}
                                                            placeholder="Full name"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="mv_form_group">
                                                        <label>Contact No.</label>
                                                        <input
                                                            type="text"
                                                            name="contactNo"
                                                            maxLength={10}
                                                            value={addressForm.contactNo}
                                                            onChange={e => {
                                                                const value = e.target.value.replace(/\D/g, '');
                                                                if (value.length <= 10) {
                                                                    setAddressForm(prev => ({ ...prev, contactNo: value }));
                                                                }
                                                            }}
                                                            onKeyPress={e => {
                                                                if (!/[0-9]/.test(e.key)) {
                                                                    e.preventDefault();
                                                                }
                                                                if (addressForm.contactNo.length >= 10 && e.key !== 'Backspace') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            placeholder="Contact no"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mv_form_section">
                                                <h4 className="mv_section_title">Address Type</h4>
                                                <div className="mv_address_type_buttons">
                                                    <button
                                                        type="button"
                                                        className={`mv_type_btn ${addressForm.addressType === 'Home' ? 'active' : ''}`}
                                                        onClick={() => handleAddressTypeSelect('Home')}
                                                    >
                                                        Home
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`mv_type_btn ${addressForm.addressType === 'Office' ? 'active' : ''}`}
                                                        onClick={() => handleAddressTypeSelect('Office')}
                                                    >
                                                        Office
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={`mv_type_btn ${addressForm.addressType === 'Other' ? 'active' : ''}`}
                                                        onClick={() => handleAddressTypeSelect('Other')}
                                                    >
                                                        Other
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mv_modal_footer">
                                                <button type="submit" className="mv_modal_submit">
                                                    {isEditing ? 'Update Address' : 'Save Address'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Address Selection Modal */}
            {showAddressSelectionModal && (
                <div className="mv_modal_overlay">
                    <div className="mv_modal_saved_address">
                        <div className="mv_modal_header">
                            <h3 className="mv_modal_heading">Saved Address</h3>
                            <button
                                className="mv_modal_close"
                                onClick={() => setShowAddressSelectionModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="mv_modal_body">
                            <div className="row">
                                {addresses.map((address) => (
                                    <div key={address.id} className="col-md-6 mb-4">
                                        <div
                                            style={{
                                                cursor: 'pointer',
                                                border: selectedAddress?.id === address.id ? '1px solid #141414' : '0.6px solid #14141480',
                                                padding: '20px',
                                                position: 'relative',
                                                backgroundColor: '#fff',
                                                height: '100%',
                                                borderRadius: '0px',
                                                minHeight: '160px'
                                            }}
                                            onClick={() => handleAddressSelect(address)}
                                        >
                                            <div style={{
                                                backgroundColor: '#1E2131',
                                                color: '#fff',
                                                display: 'inline-block',
                                                padding: '4px 12px',
                                                fontSize: '14px',
                                                marginBottom: '12px',
                                                fontWeight: '400'
                                            }}>
                                                {address.addressType}
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditAddress(address);
                                                }}
                                                style={{
                                                    border: 'none',
                                                    background: 'none',
                                                    padding: 0,
                                                    position: 'absolute',
                                                    top: '20px',
                                                    right: '20px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <img height={20} width={20} src={require(`../assets/edit_icon.png`)} />
                                            </button>
                                            <div style={{
                                                fontSize: '16px',
                                                fontWeight: '500',
                                                marginBottom: '8px',
                                                color: '#141414'
                                            }}>
                                                {address.fullName}
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                marginBottom: '8px',
                                                color: '#141414'
                                            }}>
                                                +91 {address.contactNo}
                                            </div>
                                            <div style={{
                                                fontSize: '14px',
                                                color: '#141414',
                                                lineHeight: '20px',
                                                wordBreak: 'break-word'
                                            }}>
                                                {address.address}, {address.city}, {address.state}, {address.pincode}
                                                {address.country ? `, ${address.country}` : ''}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    backgroundColor: '#1E2131',
                                    color: '#fff',
                                    border: 'none',
                                    marginTop: '15px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                                onClick={handleAddNewAddress}
                            >
                                + Add new address
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="mv_modal_overlay">
                    <div className="mv_modal_content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: '#f44336',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px'
                            }}>
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                                </svg>
                            </div>
                            <h3 style={{ marginBottom: '10px', color: '#141414' }}>Error</h3>
                            <p style={{ color: '#666', marginBottom: '20px' }}>{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Cart;
