import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { GetMainCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/MainCategorySlice';
import { GetSubCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SubCategorySlice';
import { useDispatch,useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { SizeSchema } from '../Formik'
import { GetCateData } from '../../Redux-Toolkit/ToolkitSlice/Admin/CategorySlice';
import { EditSizeData, GetSingleSizeData, GetSizeData } from '../../Redux-Toolkit/ToolkitSlice/Admin/SizeSlice';
import { GetUnitData } from '../../Redux-Toolkit/ToolkitSlice/Admin/UnitSlice';

const EditSize = () => {

  const mainCateData = useSelector((state)=> state?.mainCategory?.getMainCategoryData)
  const cateMap = useSelector((state)=> state?.category?.getCategoryData)
  const subCateData = useSelector((state)=> state?.subcategory?.getSubCategoryData)
  const unitData = useSelector((state)=> state?.unit?.getUnitData)
  const dispatch = useDispatch()
  const [editData, setEditData] = useState("")
  const editid = localStorage.getItem("Editid")
  const singleData = useSelector((state)=> state?.size?.getSingleSizeData)
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(()=>{
      dispatch(GetCateData())
      dispatch(GetMainCateData())
      dispatch(GetSubCateData())
      dispatch(GetSizeData())
      dispatch(GetUnitData())
      
      dispatch(GetSingleSizeData(editid))
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

const editsizeVal = {
  mainCateId: singleData?.mainCategoryId || "",
  cateName: singleData?.categoryId || "",
  SubcateName: singleData?.subCategoryId || "",
  sizeName: singleData?.sizeName || "",
  size: singleData?.size || "",
  unit: singleData?.unitId || "",
}

const EditSizeFormik = useFormik({
  enableReinitialize: true,
  initialValues:editsizeVal,
  validationSchema:SizeSchema,
  onSubmit:(values , action)=>{
      dispatch(EditSizeData({values, id:editid}))
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
    if (EditSizeFormik.values.mainCateId) {
      setFilteredCategories(
        cateMap?.filter(
          (cat) => cat.mainCategoryId === EditSizeFormik.values.mainCateId
        ) || []
      );
    } else {
      setFilteredCategories([]);
    }
  }, [EditSizeFormik.values.mainCateId, cateMap]);

  useEffect(() => {
    if (EditSizeFormik.values.cateName) {
      setFilteredSubCategories(
        subCateData?.filter(
          (subcat) => subcat.categoryId === EditSizeFormik.values.cateName
        ) || []
      );
    } else {
      setFilteredSubCategories([]);
    }
  }, [EditSizeFormik.values.cateName, subCateData]);

  return (
    <div>
      <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
            <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Edit Size</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard / <span onClick={()=>navigate("/admin/size")}>Size</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / Edit Size</span></p>
                </div>
            </div>
          <div className='ds_user_box mt-2'>
            <form onSubmit={EditSizeFormik.handleSubmit}>
                <div className="row">
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                        <label className='ds_login_label'>Main Category</label>
                            <select name='mainCateId' value={EditSizeFormik?.values.mainCateId} onChange={EditSizeFormik?.handleChange} onBlur={EditSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select MainCategory</option>
                                {mainCateData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.mainCategoryName}</option>
                                    )
                                })}
                            </select>
                            {EditSizeFormik.touched.mainCateId && EditSizeFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSizeFormik.errors.mainCateId}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                        <label className='ds_login_label'>Category</label>
                            <select name='cateName' value={EditSizeFormik?.values.cateName} onChange={EditSizeFormik?.handleChange} onBlur={EditSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.categoryName}</option>
                                    )
                                })}
                            </select>
                            {EditSizeFormik.touched.cateName && EditSizeFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSizeFormik.errors.cateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                        <label className='ds_login_label'>Sub Category</label>
                            <select name='SubcateName' value={EditSizeFormik?.values.SubcateName} onChange={EditSizeFormik?.handleChange} onBlur={EditSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Category</option>
                                {filteredSubCategories?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.subCategoryName}</option>
                                    )
                                })}
                            </select>
                            {EditSizeFormik.touched.SubcateName && EditSizeFormik.errors.SubcateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSizeFormik.errors.SubcateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                              <label className='ds_login_label' >Size Name</label>
                              <input type="text" name='sizeName' value={EditSizeFormik.values?.sizeName} onChange={EditSizeFormik?.handleChange} onBlur={EditSizeFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Size Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {EditSizeFormik.touched.sizeName && EditSizeFormik.errors.sizeName && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSizeFormik.errors.sizeName}</div>
                        )}
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                    <div className="form-group">
                              <label className='ds_login_label' >Size</label>
                              <input type="text" name='size' value={EditSizeFormik.values?.size} onChange={EditSizeFormik?.handleChange} onBlur={EditSizeFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Size' id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                        {EditSizeFormik.touched.size && EditSizeFormik.errors.size && (
                            <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSizeFormik.errors.size}</div>
                        )}
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                        <label className='ds_login_label'>Unit</label>
                            <select name='unit' value={EditSizeFormik?.values.unit} onChange={EditSizeFormik?.handleChange} onBlur={EditSizeFormik?.handleBlur} className='ds_user_select w-100 mt-2' style={{fontSize:"15px"}}>
                                <option value="">Select Unit</option>
                                {unitData?.map((element)=>{
                                    return(
                                        <option value={element?._id}>{element?.unitName}</option>
                                    )
                                })}
                            </select>
                            {EditSizeFormik.touched.unit && EditSizeFormik.errors.unit && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{EditSizeFormik.errors.unit}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='text-center mt-5 mb-4 pb-1'>
                  <button onClick={()=> navigate("/admin/size")} type='button' className='ds_user_cancel'>Cancel</button>
                  <button type='submit' className='ds_user_add'>Update</button>
                </div>
            </form>
          </div>
      </div>
    </div>
  )
}

export default EditSize
