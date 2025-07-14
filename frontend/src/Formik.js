import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

export const ForgetPassSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
});

export const ResetPassSchema = Yup.object().shape({
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
        .required('Confirm password is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export const VerifyOtpSchema = Yup.object().shape({
    otp: Yup.string().required('OTP is required'),
});

export const RoleSchema = Yup.object().shape({
    roleName: Yup.string()
        .required('Role name is required')
        .min(2, 'Role name must be at least 2 characters')
        .max(50, 'Role name must not exceed 50 characters'),
});

export const UnitSchema = Yup.object().shape({
    unitName: Yup.string()
        .required('Unit name is required')
        .min(2, 'Unit name must be at least 2 characters')
        .max(50, 'Unit name must not exceed 50 characters'),
});

export const MainCateSchema = Yup.object().shape({
    mainCategoryName: Yup.string()
        .required('Main category name is required')
        .min(2, 'Main category name must be at least 2 characters')
        .max(50, 'Main category name must not exceed 50 characters'),
});

export const CategorySchema = Yup.object().shape({
    categoryName: Yup.string()
        .required('Category name is required')
        .min(2, 'Category name must be at least 2 characters')
        .max(50, 'Category name must not exceed 50 characters'),
    mainCategoryId: Yup.string()
        .required('Main category is required')
});

export const FaqSchema = Yup.object().shape({
    question: Yup.string()
        .required('Question is required')
        .min(2, 'Question must be at least 2 characters'),
    answer: Yup.string()
        .required('Answer is required')
        .min(2, 'Answer must be at least 2 characters'),
});

export const editFaqSchema = Yup.object().shape({
    question: Yup.string()
        .required('Question is required')
        .min(2, 'Question must be at least 2 characters'),
    answer: Yup.string()
        .required('Answer is required')
        .min(2, 'Answer must be at least 2 characters'),
});

export const privacyPolicySchema = Yup.object().shape({
    privacyPolicy: Yup.string()
        .required('Privacy policy is required')
        .min(2, 'Privacy policy must be at least 2 characters'),
});

export const editPrivacyPolicySchema = Yup.object().shape({
    privacyPolicy: Yup.string()
        .required('Privacy policy is required')
        .min(2, 'Privacy policy must be at least 2 characters'),
});

export const termConditionSchema = Yup.object().shape({
    termCondition: Yup.string()
        .required('Terms and conditions is required')
        .min(2, 'Terms and conditions must be at least 2 characters'),
});

export const editTermConditionSchema = Yup.object().shape({
    termCondition: Yup.string()
        .required('Terms and conditions is required')
        .min(2, 'Terms and conditions must be at least 2 characters'),
});

export const reasonCancellationSchema = Yup.object().shape({
    reasonCancellation: Yup.string()
        .required('Reason for cancellation is required')
        .min(2, 'Reason for cancellation must be at least 2 characters'),
});

export const editReasonCancellationSchema = Yup.object().shape({
    reasonCancellation: Yup.string()
        .required('Reason for cancellation is required')
        .min(2, 'Reason for cancellation must be at least 2 characters'),
});

export const ProductSchema = Yup.object().shape({
    mainCateId: Yup.string().required('Main category is required'),
    cateName: Yup.string().required('Category is required'),
    SubcateName: Yup.string().required('Sub category is required'),
    productName: Yup.string().required('Product name is required'),
    sizeName: Yup.string().required('Size name is required'),
    size: Yup.string().required('Size is required'),
    unit: Yup.string().required('Unit is required'),
    stockStatus: Yup.string().required('Stock status is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    discount: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot be more than 100'),
    productImage: Yup.array().min(1, 'At least one image is required').required('An image is required'),
    shortDescription: Yup.string().required('Short description is required'),
    description: Yup.string().required('Description is required'),
});
