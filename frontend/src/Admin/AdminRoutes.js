import React from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import Header from "./Component/Header";
import Dashboard from "./CustomerPanel/Dashboard";
import AdminLayout from "./Component/AdminLayout";
import Role from "./AdminPanel/Role";
import User from "./AdminPanel/User";
import Login from "./AdminPanel/Login";
import AddUser from "./AdminPanel/AddUser";
import EditUser from "./AdminPanel/EditUser";
import Customer from "./AdminPanel/Customer";
import AdminDashboard from './AdminPanel/Dashboard'
import MainCategory from "./AdminPanel/MainCategory";
import Category from "./AdminPanel/Category";
import SubCategory from "./AdminPanel/SubCategory";
import Unit from "./AdminPanel/Unit";
import CancleOrder from "./AdminPanel/CancleOrder";
import ReasonofCancellation from "./AdminPanel/ReasonofCancellation";
import TandC from "./AdminPanel/TandC";
import ViewTandC from "./AdminPanel/ViewTandC";
import Products from "./AdminPanel/Products";
import ViewProducts from "./AdminPanel/ViewProducts";
import FAQs from "./AdminPanel/FAQs";
import ViewFAQs from "./AdminPanel/ViewFAQs";
import PrivacyPolicy from "./AdminPanel/PrivacyPolicy";
import Size from "./AdminPanel/Size";
import ViewPrivacyPolicy from "./AdminPanel/ViewPrivacyPolicy";
import ContactUs from "./AdminPanel/ContactUs";
import ViewContactUs from "./AdminPanel/ViewContactUs";
import AboutUs from "./AdminPanel/AboutUs";
import ViewaboutUs from "./AdminPanel/ViewaboutUs";
import AddProducts from "./AdminPanel/AddProducts";
import EditProducts from "./AdminPanel/EditProducts";
import AddSize from "./AdminPanel/AddSize";
import EditSize from "./AdminPanel/EditSize";
import Order from "./AdminPanel/Order";
import ViewOrder from "./AdminPanel/ViewOrder";
import Review from "./AdminPanel/Review";
import VeiwReview from "./AdminPanel/ViewReview";
import ReturnOrder from "./AdminPanel/ReturnOrder";
import ViewStatus from "./AdminPanel/ViewStatus";
import Stock from "./AdminPanel/Stock";
import AddStock from "./AdminPanel/AddStock";
import EditStock from "./AdminPanel/EditStock";
import ViewProfile from "./AdminPanel/ViewProfile";
import Sidebar from "./CustomerPanel/Sidebar";
import CustomerLayout from "./Component/CustomerLayout";
import CustomerProfile from './CustomerPanel/ViewProfile';
import ViewReview from "./AdminPanel/ViewReview";
import ServiceLayout from "./Component/ServiceLayout";
import ServiceOrder from './ServicePanel/Order';
import ServiceViewOrder from './ServicePanel/ViewOrder';
import ServiceReturnOrder from './ServicePanel/ReturnOrder';
import ServiceCancelOrder from './ServicePanel/CancelOrder';
import CustomerOrder from "./CustomerPanel/CustomerOrder";
import CustomerViewOrder from "./CustomerPanel/CustomerViewOrder";
import CustomerReview from "./CustomerPanel/CustomerReview";
import CustomerViewReview from "./CustomerPanel/CustomerViewReview";
import CustomerReturnOrder from "./CustomerPanel/CustomerReturnOrder";
import CustomerCancelOrder from "./CustomerPanel/CustomerCancelOrder";
import ViewUser from "./AdminPanel/ViewUser";
import FaqCategory from "./AdminPanel/FaqCat";
import Expence from "./AdminPanel/Expence";

const AdminProtectRoute = ({children}) => {
  const token = localStorage.getItem("login");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export const adminRoutes = [
  <Route path="/admin/login" element={<Login />} />,
  <Route path="/admin" element={<AdminProtectRoute>
      <AdminLayout />
   </AdminProtectRoute>}>
    <Route path="header" element={<Header />} />
    <Route path='dashboard' element={<AdminDashboard />} />
    <Route path="role" element={<Role />} />
    <Route path="user" element={<User />} />
    <Route path="adduser" element={<AddUser />} />
    <Route path="edituser" element={<EditUser />} />
    <Route path="customer" element={<Customer />} />
    <Route path="maincategory" element={<MainCategory/>}/>
    <Route path="category" element={<Category/>}/>
    <Route path="subcategory" element={<SubCategory/>}/>
    <Route path="unit" element={<Unit/>}/>
    <Route path='cancleorder' element={<CancleOrder/>}/>
    <Route path='reasonofcancellation' element={<ReasonofCancellation/>}/>
    <Route path='tandc' element={<TandC/>}/>
    <Route path='viewtandc' element={<ViewTandC/>}/>
    <Route path='faqs' element={<FAQs/>} />
    <Route path='faqcat' element={<FaqCategory/>} />
    <Route path="viewfaqs" element={<ViewFAQs/>}/>
    <Route path="privacypolicy" element={<PrivacyPolicy/>}/>
    <Route path="viewPrivacypolicy" element={<ViewPrivacyPolicy/>}/>
    <Route path="contactus" element={<ContactUs/>}/>
    <Route path="viewcontactus" element={<ViewContactUs/>}/>
    <Route path='aboutus' element={<AboutUs/>}/>
    <Route path='viewaboutus' element={<ViewaboutUs/>}/>
    <Route path='size' element={<Size/>}/>
    <Route path='addsize' element={<AddSize/>}/>
    <Route path='editsize' element={<EditSize/>}/>
    <Route path='order' element={<Order/>}/>
    <Route path='vieworder' element={<ViewOrder/>}/>
    <Route path='expence' element={<Expence/>}/>
    <Route path='review' element={<Review/>}/>
    <Route path='viewreview' element={<ViewReview/>}/>
    <Route path='returnorder' element={<ReturnOrder/>}/>
    <Route path='viewstatus' element={<ViewStatus/>}/>
    <Route path="stock" element={<Stock />} />
    <Route path="addStock" element={<AddStock />} />
    <Route path="editStock" element={<EditStock />} />
    <Route path="viewProfile" element={<ViewProfile />} />
    
    <Route path="product" element={<Products/>}/>
    <Route path="addproduct" element={<AddProducts/>}/>
    <Route path="editproduct" element={<EditProducts/>}/>
    <Route path="viewproduct" element={<ViewProducts/>}/>
    <Route path="viewuser" element={<ViewUser/>}/>
  </Route>,
  <Route path="/admin/login" element={<Login />} />
];

export const CustomerRoutes = [
  <Route path="/customer" element={<CustomerLayout />}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="viewProfile" element={<CustomerProfile />} />
    <Route path="order" element={<CustomerOrder/>} />
    <Route path="vieworder" element={<CustomerViewOrder/>} />
    <Route path="review" element={<CustomerReview/>} />
    <Route path="viewreview" element={<CustomerViewReview/>} />
    <Route path="returnorder" element={<CustomerReturnOrder/>} />
    <Route path="cancelorder" element={<CustomerCancelOrder/>} />
  </Route>,
];

export const ServiceRoutes = [
  <Route path="/service" element={<ServiceLayout />}>
    <Route path="order" element={<ServiceOrder />} />
    <Route path="vieworder" element={<ServiceViewOrder />} />
    <Route path="returnorder" element={<ServiceReturnOrder />} />
    <Route path="cancelorder" element={<ServiceCancelOrder />} />
</Route>,
];
