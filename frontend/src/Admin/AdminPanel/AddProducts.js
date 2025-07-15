import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { ProductSchema } from '../Formik';
import { CreateProduct, GetAllProduct } from '../../Redux-Toolkit/ToolkitSlice/User/ProductSlice';
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice';
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice';
import { GetSubCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice';
import { GetSizeData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SizeSlice';
import { GetUnitData } from '../../Redux-Toolkit/ToolkitSlice/Admin/UnitSlice';

const AddProducts = () => {

const fileInputRef = useRef(null);
const [selectedImages, setSelectedImages] = useState([]);
const [addVarient, setAddVarient] = useState([]);
const navigate = useNavigate()
const dispatch = useDispatch()
const [unitInput, setUnitInput] = useState("");
const [filteredCategories, setFilteredCategories] = useState([]);
const [filteredSubCategories, setFilteredSubCategories] = useState([]);

const handleBrowseClick = () => {
  fileInputRef.current.click(); 
};

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files);
  const newImages = [...selectedImages, ...files];
  setSelectedImages(newImages);
  CreateProductFormik.setFieldValue('productImage', newImages);
};

const removeImage = (index) => {
  const newImages = selectedImages.filter((_, i) => i !== index);
  setSelectedImages(newImages);
  CreateProductFormik.setFieldValue('productImage', newImages);
};


  const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
  const cateMap = useSelector((state)=> state?.category?.getCategoryData)
  const subCateData = useSelector((state)=> state?.subcategory?.getSubCategoryData)
  const sizeData = useSelector((state) => state.size.getsizeData)
  const unitData = useSelector((state)=> state?.unit?.getUnitData)

  useEffect(()=>{
      dispatch(GetCateData())
      dispatch(GetMainCateData())
      dispatch(GetSubCateData())
      dispatch(GetSizeData())
      dispatch(GetUnitData())
  },[])

const createProductVal = {
  mainCateId:"",
  cateName:"",
  SubcateName:"",
  sizeName:"",
  productName:"",
  sizeName:"",
  size:"",  
  unit: [],
  stockStatus:"",
  price:"",
  discount:"",
  productImage: [],
  shortDescription:"",
  description:"",
  fields: []
}

const addMoreFields = () => {
  setAddVarient([...addVarient, { key: "", value: "" }]);
  CreateProductFormik.setValues((prevValues) => ({
      ...prevValues,
      fields: [...prevValues.fields, { key: "", value: "" }],
  }));
};
const removeFields = (index) => {
  const updatedFields = [...addVarient];
  updatedFields.splice(index, 1);
  setAddVarient(updatedFields);

  CreateProductFormik.setValues((prevValues) => {
      const updatedFormikFields = [...prevValues.fields];
      updatedFormikFields.splice(index, 1);
      return {
          ...prevValues,
          fields: updatedFormikFields,
      };
  });
};

const CreateProductFormik = useFormik({
  initialValues:createProductVal,
  validationSchema:ProductSchema,
  onSubmit:(values , action)=>{
      dispatch(CreateProduct(values))
      .then((response)=>{
          if(response?.meta?.requestStatus === "fulfilled"){
              navigate("/admin/product")
              dispatch(GetAllProduct())
          }
      })
      action.resetForm()
  }
})

// Now use CreateProductFormik in useEffect
useEffect(() => {
  if (CreateProductFormik.values.mainCateId) {
    setFilteredCategories(
      cateMap?.filter(
        (cat) => cat.mainCategoryId === CreateProductFormik.values.mainCateId
      ) || []
    );
  } else {
    setFilteredCategories([]);
  }
}, [CreateProductFormik.values.mainCateId, cateMap]);

// Add effect for dependent subcategory dropdown
useEffect(() => {
  if (CreateProductFormik.values.cateName) {
    setFilteredSubCategories(
      subCateData?.filter(
        (subcat) => subcat.categoryId === CreateProductFormik.values.cateName
      ) || []
    );
  } else {
    setFilteredSubCategories([]);
  }
}, [CreateProductFormik.values.cateName, subCateData]);

  return (
    <div className='sp_height'>
      <div className='px-sm-4 px-3 mx-sm-3'>
            <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Add Products</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard / <span onClick={()=> navigate("/admin/product")}>Products</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / Add Products</span></p>
                </div>
            </div>
            <form onSubmit={CreateProductFormik.handleSubmit}>
            <div className='ds_user_box mt-2'>
               <div className="row">
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                      <label className='ds_login_label'>Main Category</label>
                            <select name='mainCateId' value={CreateProductFormik?.values.mainCateId} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="" disabled>Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateProductFormik.touched.mainCateId && CreateProductFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.mainCateId}</div>
                            )}
                      </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                      <label className='ds_login_label'>Category</label>
                            <select name='cateName' value={CreateProductFormik?.values.cateName} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.categoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateProductFormik.touched.cateName && CreateProductFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.cateName}</div>
                            )}
                      </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                      <label className='ds_login_label'>Sub Category</label>
                            <select name='SubcateName' value={CreateProductFormik?.values.SubcateName} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredSubCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.subCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateProductFormik.touched.SubcateName && CreateProductFormik.errors.SubcateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.SubcateName}</div>
                            )}
                      </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                            <label className='ds_login_label' >Product</label>
                            <input type="text" name='productName' value={CreateProductFormik.values?.productName} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Product Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                      {CreateProductFormik.touched.productName && CreateProductFormik.errors.productName && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.productName}</div>
                      )}
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label ' >Size Name</label>
                        <select name='sizeName' value={CreateProductFormik?.values.sizeName} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik?.handleBlur} className='ds_user_select w-100 mt-1'>
                          <option value="">Select Size</option>
                          {[...new Map(sizeData?.map(item => [item.sizeName, item])).values()].map(element => (
                            <option value={element?._id}>{element?.sizeName}</option>
                          ))}
                        </select>
                        {CreateProductFormik.touched.sizeName && CreateProductFormik.errors.sizeName && (
                          <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.sizeName}</div>
                        )}
                      </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label' >Size</label>
                        <input type="text" name='size' value={CreateProductFormik.values?.size} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Size' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                      {CreateProductFormik.touched.size && CreateProductFormik.errors.size && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.size}</div>
                      )}
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group">
                      <label className='ds_login_label'>Unit</label>
                      {/* Dropdown for selecting units */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px' }}>
                        <select
                          value=""
                          onChange={e => {
                            const selected = e.target.value;
                            if (selected && !(CreateProductFormik.values.unit || []).includes(selected)) {
                              CreateProductFormik.setFieldValue('unit', [...(CreateProductFormik.values.unit || []), selected]);
                            }
                          }}
                          className='ds_user_select'
                          style={{ fontSize: "15px", width: "100%", borderBottomRightRadius:"0px", borderBottomLeftRadius: "0px" }}
                        >
                          <option value="">Select Unit</option>
                          {unitData?.map(element => (
                            !(CreateProductFormik.values.unit || []).includes(element.unitName) && (
                              <option key={element._id} value={element.unitName}>{element.unitName}</option>
                            )
                          ))}
                        </select>
                      </div>
                      {/* Show selected units as tags */}
                      <div style={{ display: 'flex', gap: '8px', padding:"0px 10px", flexWrap: 'wrap', background: "#1414140F", borderBottomRightRadius:"4px", borderBottomLeftRadius: "4px" }}>
                        {(CreateProductFormik.values.unit || []).map(unitName => (
                          <div
                            key={unitName}
                            style={{
                              background: "#14141426",
                              borderRadius: "2px",
                              padding: "4px 10px",
                              display: "flex",
                              alignItems: "center",
                              position: "relative",
                              marginBottom: "10px",
                              fontSize: "14px",
                            }}
                          >
                            {unitName}
                            <span
                              style={{
                                color: "red",
                                marginLeft: 8,
                                fontWeight: "bold",
                                fontSize: "16px",
                                cursor: "pointer"
                              }}
                              onClick={() => {
                                CreateProductFormik.setFieldValue(
                                  'unit',
                                  (CreateProductFormik.values.unit || []).filter(u => u !== unitName)
                                );
                              }}
                            >✕</span>
                          </div>
                        ))}
                      </div>
                      {CreateProductFormik.touched.unit && CreateProductFormik.errors.unit && (
                        <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{CreateProductFormik.errors.unit}</div>
                      )}
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label ' >Stock Status</label>
                        <select name='stockStatus' value={CreateProductFormik?.values.stockStatus} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik?.handleBlur} className='ds_user_select w-100 mt-1' style={{fontSize:"15px"}}>
                          <option value="">Select Status</option>
                          <option value="true">In Stock</option>
                          <option value="false">Out of Stock</option>
                        </select>
                        {CreateProductFormik.touched.stockStatus && CreateProductFormik.errors.stockStatus && (
                          <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.stockStatus}</div>
                        )}
                      </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                            <label className='ds_login_label' >Price</label>
                            <input type="text" name='price' value={CreateProductFormik.values?.price} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Price' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                      {CreateProductFormik.touched.price && CreateProductFormik.errors.price && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.price}</div>
                      )}
                  </div>
                  <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                            <label className='ds_login_label' >Discount (%) </label>
                            <input type="text" name='discount' value={CreateProductFormik.values?.discount} onChange={CreateProductFormik?.handleChange} onBlur={CreateProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Discount (%)' />
                      </div>
                      {CreateProductFormik.touched.discount && CreateProductFormik.errors.discount && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.discount}</div>
                      )}
                  </div>
                  <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group position-relative">
                      <label className='ds_login_label'>Image</label>
                      <div style={{ background: '#1414140F', borderRadius: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: "4px", padding: "8px 12px", minHeight: "40px" }}>
                        {selectedImages.map((image, index) => (
                          <div key={index} 
                          style={{ 
                            background: '#14141426', 
                            borderRadius: '2px',
                            padding: '0px 10px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '14px',
                            }}>
                            <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{image.name}</span>
                            <span style={{ color: 'red', marginLeft: 8, fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} onClick={() => removeImage(index)}>✕</span>
                          </div>
                        ))}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        name="productImage"
                        multiple
                        accept="image/*"
                        onBlur={CreateProductFormik.handleBlur}
                        onChange={handleImageSelect}
                        className='d-none'
                      />
                      <div className='ds_user_browse ds_cursor' onClick={handleBrowseClick}>Browse</div>
                    </div>
                    {CreateProductFormik.touched.productImage && CreateProductFormik.errors.productImage && (
                      <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.productImage}</div>
                    )}
                  </div>
                  <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group">
                      <label className='ds_login_label' >Short Description</label>
                      <input type="text" name='shortDescription' value={CreateProductFormik.values.shortDescription} onChange={CreateProductFormik.handleChange} onBlur={CreateProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Short Description' />
                    </div>
                    {CreateProductFormik.touched.shortDescription && CreateProductFormik.errors.shortDescription && (
                      <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.shortDescription}</div>
                    )}
                  </div>
                  <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group">
                      <label className='ds_login_label' >Description</label>
                      <input type="text" name='description' value={CreateProductFormik.values.description} onChange={CreateProductFormik.handleChange} onBlur={CreateProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Description' />
                    </div>
                    {CreateProductFormik.touched.description && CreateProductFormik.errors.description && (
                      <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateProductFormik.errors.description}</div>
                    )}
                  </div>
               </div>
                  {(CreateProductFormik.values.fields || []).map((element, idx) => (
                    <div className="row" key={idx}>
                      <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Title</label>
                          <input
                            type="text"
                            name={`fields[${idx}].key`}
                            className="form-control ds_login_input mt-1"
                            placeholder='Enter Title'
                            value={CreateProductFormik.values.fields[idx]?.key || ""} onChange={(e) => CreateProductFormik.setFieldValue(`fields[${idx}].key`, e.target.value)} onBlur={CreateProductFormik.handleBlur}
                          />
                        </div>
                        {CreateProductFormik.touched.fields &&
                          CreateProductFormik.touched.fields[idx] &&
                          CreateProductFormik.touched.fields[idx].key &&
                          CreateProductFormik.errors.fields &&
                          CreateProductFormik.errors.fields[idx] &&
                          CreateProductFormik.errors.fields[idx].key && (
                          <div className="text-danger mt-1" style={{fontSize:"12px"}}>
                            {CreateProductFormik.errors.fields[idx].key}
                          </div>
                        )}
                      </div>
                      <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Description</label>
                          <input
                            type="text"
                            name={`fields[${idx}].value`}
                            className="form-control ds_login_input mt-1"
                            placeholder='Enter Description'
                            value={CreateProductFormik.values.fields[idx]?.value || ""} onChange={(e) => CreateProductFormik.setFieldValue(`fields[${idx}].value`, e.target.value)} onBlur={CreateProductFormik.handleBlur}
                          />
                        </div>
                        {CreateProductFormik.touched.fields &&
                          CreateProductFormik.touched.fields[idx] &&
                          CreateProductFormik.touched.fields[idx].value &&
                          CreateProductFormik.errors.fields &&
                          CreateProductFormik.errors.fields[idx] &&
                          CreateProductFormik.errors.fields[idx].value && (
                          <div className="text-danger mt-1" style={{fontSize:"12px"}}>
                            {CreateProductFormik.errors.fields[idx].value}
                          </div>
                          )}
                      </div>
                    </div>
                  ))}
                   <div className='text-end mt-4'>
                      <button className='ds_addmore_btn' onClick={e => {
                        e.preventDefault();
                        setAddVarient([...addVarient, { key: '', value: '' }]);
                        CreateProductFormik.setFieldValue('fields', [
                          ...(CreateProductFormik.values.fields || []),
                          { key: '', value: '' }
                        ]);
                      }}>+ Add More</button>
                   </div>
               <div className='text-center mt-5 mb-4 pb-1'>
                 <button onClick={()=> navigate("/admin/product")} className='ds_user_cancel'>Cancel</button>
                 <button type='submit' className='ds_user_add'>Add</button>
               </div>
            </div>
          </form>
      </div>
    </div>
  )
}

export default AddProducts
