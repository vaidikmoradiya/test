const express = require('express');
const { login, userRegister, verifyOtp, resendOtp, forgotPassword, resetPassword, socialLogin } = require('../Auth/login');
const { getAllUser, getUserById, updateUserById, deleteUserById, changePassword } = require('../Controller/userController');
const { auth } = require('../helper/AuthToken');
const upload = require('../helper/imageUplode');
const { createMainCategory, upadteMainCategoryById, getAllMainCategory, getMainCategoryById, deleteMainCategoryById } = require('../Controller/mainCategoryController');
const { createCategory, updateCategory, getCategoryById, getAllCategory, deleteCategoryById } = require('../Controller/categoryController');
const { createRole, updateRole, getAllRole, getRoleById, deleteRoleById } = require('../Controller/roleController');
const { createSubCategory, updateSubCategory, getSubCategoryById, getAllSubCategory, deleteSubCategoryById } = require('../Controller/subCategoryController');
const { createUnit, updateUnit, deleteUnitById, getUnitById, getAllUnit } = require('../Controller/unitCotroller');
const { createSize, updateSizeById, deleteSizeById, getSizeById, getAllSize } = require('../Controller/sizeController');
const { createProduct, getAllProduct, getProductById, updateProduct, deleteProduct, updateProductStatus } = require('../Controller/productController');
const { createStock, updateStock, deleteStockById, getAllStocks, getStockById } = require('../Controller/stockController');
const { createReasonCancel, getAllReasonCancel, getReasonCancelById, updateReasonCancel, deleteReasonCancel } = require('../Controller/reasonCancelController');
const { createTermCondition, getAllTermConditions, getTermConditionById, updateTermCondition, deleteTermCondition } = require('../Controller/termConditionController');
const { createPrivacyPolicy, getAllPrivacyPolicy, getPrivacyPolicyById, updatePrivacyPolicy, deletePrivacyPolicy } = require('../Controller/privacyController');
const { createFaqCategory, getAllFaqCategories, getFaqCategoryById, updateFaqCategory, deleteFaqCategory } = require('../Controller/faqCategoryController');
const { createFaq, getAllFaq, getFaqById, updateFaq, deleteFaq, getFaqsByCategory } = require('../Controller/faqController');
const { createAddress, updateAddress, getAllAddress, getAddressById, deleteAddress } = require('../Controller/addressController');
const { createOrder, updateOrder, getAllOrder, getOrderById, deleteOrder } = require('../Controller/orderController');
const { createCart, getCartByuser, updatecart, deleteCart } = require('../Controller/cartController')
const { createReview, updateReview, getAllReview, getReviewById, deleteReview, getCompnayProfile } = require('../Controller/reviewController');
const { getBestSellerProducts, getDashboard, getOrderSummary, getIncomeAndExpense, getRevenueByLocation } = require('../Controller/dashboardController');
const {createContact, getAllContact, getContactById, updateContact, deleteContact} = require('../Controller/contactUsController');
const {createAboutUs, getAllAboutUS, getAboutUsById, updateAboutUs, deleteAboutUs} = require('../Controller/aboutUsController');
const { createRetrunOrder, updateRetrunOrder, getAllReturnOrder, getReturnOrderById, deleteReturnOrder, returnOrderOTP } = require('../Controller/returnOrderController');
const { createCancleOrder, updateCancleOrder, getAllCancleOrder, getCancleOrderById, deleteCancleOrder } = require('../Controller/cancleOrderController');
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../Controller/serviceController');
const { createExpence,getAllExpences,getExpenceById,updateExpence,deleteExpence } = require('../Controller/expenceController');
 
const indexRoute = express.Router();

// Initialize multer with storage and file filter

//Login Route
indexRoute.post('/register', userRegister);
indexRoute.post('/verifyOtp', verifyOtp);
indexRoute.post('/resendOtp', resendOtp)
indexRoute.post('/login', login);
indexRoute.post('/forgotPassword', forgotPassword);
indexRoute.post('/resetPassword', resetPassword);
indexRoute.post('/sociallogin',socialLogin);
 
