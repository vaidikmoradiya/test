import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { SizeSchema } from '../Formik'
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice';
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice';
import { CreateSubCateData, GetSubCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice';
import { CreateSizeData, EditSizeData, GetSizeData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SizeSlice';
import { GetUnitData } from '../../Redux-Toolkit/ToolkitSlice/Admin/UnitSlice';

const AddSize = () => {

  const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
  const cateMap = useSelector((state)=> state?.category?.getCategoryData)
  const subCateData = useSelector((state)=> state?.subcategory?.getSubCategoryData)
  const unitData = useSelector((state)=> state?.unit?.getUnitData)
  const dispatch = useDispatch()
  const [editData, setEditData] = useState("")
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(()=>{
      dispatch(GetCateData())
      dispatch(GetMainCateData())
      dispatch(GetSubCateData())
      dispatch(GetSizeData())
      dispatch(GetUnitData())
  },[])

const fileInputRef = useRef(null);
const [fileName, setFileName] = useState("Choose Image")
const navigate = useNavigate()

const handleBrowseClick = () => {
  fileInputRef.current.click(); 
};

const handleFileChange = (event) => {
  const fileName = event.target.files[0]?.name || '';
  setFileName(fileName)
};    
const createSizeVal = {
  mainCateId:"",
  cateName:"",
  SubcateName:"",
  sizeName:"",
  size:"",
  unit:"",
}
const CreateSizeFormik = useFormik({
  initialValues:createSizeVal,
  validationSchema:SizeSchema,
  onSubmit:(values , action)=>{
      dispatch(CreateSizeData(values))
      .then((response)=>{
          if(response?.meta?.requestStatus === "fulfilled"){
              navigate("/admin/size")
              dispatch(GetSizeData())
          }
      })
      action.resetForm()
  }
})

useEffect(() => {
    if (CreateSizeFormik.values.mainCateId) {
      setFilteredCategories(
        cateMap?.filter(
          (cat) => cat.mainCategoryId === CreateSizeFormik.values.mainCateId
        ) || []
      );
    } else {
      setFilteredCategories([]);
    }
  }, [CreateSizeFormik.values.mainCateId, cateMap]);

  useEffect(() => {
    if (CreateSizeFormik.values.cateName) {
      setFilteredSubCategories(
        subCateData?.filter(
          (subcat) => subcat.categoryId === CreateSizeFormik.values.cateName
        ) || []
      );
    } else {
      setFilteredSubCategories([]);
    }
  }, [CreateSizeFormik.values.cateName, subCateData]);

  return (
    <div>
      <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
            <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Add Size</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard / <span onClick={()=>navigate("/admin/size")}>Size</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / Add Size</span></p>
                </div>
            </div>
            <div className='ds_user_box mt-2'>
              <form onSubmit={CreateSizeFormik.handleSubmit}>
                <div className="row">
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Main Category</label>
                            <select name='mainCateId' value={CreateSizeFormik?.values.mainCateId} onChange={CreateSizeFormik?.handleChange} onBlur={CreateSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="" disabled>Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateSizeFormik.touched.mainCateId && CreateSizeFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.mainCateId}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Category</label>
                            <select name='cateName' value={CreateSizeFormik?.values.cateName} onChange={CreateSizeFormik?.handleChange} onBlur={CreateSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.categoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateSizeFormik.touched.cateName && CreateSizeFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.cateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Sub Category</label>
                            <select name='SubcateName' value={CreateSizeFormik?.values.SubcateName} onChange={CreateSizeFormik?.handleChange} onBlur={CreateSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredSubCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.subCategoryName}</option>
                                    )
                                })}
                            </select>
                            {CreateSizeFormik.touched.SubcateName && CreateSizeFormik.errors.SubcateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.SubcateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                              <label className='ds_login_label' >Size Name</label>
                              <input type="text" name='sizeName' value={CreateSizeFormik.values?.sizeName} onChange={CreateSizeFormik?.handleChange} onBlur={CreateSizeFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Size Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {CreateSizeFormik.touched.sizeName && CreateSizeFormik.errors.sizeName && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.sizeName}</div>
                        )}
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                              <label className='ds_login_label' >Size</label>
                              <input type="text" name='size' value={CreateSizeFormik.values?.size} onChange={CreateSizeFormik?.handleChange} onBlur={CreateSizeFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Size' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {CreateSizeFormik.touched.size && CreateSizeFormik.errors.size && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.size}</div>
                        )}
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Unit</label>
                            <select name='unit' value={CreateSizeFormik?.values.unit} onChange={CreateSizeFormik?.handleChange} onBlur={CreateSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Unit</option>
                                {unitData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.unitName}</option>
                                    )
                                })}
                            </select>
                            {CreateSizeFormik.touched.unit && CreateSizeFormik.errors.unit && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.unit}</div>
                            )}
                        </div>
                    </div>
                </div>
               <div className='text-center mt-5 mb-4 pb-1'>
                 <button onClick={()=> navigate("/admin/size")} type='button' className='ds_user_cancel'>Cancel</button>
                 <button type='submit' className='ds_user_add'>Add</button>
               </div>
            </form>
            </div>
      </div>
    </div>
  )
}

export default AddSize
