import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Import images statically
import cat1 from '../../assets/cat1.png';
import cat2 from '../../assets/cat2.png';
import cat3 from '../../assets/cat3.png';
import cat4 from '../../assets/cat4.png';
import cat5 from '../../assets/cat5.png';
import { GetActiveCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice';
import { GetSubCateDataByCategoryId } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice';

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
            <svg className='mv_svg_color' width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <svg className='mv_svg_color' width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const navigate = useNavigate();
    const categoryData = useSelector((state) => state.category.getCategoryData)
    const subCategoryData = useSelector((state) => state.subcategory.getSubCategoryDataByCategoryId)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showSubcategories, setShowSubcategories] = useState(false);
    // console.log(categoryData);

    useEffect(() => {
      dispatch(GetActiveCateData())
  }, [])

  const Back_URL = 'http://localhost:5000/'

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    dispatch(GetSubCateDataByCategoryId(category._id));
    setShowSubcategories(true);
  };

  const handleCategoryDirectClick = (category) => {
    navigate(`/layout/Productlist?categoryId=${category._id}&categoryName=${encodeURIComponent(category.categoryName)}`);
  };

  const handleSubcategoryClick = (subcategory) => {
    navigate(`/layout/Productlist?subcategory=${subcategory._id}&subcategoryName=${encodeURIComponent(subcategory.subCategoryName)}`);
  };

  const handleBackToCategories = () => {
    setShowSubcategories(false);
    setSelectedCategory(null);
  };

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
                    <p className="mv_section_subtitle">
                        {showSubcategories ? 'Subcategory' : 'Category'}
                    </p>
                    <h2 className="mv_relay_text">
                        {showSubcategories ? `Subcategories in ${selectedCategory?.categoryName}` : 'Explore categories'}
                    </h2>
                    {showSubcategories && (
                        <button 
                            className="btn btn-outline-secondary btn-sm mt-2"
                            onClick={handleBackToCategories}
                        >
                            ← Back to Categories
                        </button>
                    )}
                </div>
                
                <div className="s_category-slider">
                    <Slider className='mv_slider_arrow' {...settings}>
                        {showSubcategories ? (
                            subCategoryData.map(subcategory => (
                                <div key={subcategory._id} className="s_category-item">
                                    <div 
                                        className="s_category-card bg-white rounded shadow-sm p-4 m-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleSubcategoryClick(subcategory)}
                                    >
                                        <div className="text-center">
                                            <div className='d-flex justify-content-center'>
                                              <img 
                                                  src={Back_URL + subcategory.image} 
                                                  className="img-fluid mb-3 text-center" 
                                                  style={{ maxHeight: "100px", objectFit: "contain" }}
                                              />
                                            </div>
                                            <h6 className="fw-medium">{subcategory.subCategoryName}</h6>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            categoryData.map(category => (
                                <div key={category._id} className="s_category-item">
                                    <div 
                                        className="s_category-card bg-white rounded shadow-sm p-4 m-2"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleCategoryDirectClick(category)}
                                    >
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
                            ))
                        )}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default ExploreCategory;