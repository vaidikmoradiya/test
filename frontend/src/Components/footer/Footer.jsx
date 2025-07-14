import React from 'react';
import './footer.css';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import insta from '../../assets/instagram.svg';
import facebook from '../../assets/facebook.svg';
import thread from '../../assets/thread.svg';

const Footer = () => {
    return (
        <footer className='Footer VK_footer_par'>
            <div className='m_container inter VK_sec_padding'>
                <Row className='m-0 justify-content-between'>
                    <Col xl={3} lg={3} md={12} className='px-2 text-white my-sm-4 my-2 mb-4'>
                        <div className='text-white'>
                            <h2 className='fw-bolder'>
                                Logo
                            </h2>
                            <p className='VK_light_color mb-0'>
                                Lorem ipsum dolor sit amet consectetur. Amet viverra nec netus donec. Et ut cursus nisl tincidunt egestas morbi aliquet.
                            </p>
                        </div>
                        <div className='mv_main_mail_no'>
                            <div className=''>
                                <div className='mv_mo_main mb-2'>
                                    <div className='me-2'>
                                        <img src={require('../../assets/email_w_icon.png')} height="18px" width="18px" alt="" />
                                    </div>
                                    <div>
                                        <p className='mb-0 mv_mo_number'>example123@gmail.com</p>
                                    </div>
                                </div>
                                <div className='mv_mo_main'>
                                    <div className='me-2'>
                                        <img src={require('../../assets/phone_w_icon.png')} height="18px" width="18px" alt="" />
                                    </div>
                                    <div>
                                        <p className='mb-0 mv_mo_number'>+91 3698527412</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={2} lg={2} md={6} xs={6} className='px-2 text-white my-sm-4 my-2 mb-4'>
                        <h5 className='font_20 fw-500 mb-sm-4 mb-2 '>
                            Quick Link
                        </h5>
                        <ul className='list-unstyled VK_footer_ul'>
                            <li className='my-2'>
                                <Link to="/layout/Aboutus">About Us</Link>
                            </li>
                            <li className='my-2'>
                                <Link to='/layout/Contectus'>Contact Us</Link>
                            </li>
                        </ul>
                    </Col>
                    <Col xl={2} lg={2} md={6} xs={6}  className='px-2 text-white my-sm-4 my-2 mb-4'>
                        <h5 className='font_20 fw-500 mb-sm-4 mb-2'>
                        Support
                        </h5>
                        <ul className='list-unstyled VK_light_color VK_footer_ul'>
                            <li className='my-2'>
                                <Link to='/layout/Faq'>FAQ’s</Link>
                            </li>
                            <li className='my-2'>
                                <Link to='/layout/Privacy'>Privacy Policy</Link>
                            </li>
                            <li className='my-2'>
                                <Link to='/layout/Termsconditions'>Terms & Condition</Link>
                            </li>
                        </ul>
                    </Col>
                    <Col xl={4} lg={5} md={12} xs={12} className='px-2 text-white my-sm-4 my-2 mb-4'>
                        <h5 className='font_20 fw-500 mb-sm-4 mb-2'>
                            Newsletter
                        </h5>
                        <div className='mv_main_email_input mb-3'>
                            <div>
                                <input className='mv_mail_input' type="text" placeholder='Your email' />
                            </div>
                            <div>
                                <button className='mv_main_sub_btn'>
                                    <a className='mv_subscribe_btn' href="">Subscribe</a>
                                </button>
                            </div>
                        </div>
                        <p className='VK_light_color'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                        </p>
                        <div className='d-flex'>
                            <div className='me-2'>
                                <img src={insta}  alt="" />
                            </div>
                            <div className='me-2'>
                                <img src={facebook}  alt="" />
                            </div>
                            <div className=''>
                                <img src={thread}  alt="" />
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="">
                <div className='mv_copy_right'>
                    <p className='mb-0'>All right reserved &copy; 2025</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;