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
import { Link } from 'react-router-dom';
import arrowdown from '../../Admin/Image/Savani/arrow.svg';

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

const handleSizeNameChange = (e) => {
  const value = e.target.value;
  const capitalized = value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
  CreateSizeFormik.setFieldValue('sizeName', capitalized);
}

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
  const unitOptions = [
    { value: '', label: 'Select Unit' },
    ...((Array.isArray(unitData) ? unitData : []).filter(el => el?.status).map(u => ({ value: u?._id || '', label: u?.unitName || '' })))
  ];

  return (
    <div>
      <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
            <div className='d-flex justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>Add Size</h4>
                   <p className='ds_text ds_font ds_cursor'><Link to="/admin/Dashboard" className='sp_text_gray'>Dashboard</Link> / <span onClick={()=>navigate("/admin/size")}>Size</span> <span style={{color:'rgba(20, 20, 20, 1)'}}> / Add Size</span></p>
                </div>
            </div>
            <div className='ds_user_box mt-2'>
              <form onSubmit={CreateSizeFormik.handleSubmit}>
                <div className="row">
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Main Category</label>
                            <div className='mt-2'>
                              <CustomSelect
                                options={mainCategoryOptions}
                                value={CreateSizeFormik?.values.mainCateId}
                                onChange={(val) => CreateSizeFormik.setFieldValue('mainCateId', val)}
                                placeholder="Select MainCategory"
                              />
                            </div>
                            {CreateSizeFormik.touched.mainCateId && CreateSizeFormik.errors.mainCateId && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.mainCateId}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Category</label>
                            <div className='mt-2'>
                              <CustomSelect
                                options={categoryOptions}
                                value={CreateSizeFormik?.values.cateName}
                                onChange={(val) => CreateSizeFormik.setFieldValue('cateName', val)}
                                placeholder="Select Category"
                              />
                            </div>
                            {CreateSizeFormik.touched.cateName && CreateSizeFormik.errors.cateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.cateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                          <label className='ds_login_label'>Sub Category</label>
                            <div className='mt-2'>
                              <CustomSelect
                                options={subCategoryOptions}
                                value={CreateSizeFormik?.values.SubcateName}
                                onChange={(val) => CreateSizeFormik.setFieldValue('SubcateName', val)}
                                placeholder="Select SubCategory"
                              />
                            </div>
                            {CreateSizeFormik.touched.SubcateName && CreateSizeFormik.errors.SubcateName && (
                                <div className="text-danger mt-1" style={{fontSize:"12px"}}>{CreateSizeFormik.errors.SubcateName}</div>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 px-3 mt-sm-4 mt-3">
                        <div className="form-group">
                              <label className='ds_login_label' >Size Name</label>
                              <input type="text" name='sizeName' value={CreateSizeFormik.values?.sizeName} onChange={handleSizeNameChange} onBlur={CreateSizeFormik.handleBlur} className="form-control ds_login_input mt-1" placeholder='Enter Size Name' id="exampleInputEmail1" aria-describedby="emailHelp"/>
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
                            <div className='mt-2'>
                              <CustomSelect
                                options={unitOptions}
                                value={CreateSizeFormik?.values.unit}
                                onChange={(val) => CreateSizeFormik.setFieldValue('unit', val)}
                                placeholder="Select Unit"
                              />
                            </div>
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
