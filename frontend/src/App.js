import {  BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Css/S_style.css';
import './Css/mv_style.css';
import Login from './Pages/LoginFlow/Login';
import SignIn from './Pages/LoginFlow/SignIn';
import ForgotPassword from './Pages/LoginFlow/ForgotPassword';
import VerifyEmail from './Pages/LoginFlow/VerifyEmail';
import ResetPassword from './Pages/LoginFlow/ResetPassword';
import VerifyOtp from './Pages/LoginFlow/VerifyOtp';
import Layout from './Components/Layout';
import Home from './Pages/Home/Home';
import Productlist from './Pages/Productlist';
import Detailpage from './Pages/Detailpage';
import Cart from './Pages/cart';
import Payment from './Pages/payment';
import Aboutus from './Pages/Aboutus';
import Contectus from './Pages/Contectus';
import Faq from './Pages/Faq';
import Privacy from './Pages/Privacy';
import Termsconditions from './Pages/Termsconditions';
import Myorder from './Pages/Myorder'; 
import { adminRoutes, CustomerRoutes, ServiceRoutes } from './Admin/AdminRoutes';
import Trackorder from './Pages/Trackorder';
import Trackrefund from './Pages/Trackrefund';
import Deliveredorder from './Pages/Deliveredorder';
import Trackreturnrefund from './Pages/Trackreturnrefund';
import { Provider } from 'react-redux';
import { store } from './Redux-Toolkit/Store/Store';

function App() {
  return (
    <>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/verifyemail' element={<VerifyEmail />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/verifyotp' element={<VerifyOtp />} />

          <Route path='/layout' element={< Layout/>}>
              <Route path='home' element={<Home />} />
              <Route path='Productlist' element={<Productlist />} />
              <Route path='Detailpage/:id' element={<Detailpage />} />
              <Route path='cart' element={<Cart />} />
              <Route path='payment' element={<Payment />} />
              <Route path='aboutus' element={<Aboutus />} />
              <Route path='Contectus' element={<Contectus />} />
              <Route path='Faq' element={<Faq />} />
              <Route path='Privacy' element={<Privacy />} />
              <Route path='Termsconditions' element={<Termsconditions />} />
              <Route path='Myorder' element={<Myorder />} />
              <Route path='Trackorder/:id' element={<Trackorder />} />
              <Route path='Trackrefund/:id' element={<Trackrefund />} />
              <Route path='Deliveredorder/:id' element={<Deliveredorder />} />
              <Route path='Trackreturnrefund/:id' element={<Trackreturnrefund />} />
          </Route>
          {adminRoutes}
          {CustomerRoutes}
          {ServiceRoutes}
        </Routes>

    </>
  );
}

export default App;
