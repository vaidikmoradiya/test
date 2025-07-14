import React, { useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from 'react-redux';

// Import images statically
import cat1 from '../../assets/cat1.png';
import cat2 from '../../assets/cat2.png';
import cat3 from '../../assets/cat3.png';
import cat4 from '../../assets/cat4.png';
import cat5 from '../../assets/cat5.png';
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice';

const ExploreCategory = () => {
    const CustomPrevArrow = (props) => {
        const { className, onClick } = props;
        return (
          <button 
            className={`${className} custom-prev-arrow`} 
            onClick={onClick}
            style={{
              left: "-30px",
              zIndex: 1,
              background: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 2L2 8L8 14" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        );
      };
    
      const CustomNextArrow = (props) => {
        const { className, onClick } = props;
        return (
          <button 
            className={`${className} custom-next-arrow`} 
            onClick={onClick}
            style={{
              right: "-30px",
              zIndex: 1,
              background: "white",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
            }}
          >
            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 2L8 8L2 14" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        );
      };
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 2500,
                settings: {
                    slidesToShow: 5,
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    };
    const dispatch = useDispatch();
    const categoryData = useSelector((state) => state.category.getCategoryData)
    // console.log(categoryData);

    useEffect(() => {
      dispatch(GetCateData())
  }, [])

  const Back_URL = 'http://localhost:5000/'

    // Category data with imported images
    const categories = [
        { id: 1, name: 'Drive Belts', image: cat1 },
        { id: 2, name: 'Oiling System', image: cat2 },
        { id: 3, name: 'Drop Wires', image: cat3 },
        { id: 4, name: 'Water Pipes', image: cat4 },
        { id: 5, name: 'Cooling Fans', image: cat5 },
        { id: 6, name: 'Drive Belts', image: cat1 },
    ];

    return (
        <div className="s_category-section">
            <div className='container-fluid'>
                <div className="text-center">
                    <p className="mv_section_subtitle">Category</p>
                    <h2 className="mv_relay_text">Explore categories</h2>
                </div>
                
                <div className="s_category-slider">
                    <Slider className='mv_slider_arrow' {...settings}>
                        {categoryData.map(category => (
                            <div key={category.id} className="s_category-item">
                                <div className="s_category-card bg-white rounded shadow-sm p-4 m-2">
                                    <div className="text-center">
                                        <div className='d-flex justify-content-center'>
                                          <img 
                                              src={Back_URL + category.image} 
                                              className="img-fluid mb-3 text-center" 
                                              style={{ maxHeight: "100px", objectFit: "contain" }}
                                          />
                                        </div>
                                        <h6 className="fw-medium">{category.categoryName}</h6>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default ExploreCategory;