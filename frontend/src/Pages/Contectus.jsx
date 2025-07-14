import React, { useState } from 'react';
import '../Css/mv_style.css';
import phoneIcon from '../assets/phone_icon.png';
import emailIcon from '../assets/email_icon.png';
import locationIcon from '../assets/address_icon.png';
import { useDispatch, useSelector } from 'react-redux';
import { createContact, resetContactState } from '../Redux-Toolkit/ToolkitSlice/User/ContactusSlice';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
};

const Contactus = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contact);
  const [form, setForm] = useState(initialForm);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number length
    if (form.phone.length !== 10) {
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
      return;
    }

    const contactData = {
      name: form.name,
      email: form.email,
      phoneNo: form.phone,
      subject: form.subject,
      message: form.message
    };

    try {
      await dispatch(createContact(contactData)).unwrap();
      setShowSuccessModal(true);
      setForm(initialForm);
      setTimeout(() => {
        setShowSuccessModal(false);
        dispatch(resetContactState());
      }, 2000);
    } catch (err) {
      setShowErrorModal(true);
      setTimeout(() => {
        setShowErrorModal(false);
      }, 2000);
      console.error('Failed to submit contact form:', err);
    }
  };

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
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
            </svg>
          </div>
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Message Sent Successfully!</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Thank you for contacting us.</p>
        </div>
      </div>
    </div>
  );

  // Error Modal Component
  const ErrorModal = () => (
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
          <h3 style={{ marginBottom: '10px', color: '#141414' }}>Message Failed</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>Failed to send message. Please try again.</p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="mv_contactus_section">
      <div className="m_container">
        <div className='text-center'>
          <div className="mv_contactus_title">Contact Us</div>
          <div className="mv_contactus_subtitle">
            Have question? Get in touch with us - We're here to help you out
          </div>          
        </div>
      </div>
      
      <div className='mv_contactus_main_map'>
        <div className="m_container">
          <div className="row mv_contactus_row">
            <div className="col-xl-4 col-lg-5">
              <iframe
                className="mv_contactus_map"
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19809.96407342013!2d-0.1721792!3d51.5072681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876053e3b7b1b0b%3A0x2e8b8b8b8b8b8b8b!2sHyde%20Park!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div className="col-xl-8 col-lg-7">
              <div className="mv_contactus_form_wrap">
                <div className="mv_contactus_form_title">Send us a message</div>
                <form onSubmit={handleSubmit}>
                  <div className="mv_contactus_form_row">
                    <div className="mv_contactus_form_group">
                      <label>Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="mv_contactus_form_group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Your email"
                        required
                      />
                    </div>
                  </div>
                  <div className="mv_contactus_form_row">
                    <div className="mv_contactus_form_group">
                      <label>Phone No.</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 10) {
                            setForm({ ...form, phone: value });
                          }
                        }}
                        placeholder="Your phone no."
                        required
                        maxLength={10}
                        pattern="[0-9]*"
                      />
                    </div>
                    <div className="mv_contactus_form_group">
                      <label>Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                        required
                      />
                    </div>
                  </div>
                  <div className="mv_contactus_form_group" style={{ marginBottom: 18 }}>
                    <label>Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Enter message"
                      required
                    ></textarea>
                  </div>
                  <button 
                    className="mv_contactus_submit_btn" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mv_contactus_info_row">
        <div className="m_container">
          <div className="row justify-content-center">
            <div className="col-md-4 col-sm-6 col-12">
              <div className="mv_contactus_info_card">
                <img src={phoneIcon} alt="Phone" className="mv_contactus_info_icon" />
                <div className="mv_contactus_info_title">Call us</div>
                <div className="mv_contactus_info_text">+91 3698527412</div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="mv_contactus_info_card">
                <img src={emailIcon} alt="Email" className="mv_contactus_info_icon" />
                <div className="mv_contactus_info_title">Email us</div>
                <div className="mv_contactus_info_text">example123@gmail.com</div>
              </div>
            </div>
            <div className="col-md-4 col-sm-6 col-12">
              <div className="mv_contactus_info_card">
                <img src={locationIcon} alt="Address" className="mv_contactus_info_icon" />
                <div className="mv_contactus_info_title">Address</div>
                <div className="mv_contactus_info_text">
                  133, Lorem plot, 1st floor, Nr. queen st.<br />
                  opp. post office, Lorem, USA
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && <SuccessModal />}
      {showErrorModal && <ErrorModal />}
    </section>
  );
};

export default Contactus;