//Role Routes
indexRoute.post('/createRole', auth(['Admin', 'User']), createRole);
indexRoute.put('/updateRole/:id', auth(['Admin', 'User']), updateRole);
indexRoute.get('/getAllRole', auth(['Admin', 'User']), getAllRole);
indexRoute.get('/getRoleById/:id', auth(['Admin', 'User']), getRoleById);
indexRoute.delete('/deleteRoleById/:id', auth(['Admin', 'User']), deleteRoleById);

// User Routes
indexRoute.get('/getAllUsers', auth(['Admin', 'User']), getAllUser);
indexRoute.get('/getUserById/:id', auth(['Admin', 'User']), getUserById);
indexRoute.put('/updateUserById/:id', auth(['Admin', 'User']),upload.single('image'), updateUserById);
indexRoute.delete('/deleteUserById/:id', auth(['Admin', 'User']), deleteUserById);
indexRoute.post('/changePassword', auth(['Admin', 'User']), changePassword);

// MainCategory Routes
indexRoute.post('/createMainCategory', auth(['Admin', 'User']), upload.single('image'), createMainCategory);
indexRoute.put('/upadteMainCategoryById/:id', auth(['Admin', 'User']), upload.single('image'), upadteMainCategoryById);
indexRoute.get('/getAllMainCategory', getAllMainCategory);
indexRoute.get('/getMainCategoryById/:id', getMainCategoryById);
indexRoute.delete('/deleteMainCategoryById/:id', auth(['Admin', 'User']), deleteMainCategoryById);

// Category Routes
indexRoute.post('/createCategory', auth(['Admin', 'User']), upload.single('image'), createCategory);
indexRoute.put('/updateCategory/:id', auth(['Admin', 'User']), upload.single('image'), updateCategory);
indexRoute.get('/getCategoryById/:id', getCategoryById);
indexRoute.get('/getAllCategory', getAllCategory);
indexRoute.delete('/deleteCategoryById/:id', auth(['Admin', 'User']), deleteCategoryById);


// Sub Category Routes
indexRoute.post('/createSubCategory', auth(['Admin', 'User']), upload.single('image'), createSubCategory);
indexRoute.put('/updateSubCategory/:id', auth(['Admin', 'User']), upload.single('image'), updateSubCategory);
indexRoute.get('/getSubCategoryById/:id', getSubCategoryById);
indexRoute.get('/getAllSubCategory', getAllSubCategory);
indexRoute.delete('/deleteSubCategoryById/:id', auth(['Admin', 'User']), deleteSubCategoryById);

// Unit Route
indexRoute.post('/createUnit', auth(['Admin', 'User']), createUnit);
indexRoute.put('/updateUnit/:id', auth(['Admin', 'User']), updateUnit);
indexRoute.delete('/deleteUnitById/:id', auth(['Admin', 'User']), deleteUnitById);
indexRoute.get('/getUnitById/:id', auth(['Admin', 'User']), getUnitById);
indexRoute.get('/getAllUnit', auth(['Admin', 'User']), getAllUnit);

//Size Route
indexRoute.post('/createSize', auth(['Admin', 'User']), createSize);
indexRoute.put('/updateSizeById/:id', auth(['Admin', 'User']), updateSizeById);
indexRoute.delete('/deleteSizeById/:id', auth(['Admin', 'User']), deleteSizeById);
indexRoute.get('/getSizeById/:id', auth(['Admin', 'User']), getSizeById);
indexRoute.get('/getAllSize', auth(['Admin', 'User']), getAllSize);

// Product Route
indexRoute.post('/createProduct', auth(['Admin', 'User']), upload.fields([{ name: 'productImage' }]), createProduct);
indexRoute.get('/getAllProduct', getAllProduct);
indexRoute.get('/getProductById/:id', getProductById);
indexRoute.put('/updateProduct/:id', auth(['Admin', 'User']), upload.fields([{ name: 'productImage' }]), updateProduct);
indexRoute.put('/updateProductStatus/:id', auth(['Admin', 'User']), updateProductStatus);
indexRoute.delete('/deleteProduct/:id', auth(['Admin', 'User']), deleteProduct);

