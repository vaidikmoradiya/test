import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetAllReview } from "../../Redux-Toolkit/ToolkitSlice/User/ReviewSlice";

const testimonials = [
  {
    name: 'Apoorva Dave',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rating: 3,
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Ranveer Mehra',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rating: 4,
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Samay Shah',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    rating: 3,
    image: 'https://randomuser.me/api/portraits/men/3.jpg'
  }
];

const settings = {
  // dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: false,
  responsive: [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 768, 
      settings: {
        slidesToShow: 2,
      }
    },
    {
      breakpoint: 425, 
      settings: {
        slidesToShow: 1,
      }
    }
  ]
};

const Testimonial = () => {

  const ReviewtData = useSelector((state) => state.review.allReviewData )
  console.log("ReviewtData",ReviewtData);
 
  const dispatch = useDispatch()
  const Back_URL = 'http://localhost:5000/'

  useEffect(() => {
      dispatch(GetAllReview())
  }, [])

  let sliderRef = useRef(null);
  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };

  return (
    <section className="py-5 mv_services_section">
      <div className="container text-center mb-5">
        <p className="mv_section_subtitle mb-2">Testimonial</p>
        <h2 className="mv_relay_text">what our customers says</h2>
      </div>

      <div className="m_container">
        <Slider
          ref={slider => {
            sliderRef = slider;
          }}
          {...settings}
        >
          {ReviewtData.map((item, index) => (
            <div key={index} className="px-3">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body d-flex flex-column mv_slider_card_body">
                  <div className="d-flex align-items-center">
                    <img src={`${Back_URL}${item?.userData?.[0]?.image}`} className="rounded-circle me-3" style={{ width: "50px", height: "50px", objectFit: "cover" }} />  
                  </div>
                  <p className="text-muted small flex-grow-1 mv_testimonial_comment">{item.description}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-start">
                      <h5 className="mb-0">{item.userData[0].firstName}</h5>
                      {/* <small className="text-muted">{item.name}</small> */}
                    </div>
                    <div className="d-flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`me-1 ${i <item.rate ? 'text-warning' : 'text-secondary'}`}
                          style={{ fontSize: "1rem" }}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button className="button mv_slider_prev_btn" onClick={previous}>
            <img src={require('../../assets/arrow_left.png')} height="22px" width="22px" alt="" />
          </button>
          <button className="button mv_slider_next_btn" onClick={next}>
            <img src={require('../../assets/arrow_right.png')} height="22px" width="22px" alt="" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
