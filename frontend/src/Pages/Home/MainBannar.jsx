import { Carousel } from 'react-bootstrap';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from 'react-router-dom';


const MainBannar = () => {
    return (
        <Carousel fade indicators={false} 
        nextIcon={<IoIosArrowForward className="s_slider_icon" />}
        prevIcon={<IoIosArrowBack  className="s_slider_icon" />}
        >
            <Carousel.Item>
                <img src={require('../../assets/slider1.png')} alt="" className='s_slider_item' />
                <Carousel.Caption className='s_slider_caption'>
                    <p className='mv_slider_small_heading'>Providing cutting-edge and cost-efficient solutions in power loom weaving technology</p>
                    <h3>Enhance your textile peformance and unlock new products design possibilities.</h3>
                    <Link to={'/layout/productlist'}><button className='s_slider_btn mt-2'>View Products</button></Link>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img src={require('../../assets/slider2.png')} alt="" className='s_slider_item' />
                <Carousel.Caption className='s_slider_caption'>
                <p className='mv_slider_small_heading'>Bringing you the finest textile machinery from around the world.</p>
                <h3>10+ year Manufacturing Excellence, Delivering the Finest Quality !</h3>
                <Link to={'/layout/productlist'}><button className='s_slider_btn mt-2'>View Products</button></Link>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    )
}

export default MainBannar;