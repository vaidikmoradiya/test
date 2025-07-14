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

  return (
  
      <div className="sp_height">
        <div className="px-sm-4 px-3 mx-sm-3">
          <div className="d-flex justify-content-between mt-sm-4 mt-3">
            <div>
              <h4 className="ds_600 mb-0">Add Stock</h4>
              <p className="ds_text ds_font">
                Dashboard / Stock{" "}
                <span style={{ color: "rgba(20, 20, 20, 1)" }}>
                  {" "}
                  / Add Stock
                </span>
              </p>
            </div>
          </div>

          <form onSubmit={CreateStockFormik.handleSubmit}>
            <div className="ds_user_box mt-2">
              <div className="row">
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                  <label className='ds_login_label'>Main Category</label>
                  <select name='mainCateId' value={CreateStockFormik?.values.mainCateId} onChange={CreateStockFormik?.handleChange} onBlur={CreateStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="" disabled>Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateStockFormik.touched.mainCateId && CreateStockFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.mainCateId}</div>
                            )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                    <label className="ds_login_label">Category</label>
                    <select name='cateName' value={CreateStockFormik?.values.cateName} onChange={CreateStockFormik?.handleChange} onBlur={CreateStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.categoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateStockFormik.touched.cateName && CreateStockFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.cateName}</div>
                            )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                  <div className="form-group">
                  <label className='ds_login_label'>Sub Category</label>
                  <select name='SubcateName' value={CreateStockFormik?.values.SubcateName} onChange={CreateStockFormik?.handleChange} onBlur={CreateStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredSubCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.subCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateStockFormik.touched.SubcateName && CreateStockFormik.errors.SubcateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateStockFormik.errors.SubcateName}</div>
                            )}
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                <div className="form-group">
                            <label className='ds_login_label' >Product</label>
                            <select name='product' value={CreateStockFormik?.values.product} onChange={CreateStockFormik?.handleChange} onBlur={CreateStockFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {ProductData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.productName}</option>
                                    )
                                })}
                            </select>
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
