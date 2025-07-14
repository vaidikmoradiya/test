import * as Yup from 'yup'


export const LoginSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
});

export const ForgetPassSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
});

export const VerifyOtpSchema = Yup.object({
  otp0: Yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp1: Yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp2: Yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp3: Yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp4: Yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
  otp5: Yup.string().required("Required").matches(/^\d$/, "Must be a digit"),
});

export const ResetPassSchema = Yup.object({
  newPass: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPass: Yup.string()
    .oneOf([Yup.ref('newPass'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export const RoleSchema = Yup.object({
  roleName: Yup.string()
    .required('Role name is required')
    .min(2, 'Role name must be at least 2 characters')
    .max(50, 'Role name must be 50 characters or less'),
});

export const MainCateSchema = Yup.object({
  mainCategoryName: Yup.string()
    .required('Main category name is required')
    .min(2, 'Main category must be at least 2 characters')
    .max(50, 'Main category must be 50 characters or less'),
});

export const reasonCancellationSchema = Yup.object({
  reasonCancel: Yup.string()
  .required('Reason is required')
  .min(2, 'Reason must be at least 2 characters')
  .max(50, 'Reason must be 50 characters or less'),
});

export const editReasonCancellationSchema = Yup.object({
  reasonCancel: Yup.string()
  .required('Reason is required')
  .min(2, 'Reason must be at least 2 characters')
  .max(50, 'Reason must be 50 characters or less'),
})

export const termConditionSchema = Yup.object({
  title: Yup.string()
  .required('Term and condition is required'),
  description: Yup.string()
  .required('Term and condition is required'),
})

export const editTermConditionSchema = Yup.object({
  title: Yup.string()
  .required('Term and condition is required'),
  description: Yup.string()
  .required('Term and condition is required'),
})
export const UnitSchema = Yup.object({
  unitName: Yup.string()
      .required("Unit name is required")
      .min(2, "Unit name must be at least 2 characters")
      .max(50, "Unit name must be at most 50 characters"),
  shortName: Yup.string()
      .required("Short name is required")
      .min(1, "Short name must be at least 1 character")
      .max(10, "Short name must be at most 10 characters"),
});

export const FaqCateSchema = Yup.object({
  categoryName: Yup.string()
    .required('Faq category name is required')
    .min(2, 'Faq category must be at least 2 characters')
    .max(50, 'Faq category must be 50 characters or less'),
});

export const FaqSchema = Yup.object({
  categoryName: Yup.string()
  .required('Faqcategory is required'),
  faqQuestion: Yup.string()
  .required('Question is required'),
  faqAnswer: Yup.string()
  .required('Answer is required'),
});

export const editFaqSchema = Yup.object({
  categoryName: Yup.string()
  .required('Faqcategory is required'),
  faqQuestion: Yup.string()
  .required('Question is required'),
  faqAnswer: Yup.string()
  .required('Answer is required'),
});

export const privacyPolicySchema = Yup.object({
  title: Yup.string()
  .required('Title is required'),
  description: Yup.string()
  .required('Description is required'),
});

export const editPrivacyPolicySchema = Yup.object({
  title: Yup.string()
  .required('Title is required'),
  description: Yup.string()
  .required('Description is required'),
});

export const CateSchema = Yup.object({
  mainCateId: Yup.string().required('Main Category is required'),
  cateName: Yup.string()
      .required('Category name is required')
      .min(2, 'Must be at least 2 characters')
      .max(50, 'Must be at most 50 characters'),
});

export const SubCateSchema = Yup.object({
  mainCateId: Yup.string().required('Main Category is required'),
  cateName: Yup.string().required('Category is required'),
  SubcateName: Yup.string()
      .required('Category name is required')
      .min(2, 'Must be at least 2 characters')
      .max(50, 'Must be at most 50 characters'),
});

export const SizeSchema = Yup.object({
  mainCateId: Yup.string().required('Main Category is required'),
  cateName: Yup.string().required('Category is required'),
  SubcateName: Yup.string()
      .required('Category name is required')
      .min(2, 'Must be at least 2 characters')
      .max(50, 'Must be at most 50 characters'),
  sizeName: Yup.string().required('Size Name is required'),
  size: Yup.string().required('Size is required'),
  unit: Yup.string().required('Unit is required'),
});

export const ProductSchema = Yup.object().shape({
    mainCateId: Yup.string().required('Main category is required'),
    cateName: Yup.string().required('Category is required'),
    SubcateName: Yup.string().required('Sub category is required'),
    productName: Yup.string().required('Product name is required'),
    sizeName: Yup.string().required('Size name is required'),
    size: Yup.string().required('Size is required'),
    unit: Yup.array().min(1, 'At least one unit is required'),
    stockStatus: Yup.string().required('Stock status is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
    discount: Yup.number().min(0, 'Discount cannot be negative').max(100, 'Discount cannot be more than 100'),
    productImage: Yup.mixed().required('An image is required'),
    shortDescription: Yup.string().required('Short description is required'),
    description: Yup.string().required('Description is required'),
    fields: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required('Title is required'),
        value: Yup.string().required('Description is required'),
      })
    )
});

export const StockSchema = Yup.object({
  mainCateId: Yup.string().required('Main Category is required'),
  cateName: Yup.string().required('Category is required'),
  SubcateName: Yup.string()
      .required('Category name is required')
      .min(2, 'Must be at least 2 characters')
      .max(50, 'Must be at most 50 characters'),
  product: Yup.string().required('Product is required'),
  // stockStatus: Yup.string().required('Stock Status is required'),
  qty: Yup.string().required('Quantity is required'),
});

export const ExpenceSchema = Yup.object({
  expenceName: Yup.string()
    .required('Expence name is required')
    .min(2, 'Expence must be at least 2 characters')
    .max(50, 'Expence must be 50 characters or less'),
  price: Yup.number().required('Price is required').positive('Price must be positive'),
});

export const AboutusSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  img: Yup.array().min(1, "At least one image is required"),
});

export const ReturnOrderSchema = Yup.object({
  orderid: Yup.string().required('Order ID is required'),
  reasonforreturn: Yup.string().required('Reason for Return is required'),
  mobileno: Yup.string().required('Mobile No is required'),
  enterOTPtoreturn: Yup.string().required('Enter OTP to Return is required'),
});