// stock Route
indexRoute.post('/createStock', auth(['Admin', 'User']), createStock);
indexRoute.put('/updateStock/:id', auth(['Admin', 'User']), updateStock);
indexRoute.delete('/deleteStockById/:id', auth(['Admin', 'User']), deleteStockById);
indexRoute.get('/getAllStocks', auth(['Admin', 'User']), getAllStocks);
indexRoute.get('/getStockById/:id', auth(['Admin', 'User']), getStockById);

// Reason Cancellation Routes
indexRoute.post('/createReasonCancel', auth(['Admin', 'User']), createReasonCancel);
indexRoute.get('/getAllReasonCancel', auth(['Admin', 'User']), getAllReasonCancel);
indexRoute.get('/getReasonCancelById/:id', auth(['Admin', 'User']), getReasonCancelById);
indexRoute.put('/updateReasonCancel/:id', auth(['Admin', 'User']), updateReasonCancel);
indexRoute.delete('/deleteReasonCancel/:id', auth(['Admin', 'User']), deleteReasonCancel);

// Term and Condition Routes
indexRoute.post('/createTermCondition', auth(['Admin', 'User']), createTermCondition);
indexRoute.get('/getAllTermConditions', getAllTermConditions);
indexRoute.get('/getTermConditionById/:id', auth(['Admin', 'User']), getTermConditionById);
indexRoute.put('/updateTermCondition/:id', auth(['Admin', 'User']), updateTermCondition);
indexRoute.delete('/deleteTermCondition/:id', auth(['Admin', 'User']), deleteTermCondition);

// Address Route 
indexRoute.post('/createAddress', auth(['Admin', 'User']), createAddress);
indexRoute.put('/updateAddress/:id', updateAddress);
indexRoute.get('/getAllAddress', getAllAddress);
indexRoute.get('/getAddressById/:id', auth(['Admin', 'User']), getAddressById);
indexRoute.delete('/deleteAddress/:id', auth(['Admin', 'User']), deleteAddress);

// FAQ's Routes
indexRoute.post('/createFaq', auth(['Admin', 'User']), createFaq);
indexRoute.get('/getAllFaq', getAllFaq);
indexRoute.get('/getFaqById/:id', auth(['Admin', 'User']), getFaqById);
indexRoute.put('/updateFaq/:id', auth(['Admin', 'User']), updateFaq);
indexRoute.delete('/deleteFaq/:id', auth(['Admin', 'User']), deleteFaq);

// Privacy policy Routes
indexRoute.post('/createPrivacyPolicy', auth(['Admin', 'User']), createPrivacyPolicy);
indexRoute.get('/getAllPrivacyPolicy', getAllPrivacyPolicy);
indexRoute.get('/getPrivacyPolicyById/:id', getPrivacyPolicyById);
indexRoute.put('/updatePrivacyPolicy/:id', auth(['Admin', 'User']), updatePrivacyPolicy);
indexRoute.delete('/deletePrivacyPolicy/:id', auth(['Admin', 'User']), deletePrivacyPolicy);

// contact us routes
indexRoute.post('/createContact', auth(['Admin', 'User']), createContact);
indexRoute.get('/getAllContact', getAllContact);
indexRoute.get('/getContactById/:id', getContactById);
indexRoute.put('/updateContact/:id', auth(['Admin', 'user']), updateContact);
indexRoute.delete('/deleteContact/:id', auth(['Admin', 'user']), deleteContact);

// about us routes
indexRoute.post('/createAboutUs', auth(['Admin', 'user']), upload.fields([{ name: 'image' }]), createAboutUs);
indexRoute.get('/getallAboutUs', getAllAboutUS);
indexRoute.get('/getAboutUsById/:id', getAboutUsById);
indexRoute.put('/updateAboutUs/:id', auth(['Admin', 'user']), upload.fields([{ name: 'image' }]), updateAboutUs);
indexRoute.delete('/deleteAboutUs/:id', auth(['Admin', 'user']), deleteAboutUs);

// order Route 
indexRoute.post('/createOrder', auth(['Admin', 'User']), createOrder);
indexRoute.get('/getAllOrder', getAllOrder);
indexRoute.get('/getOrderById/:id', getOrderById)
indexRoute.put('/updateOrder/:id', auth(['Admin', 'User']), updateOrder)
indexRoute.delete('/deleteOrder/:id', auth(['Admin', 'User']), deleteOrder)

