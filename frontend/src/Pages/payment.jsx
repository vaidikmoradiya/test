import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Payment = () => {
    const navigate = useNavigate();
    const Back_URL = 'http://localhost:5000/'

    const [activeMethod, setActiveMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [paymentError, setPaymentError] = useState('');
    const [expandedSection, setExpandedSection] = useState('card');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBank, setSelectedBank] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    var cartItems = JSON.parse(localStorage.getItem('CartbyuserData'));

    const [selectedAddress, setSelectedAddress] = useState(() => {
        const saved = localStorage.getItem('selectedaddress');
        return saved ? JSON.parse(saved) : null;
    });

    const [priceDetails, setPriceDetails] = useState({
        subTotal: 0,
        discount: 55,
        tax: 30,
        deliveryCharge: 0,
    });

    const banks = [
        { id: 1, name: 'Citi Bank', image: 'citi_bank.png' },
        { id: 2, name: 'Wells Fargo Bank', image: 'wells_fargo_bank.png' },
        { id: 3, name: 'Capital One Bank', image: 'capital_one_bank.png' },
        { id: 4, name: 'TD Bank', image: 'td_bank.png' },
        { id: 5, name: 'Citi Bank', image: 'citi_bank.png' },
        { id: 6, name: 'Capital One Bank', image: 'capital_one_bank.png' },
        { id: 7, name: 'Citi Bank', image: 'citi_bank.png' },
        { id: 8, name: 'Wells Fargo Bank', image: 'wells_fargo_bank.png' },
    ];

    const filteredBanks = banks.filter(bank => 
        bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBankSelect = (bank) => {
        setSelectedBank(bank);
        setSearchQuery(bank.name);
    };

    // Form validation schema
    const cardValidationSchema = Yup.object({
        cardNumber: Yup.string()
            .required('Card number is required')
            .matches(/^[0-9]{16}$/, 'Card number must be 16 digits'),
        expiryDate: Yup.string()
            .required('Expiry date is required')
            .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
        cvv: Yup.string()
            .required('CVV is required')
            .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits'),
        cardHolderName: Yup.string()
            .required('Cardholder name is required')
            .min(3, 'Name is too short')
    });

    // Formik initialization
    const formik = useFormik({
        initialValues: {
            cardNumber: '',
            expiryDate: '',
            cvv: '',
            cardHolderName: ''
        },
        validationSchema: cardValidationSchema,
        onSubmit: handlePayment
    });

    // Update quantity of items
    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        const updatedItems = cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        );
        cartItems = updatedItems;
    };

    // Remove item from cart
    const removeItem = (id) => {
        const updatedItems = cartItems.filter(item => item.id !== id);
        cartItems = updatedItems;
    };

    // Calculate final total
    const calculateTotal = () => {
        return priceDetails.subTotal - priceDetails.discount + priceDetails.tax + priceDetails.deliveryCharge;
    };

    // Calculate subtotal, tax and discount whenever cart items change
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const newTax = totalItems * 30;
        const newDiscount = totalItems * 100;

        // setPriceDetails(prev => ({
        //     ...prev,
        //     subTotal: total,
        //     tax: newTax,
        //     discount: newDiscount
        // }));
    }, [cartItems]);

    // Success Modal Component
    const SuccessModal = () => (
        <div className="mv_modal_overlay">
            <div className="mv_modal_content" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ 
                        width: '60px', 
                        height: '60px', 
                        background: '#4CAF50', 
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white"/>
                        </svg>
                    </div>
                    <h3 style={{ marginBottom: '10px', color: '#141414' }}>Payment successfully!</h3>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Thank you your payment is completed</p>
                </div>
            </div>
        </div>
    );

    // Handle payment submission
    async function handlePayment(values) {
        setIsProcessing(true);
        setPaymentError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setShowSuccessModal(true);
            // Automatically navigate to cart page after 1.5 seconds
            setTimeout(() => {
                navigate('/layout/cart');
            }, 1500);
        } catch (error) {
            setPaymentError('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    }

    // Format card number with spaces
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    // Toggle payment method
    const toggleMethod = (method) => {
        setActiveMethod(activeMethod === method ? '' : method);
    };

    return (
        <div className='mv_cart_main_padd'>
            <div className="m_container">
                <p className='mv_page_main_heading'>Payment method</p>

                <div className="row mv_main_product">
                    <div className="col-xl-8 col-lg-7">
                        <div className="mv_payment_methods_container">
                            {/* Credit/Debit Card */}
                            <div className={`mv_payment_method ${activeMethod === 'card' ? 'active' : ''}`}>
                                <div className="mv_method_header" onClick={() => toggleMethod('card')}>
                                    <div className="mv_method_title">
                                        <img height={24} width={24} src={require('../assets/debit_card.png')} alt="Visa" />
                                        <span>Debit / Credit Card</span>
                                    </div>
                                    <span className={`mv_arrow ${activeMethod === 'card' ? 'active' : ''}`}>›</span>
                                </div>
                                
                                {activeMethod === 'card' && (
                                    <div className="mv_method_content">
                                        <form onSubmit={formik.handleSubmit} className="mv_card_details_form">
                                            <div className="mv_payment_form_group">
                                                <label htmlFor="cardNumber">Card Number</label>
                                                <div className="mv_card_input_wrapper">
                                                    <input
                                                        type="text"
                                                        id="cardNumber"
                                                        placeholder="Enter Card Number"
                                                        {...formik.getFieldProps('cardNumber')}
                                                        onChange={(e) => {
                                                            const formatted = formatCardNumber(e.target.value);
                                                            formik.setFieldValue('cardNumber', formatted);
                                                        }}
                                                        maxLength="19"
                                                    />
                                                    <div className="mv_card_icons">
                                                        <img src={require('../assets/visa_card.png')} alt="" />
                                                        <img src={require('../assets/master_card.png')} alt="" />
                                                        <img src={require('../assets/amex_card.png')} alt="" />
                                                        <img src={require('../assets/discover_card.png')} alt="" />
                                                    </div>
                                                </div>
                                                {formik.touched.cardNumber && formik.errors.cardNumber && (
                                                    <div className="mv_error_message">{formik.errors.cardNumber}</div>
                                                )}
                                            </div>

                                            <div className="mv_card_details_row">
                                                <div className="mv_payment_form_group">
                                                    <label htmlFor="expiryDate">Expiry Date</label>
                                                    <input
                                                        type="text"
                                                        id="expiryDate"
                                                        placeholder="MM/YY"
                                                        {...formik.getFieldProps('expiryDate')}
                                                        maxLength="5"
                                                    />
                                                    {formik.touched.expiryDate && formik.errors.expiryDate && (
                                                        <div className="mv_error_message">{formik.errors.expiryDate}</div>
                                                    )}
                                                </div>

                                                <div className="mv_payment_form_group">
                                                    <label htmlFor="cvv">CVV</label>
                                                    <input
                                                        type="password"
                                                        id="cvv"
                                                        placeholder="CVV"
                                                        {...formik.getFieldProps('cvv')}
                                                        maxLength="4"
                                                    />
                                                    {formik.touched.cvv && formik.errors.cvv && (
                                                        <div className="mv_error_message">{formik.errors.cvv}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {paymentError && (
                                                <div className="mv_payment_error">{paymentError}</div>
                                            )}

                                            <div className='d-flex justify-content-center'>
                                                <button 
                                                    type="submit" 
                                                    className="mv_payment_button"
                                                    disabled={isProcessing || !formik.isValid}
                                                    onClick={handlePayment}
                                                >
                                                    {isProcessing ? 'Processing...' : `Payment`}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* Net Banking */}
                            <div className={`mv_payment_method ${activeMethod === 'netbanking' ? 'active' : ''}`}>
                                <div className="mv_method_header" onClick={() => toggleMethod('netbanking')}>
                                    <div className="mv_method_title">
                                        <img height={24} width={24} src={require('../assets/net_banking_icon.png')} alt="Visa" />
                                        <span>Net Banking</span>
                                    </div>
                                    <span className={`mv_arrow ${activeMethod === 'netbanking' ? 'active' : ''}`}>›</span>
                                </div>
                                
                                {activeMethod === 'netbanking' && (
                                    <div className="mv_method_content">
                                        <div className="mv_search_bank">
                                            <input 
                                                type="text" 
                                                placeholder="Search your bank"
                                                className="mv_bank_search_input"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="row dk_net_banking_sub">
                                            {filteredBanks.map((bank) => (
                                                <div 
                                                    key={bank.id}
                                                    className="col-xxl-1 col-xl-2 col-lg-2 col-md-3 col-sm-4 col-6"
                                                    onClick={() => handleBankSelect(bank)}
                                                >
                                                    <img 
                                                        src={require(`../assets/${bank.image}`)} 
                                                        alt={bank.name} 
                                                    />
                                                    <p>{bank.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className='d-flex justify-content-center'>
                                            <button 
                                                type="button" 
                                                className="mv_payment_button"
                                                disabled={isProcessing || !selectedBank}
                                                onClick={handlePayment}
                                            >
                                                {isProcessing ? 'Processing...' : 'Payment'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* UPI Section */}
                            <div 
                                className={`mv_payment_method ${activeMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => toggleMethod('upi')}
                            >
                                <div className="mv_method_header">
                                    <div className="mv_method_title">
                                        <img height={24} width={24} src={require('../assets/paypal_icon.png')} alt="Visa" />
                                        <span>Paypal</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-4 col-lg-5">
                        <div className="mv_price_details_container">
                            <div className="mv_address_section">
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
                                    </div>
                            </div>

                            <div className="mv_cart_product_wrapper">
                                {cartItems?.map((item ,index) => (
                                    <div key={index} className="mv_cart_product_card">
                                        <div className="mv_cart_product_content">
                                            <img src={`${Back_URL}${item?.productData[0]?.productImage[0]}`} alt={item.name} className="mv_cart_product_img" />
                                            <div className="mv_cart_product_details">
                                                <div className="mv_cart_product_title">{item.productData[0]?.productName}</div>
                                                <div className='mv_cart_price_qty_wrapper'>
                                                    <div className="mv_cart_price_group">
                                                        <span className="mv_cart_current_price">₹{item.productData[0]?.discountedPrice}</span>
                                                        <span className="mv_cart_original_price">₹{item.productData[0]?.price}</span>
                                                    </div>
                                                    <div className="mv_cart_qty">
                                                        <div className='d-flex justify-content-between'>
                                                            <div>
                                                                <span className='mv_cart_qty_label'>Qty: </span>
                                                            </div>
                                                            <div>
                                                                <span className='mv_cart_qty_value'>{item.qty}</span>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mv_price_details_section">
                                <h3 className="mv_price_details_heading">Price details</h3>

                                <div className='mv_main_price_row'>
                                        <div className="mv_price_row mt-4">
                                            <span className="mv_price_label">Sub Total</span>
                                            <span className="mv_price_value">₹{cartItems.reduce((total, item) => total + (item.productData[0]?.discountedPrice * item.qty), 0)}</span>
                                        </div>

                                        <div className="mv_price_row">
                                            <span className="mv_price_label">Tax (28%)</span>
                                            <span className="mv_price_value">₹{Math.round(cartItems.reduce((total, item) => total + (item.productData[0]?.discountedPrice * item.qty), 0) * 0.28)}</span>
                                        </div>

                                        <div className="mv_price_row mb-3">
                                            <span className="mv_price_label">Delivery Charge</span>
                                            <span className="mv_discount_value">FREE</span>
                                        </div>
                                    </div>

                                    <div className="mv_total_row">
                                        <span className='mv_total_amount'>Total Amount</span>
                                        <span className='mv_total_amount'>₹{Math.round(cartItems.reduce((total, item) => total + (item.productData[0]?.discountedPrice * item.qty), 0) * 1.28)}</span>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {showSuccessModal && <SuccessModal />}  
        </div>
    );
};

export default Payment;
