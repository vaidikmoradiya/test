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
  const [review, setReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  const [reviewdata, SetReviewData] = useState();
  useEffect(() => {
    const data = ReviewtData.filter(item => item.productId === id)
    SetReviewData(data);
  }, [ReviewtData])

  const [cart, setCart] = useState({
    productId: '',
    userId: '',
    qty: ''
  });

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
    dispatch(CreateReview({ ...review, id, userId })).then((response) => {
      if (response.payload) {
        console.log("payload", response.payload);
        dispatch(GetAllReview())
      }
    })
    setShowReviewModal(false);
    setReview({ rating: 0, title: '', comment: '' });
  };

  const ratings = [
    { stars: 5, count: 80 },
    { stars: 4, count: 30 },
    { stars: 3, count: 10 },
    { stars: 2, count: 5 },
    { stars: 1, count: 3 }
  ];

  // Calculate total ratings to get percentages
  const totalRatings = ratings.reduce((acc, curr) => acc + curr.count, 0);

  const [showAllReviews, setShowAllReviews] = useState(false);
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
                          <h1 className="mv_rate_text">{item.rating}</h1>
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
                    <span className="mv_current_price">${item.discountedPrice}</span>
                    <span className="mv_original_price">${item.price}</span>
                    <span className="mv_discount">{item.discount}% Off</span>
                  </div>

                  <div className="mv_part_number">
                    <div><p className='mb-0'>Part No.:</p></div>
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
                      <div className="col-lg-4 col-md-6 col-sm-4 col-6">
                        <button className="mv_buy_now">Buy now</button>
                      </div>
                      <div className="col-lg-8 col-md-6 col-sm-8 col-6">
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
              {/* Left Section - Show when there's at least 1 data item */}
              <div className="col-sm-6 col-12">
                <div className='mv_part_details_padd'>
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
                </div>
              </div>
              {/* Right Section - Show only when there are 6 or more data items */}
              {detailData[0]?.data?.length >= 6 && (
                <div className="col-sm-6 col-12">
                  <div className='mv_part_details_padd'>
                    {detailData[0]?.data?.slice(6, detailData[0]?.data?.length).map((item, index) => (
                      <div className="row" key={index}>
                        <div className="col-md-3 col-sm-4 col-4">
                          <p className='mv_name_heading'>{item.key}</p>
                        </div>
                        <div className="col-md-9 col-sm-8 col-8">
                          <p className='mv_title'>{item.value}</p>
                        </div>
                      </div>
                    ))}
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
              <p className='mv_count_reating'>125 Ratings & 20 Reviews</p>
            </div>
            <div>
              <a className='mv_add_review' href="#" onClick={(e) => { e.preventDefault(); setShowReviewModal(true); }}>Add review</a>
            </div>
          </div>

          <div className="mv_rating_distribution">
            {ratings.map((rating) => (
              <div key={rating.stars} className="mv_rating_row" style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ width: '30px', marginRight: '8px' }}>
                  <span style={{ color: 'black', marginRight: '5px' }}>{rating.stars}</span>
                  <span style={{ color: '#FDC040', fontSize: '20px' }}>★</span>
                </div>
                <div style={{ flex: 1, backgroundColor: '#CECECE', height: '8px', borderRadius: '4px' }}>
                  <div
                    style={{
                      width: `${(rating.count / totalRatings) * 100}%`,
                      backgroundColor: '#1E2131',
                      height: '100%',
                      borderRadius: '4px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mv_reviews_section">
            <h2 className="mv_coman_heading">Reviews</h2>
            {reviewdata?.slice(0, showAllReviews ? reviewdata.length : 3).map((item, index) => (
              <div key={index} className="review-card">
                <div className="mv_review_header">
                  <div className="mv_user_info">
                    <div>
                      <img src={`${Back_URL}${item?.userData?.[0]?.image}`} className="mv_avatar" />
                    </div>
                    <div className='w-100'>
                      <div className='mv_review_name_star'>
                        <div className='mv_main_user_name'>
                          <div>
                            <h4 className="mv_user_name">{item.userData[0].firstName}</h4>
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
                      <div className="row">
                        <div className="col-md-8 col-sm-12">
                          <p className="mv_review_text">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {ReviewtData.length > 3 && (
              <a
                href="#"
                className="mv_view_all_btn"
                onClick={(e) => {
                  e.preventDefault();
                  setShowAllReviews(!showAllReviews);
                }}
              >
                {/* {showAllReviews ? 'Show Less' : 'View All'} */}
              </a>
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

    </div>
  );
};

export default Detailpage;