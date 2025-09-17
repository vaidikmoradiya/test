import React, { useState,useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { GetCateData } from "../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice";
import { GetMainCateData } from "../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice";
import { GetSubCateData } from "../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice";
import { GetAllProduct } from "../../Redux-Toolkit/ToolkitSlice/User/ProductSlice";
import { CreateStock, GetAllStock } from "../../Redux-Toolkit/ToolkitSlice/Admin/StockSlice";
import { StockSchema } from "../Formik";
import { Link } from 'react-router-dom';
import arrowdown from '../../Admin/Image/Savani/arrow.svg';

const AddStock = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
  const cateMap = useSelector((state)=> state?.category?.getCategoryData)
  const subCateData = useSelector((state)=> state?.subcategory?.getSubCategoryData)
  const ProductData = useSelector((state) => state.product.allProductData)
  const StockData = useSelector((state) => state.stock.StockData)

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(()=>{
      dispatch(GetCateData())
      dispatch(GetMainCateData())
      dispatch(GetSubCateData())
      dispatch(GetAllProduct())
      dispatch(GetAllStock())
  },[])

const createStockVal = {
  mainCateId:"",
  cateName:"",
  SubcateName:"",
  product:"",
  stockStatus:"",
  qty:"",
}

const CreateStockFormik = useFormik({
  initialValues:createStockVal,
  validationSchema:StockSchema,
  onSubmit:(values , action)=>{
      dispatch(CreateStock(values))
      .then((response)=>{
          if(response?.meta?.requestStatus === "fulfilled"){
              navigate("/admin/stock")
              dispatch(GetAllStock())
          }
      })
      action.resetForm()
  }
})

useEffect(() => {
  if (CreateStockFormik.values.mainCateId) {
    setFilteredCategories(
      cateMap?.filter(
        (cat) => cat.mainCategoryId === CreateStockFormik.values.mainCateId
      ) || []
    );
  } else {
    setFilteredCategories([]);
  }
}, [CreateStockFormik.values.mainCateId, cateMap]);

useEffect(() => {
  if (CreateStockFormik.values.cateName) {
    setFilteredSubCategories(
      subCateData?.filter(
        (subcat) => subcat.categoryId === CreateStockFormik.values.cateName
      ) || []
    );
  } else {
    setFilteredSubCategories([]);
  }
}, [CreateStockFormik.values.cateName, subCateData]);

// Filter products by selected main/category/subcategory
useEffect(() => {
  const mainId = CreateStockFormik.values.mainCateId;
  const catId = CreateStockFormik.values.cateName;
  const subId = CreateStockFormik.values.SubcateName;

  // If no filters selected, do not show any products initially
  if (!mainId && !catId && !subId) {
    setFilteredProducts([]);
    if (CreateStockFormik.values.product) {
      CreateStockFormik.setFieldValue('product', '');
    }
    return;
  }

  const matchesMain = (p) =>
    !mainId ||
    p.mainCategoryId === mainId ||
    p.mainCategoryData?.[0]?._id === mainId;

  const matchesCat = (p) =>
    !catId ||
    p.categoryId === catId ||
    p.categoryData?.[0]?._id === catId;

  const matchesSub = (p) =>
    !subId ||
    p.subCategoryId === subId ||
    p.subCategoryData?.[0]?._id === subId;

  const next = (ProductData || []).filter((p) => matchesMain(p) && matchesCat(p) && matchesSub(p));
  setFilteredProducts(next);

  // If current selected product no longer matches, clear it
  if (CreateStockFormik.values.product) {
    const stillValid = next.some(
      (p) => p._id === CreateStockFormik.values.product
    );
    if (!stillValid) {
      CreateStockFormik.setFieldValue('product', '');
    }
  }
}, [CreateStockFormik.values.mainCateId, CreateStockFormik.values.cateName, CreateStockFormik.values.SubcateName, ProductData]);

// Reusable Custom Select (aligned with Category page)
const CustomSelect = ({ options, value, onChange, placeholder = 'Select' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [container, setContainer] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (container && !container.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [container]);

  const selected = options.find(opt => opt.value === value);

  return (
    <div ref={setContainer} style={{ position: 'relative', width: '100%' }}>
      <div
        className='mv_category_modal_select'
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        tabIndex={0}
        onClick={() => setIsOpen(prev => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setIsOpen(prev => !prev);
          if (e.key === 'Escape') setIsOpen(false);
        }}
      >
        <span style={{ color: selected && selected.value !== '' ? '#111' : '#14141499' }}>
          {selected && selected.value !== '' ? selected.label : placeholder}
        </span>
        <span style={{ marginLeft: 8 }}><img src={arrowdown}/></span>
      </div>
      {isOpen && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            zIndex: 20,
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 0,
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
            maxHeight: 220,
            overflowY: 'auto',
            margin: 0,
            paddingLeft: 0,
            listStyle: 'none',
          }}
        >
          {options.filter(o => o.value !== '').map(opt => (
            <li
              className='mv_category_modal_select_option'
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '3px 12px',
                borderRadius: 0,
                background: opt.value === value ? '#1E2131' : 'transparent',
                color: opt.value === value ? '#fff' : '',
                cursor: 'pointer',
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const mainCategoryOptions = [
  { value: '', label: 'Select MainCategory' },
  ...((Array.isArray(mainCateData) ? mainCateData : []).map(m => ({ value: m?._id || '', label: m?.mainCategoryName || '' })))
];
const categoryOptions = [
  { value: '', label: 'Select Category' },
  ...((Array.isArray(filteredCategories) ? filteredCategories : []).map(c => ({ value: c?._id || '', label: c?.categoryName || '' })))
];
const subCategoryOptions = [
  { value: '', label: 'Select SubCategory' },
  ...((Array.isArray(filteredSubCategories) ? filteredSubCategories : []).map(sc => ({ value: sc?._id || '', label: sc?.subCategoryName || '' })))
];
const productOptions = [
  { value: '', label: 'Select Product' },
  ...((Array.isArray(filteredProducts) ? filteredProducts : []).map(p => ({ value: p?._id || '', label: p?.productName || '' })))
];

  return (
  
      <div className="sp_height">
        <div className="px-sm-4 px-3 mx-sm-3">
          <div className="d-flex justify-content-between mt-sm-4 mt-3">
            <div>
              <h4 className="ds_600 mb-0">Add Stock</h4>
              <p className="ds_text ds_font ds_cursor">
              <Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link> / <span onClick={()=>navigate("/admin/stock")}> Stock </span> <span style={{ color: "rgba(20, 20, 20, 1)" }}> / Add Stock</span></p>
            </div>
          </div>

          <form onSubmit={CreateStockFormik.handleSubmit}>
            <div className="ds_user_box mt-2">
              <div className="row">
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                  <label className='ds_login_label'>Main Category</label>
                  <div className='mt-2'>
                    <CustomSelect
                      options={mainCategoryOptions}
                      value={CreateStockFormik?.values.mainCateId}
                      onChange={(val) => CreateStockFormik.setFieldValue('mainCateId', val)}
                      placeholder="Select MainCategory"
                    />
                  </div>
                  {CreateStockFormik.touched.mainCateId && CreateStockFormik.errors.mainCateId && (
                    <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.mainCateId}</div>
                  )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                    <label className="ds_login_label">Category</label>
                    <div className='mt-2'>
                      <CustomSelect
                        options={categoryOptions}
                        value={CreateStockFormik?.values.cateName}
                        onChange={(val) => CreateStockFormik.setFieldValue('cateName', val)}
                        placeholder="Select Category"
                      />
                    </div>
                    {CreateStockFormik.touched.cateName && CreateStockFormik.errors.cateName && (
                      <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.cateName}</div>
                    )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                  <label className='ds_login_label'>Sub Category</label>
                  <div className='mt-2'>
                    <CustomSelect
                      options={subCategoryOptions}
                      value={CreateStockFormik?.values.SubcateName}
                      onChange={(val) => CreateStockFormik.setFieldValue('SubcateName', val)}
                      placeholder="Select SubCategory"
                    />
                  </div>
                  {CreateStockFormik.touched.SubcateName && CreateStockFormik.errors.SubcateName && (
                    <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.SubcateName}</div>
                  )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className='ds_login_label' >Product</label>
                  <div className='mt-2'>
                    <CustomSelect
                      options={productOptions}
                      value={CreateStockFormik?.values.product}
                      onChange={(val) => CreateStockFormik.setFieldValue('product', val)}
                      placeholder="Select Product"
                    />
                  </div>
                  {CreateStockFormik.touched.product && CreateStockFormik.errors.product && (
                    <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.product}</div>
                  )}
                </div>
                </div>
                {/* <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                    <label className="ds_login_label">Stock Status</label>
                    <select name='stockStatus' value={CreateStockFormik?.values.stockStatus} onChange={CreateStockFormik?.handleChange} onBlur={CreateStockFormik?.handleBlur} className='ds_user_select w-100 mt-1' style={{fontSize:"15px"}}>
                          <option value="">Select Status</option>
                          <option value="In Stock">In Stock</option>
                          <option value="Out of Stock">Out of Stock</option>
                        </select>
                        {CreateStockFormik.touched.stockStatus && CreateStockFormik.errors.stockStatus && (
                          <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.stockStatus}</div>
                        )}
                  </div>
                </div> */}
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                    <label className="ds_login_label">Qty.</label>
                    <input type="text" name='qty' value={CreateStockFormik.values?.qty} onChange={CreateStockFormik?.handleChange} onBlur={CreateStockFormik.handleBlur}  className="form-control ds_login_input mt-1" placeholder='Enter quantity' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                  </div>
                  {CreateStockFormik.touched.qty && CreateStockFormik.errors.qty && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.qty}</div>
                      )}
                </div>
              </div>
              <div className="text-center mt-5 mb-4 pb-1">
                <button onClick={()=> navigate("/admin/stock")} className="ds_user_cancel">Cancel</button>
                <button type='submit' className="ds_user_add">Add</button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
  );
};

export default AddStock;
