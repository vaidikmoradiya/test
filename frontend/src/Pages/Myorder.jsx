import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { createaddress, getalladdress, updateAddress, deleteAddress } from '../Redux-Toolkit/ToolkitSlice/User/AddressSlice'
import { GetUserData, updateUserData } from '../Redux-Toolkit/ToolkitSlice/User/UserSlice';
import { GetAllOrderData } from '../Redux-Toolkit/ToolkitSlice/User/OrderSlice';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { CreateReview, GetAllReview } from '../Redux-Toolkit/ToolkitSlice/User/ReviewSlice';

const initialUser = {
  image: '',
  firstName: '',
  lastName: '',
  gender: '',
  email: '',
  mobileNo: '',
  password: '',
  profilePhotoFileName: '',
};

const LOCAL_KEY = 'profileData';

const Myorder = () => {
  const dispatch = useDispatch();
  const { allAddress, loading, error } = useSelector((state) => state.address);
  const { allUserData } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log('Component mounted, fetching addresses...');
    dispatch(getalladdress());
    dispatch(GetUserData());
  }, [dispatch]);

  useEffect(() => {
    // console.log('Address state updated:', { allAddress, loading, error });
  }, [allAddress, loading, error]);

  const userid = localStorage.getItem("UserId");
  let currentUser = allUserData?.find(user => user._id === userid) || {};
  // console.log("efrerfrferfrf",currentUser);

  // const { id } = useParams();
  // console.log(id)

  const detailData = useSelector((state) => state.detailpage.GetProductByIdData)
  // console.log("detailData", detailData);

  const Back_URL = 'http://localhost:5000/'
 
  const [activeTab, setActiveTab] = useState('order');
  const [orderFilter, setOrderFilter] = useState('All Orders');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: currentUser.firstName || '',
    lastName: currentUser.lastName || '',
    email: currentUser.email || '',
    mobileNo : currentUser.mobileNo || '',
    // password: currentUser.password || '',
    profilePhoto: currentUser.image || '',
    profilePhotoFile: null,
  });
  const [reviewText, setReviewText] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    address: '',
    pincode: '',
    country: '',
    state: '',
    city: '',
    contactNo: '',
    addressType: 'Home',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [defaultAddressId, setDefaultAddressId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null); // Create a ref for the dropdown
  const [productid, setProductid] =useState('');

  const [creditCards, setCreditCards] = useState(() => {
    const savedCards = localStorage.getItem('creditCards');
    return savedCards ? JSON.parse(savedCards) : [
      {
        name: 'BAHADIR NUROGLU',
        number: '2243 6652 9435 9982',
        expiry: '10/25',
        cvv: '123',
      },
    ];
  });

  const [newCard, setNewCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });

  const [showCardModal, setShowCardModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(currentUser));
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [currentUser, addresses]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenMenuId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const onEdit = () => {
    setEditForm({
      id: currentUser._id || '',
      email: currentUser.email || '',
      firstName: currentUser.firstName || '',
      lastName: currentUser.lastName || '',
      mobileNo: currentUser.mobileNo || '',
      // password: currentUser.password || '',
      profilePhoto: currentUser.image || '',
      profilePhotoFile: null,
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    console.log("888888888",files)
    if (name === 'profilePhoto' && files && files[0]) {
      setEditForm((prev) => ({
        ...prev,
        profilePhoto: files[0].name,
        profilePhotoFile: files[0],
      }));
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
  console.log('userdata',editForm)
    dispatch(updateUserData(editForm)).then((response)=>{
      console.log(response.type === "updateUserData/fulfilled")
      if(response.type === "updateUserData/fulfilled")
      dispatch(GetUserData());
      currentUser = allUserData?.find(user => user._id === userid) || {};

      console.log('updateData',currentUser);
    });
    // Here you would typically dispatch an action to update the user data in the API
    setShowEditModal(false);
  };

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    title: '',
    comment: ''
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // You can handle review submission here
    console.log('Review submitted:', review);
    var userId = localStorage.getItem('UserId')
    dispatch(CreateReview({...review,id: productid,userId})).then((response)=>{
      if(response){
        console.log("payload",response);
        dispatch(GetAllReview())
      }
    })
    setShowReviewModal(false);
    setReview({ rating: 0, title: '', comment: '' });
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };
  const handleAddressTypeSelect = (type) => {
    setAddressForm(prev => ({ ...prev, addressType: type }));
  };
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
            const isDuplicate = allAddress.some(addr => 
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
    setIsEditing(false);
    setEditId(null);
    setShowAddressModal(true);
  };

  const handleOpenCardModal = () => {
    setShowCardModal(true);
  };

  const handleCloseCardModal = () => {
    setShowCardModal(false);
  };

  const handleOpenNewModal = () => {
    setShowNewModal(true);
  };

  const handleDeleteCard = (cardIndex) => {
    setCreditCards(prev => {
        const updatedCards = prev.filter((_, index) => index !== cardIndex);
        localStorage.setItem('creditCards', JSON.stringify(updatedCards)); // Update local storage
        return updatedCards;
    });
    setShowNewModal(false); // Close the modal after deletion
};

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'expiry') {
        // Allow only digits and a slash, limit to 7 characters
        const numericValue = value.replace(/[^0-9/]/g, '').slice(0, 7);
        // Ensure the slash is in the correct position
        const parts = numericValue.split('/');
        if (parts.length > 2) {
            return; // Prevent more than one slash
        }
        if (parts.length === 2 && parts[1].length > 4) {
            return; // Prevent more than 4 digits after the slash
        }
        setNewCard(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'number') {
        // Allow only digits and limit to 12 characters
        const numericValue = value.replace(/\D/g, '').slice(0, 12);
        setNewCard(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'cvv') {
        // Allow only digits and limit to 3 characters
        const numericValue = value.replace(/\D/g, '').slice(0, 3);
        setNewCard(prev => ({ ...prev, [name]: numericValue }));
    } else {
        setNewCard(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    
    // Format the card number
    const formattedCardNumber = newCard.number.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space every 4 digits

    // Add the new card to the array
    setCreditCards(prev => {
        const updatedCards = [...prev, { ...newCard, number: formattedCardNumber }];
        localStorage.setItem('creditCards', JSON.stringify(updatedCards)); // Update local storage
        return updatedCards;
    });

    // Reset the form
    setNewCard({
        name: '',
        number: '',
        expiry: '',
        cvv: '',
    });
    handleCloseCardModal(); // Close the modal after submission
  };

  // Mock order data
  const orders = [
    {
      id: 1,
      status: 'In Progress',
      statusText: '• In Progress',
      statusColor: '#ED751E',
      date: '15 Feb 2025',
      productName: 'Delta Omni 0.4X19 Relay Nozzle',
      qty: 2,
      orderId: '15666HRHKBX86115',
      deliveryDate: '01 Apr 2025',
      amount: 5000,
      image: require('../assets/Delta Omni.png'),
    },
    {
      id: 2,
      status: 'Delivered',
      statusText: '• Delivered',
      statusColor: '#388E3C',
      date: '15 Feb 2025',
      productName: 'Delta Omni 0.4X19 Relay Nozzle',
      qty: 2,
      orderId: '15666HRHKBX86115',
      deliveryDate: '01 Apr 2025',
      amount: 5000,
      image: require('../assets/Delta Omni.png'),
    },
    {
      id: 3,
      status: 'Cancelled',
      statusText: '• Cancelled',
      statusColor: '#E53935',
      date: '15 Feb 2025',
      productName: 'Delta Omni 0.4X19 Relay Nozzle',
      qty: 2,
      orderId: '15666IKIHIBJX6115',
      deliveryDate: '01 Apr 2025',
      amount: 5000,
      image: require('../assets/Delta Omni.png'),
    },
  ];

  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'All Orders') return true;
    return order.status === orderFilter;
  });

  const handleDeleteAddress = async () => {
    if (deleteAddressId) {
        try {
            setIsDeleting(true);
            await dispatch(deleteAddress(deleteAddressId)).unwrap();
            setShowDeleteModal(false);
            setDeleteAddressId(null);
        } catch (error) {
            console.error('Failed to delete address:', error);
            setShowDeleteModal(false);
            setDeleteAddressId(null);
        } finally {
            setIsDeleting(false);
        }
    }
  };

  // Singleuser
  const allusers = useSelector(state => state.user.allUserData)

  const singleuser = allusers.find(user => user._id === userid)
  // console.log("singleuser",singleuser);

  // Allorder
  const allorder = useSelector(state => state.order.allOrderData)
  console.log("allorder",allorder);

  useEffect(() => {
    dispatch(GetUserData())
    dispatch(GetAllOrderData())
  },[])

  return (
    <div className='mv_profile_main_card'>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="mv_profile_modal_overlay">
            <div className="mv_profile_modal_content">
              <div className="mv_profile_modal_header">
                <h3 className="mv_profile_modal_heading">Edit Profile</h3>
                <button className="mv_profile_modal_close" onClick={() => setShowEditModal(false)}>×</button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="mv_profile_modal_body">
                  <div className="mv_profile_form_group">
                    <label>First Name</label>
                    <input type="text" name="firstName" value={editForm.firstName} onChange={handleEditChange} />
                  </div>
                  <div className="mv_profile_form_group">
                    <label>Last Name</label>
                    <input type="text" name="lastName" value={editForm.lastName} onChange={handleEditChange} />
                  </div>
                  <div className="mv_profile_form_group">
                    <label>Contact No.</label>
                    <input 
                      type="text" 
                      name="mobileNo" 
                      value={editForm.mobileNo || ''} 
                      onChange={e => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          setEditForm(prev => ({ ...prev, mobileNo: value }));
                        }
                      }}
                      maxLength={10}
                    />
                  </div>
                  <div className="mv_profile_form_group">
                    <label>Email</label>
                    <input type="email" name="email" value={editForm.email} onChange={handleEditChange} />
                  </div>
                  {/* <div className="mv_profile_form_group">
                    <label>Password</label>
                    <input type="password" name="password" value={editForm.password} onChange={handleEditChange} />
                  </div> */}
                  {console.log("------",editForm.profilePhoto)}
                  <label className='mv_profile_modal_label'>Profile Photo</label>
                  <div className="mv_profile_add_image">
                    <span className="mv_profile_file_name">
                      {editForm.profilePhoto 
                        ? editForm.profilePhoto.includes("public") ? editForm.profilePhoto.split('\\').pop().split('-').slice(1).join('-') : editForm.profilePhoto
                        : initialUser.profilePhoto} 
                    </span>
                    <input
                      type="file"
                      name="profilePhoto"
                      accept="image/*"
                      onChange={handleEditChange}
                      className="mv_profile_file_input"
                      id="profilePhotoInput"
                    />
                    <label htmlFor="profilePhotoInput" className="mv_profile_file_cjhange_btn">Change</label>
                  </div>
                </div>
                <div className="mv_profile_modal_footer">
                  <button type="button" className="mv_profile_modal_cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="mv_profile_modal_submit">Update</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="mv_review_modal_overlay">
            <div className="mv_review_modal_content">
              <div className="mv_review_modal_header">
                <h3 className="mv_review_modal_heading">Write a review</h3>
                <button className="mv_review_modal_close" onClick={() => setShowReviewModal(false)}>×</button>
              </div>
              <form onSubmit={handleReviewSubmit}>
                <div className="mv_review_modal_body">
                  <div className="mv_review_rating_section">
                    <label>How would you rate us?</label>
                    <div className="mv_review_star_rating">
                      {[1,2,3,4,5].map(star => (
                        <span
                          key={star}
                          className={`mv_review_star${review.rating >= star ? ' mv_review_star_filled' : ''}`}
                          onClick={() => setReview({ ...review, rating: star })}
                          style={{fontSize: 30, cursor: 'pointer'}}
                        >★</span>
                      ))}
                    </div>
                  </div>
                  <div className="mv_review_modal_comment">
                    <label>Can you tell us more?</label>
                    <textarea
                      value={review.comment}
                      onChange={e => setReview({ ...review, comment: e.target.value })}
                      placeholder="Write your review"
                      required
                      style={{width: '100%', minHeight: 100, marginTop: 8}}
                    />
                  </div>
                </div>
                <div className="mv_review_modal_footer">
                  <button type="button" className="mv_review_modal_cancel" onClick={() => setShowReviewModal(false)}>Cancel</button>
                  <button type="submit" className="mv_review_modal_submit">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add new debit card */}
        {showCardModal && (
          <div className="mv_card_modal_overlay">
              <div className="mv_card_modal_content">
                <div className="mv_card_modal_header">
                  <h3 className="mv_review_modal_heading">Add Debit / Credit Card</h3>
                  <button className="mv_review_modal_close" onClick={handleCloseCardModal}>×</button>
                </div>
                <form onSubmit={handleCardSubmit}>
                  <div className="mv_card_modal_body">
                    <div className="mv_card_form_group">
                      <label>Card Holder Name</label>
                      <input
                        type="text"
                        name="name"
                        value={newCard.name}
                        onChange={handleCardInputChange}
                        placeholder="Enter card holder name"
                        required
                      />
                    </div>
                    <div className="mv_card_form_group">
                      <label>Card No.</label>
                      <input
                        type="text"
                        name="number"
                        value={newCard.number}
                        onChange={handleCardInputChange}
                        placeholder="**** **** **** ****"
                        required
                      />
                    </div>
                    <div className="mv_card_form_group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={newCard.expiry}
                        onChange={handleCardInputChange}
                        placeholder="MM / YYYY"
                        required
                      />
                    </div>
                    <div className="mv_card_form_group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={newCard.cvv}
                        onChange={handleCardInputChange}
                        placeholder="***"
                        required
                      />
                    </div>
                  </div>
                  <div className="mv_card_modal_footer">
                    <button type="button" className="mv_card_modal_cancel" onClick={handleCloseCardModal}>Cancel</button>
                    <button type="submit" className="mv_card_modal_submit">Add</button>
                  </div>
                </form>
            </div>
          </div>
        )}
        
        {/* Delete Debit Card Modal */}
        {showNewModal && (
          <div className="mv_carddelete_modal_overlay">
            <div className="mv_carddelete_modal_content">
              <div className="mv_carddelete_modal_header">
                <h3 className="mv_carddelete_modal_heading">Delete Debit Card</h3>
                <button className="mv_carddelete_modal_close" onClick={() => setShowNewModal(false)}>×</button>
              </div>
              <div className="mv_carddelete_modal_body">
                <p>Are you sure you want to delete this card?</p>
              </div>
              <div className="mv_carddelete_modal_footer">
                <button className="mv_carddelete_modal_cancel" onClick={() => setShowNewModal(false)}>Cancel</button>
                <button className="mv_carddelete_modal_submit" onClick={() => handleDeleteCard(selectedCardIndex)}>Delete</button>
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

        <div className='mv_profile_main_card'>
            <div className='mv_profile_card'>
                <div className="m_container">
                  <div className='row justify-content-center'> 
                    <div className="col-xl-8 col-lg-12">
                        <div className="mv_profile_card_row justify-content-evenly">
                          <div className="d-flex align-items-center">
                              <div className="">
                                  {/* <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="mv_profile_avatar" /> */}
                                  <img src={`${Back_URL}${currentUser.image}`} alt="Profile" className="mv_profile_avatar" />
                              </div>
                          </div>
                          {/* {console.log('currentuser123',currentUser)} */}
                          <div className="align-item-center">
                              <div className="mv_profile_row">
                                  <div className="mv_profile_label">First Name :</div>
                                  <div className="mv_profile_value">{currentUser?.firstName}</div>
                              </div>
                              <div className="mv_profile_row">
                                  <div className="mv_profile_label">Last Name :</div>
                                  <div className="mv_profile_value">{currentUser?.lastName}</div>
                              </div>
                              {/* <div className="mv_profile_row">
                                  <div className="mv_profile_label">Gender :</div>
                                  <div className="mv_profile_value">{currentUser?.gender}</div>
                              </div> */}
                          </div>
                          <div className="">
                              <div className="mv_profile_row">
                                  <div className="mv_profile_label">Email :</div>
                                  <div className="mv_profile_value">{currentUser?.email}</div>
                              </div>
                              <div className="mv_profile_row">
                                  <div className="mv_profile_label">Contact No. :</div>
                                  <div className="mv_profile_value">{currentUser?.mobileNo}</div>
                              </div>
                              {/* <div className="mv_profile_row">
                                  <div className="mv_profile_label">Password :</div>
                                  <div className="mv_profile_value">{'*'.repeat(currentUser?.password.length)}</div>
                              </div> */}
                          </div>
                          {/* <div className="">
                              <div className="mv_profile_row">
                                  <div className="mv_profile_label">Email :</div>
                                  <div className="mv_profile_value">{currentUser.email}</div>
                              </div>
                          </div> */}
                          <div className="">
                              <button className="mv_profile_edit_btn" onClick={onEdit}>Edit Profile</button>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
            </div>

            <div>
                {/* Nav Tabs */}
                <div className="m_container">
                    <div className="row">
                        <div className="col-12">
                            <div className="mv_nav_tabs_container">
                                <div className="mv_main_custom_tabs">
                                    <button className={`mv_custom_tab ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}>
                                        My Order
                                    </button>
                                    <button className={`mv_custom_tab ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
                                        My Address
                                    </button>
                                    {/* <button className={`mv_custom_tab ${activeTab === 'card' ? 'active' : ''}`} onClick={() => setActiveTab('card')}>
                                        Debit / Credit Card
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col-12">
                          {activeTab === 'order' && (
                            <>
                              {/* Tab Content */}
                              <div className='d-flex justify-content-between align-item-center mb-3'>
                                <div>
                                  <p className='mv_all_order_heading'>All Orders</p>
                                </div>
                                <div>
                                  <div className="mv_order_filter">
                                    <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}>
                                      <option>All Orders</option>
                                      <option>Pending</option>
                                      <option>Delivered</option>
                                      <option>Cancelled</option>
                                    </select>
                                  </div>
                                </div>
                              </div>
                              {allorder
                                .filter(order => {
                                  if (orderFilter === 'All Orders') return true;
                                  return order.orderStatus === orderFilter;
                                }).length === 0 ? (
                                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                                  <img src={require('../assets/no_order.png')} alt="No order found" style={{ width: 150, marginBottom: 16 }} />
                                </div>
                              ) : (
                                allorder
                                  .filter(order => {
                                    if (orderFilter === 'All Orders') return true;
                                    return order.orderStatus === orderFilter;
                                  })
                                  .map((item, index) => (
                                  <div key={item.id} className="mv_order_card" onClick={() => {
                                    if (item.orderStatus === 'Delivered') {
                                      navigate(`/layout/Deliveredorder/${item._id}`);
                                    }
                                  }} style={{ cursor: item.orderStatus === 'Delivered' ? 'pointer' : 'default' }}>
                                    <div className="row">
                                      <div className="col-xxl-1 col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3">
                                        <div>
                                          <p className="mv_order_status" style={{ color: item.statusColor }}>{item.orderStatus}</p>
                                        </div>
                                      </div>
                                      <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-6 col-6">
                                        <div>
                                          <p className="mv_order_date">
                                          {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                          }).replace(/\s/g, ' ')}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3 d-flex flex-column justify-content-between align-items-end">
                                        <p className="mv_order_amount">₹{item.totalAmount}</p>
                                      </div>
                                    </div>
                                    {item.products.map((it, ind) => (
                                      <div className="row">
                                        <div className="col-xxl-1 col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3">
                                          <div key={ind} className='text-center'>
                                            <img src={`${Back_URL}${it?.details.productImage[0]}`} alt="product" className="mv_order_image" />
                                          </div>
                                        </div>
                                        <div className="col-xxl-9 col-xl-8 col-lg-8 col-md-8 col-sm-6 col-6">
                                          <div key={ind}>
                                            <div className="mv_order_details">
                                              <div className="mv_order_product_name">{it.productName}</div>
                                              <div className="mv_order_info">
                                                <p className='mb-2 mv_order_text_qty'>Qty :</p>
                                                <p className='mb-2 mv_order_qty'>{it.qty}</p>
                                              </div>
                                              <div className="mv_order_info">
                                                <p className='mb-2 mv_order_text_qty'>Order ID :</p>            
                                                <p className='mb-2 mv_order_qty'>{item._id}</p>
                                              </div>
                                              <div className="mv_order_info">
                                                <p className='mb-2 mv_order_text_qty'>{it.status === 'Delivered' ? 'Delivery Date' : 'Expected Date'} :</p>
                                                <p className='mb-2 mv_order_qty'>{it.deliveryDate}</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-2 col-sm-3 col-3 d-flex flex-column justify-content-between align-items-end" style={{ minHeight: '100px' }}>
                                          <div className="mv_order_action mt-auto">
                                            {item.orderStatus === 'Pending' && <Link  to={`/layout/Trackorder/${item._id}`} className="mv_order_action_link" >Track Order</Link>}
                                            {item.orderStatus === 'Delivered' && <Link  to={``} className="mv_order_action_link" onClick={(e) => { e.preventDefault(); setShowReviewModal(true); setProductid(it?.details._id) }}>Submit Review</Link>}
                                            {item.orderStatus === 'Cancelled' && <Link  to={`/layout/Trackrefund/${item._id}`} className="mv_order_action_link" >Track Refund</Link>}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ))
                              )}
                            </>
                            )}
                            {activeTab === 'address' && (
                              <div className="mv_tab_content" style={{ background: 'transparent', padding: 0, textAlign: 'left' }}>
                                <div className="mv_my_address_header">
                                  <span className="mv_my_address_title">My Address</span>
                                  <button className="mv_my_address_add_btn" onClick={handleAddNewAddress}>
                                    + Add New Address
                                  </button>
                                </div>
                                <div className="row">
                                  {allAddress.length === 0 ? (
                                    <div style={{ textAlign: 'center', margin: '40px 0' }}>
                                      <img src={require('../assets/no_address_found.png')} alt="No order found" style={{ width: 150, marginBottom: 16 }} />
                                    </div>
                                  ) : (
                                    allAddress.map(address => (
                                      <div className="col-md-6 mb-4" key={address._id}>
                                        <div 
                                          className={`mv_my_address_card ${defaultAddressId === address._id ? 'mv_border_highlight' : ''}`}
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <div className="mv_address_card_header_row">
                                            <div className="mv_my_address_type_pill">{address.addressType}</div>
                                            <button
                                              onClick={() => setOpenMenuId(openMenuId === address._id ? null : address._id)}
                                              className="mv_my_address_edit_btn"
                                              style={{ fontSize: 24, background: 'none', border: 'none', cursor: 'pointer' }}
                                            >
                                              &#8942;
                                            </button>
                                          </div>
                                          {openMenuId === address._id && (
                                            <div className="mv_my_address_menu" ref={dropdownRef}>
                                              <p onClick={() => { handleEditAddress(address); setOpenMenuId(null); }}>Edit</p>
                                              <p onClick={() => { setDeleteAddressId(address._id); setShowDeleteModal(true); setOpenMenuId(null); }}>Delete</p>
                                              <p onClick={(e) => { 
                                                e.stopPropagation();
                                                setDefaultAddressId(address._id);
                                                setOpenMenuId(null);
                                              }}>Make as default</p>
                                            </div>
                                          )}
                                          <div className='mv_my_address_text_padd'>
                                            <div className="mv_my_address_name">{address.fullName}</div>
                                            <div className="mv_my_address_phone">+91 {address.contactNo}</div>
                                            <div className="mv_my_address_text">
                                              {address.address}, {address.city}, {address.state}, {address.pincode}{address.country ? `, ${address.country}` : ''}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                                {/* Address Modal */}
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
                                {/* Delete Confirmation Modal */}
                                {showDeleteModal && (
                                  <div className="mv_delete_modal_overlay">
                                    <div className="mv_delete_modal_content">
                                      <div className="mv_delete_modal_header">
                                        <h3 className="mv_delete_modal_heading">Delete Address</h3>
                                        <button className="mv_delete_modal_close" onClick={() => setShowDeleteModal(false)}>×</button>
                                      </div>
                                      <div className="mv_delete_modal_body">
                                        <p>Are you sure you want to delete <br /> address?</p>
                                      </div>
                                      <div className="mv_delete_address_modal_footer">
                                        <button className="mv_delete_address_modal_cancel" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>Cancel</button>
                                        <button className="mv_delete_address_modal_submit" onClick={handleDeleteAddress} disabled={isDeleting}>
                                            {isDeleting ? 'Deleting...' : 'Delete'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            {/* {activeTab === 'card' && (
                              <div className="">
                                <div className="mv_my_address_header">
                                  <span className="mv_my_address_title">Debit / Credit Card</span>
                                  <button className="mv_my_address_add_btn" onClick={handleOpenCardModal}>
                                    + Add New Card
                                  </button>
                                </div>
                                <div className="row">
                                  {creditCards.length > 0 ? ( // Check if there are any cards
                                    creditCards.map((card, index) => (
                                      <div key={index} className="mb-3 col-xxl-4 col-xl-4 col-lg-4 col-md-6 col-sm-6">
                                        <div className="mv_credit_card">
                                          <div className="d-flex justify-content-between align-items-center mb-5">
                                            <div>
                                              <div className='mv_credit_card_name'>{card.name}</div>
                                            </div>
                                            <div>
                                              <img  onClick={() => { setSelectedCardIndex(index); handleOpenNewModal(); }} height={20} width={20} src={require('../assets/trust_icon.png')} alt="" />
                                            </div>
                                          </div>
                                          <div className="d-flex justify-content-between align-content-center mb-4">
                                            <div>
                                              <div className='mv_card_num_heading'>Card Number</div>
                                              <div className='mv_card_number'>{card.number}</div>
                                            </div>
                                            <div>
                                              <img height={32} width={40} src={require('../assets/Chip.png')} alt="" />
                                            </div>
                                          </div>
                                          <div className="d-flex justify-content-between align-content-center">
                                            <div>
                                              <div className='mv_card_num_heading'>Expiry Date</div>
                                              <div className='mv_expirty_date'>{card.expiry}</div>
                                            </div>
                                            <div>
                                              <img height={30} width={50} src={require('../assets/master_card_icon.png')} alt="" />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))
                                  ) : (
                                    <div style={{ textAlign: 'center', margin: '40px 0' }}>
                                      <img src={require('../assets/no_saved_card.png')} alt="No saved cards found" style={{ width: 150, marginBottom: 16 }} />
                                      <p>No saved cards found</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
  );
}

export default Myorder
