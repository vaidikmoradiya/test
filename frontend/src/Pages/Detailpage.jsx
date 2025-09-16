import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { GetProductById } from '../Redux-Toolkit/ToolkitSlice/User/DetailPageSlice';
import { Link } from 'react-router-dom';
import { CreateReview, GetAllReview } from '../Redux-Toolkit/ToolkitSlice/User/ReviewSlice';
import { GetBestSeller } from '../Redux-Toolkit/ToolkitSlice/User/TopSellingSlice';
import { Createcart, GetCartByuser } from '../Redux-Toolkit/ToolkitSlice/User/CartSlice';

const Detailpage = () => {
  const { id } = useParams();
  console.log(id)

  const navigate = useNavigate();

  const detailData = useSelector((state) => state.detailpage.GetProductByIdData)
  console.log("detailData", detailData);

  const dispatch = useDispatch()
  const Back_URL = 'http://localhost:5000/'

  useEffect(() => {
    dispatch(GetProductById(id))
  }, [])

  const TopsellingData = useSelector((state) => state.topselling.allTopSellingData)
  // console.log("TopsellingData",TopsellingData);

  useEffect(() => {
    dispatch(GetBestSeller())
  }, [])

  const ReviewtData = useSelector((state) => state.review.allReviewData)
  // console.log("ReviewtData",ReviewtData);

  useEffect(() => {
    dispatch(GetAllReview())
  }, [])

  const CartData = useSelector((state) => state.cart.GetCartData)
  // console.log("CartData",CartData);

  const [selectedImage, setSelectedImage] = useState(0);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewSuccess, setShowReviewSuccess] = useState(false);
  const [showReviewError, setShowReviewError] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  const [reviewdata, SetReviewData] = useState();
  
  useEffect(() => {
    const data = ReviewtData.filter(item => item.productId === id)
    SetReviewData(data);
  }, [ReviewtData, id])

  const [cart, setCart] = useState({
    productId: '',
    userId: '',
    qty: ''
  });

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

  const handleContinue = (e, itemId) => {
    e.preventDefault();
    dispatch(Createcart({
      id: itemId || id
    })).then(() => {
      dispatch(GetCartByuser()); // Refresh cart data after update
      navigate('/layout/Cart');
    }).catch((error) => {
      alert('Failed to add product to cart: ' + error.message);
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Here you can add the logic to submit the review
    console.log('Review submitted:', review);
    var userId = localStorage.getItem('UserId')
    const alreadyReviewed = Array.isArray(ReviewtData) && ReviewtData.some(r => r?.productId === id && String(r?.userId) === String(userId));
    if (alreadyReviewed) {
      setShowReviewError(true);
      setTimeout(() => setShowReviewError(false), 1800);
      return;
    }
    dispatch(CreateReview({ ...review, id, userId })).then((response) => {
      if (response?.meta?.requestStatus === 'fulfilled') {
        dispatch(GetAllReview());
        setShowReviewModal(false);
        setReview({ rating: 0, title: '', comment: '' });
        setShowReviewSuccess(true);
        setTimeout(() => setShowReviewSuccess(false), 1800);
      } else {
        setShowReviewError(true);
        setTimeout(() => setShowReviewError(false), 1800);
      }
    })
  };

  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  const PaymentSuccessModal = () => (
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
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
            </svg>
          </div>
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Payment Successful!</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Your order has been placed successfully. Redirecting to home page...</p>
        </div>
      </div>
    </div>
  );

  const handleBuyNow = async (product) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const subTotal = Number(product?.discountedPrice || 0);
    const tax = Math.round(subTotal * 0.28);
    const totalAmount = subTotal + tax;

    const options = {
      key: "rzp_test_hN631gyZ1XbXvp",
      amount: parseInt(totalAmount * 100),
      currency: "INR",
      name: "Pifron",
      description: "Pifron Payment",
      image: "https://yourdomain.com/logo.png",
      prefill: {},
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: true,
      },
      theme: {
        color: "#000000",
      },
      handler: function (response) {
        const orderData = {
          paymentInfo: {
            razorpay_payment_id: response.razorpay_payment_id,
          },
          items: [
            {
              id: product?._id,
              name: product?.productName,
              price: product?.discountedPrice,
              quantity: 1,
            },
          ],
          totalPrice: parseInt(totalAmount * 100),
        };
        console.log('orderData', orderData);

        setShowPaymentSuccessModal(true);
        setTimeout(() => {
          setShowPaymentSuccessModal(false);
          navigate('/layout/home');
        }, 2000);
      },
      modal: {
        ondismiss: function () {
          alert("Payment popup closed");
        },
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Calculate actual ratings distribution from review data
  const calculateRatingsDistribution = () => {
    if (!reviewdata || reviewdata.length === 0) return [];
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewdata.forEach(review => {
      if (review.rate && review.rate >= 1 && review.rate <= 5) {
        distribution[review.rate]++;
      }
    });
    
    return Object.entries(distribution).map(([stars, count]) => ({
      stars: parseInt(stars),
      count: count
    })).reverse(); // Show 5 stars first
  };

  const ratings = calculateRatingsDistribution();
  const totalRatings = reviewdata ? reviewdata.length : 0;
  
  // Calculate average rating
  const calculateAverageRating = () => {
    if (!reviewdata || reviewdata.length === 0) return 0;
    const totalRating = reviewdata.reduce((sum, review) => sum + (review.rate || 0), 0);
    return (totalRating / reviewdata.length).toFixed(1);
  };
  
  const averageRating = calculateAverageRating();

  const [showAllReviews, setShowAllReviews] = useState(false);

  const ReviewSuccessModal = () => (
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
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
            </svg>
          </div>
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Review submitted!</h3>
        </div>
      </div>
    </div>
  );

  const ReviewErrorModal = () => (
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
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>You already reviewed this product</h3>
        </div>
      </div>
    </div>
  );
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

  // Function to get responsive character limit based on screen width
  const getResponsiveCharLimit = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1440) return 120;
    if (screenWidth >= 1024) return 100;
    if (screenWidth >= 768) return 70;
    if (screenWidth >= 575) return 50;
    if (screenWidth >= 425) return 35;
    if (screenWidth >= 320) return 25;
    return 150; // default for larger screens
  };

  // State to track character limit
  const [charLimit, setCharLimit] = useState(getResponsiveCharLimit());

  // Effect to update character limit on window resize
  useEffect(() => {
    const handleResize = () => {
      setCharLimit(getResponsiveCharLimit());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="">
      <div className='mv_coman_padd'>
        <div className="m_container">
          {detailData?.map((item, index) => (
            <div key={index} className="row">
              <div className="col-md-6 align-content-center mv_image_main">
                <div className="mv_product_gallery">
                  <div className="mv_thumbnail_list">
                    {item.productImage.map((img, index) => (
                      <div
                        key={index}
                        className={`mv_thumbnail ${selectedImage === index ? 'active' : ''}`}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img src={`${Back_URL}${img}`} alt={`Product view ${index + 1}`} />
                      </div>
                    ))}
                  </div>
                  <div className="mv_main_image">
                    <div className="">
                      <img src={`${Back_URL}${item.productImage[selectedImage]}`} alt={item.name} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mv_product_info">
                  <div className='d-flex justify-content-between font_12 mb-3'>
                    <div>
                      <h1 className="mv_product_title">{item.productName}</h1>
                    </div>
                    <div>
                      <div style={{ backgroundColor: '#F6F0DF', padding: '5px' }} className='mv_main_star'>
                        <div>
                          <img className='mv_star_img' src={require(`../assets/Star.png`)} />
                        </div>
                        <div>
                          <h1 className="mv_rate_text">{Number(item?.rating || 0).toFixed(2)}</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mv_stock_status">
                    {item.stockStatus ? (
                      <span className="mv_in_stock">In Stock</span>
                    ) : (
                      <span className="mv_out_of_stock">Out of Stock</span>
                    )}
                  </div>

                  <div className="mv_description">
                    {item.shortDescription}
                  </div>

                  <div className="mv_price_section">
                    <span className="mv_current_price">₹{item.discountedPrice}</span>
                    <span className="mv_original_price">₹{item.price}</span>
                    <span className="mv_discount">{item.discount}% Off</span>
                  </div>

                  <div className="mv_part_number">
                    {/* <div><p className='mb-0'>Part No.:</p></div> */}
                    {/* <div className='mv_part_no'>{item.partNo}</div> */}
                  </div>

                  <div className="mv_main_star mb-3">
                    <img className='mv_star_img me-0' src={require(`../assets/Delivery.png`)} />
                    <div className='mv_part_no'>Deliver to</div>
                  </div>

                  <div className='mv_main_pincode'>
                    <div className='mv_main_pin_input'>
                      <input className='mv_pin_input' type="text" placeholder='Enter delivery Pincode' />
                      <div><a className='mv_check' href="">Check</a></div>
                    </div>
                    <div>
                      <p className='mv_deli_date'>Delivery by 7 Oct, Monday</p>
                      <p className='mv_deli_time'>if ordered before 5:11PM</p>
                    </div>
                  </div>

                  <div className="mv_action_buttons">
                    <div className="row mv_action_btn_main">
                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        <button className="mv_buy_now" onClick={() => handleBuyNow(item)}>Buy now</button>
                      </div>
                      <div className="col-lg-6 col-md-6 col-sm-6 col-6">
                        {item.stockStatus ? (
                          <Link to={`/layout/Cart`}>
                            <button className="mv_add_to_cart" onClick={handleContinue}>Add to cart</button>
                          </Link>
                        ) : (
                          <button className="mv_add_to_cart">Notify Me</button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <ul className='mv_pro_details'>
                      <li>Additional 5 - 6 business days is required for delivery.</li>
                      <li>Within a week to 45 days</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Description */}
      <div className="mv_product_des_padd">
        <div className="m_container">
          {detailData.map((item, index) => (
            <div key={index}>
              <p className='mv_coman_heading'>Product Description</p>
              <p className='mb-0'>{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product deratils */}
      <div className="m_container">
        {detailData[0]?.data && detailData[0]?.data.length > 0 && (
          <div className="mv_part_main_det_padd">
            <div className="row">
              {/* Left Section - Items 1-6 and odd items 13+ */}
              <div className="col-sm-6 col-12">
                <div className='mv_part_details_padd'>
                  {/* First 6 items */}
                  {detailData[0]?.data?.slice(0, 6).map((item, index) => (
                    <div className="row" key={index}>
                      <div className="col-md-3 col-sm-4 col-4">
                        <p className='mv_name_heading'>{item.key}</p>
                      </div>
                      <div className="col-md-9 col-sm-8 col-8">
                        <p className='mv_title'>{item.value}</p>
                      </div>
                    </div>
                  ))}
                  {/* Items 13, 15, 17, etc. (odd items 13+) */}
                  {detailData[0]?.data?.length > 12 && detailData[0]?.data?.slice(12).map((item, index) => {
                    const actualIndex = index + 12;
                    // Only show odd items (13, 15, 17, etc.) in left section
                    if (actualIndex % 2 === 0) {
                      return (
                        <div className="row" key={actualIndex}>
                          <div className="col-md-3 col-sm-4 col-4">
                            <p className='mv_name_heading'>{item.key}</p>
                          </div>
                          <div className="col-md-9 col-sm-8 col-8">
                            <p className='mv_title'>{item.value}</p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              {/* Right Section - Items 7-12 and even items 13+ */}
              {detailData[0]?.data?.length >= 7 && (
                <div className="col-sm-6 col-12">
                  <div className='mv_part_details_padd'>
                    {/* Items 7-12 */}
                    {detailData[0]?.data?.slice(6, 12).map((item, index) => (
                      <div className="row" key={index + 6}>
                        <div className="col-md-3 col-sm-4 col-4">
                          <p className='mv_name_heading'>{item.key}</p>
                        </div>
                        <div className="col-md-9 col-sm-8 col-8">
                          <p className='mv_title'>{item.value}</p>
                        </div>
                      </div>
                    ))}
                    {/* Items 14, 16, 18, etc. (even items 13+) */}
                    {detailData[0]?.data?.length > 12 && detailData[0]?.data?.slice(12).map((item, index) => {
                      const actualIndex = index + 12;
                      // Only show even items (14, 16, 18, etc.) in right section
                      if (actualIndex % 2 === 1) {
                        return (
                          <div className="row" key={actualIndex}>
                            <div className="col-md-3 col-sm-4 col-4">
                              <p className='mv_name_heading'>{item.key}</p>
                            </div>
                            <div className="col-md-9 col-sm-8 col-8">
                              <p className='mv_title'>{item.value}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Customer Ratings */}
      <div className='mv_product_des_padd'>
        <div className="m_container">
          <div className='mv_main_cus_rating'>
            <div>
              <p className='mv_coman_heading'>Customer Ratings</p>
              <p className='mv_count_reating'>
                {totalRatings} {totalRatings === 1 ? 'Rating' : 'Ratings'} & {reviewdata?.length || 0} {reviewdata?.length === 1 ? 'Review' : 'Reviews'}
              </p>
            </div>
            <div>
              <a className='mv_add_review' href="#" onClick={(e) => { e.preventDefault(); setShowReviewModal(true); }}>Add review</a>
            </div>
          </div>

          {/* Average Rating Display */}
          {/* {totalRatings > 0 && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '20px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center', marginRight: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1E2131' }}>
                  {averageRating}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>out of 5</div>
              </div>
              <div style={{ marginLeft: '20px' }}>
                <div style={{ display: 'flex', marginBottom: '8px' }}>
                  {[...Array(5)].map((_, index) => (
                    <span
                      key={index}
                      style={{ 
                        color: index < Math.round(averageRating) ? '#FDC040' : '#CECECE',
                        fontSize: '24px',
                        marginRight: '2px'
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Based on {totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'}
                </div>
              </div>
            </div>
          )} */}

          <div className="mv_rating_distribution">
            {ratings.length > 0 ? (
              ratings.map((rating) => (
                <div key={rating.stars} className="mv_rating_row" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ width: '30px', marginRight: '8px' }}>
                    <span style={{ color: 'black', marginRight: '5px' }}>{rating.stars}</span>
                    <span style={{ color: '#FDC040', fontSize: '20px' }}>★</span>
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#CECECE', height: '8px', borderRadius: '4px' }}>
                    <div
                      style={{
                        width: `${totalRatings > 0 ? (rating.count / totalRatings) * 100 : 0}%`,
                        backgroundColor: '#1E2131',
                        height: '100%',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <div style={{ width: '40px', marginLeft: '8px', fontSize: '12px', color: '#666' }}>
                    {rating.count}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                No ratings yet. Be the first to rate this product!
              </div>
            )}
          </div>

          <div className="mv_reviews_section">
            <h2 className="mv_coman_heading">Reviews</h2>
            {reviewdata && reviewdata.length > 0 ? (
              <>
                {reviewdata.slice(0, showAllReviews ? reviewdata.length : 3).map((item, index) => (
                  <div key={index} className="review-card">
                    <div className="mv_review_header">
                      <div className="mv_user_info">
                        <div>
                          <img 
                            src={item?.userData?.[0]?.image ? `${Back_URL}${item.userData[0].image}` : '/default-avatar.png'} 
                            className="mv_avatar" 
                            alt="User Avatar"
                          />
                        </div>
                        <div className='w-100'>
                          <div className='mv_review_name_star'>
                            <div className='mv_main_user_name'>
                              <div>
                                <h4 className="mv_user_name">{item.userData[0]?.firstName || 'Anonymous User'}</h4>
                              </div>
                              <div className="mv_rating_stars">
                                {[...Array(5)].map((_, index) => (
                                  <span
                                    key={index}
                                    className="mv_star"
                                    style={{ color: index < item.rate ? '#FDC040' : '#CECECE' }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className='mv_main_review_main'>
                              <span className="mv_review_date">
                                {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }).replace(/\s/g, ' ')}
                              </span>
                            </div>
                          </div>
                          {item.title && (
                            <div className="row" style={{ marginBottom: '8px' }}>
                              <div className="col-md-8 col-sm-12">
                                <h5 style={{ 
                                  fontSize: '16px', 
                                  fontWeight: '600', 
                                  color: '#1E2131',
                                  margin: '0'
                                }}>
                                  {item.title}
                                </h5>
                              </div>
                            </div>
                          )}
                          <div className="row">
                            <div className="col-md-8 col-sm-12">
                              <p className="mv_review_text">
                                {item.description && item.description.length > charLimit 
                                  ? `${item.description.slice(0, charLimit)}...` 
                                  : item.description || 'No description provided'
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {reviewdata.length > 3 && (
                  <a
                    href="#"
                    className="mv_view_all_btn"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllReviews(!showAllReviews);
                    }}
                  >
                    {showAllReviews ? 'Show Less' : `View All ${reviewdata.length} Reviews`}
                  </a>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>No reviews yet for this product.</p>
                <p>Be the first to share your experience!</p>
              </div>
            )}
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
                      <p className='mv_pro_name'>{item.productDetails.productName}</p>
                    </div>
                    {item.productDetails.discount && (
                      <div>
                        <p className='mv_dis_per'>{item.productDetails.discount}% off</p>
                      </div>
                    )}
                  </div>
                  <div 
                    className='mv_main_pro_price text-decoration-none'
                    onClick={() => window.location.href = `/layout/Detailpage/${item._id}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className=''>
                      <p className='mv_product_price'>${item.productDetails.discountedPrice}</p>
                    </div>
                    <div>
                      <p className='mv_dis_price'><strike>${item.productDetails.price}</strike></p>
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

      {/* Review Modal */}
      {showReviewModal && (
        <div className="mv_modal_overlay">
          <div className="mv_review_modal">
            <div className="mv_modal_header">
              <h3>Write a review</h3>
              <button className="mv_modal_close" onClick={() => setShowReviewModal(false)}>×</button>
            </div>
            <form onSubmit={handleReviewSubmit}>
              <div className="mv_modal_body">
                <div className="mv_rating_section">
                  <label className='mv_modal_heading'>How would you rate us?</label>
                  <div className="mv_star_rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`mv_star ${review.rating >= star ? 'mv_star_filled' : ''}`}
                        onClick={() => setReview({ ...review, rating: star })}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mv_review_comment">
                  <label className='mv_modal_heading'>Can you tell us more?</label>
                  <textarea
                    value={review.comment}
                    onChange={(e) => setReview({ ...review, comment: e.target.value })}
                    placeholder="Write your review"
                    required
                  />
                </div>
              </div>
              <div className="mv_modal_footer">
                <button type="button" className="mv_modal_cancel" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="mv_modal_submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewSuccess && <ReviewSuccessModal />}
      {showReviewError && <ReviewErrorModal />}
      {showPaymentSuccessModal && <PaymentSuccessModal />}

    </div>
  );
};

export default Detailpage;