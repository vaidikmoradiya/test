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

const EditStock = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const editid = localStorage.getItem("Editid")

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

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

  return (

    <div className='sp_height'>
      <div className="px-sm-4 px-3 mx-sm-3">
        <div className="d-flex justify-content-between mt-sm-4 mt-3">
          <div>
            <h4 className="ds_600 mb-0">Edit Stock</h4>
            <p className="ds_text ds_font">
              Dashboard / Stock{" "}
              <span style={{ color: "rgba(20, 20, 20, 1)" }}>
                {" "}
                / Edit Stock
              </span>
            </p>
          </div>
        </div>
        <form onSubmit={EditStockFormik.handleSubmit}>
          <div className="ds_user_box mt-2">
            <div className="row">
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className='ds_login_label'>Main Category</label>
                  <select name='mainCateId' value={EditStockFormik?.values.mainCateId} onChange={EditStockFormik?.handleChange} onBlur={EditStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{ fontSize: "15px" }}>
                    <option value="">Select MainCategory</option>
                    {mainCateData?.map((element) => {
                      return (
                        <option value={element?._id}>{element?.mainCategoryName}</option>
                      )
                    })}
                  </select>
                  {EditStockFormik.touched.mainCateId && EditStockFormik.errors.mainCateId && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.mainCateId}</div>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className="ds_login_label">Category</label>
                  <select name='cateName' value={EditStockFormik?.values.cateName} onChange={EditStockFormik?.handleChange} onBlur={EditStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{ fontSize: "15px" }}>
                    <option value="">Select Category</option>
                    {filteredCategories?.map((element) => {
                      return (
                        <option value={element?._id}>{element?.categoryName}</option>
                      )
                    })}
                  </select>
                  {EditStockFormik.touched.cateName && EditStockFormik.errors.cateName && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.cateName}</div>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className="ds_login_label ">Sub Category</label>
                  <select name='SubcateName' value={EditStockFormik?.values.SubcateName} onChange={EditStockFormik?.handleChange} onBlur={EditStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{ fontSize: "15px" }}>
                    <option value="">Select Category</option>
                    {filteredSubCategories?.map((element) => {
                      return (
                        <option value={element?._id}>{element?.subCategoryName}</option>
                      )
                    })}
                  </select>
                  {EditStockFormik.touched.SubcateName && EditStockFormik.errors.SubcateName && (
                    <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditStockFormik.errors.SubcateName}</div>
                  )}
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                  <label className="ds_login_label">Product</label>
                  <select name='product' value={EditStockFormik?.values.product} onChange={EditStockFormik?.handleChange} onBlur={EditStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{ fontSize: "15px" }}>
                    <option value="">Select Category</option>
                    {ProductData?.map((element) => {
                      return (
                        <option value={element?._id}>{element?.productName}</option>
                      )
                    })}
                  </select>
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
