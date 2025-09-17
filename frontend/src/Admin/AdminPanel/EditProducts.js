import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice';
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice';
import { GetSubCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice';
import { GetSizeData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SizeSlice';
import { GetUnitData } from '../../Redux-Toolkit/ToolkitSlice/Admin/UnitSlice';
import { EditProduct, GetAllProduct, GetSingleProductData } from '../../Redux-Toolkit/ToolkitSlice/User/ProductSlice';
import { ProductSchema } from '../Formik';
import { Link } from 'react-router-dom';
import arrowdown from '../../Admin/Image/Savani/arrow.svg';

const EditProducts = () => {

const fileInputRef = useRef(null);
const [fileName, setFileName] = useState("Choose Image")
const [addVarient, setAddVarient] = useState([]);
const navigate = useNavigate()
const [selectedImages, setSelectedImages] = useState([]);
const [existingImages, setExistingImages] = useState([]);
const [filteredCategories, setFilteredCategories] = useState([]);
const [filteredSubCategories, setFilteredSubCategories] = useState([]);

const dispatch = useDispatch()
const editid = localStorage.getItem("Editid")
const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
const cateMap = useSelector((state)=> state?.category?.getCategoryData)
const subCateData = useSelector((state)=> state?.subcategory?.getSubCategoryData)
const sizeData = useSelector((state) => state.size.getsizeData)
const unitData = useSelector((state)=> state?.unit?.getUnitData)
const singleProductData = useSelector((state)=> state?.product?.GetSingleProductData)

useEffect(()=>{
  dispatch(GetCateData())
  dispatch(GetMainCateData())
  dispatch(GetSubCateData())
  dispatch(GetSizeData())
  dispatch(GetUnitData())

  dispatch(GetSingleProductData(editid))

},[])

useEffect(() => {
  if (singleProductData[0]?.productImage) {
    setExistingImages(singleProductData[0].productImage);
  }
}, [singleProductData]);

useEffect(() => {
  if (singleProductData[0]?.fields) {
    setAddVarient(singleProductData[0].fields);
  }
}, [singleProductData]);

// Add this new useEffect to handle data field properly
useEffect(() => {
  if (singleProductData[0]) {
    // Check if data exists and parse it properly
    let fieldsData = [];
    
    // Check for 'data' field first (as sent from backend)
    if (singleProductData[0].data && Array.isArray(singleProductData[0].data)) {
      fieldsData = singleProductData[0].data.map(item => {
        // If item is a string, try to parse it as JSON
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch (e) {
            return { key: item, value: '' };
          }
        }
        // If item is already an object
        return item;
      });
    }
    // Fallback to 'fields' if 'data' doesn't exist
    else if (singleProductData[0].fields && Array.isArray(singleProductData[0].fields)) {
      fieldsData = singleProductData[0].fields;
    }
    
    setAddVarient(fieldsData);
  }
}, [singleProductData]);

const handleBrowseClick = () => {
  fileInputRef.current.click(); 
};

const handleFileChange = (event) => {
  const fileName = event.target.files[0]?.name || '';
  setFileName(fileName)
};

const addMoreVarient = (e) => {
  e.preventDefault();
  setAddVarient([...addVarient, { title: "", desc: "" }]);
};

const handleVarientChange = (index, field, value) => {
  const updatedVarients = addVarient.map((variant, i) =>
    i === index ? { ...variant, [field]: value } : variant
  );
  setAddVarient(updatedVarients);
};

const handleImageSelect = (event) => {
  const files = Array.from(event.target.files);
  const newImages = [...selectedImages, ...files];
  setSelectedImages(newImages);
  EditProductFormik.setFieldValue('productImage', [...existingImages, ...newImages]);
};

const removeImage = (index) => {
  const newImages = selectedImages.filter((_, i) => i !== index);
  setSelectedImages(newImages);
  EditProductFormik.setFieldValue('productImage', [...existingImages, ...newImages]);
};

const removeExistingImage = (index) => {
  const newExistingImages = existingImages.filter((_, i) => i !== index);
  setExistingImages(newExistingImages);
  EditProductFormik.setFieldValue('productImage', [...newExistingImages, ...selectedImages]);
};

const addMoreFields = () => {
  setAddVarient([...addVarient, { key: "", value: "" }]);
  EditProductFormik.setValues((prevValues) => ({
      ...prevValues,
      fields: [...prevValues.fields, { key: "", value: "" }],
  }));
};

const removeFields = (index) => {
  const updatedFields = [...addVarient];
  updatedFields.splice(index, 1);
  setAddVarient(updatedFields);

  EditProductFormik.setValues((prevValues) => {
      const updatedFormikFields = [...prevValues.fields];
      updatedFormikFields.splice(index, 1);
      return {
          ...prevValues,
          fields: updatedFormikFields,
      };
  });
};

const editProductVal = {
  mainCateId:singleProductData[0]?.mainCategoryId,
  cateName:singleProductData[0]?.categoryId,
  SubcateName:singleProductData[0]?.subCategoryId,
  productName:singleProductData[0]?.productName,
  sizeName:singleProductData[0]?.sizeNameId,
  size:singleProductData[0]?.size,  
  unit: (() => {
    const unitData = singleProductData[0]?.unit;
    if (Array.isArray(unitData)) {
      return unitData;
    } else if (typeof unitData === 'string' && unitData.trim() !== '') {
      // Split by comma and trim whitespace
      return unitData.split(',').map(unit => unit.trim()).filter(unit => unit !== '');
    } else {
      return [];
    }
  })(),
  stockStatus:singleProductData[0]?.stockStatus,
  price:singleProductData[0]?.price,
  discount:singleProductData[0]?.discount,
  productImage: singleProductData[0]?.productImage || [],
  shortDescription:singleProductData[0]?.shortDescription,
  description:singleProductData[0]?.description,
  fields: (() => {
    // Check for 'data' field first (as sent from backend)
    if (singleProductData[0]?.data && Array.isArray(singleProductData[0].data)) {
      return singleProductData[0].data.map(item => {
        // If item is a string, try to parse it as JSON
        if (typeof item === 'string') {
          try {
            return JSON.parse(item);
          } catch (e) {
            return { key: item, value: '' };
          }
        }
        // If item is already an object
        return item;
      });
    }
    // Fallback to 'fields' if 'data' doesn't exist
    else if (singleProductData[0]?.fields && Array.isArray(singleProductData[0].fields)) {
      return singleProductData[0].fields;
    }
    return [];
  })()
}

const EditProductFormik = useFormik({
  enableReinitialize: true,
  initialValues:editProductVal,
  validationSchema:ProductSchema,
  onSubmit:(values , action)=>{
      dispatch(EditProduct({values, id:editid}))
      .then((response)=>{
          if(response?.meta?.requestStatus === "fulfilled"){
              navigate("/admin/product")
              dispatch(GetAllProduct())
          }
      })
      action.resetForm()
  }
})

// Add useEffect to sync addVarient with Formik fields after Formik initialization
useEffect(() => {
  if (EditProductFormik.values.fields && EditProductFormik.values.fields.length > 0) {
    setAddVarient(EditProductFormik.values.fields);
  }
}, [EditProductFormik.values.fields]);

useEffect(() => {
  if (EditProductFormik.values.mainCateId) {
    setFilteredCategories(
      cateMap?.filter(
        (cat) => cat.mainCategoryId === EditProductFormik.values.mainCateId
      ) || []
    );
  } else {
    setFilteredCategories([]);
  }
}, [EditProductFormik.values.mainCateId, cateMap]);

useEffect(() => {
  if (EditProductFormik.values.cateName) {
    setFilteredSubCategories(
      subCateData?.filter(
        (subcat) => subcat.categoryId === EditProductFormik.values.cateName
      ) || []
    );
  } else {
    setFilteredSubCategories([]);
  }
}, [EditProductFormik.values.cateName, subCateData]);

  // Reusable Custom Select (aligned with Category/Add Products)
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

  const sizeOptions = [
    { value: '', label: 'Select Size' },
    ...([...new Map((Array.isArray(sizeData) ? sizeData : []).map(item => [item.sizeName, item])).values()].map(el => ({ value: el?._id || '', label: el?.sizeName || '' })))
  ];

  const stockStatusOptions = [
    { value: '', label: 'Select Status' },
    { value: 'true', label: 'In Stock' },
    { value: 'false', label: 'Out of Stock' }
  ];

  const unitOptions = [
    { value: '', label: 'Select Unit' },
    ...((Array.isArray(unitData) ? unitData : [])
      .filter(el => el?.status)
      .filter(el => !((EditProductFormik.values.unit || []).includes(el.unitName)))
      .map(el => ({ value: el?.unitName || '', label: el?.unitName || '' })))
  ];

  return (
    <div>
      <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
            <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Edit Products</h4>
                   <p className='ds_text ds_font ds_cursor'><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link> / <span onClick={()=> navigate("/admin/product")}>Products</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / Edit Products</span></p>
                </div>
            </div>
            <form onSubmit={EditProductFormik.handleSubmit}>
              <div className='ds_user_box mt-2'>
                <div className="row">
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label ' >Main Category</label>
                          <div className='mt-2'>
                            <CustomSelect
                              options={mainCategoryOptions}
                              value={EditProductFormik?.values.mainCateId}
                              onChange={(val) => EditProductFormik.setFieldValue('mainCateId', val)}
                              placeholder="Select MainCategory"
                            />
                          </div>
                            {EditProductFormik.touched.mainCateId && EditProductFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.mainCateId}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label ' >Category</label>
                          <div className='mt-2'>
                            <CustomSelect
                              options={categoryOptions}
                              value={EditProductFormik?.values.cateName}
                              onChange={(val) => EditProductFormik.setFieldValue('cateName', val)}
                              placeholder="Select Category"
                            />
                          </div>
                            {EditProductFormik.touched.cateName && EditProductFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.cateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label ' >Sub Category</label>
                          <div className='mt-2'>
                            <CustomSelect
                              options={subCategoryOptions}
                              value={EditProductFormik?.values.SubcateName}
                              onChange={(val) => EditProductFormik.setFieldValue('SubcateName', val)}
                              placeholder="Select SubCategory"
                            />
                          </div>
                            {EditProductFormik.touched.SubcateName && EditProductFormik.errors.SubcateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.SubcateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group">
                            <label className='ds_login_label' >Product</label>
                            <input type="text" name='productName' value={EditProductFormik.values?.productName} onChange={EditProductFormik?.handleChange} onBlur={EditProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Product Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                      {EditProductFormik.touched.productName && EditProductFormik.errors.productName && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.productName}</div>
                      )}
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group">
                        <label className='ds_login_label ' >Size Name</label>
                        <div className='mt-1'>
                          <CustomSelect
                            options={sizeOptions}
                            value={EditProductFormik?.values.sizeName}
                            onChange={(val) => EditProductFormik.setFieldValue('sizeName', val)}
                            placeholder="Select Size"
                          />
                        </div>
                        {EditProductFormik.touched.sizeName && EditProductFormik.errors.sizeName && (
                          <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.sizeName}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label' >Size</label>
                        <input type="text" name='size' value={EditProductFormik.values?.size} onChange={EditProductFormik?.handleChange} onBlur={EditProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Size' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                      {EditProductFormik.touched.size && EditProductFormik.errors.size && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.size}</div>
                      )}
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label'>Unit</label>
                        {/* Dropdown for selecting units */}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '4px', width: '100%' }}>
                          <CustomSelect
                            options={unitOptions}
                            value={''}
                            onChange={(val) => {
                              if (val && !(EditProductFormik.values.unit || []).includes(val)) {
                                EditProductFormik.setFieldValue('unit', [...(EditProductFormik.values.unit || []), val]);
                              }
                            }}
                            placeholder="Select Unit"
                          />
                        </div>
                        {/* Show selected units as tags */}
                        <div style={{ display: 'flex', gap: '8px', padding:"0px 10px", flexWrap: 'wrap', background: "#1414140F", borderBottomRightRadius:"4px", borderBottomLeftRadius: "4px" }}>
                          {(EditProductFormik.values.unit || []).map(unitName => (
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
                                  EditProductFormik.setFieldValue(
                                    'unit',
                                    (EditProductFormik.values.unit || []).filter(u => u !== unitName)
                                  );
                                }}
                              >✕</span>
                            </div>
                          ))}
                        </div>
                        {EditProductFormik.touched.unit && EditProductFormik.errors.unit && (
                          <div className="text-danger mt-1" style={{ fontSize: "12px" }}>{EditProductFormik.errors.unit}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label ' >Stock Status</label>
                          <div className='mt-1'>
                            <CustomSelect
                              options={stockStatusOptions}
                              value={EditProductFormik?.values.stockStatus}
                              onChange={(val) => EditProductFormik.setFieldValue('stockStatus', val)}
                              placeholder="Select Status"
                            />
                          </div>
                        {EditProductFormik.touched.stockStatus && EditProductFormik.errors.stockStatus && (
                          <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.stockStatus}</div>
                        )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group">
                            <label className='ds_login_label' >Price</label>
                            <input type="text" name='price' value={EditProductFormik.values?.price} onChange={EditProductFormik?.handleChange} onBlur={EditProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Price' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                      </div>
                      {EditProductFormik.touched.price && EditProductFormik.errors.price && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.price}</div>
                      )}
                    </div>
                    <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                            <label className='ds_login_label' >Discount (%) </label>
                            <input type="text" name='discount' value={EditProductFormik.values?.discount} onChange={EditProductFormik?.handleChange} onBlur={EditProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Discount (%)' />
                      </div>
                      {EditProductFormik.touched.discount && EditProductFormik.errors.discount && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.discount}</div>
                      )}
                    </div>
                    <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group position-relative">
                        <label className='ds_login_label'>Image</label>
                        <div style={{ background: '#1414140F', borderRadius: '4px', display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: "4px", padding: "8px 12px", minHeight: "40px" }}>
                          {/* Show existing images */}
                          {existingImages.map((image, index) => (
                            <div key={`existing-${index}`} 
                            style={{ 
                              background: '#14141426', 
                              borderRadius: '2px',
                              padding: '0px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px',
                              }}>
                              <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>
                                {typeof image === 'string' ? 
                                  (() => {
                                    const filename = image.includes('\\') ? image.split('\\').pop() : image.split('/').pop();
                                    // Remove timestamp prefix (numbers followed by dash)
                                    return filename.replace(/^\d+-/, '');
                                  })()
                                  : image.name || `Image ${index + 1}`}
                              </span>
                              <span style={{ color: 'red', marginLeft: 8, fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }} onClick={() => removeExistingImage(index)}>✕</span>
                            </div>
                          ))}
                          {/* Show newly selected images */}
                          {selectedImages.map((image, index) => (
                            <div key={`new-${index}`} 
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
                          onBlur={EditProductFormik.handleBlur}
                          onChange={handleImageSelect}
                          className='d-none'
                        />
                        <div className='ds_user_browse ds_cursor' onClick={handleBrowseClick}>Browse</div>
                      </div>
                      {EditProductFormik.touched.productImage && EditProductFormik.errors.productImage && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.productImage}</div>
                      )}
                    </div>
                    <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label' >Short Description</label>
                        <input type="text" name='shortDescription' value={EditProductFormik.values.shortDescription} onChange={EditProductFormik.handleChange} onBlur={EditProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Short Description' />
                      </div>
                      {EditProductFormik.touched.shortDescription && EditProductFormik.errors.shortDescription && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.shortDescription}</div>
                      )}
                    </div>
                    <div className="col-xl-6 col-lg-6 px-3 mt-sm-4 mt-3">
                      <div className="form-group">
                        <label className='ds_login_label' >Description</label>
                        <input type="text" name='description' value={EditProductFormik.values.description} onChange={EditProductFormik.handleChange} onBlur={EditProductFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Description' />
                      </div>
                      {EditProductFormik.touched.description && EditProductFormik.errors.description && (
                        <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditProductFormik.errors.description}</div>
                      )}
                    </div>
          
                </div>
                    {(EditProductFormik.values.fields || []).map((element, idx) => (
                      <div className="row" key={idx}>
                        <div className={`col-xl-6 col-lg-6 px-3 ${idx === 0 ? 'mt-sm-4 mt-3' : ''}`}>
                          <div className="form-group">
                            <label className='ds_login_label'>Title</label>
                            <input
                              type="text"
                              name={`fields[${idx}].key`}
                              className="form-control ds_login_input mt-1"
                              placeholder='Enter Title'
                              value={EditProductFormik.values.fields[idx]?.key || ""} 
                              onChange={(e) => EditProductFormik.setFieldValue(`fields[${idx}].key`, e.target.value)} 
                              onBlur={EditProductFormik.handleBlur}
                            />
                          </div>
                          {EditProductFormik.touched.fields &&
                            EditProductFormik.touched.fields[idx] &&
                            EditProductFormik.touched.fields[idx].key &&
                            EditProductFormik.errors.fields &&
                            EditProductFormik.errors.fields[idx] &&
                            EditProductFormik.errors.fields[idx].key && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>
                              {EditProductFormik.errors.fields[idx].key}
                            </div>
                          )}
                        </div>
                        <div className={`col-xl-6 col-lg-6 px-3 ${idx === 0 ? 'mt-sm-4 mt-3' : ''}`}>
                          <div className="form-group">
                            <label className='ds_login_label'>Description</label>
                            <input
                              type="text"
                              name={`fields[${idx}].value`}
                              className="form-control ds_login_input mt-1"
                              placeholder='Enter Description'
                              value={EditProductFormik.values.fields[idx]?.value || ""} 
                              onChange={(e) => EditProductFormik.setFieldValue(`fields[${idx}].value`, e.target.value)} 
                              onBlur={EditProductFormik.handleBlur}
                            />
                          </div>
                          {EditProductFormik.touched.fields &&
                            EditProductFormik.touched.fields[idx] &&
                            EditProductFormik.touched.fields[idx].value &&
                            EditProductFormik.errors.fields &&
                            EditProductFormik.errors.fields[idx] &&
                            EditProductFormik.errors.fields[idx].value && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>
                              {EditProductFormik.errors.fields[idx].value}
                            </div>
                          )}
                        </div>
                        <div className="col-12 px-3 mt-sm-4 mt-3 d-flex align-items-end justify-content-end">
                          <button 
                            type="button"
                            className="btn btn-danger"
                            style={{
                              backgroundColor: '#dc3545',
                              border: 'none',
                              borderRadius: '4px',
                              padding: '8px 16px',
                              fontSize: '14px',
                              fontWeight: '500',
                            }}
                            onClick={() => removeFields(idx)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className='text-end mt-4'>
                        <button className='ds_addmore_btn' onClick={e => {
                          e.preventDefault();
                          setAddVarient([...addVarient, { key: '', value: '' }]);
                          EditProductFormik.setFieldValue('fields', [
                            ...(EditProductFormik.values.fields || []),
                            { key: '', value: '' }
                          ]);
                        }}>+ Add More</button>
                    </div>
                <div className='text-center mt-5 mb-4 pb-1'>
                  <button onClick={()=> navigate("/admin/product")} className='ds_user_cancel'>Cancel</button>
                  <button type='submit' className='ds_user_add'>Update</button>
                </div>
              </div>
            </form>
      </div>
    </div>
  )
}

export default EditProducts