//cart Route
indexRoute.post('/createCart', createCart)
indexRoute.get('/getCartByuser/:id', getCartByuser)
indexRoute.put('/updatecart/:id', updatecart)
indexRoute.delete('/deletecart/:id', deleteCart)

// review Route 
indexRoute.post('/createReview', auth(['Admin', 'User']), createReview);
indexRoute.get('/getAllReview', getAllReview);
indexRoute.get('/getReviewById/:id', getReviewById)
indexRoute.put('/updateReview/:id', auth(['Admin', 'User']), updateReview)
indexRoute.delete('/deleteReview/:id', auth(['Admin', 'User']), deleteReview)
indexRoute.get('/getCompanyProfile', getCompnayProfile)

// return order Route
indexRoute.post('/returnorderOTP', auth(['Admin', 'User']), returnOrderOTP);
indexRoute.post('/createReturnOrder', auth(['Admin', 'User']), createRetrunOrder);
indexRoute.put('/updateReturnOrder/:id', auth(['Admin', 'User']), updateRetrunOrder);
indexRoute.get('/getAllReturnOrder', getAllReturnOrder);
indexRoute.get('/getReturnOrderById/:id', getReturnOrderById);
indexRoute.delete('/deleteReturnOrder/:id', auth(['Admin', 'User']), deleteReturnOrder)

// cancle order
indexRoute.post('/createCancleOrder', auth(['Admin', 'User']), createCancleOrder);
indexRoute.put('/updateCancleOrder/:id', auth(['Admin', 'User']), updateCancleOrder);
indexRoute.get('/getAllCancleOrder', getAllCancleOrder);
indexRoute.get('/getCancleOrderById/:id', getCancleOrderById);
indexRoute.delete('/deletecancleOrder/:id', auth(['Admin', 'User']), deleteCancleOrder)

// FAQ Category Routes
indexRoute.post('/createFaqCategory', auth(['Admin', 'User']), createFaqCategory);
indexRoute.get('/getAllFaqCategories', getAllFaqCategories);
indexRoute.get('/getFaqCategoryById/:id', getFaqCategoryById);
indexRoute.put('/updateFaqCategory/:id', auth(['Admin', 'User']), updateFaqCategory);
indexRoute.delete('/deleteFaqCategory/:id', auth(['Admin', 'User']), deleteFaqCategory);

// FAQ's Routes
indexRoute.post('/createFaq', auth(['Admin', 'User']), createFaq);
indexRoute.get('/getAllFaq', getAllFaq);
indexRoute.get('/getFaqById/:id', getFaqById);
indexRoute.get('/getFaqsByCategory/:categoryId', getFaqsByCategory);
indexRoute.put('/updateFaq/:id', auth(['Admin', 'User']), updateFaq);
indexRoute.delete('/deleteFaq/:id', auth(['Admin', 'User']), deleteFaq);

// Service Routes
indexRoute.get('/services', getAllServices);
indexRoute.get('/services/:id', getServiceById);
indexRoute.post('/services', auth(['Admin']), upload.single('image'), createService);
indexRoute.put('/services/:id', auth(['Admin']), upload.single('image'), updateService);
indexRoute.delete('/services/:id', auth(['Admin']), deleteService);

// Dashboard Routes
indexRoute.get('/bestSellerProducts', getBestSellerProducts);
indexRoute.put('/updateFaq/:id', auth(['Admin', 'User']), updateFaq);
indexRoute.delete('/deleteFaq/:id', auth(['Admin', 'User']), deleteFaq);
indexRoute.get('/getdashboard', getDashboard);
indexRoute.get('/getordersummary', getOrderSummary);
indexRoute.get('/getincome',getIncomeAndExpense)
indexRoute.get('/getrevenuebylocation',getRevenueByLocation)

// expence routes
indexRoute.post('/expence', auth(['Admin']), createExpence);
indexRoute.get('/expence', auth(['Admin']), getAllExpences);
indexRoute.get('/expence/:id', auth(['Admin']), getExpenceById);
indexRoute.put('/expence/:id', auth(['Admin']), updateExpence);
indexRoute.delete('/expence/:id', auth(['Admin']), deleteExpence);

module.exports = indexRoute;