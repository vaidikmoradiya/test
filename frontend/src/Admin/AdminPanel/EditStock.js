import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { EditStockData, GetAllStock, GetSingleStockData } from '../../Redux-Toolkit/ToolkitSlice/Admin/StockSlice'
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice'
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice'
import { GetSubCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice'
import { GetAllProduct } from '../../Redux-Toolkit/ToolkitSlice/User/ProductSlice'
import { StockSchema } from "../Formik";
import { Link } from 'react-router-dom';
import arrowdown from '../../Admin/Image/Savani/arrow.svg';

const EditStock = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const editid = localStorage.getItem("Editid")

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const mainCateData = useSelector((state) => state?.mainCategory?.getMainCategoryData)
  const cateMap = useSelector((state) => state?.category?.getCategoryData)
  const subCateData = useSelector((state) => state?.subcategory?.getSubCategoryData)
  const ProductData = useSelector((state) => state.product.allProductData)
  const singleStocktData = useSelector((state) => state?.stock?.GetSingleStockData)

  useEffect(() => {
    dispatch(GetCateData())
    dispatch(GetMainCateData())
    dispatch(GetSubCateData())
    dispatch(GetAllProduct())

    dispatch(GetSingleStockData(editid))
  }, [])

  const editStockVal = {
    mainCateId: singleStocktData?.mainCategory,
    cateName: singleStocktData?.category,
    SubcateName: singleStocktData?.subCategory,
    product: singleStocktData?.product,
    stockStatus: singleStocktData?.stockStatus,
    qty: singleStocktData?.qty,
  }
  const EditStockFormik = useFormik({
    enableReinitialize: true,
    initialValues: editStockVal,
    validationSchema: StockSchema,
    onSubmit: (values, action) => {
      dispatch(EditStockData({ values, id: editid }))
        .then((response) => {
          if (response?.meta?.requestStatus === "fulfilled") {
            navigate("/admin/stock")
            dispatch(GetAllStock())
          }
        })
      action.resetForm()
    }
  })

  useEffect(() => {
    if (EditStockFormik.values.mainCateId) {
      setFilteredCategories(
        cateMap?.filter(
          (cat) => cat.mainCategoryId === EditStockFormik.values.mainCateId
        ) || []
      );
    } else {
      setFilteredCategories([]);
    }
  }, [EditStockFormik.values.mainCateId, cateMap]);

  useEffect(() => {
    if (EditStockFormik.values.cateName) {
      setFilteredSubCategories(
        subCateData?.filter(
          (subcat) => subcat.categoryId === EditStockFormik.values.cateName
        ) || []
      );
    } else {
      setFilteredSubCategories([]);
    }
  }, [EditStockFormik.values.cateName, subCateData]);

  // Reusable Custom Select (aligned with Category/Add Stock)
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
  // Filter products by selected main/category/subcategory; ensure current selection is always shown
  useEffect(() => {
    const mainId = EditStockFormik.values.mainCateId;
    const catId = EditStockFormik.values.cateName;
    const subId = EditStockFormik.values.SubcateName;

    const matchesMain = (p) => !mainId || p.mainCategoryId === mainId || p.mainCategoryData?.[0]?._id === mainId;
    const matchesCat = (p) => !catId || p.categoryId === catId || p.categoryData?.[0]?._id === catId;
    const matchesSub = (p) => !subId || p.subCategoryId === subId || p.subCategoryData?.[0]?._id === subId;

    const all = Array.isArray(ProductData) ? ProductData : [];
    const next = all.filter((p) => matchesMain(p) && matchesCat(p) && matchesSub(p));

    const selectedId = EditStockFormik.values.product;
    const selectedProduct = selectedId ? all.find(p => p._id === selectedId) : null;

    // If no filters selected, show only the selected product (if any), else empty
    if (!mainId && !catId && !subId) {
      setFilteredProducts(selectedProduct ? [selectedProduct] : []);
      return;
    }

    // If filtered list doesn't contain the selected one, prepend it so it stays visible
    const containsSelected = selectedProduct && next.some(p => p._id === selectedProduct._id);
    if (selectedProduct && !containsSelected) {
      const withoutSelected = next.filter(p => p._id !== selectedProduct._id);
      setFilteredProducts([selectedProduct, ...withoutSelected]);
    } else {
      setFilteredProducts(next);
    }
  }, [EditStockFormik.values.mainCateId, EditStockFormik.values.cateName, EditStockFormik.values.SubcateName, ProductData]);

  return (

    <div className='sp_height'>
      <div className="px-sm-4 px-3 mx-sm-3">
        <div className="d-flex justify-content-between mt-sm-4 mt-3">
          <div>
              <h4 className="ds_600 mb-0">Edit Stock</h4>
              <p className="ds_text ds_font ds_cursor">
              <Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link> / <span onClick={()=>navigate("/admin/stock")}> Stock </span> <span style={{ color: "rgba(20, 20, 20, 1)" }}> / Edit Stock</span></p>
            </div>
        </div>
        <form onSubmit={EditStockFormik.handleSubmit}>
          <div className="ds_user_box mt-2">
            <div className="row">
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className='ds_login_label'>Main Category</label>
                  <div className='mt-2'>
                    <CustomSelect
                      options={mainCategoryOptions}
                      value={EditStockFormik?.values.mainCateId}
                      onChange={(val) => EditStockFormik.setFieldValue('mainCateId', val)}
                      placeholder="Select MainCategory"
                    />
                  </div>
                  {EditStockFormik.touched.mainCateId && EditStockFormik.errors.mainCateId && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.mainCateId}</div>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className="ds_login_label">Category</label>
                  <div className='mt-2'>
                    <CustomSelect
                      options={categoryOptions}
                      value={EditStockFormik?.values.cateName}
                      onChange={(val) => EditStockFormik.setFieldValue('cateName', val)}
                      placeholder="Select Category"
                    />
                  </div>
                  {EditStockFormik.touched.cateName && EditStockFormik.errors.cateName && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.cateName}</div>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className="ds_login_label ">Sub Category</label>
                  <div className='mt-2'>
                    <CustomSelect
                      options={subCategoryOptions}
                      value={EditStockFormik?.values.SubcateName}
                      onChange={(val) => EditStockFormik.setFieldValue('SubcateName', val)}
                      placeholder="Select SubCategory"
                    />
                  </div>
                  {EditStockFormik.touched.SubcateName && EditStockFormik.errors.SubcateName && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.SubcateName}</div>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className="ds_login_label">Product</label>
                  <div className='mt-2'>
                    <CustomSelect
                      options={productOptions}
                      value={EditStockFormik?.values.product}
                      onChange={(val) => EditStockFormik.setFieldValue('product', val)}
                      placeholder="Select Product"
                    />
                  </div>
                  {EditStockFormik.touched.product && EditStockFormik.errors.product && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.product}</div>
                  )}
                </div>
              </div>
              {/* <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                    <label className="ds_login_label">Stock Status</label>
                    <select className="ds_user_select w-100 mt-1">
                      <option value="">Select</option>
                    </select>
                  </div>
                </div> */}
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className="ds_login_label">Qty.</label>
                  <input type="text" name='qty' value={EditStockFormik.values?.qty} onChange={EditStockFormik?.handleChange} onBlur={EditStockFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter quantity' id="exampleInputEmail1" aria-describedby="emailHelp" />
                </div>
                {EditStockFormik.touched.qty && EditStockFormik.errors.qty && (
                  <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.qty}</div>
                )}
              </div>
            </div>
            <div className="text-center mt-5 mb-4 pb-1">
              <button className="ds_user_cancel">Cancel</button>
              <button className="ds_user_add">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>


  )
}

export default EditStock
