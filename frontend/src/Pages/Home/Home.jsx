import AboutUs from "./AboutUs";
import ExploreCategory from "./ExploreCategory";
import MainBannar from "./MainBannar";
import Topselling from "./Topselling";
import Testimonial from "./Testimonial";
import ExploreOurServices from "./ExploreOurServices";

const Home = () => {
    return(
        <div>
           <MainBannar/>
           <ExploreCategory/>
           <AboutUs/>
           <Topselling/>
           <Testimonial/>
           <ExploreOurServices/>
        </div>
    )
}

export default Home;