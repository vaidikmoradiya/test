import { configureStore } from '@reduxjs/toolkit'
import loginReducer from '../ToolkitSlice/Admin/LoginSlice' 
import roleReducer from '../ToolkitSlice/Admin/RoleSlice' 
import mainCateReducer from '../ToolkitSlice/Admin/MainCategorySlice' 
import reasonCancelReducer from '../ToolkitSlice/Admin/ReasonCancellationSlice'
import termConditionReducer from '../ToolkitSlice/Admin/TermConditionSlice'
import cateReducer from '../ToolkitSlice/Admin/CategorySlice' 
import unitReducer from '../ToolkitSlice/Admin/UnitSlice' 
import faqcategoryReducer from '../ToolkitSlice/Admin/FaqCategorySlice'
import faqReducer from '../ToolkitSlice/Admin/FaqSlice'
import privacyPolicyReducer from '../ToolkitSlice/Admin/PrivacyPolicySlice'
import registerReducer from '../ToolkitSlice/User/RegisterSlice';
import contactReducer from '../ToolkitSlice/User/ContactusSlice';
import aboutReducer from '../ToolkitSlice/User/AboutusSlice';
import addressReducer from '../ToolkitSlice/User/AddressSlice';
import SubCategorySlice from '../ToolkitSlice/Admin/SubCategorySlice';
import userReducer from '../ToolkitSlice/User/UserSlice';
import orderReducer from '../ToolkitSlice/User/OrderSlice';
import companyprofileReducer from '../ToolkitSlice/User/CompanyProfileSlice';
import ProductReducer from '../ToolkitSlice/User/ProductSlice';
import DetailpageReducer from '../ToolkitSlice/User/DetailPageSlice';
import ReviewReducer from '../ToolkitSlice/User/ReviewSlice';
import TopsellingReducer from '../ToolkitSlice/User/TopSellingSlice';
import CancelorderReducer from '../ToolkitSlice/User/CancelOrderSlice';
import CartReducer from '../ToolkitSlice/User/CartSlice';
import SizeReducer from '../ToolkitSlice/Admin/SizeSlice';
import StockReducer from '../ToolkitSlice/Admin/StockSlice';
import ReturnOrderReducer from '../ToolkitSlice/Admin/ReturnOrderSlice';
import DashboardReducer from '../ToolkitSlice/Admin/DashboardSlice';
import ExpenceReducer from '../ToolkitSlice/Admin/ExpenceSlice';
import ProfileReducer from '../ToolkitSlice/Admin/ViewProfileSlice';
export const store = configureStore({
  reducer: {
    // ********* Admin ********
    login: loginReducer, 
    role: roleReducer,
    mainCategory:mainCateReducer,
    reasonCancel: reasonCancelReducer,
    termCondition: termConditionReducer,
    category:cateReducer,
    unit: unitReducer,
    faqcategory: faqcategoryReducer,
    faq: faqReducer,
    privacyPolicy: privacyPolicyReducer,
    subcategory: SubCategorySlice,
    size: SizeReducer,
    stock: StockReducer,
    returnOrder: ReturnOrderReducer,
    dashboard: DashboardReducer,
    expence: ExpenceReducer,
    profile: ProfileReducer,

    // *********** User *********
    register:registerReducer,
    contact: contactReducer,
    about: aboutReducer,
    address:addressReducer,
    user:userReducer,
    order: orderReducer,
    companyprofile: companyprofileReducer,
    product: ProductReducer,
    detailpage: DetailpageReducer,
    review: ReviewReducer,
    topselling: TopsellingReducer,
    cancelorder: CancelorderReducer,
    cart: CartReducer,
  },
})
