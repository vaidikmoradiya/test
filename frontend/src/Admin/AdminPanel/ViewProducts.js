import React, { useState, useEffect } from 'react'
import steel from '../Image/Savani/steel.png'
import right from '../Image/Savani/right.png'
import round from '../Image/Savani/round.png'
import back from '../Image/Savani/back.png'
import vertical from '../Image/Savani/vertical.png'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { GetSingleProductData } from '../../Redux-Toolkit/ToolkitSlice/User/ProductSlice'

const Back_URL = 'http://localhost:5000/'

const ViewProducts = () => {

const [image, setImage] = useState("")
const navigate = useNavigate()
const editid = localStorage.getItem("Getid")
const dispatch = useDispatch()
const singleProductData = useSelector((state)=> state?.product?.GetSingleProductData)
console.log("njnvjkgnbjb",singleProductData);

// Function to extract filename from path
const getFileName = (path) => {
    const fullPath = path.split('\\').pop() || path.split('/').pop() || path;
    // Remove timestamp part (numbers followed by dash) from filename
    return fullPath.replace(/^\d+-/, '');
}

useEffect(()=>{
    dispatch(GetSingleProductData(editid))
},[])

// Set default image when data loads
useEffect(() => {
    if (singleProductData && singleProductData.length > 0 && singleProductData[0].productImage && singleProductData[0].productImage.length > 0) {
        setImage(singleProductData[0].productImage[0])
    }
}, [singleProductData])


  return (
    <div className='px-sm-4 px-3 mx-sm-3 sp_height'>
        <div className='d-flex flex-wrap justify-content-between mt-sm-4 mt-3'>
                <div>
                   <h4 className='ds_600 mb-0'>View Products</h4>
                   <p className='ds_text ds_font ds_cursor'>Dashboard  <span onClick={()=> navigate("/admin/product")}>/  Product </span> <span style={{color:'rgba(20, 20, 20, 1)'}}>  / View Products</span></p>
                </div>
        </div>
        <div className='ds_view_main'>
            <div className="row">
                <div className="col-xl-3 col-lg-8 col-md-9 col-sm-9 px-4 mt-4">
                    <div>
                        <img src={image ? `${Back_URL}${image}` : steel} alt="" className='w-100 ds_view_img' />
                        <div className='d-flex justify-content-between flex-wrap '>
                            {singleProductData && singleProductData.length > 0 && singleProductData[0].productImage && singleProductData[0].productImage.map((img, index) => (
                                <div key={index} onClick={()=> setImage(img)} className='mt-3 ds_cursor me-2'>
                                    <img src={`${Back_URL}${img}`} alt={getFileName(img)} className='ds_view_mini_img' />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-xl-9 col-lg-12 px-4 mt-4">
                    <div className='overflow-x-auto'>
                    {singleProductData?.map((item, index) => (
                      <table key={index} className='ds_viewWare_table w-100'>
                        <tbody>
                            <tr>
                                <td className='ds_first_td'>Main Category</td>
                                <td className='ds_second_td'>{item.mainCategoryData[0].mainCategoryName}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Category</td>
                                <td className='ds_second_td'>{item.categoryData[0].categoryName}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Sub Category</td>
                                <td className='ds_second_td'>{item.subCategoryData[0].subCategoryName}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Product Name</td>
                                <td className='ds_second_td'>{item.productName}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Size Name</td>
                                <td className='ds_second_td'>{item.sizeData[0].sizeName}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Size</td>
                                <td className='ds_second_td'>{item.size}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Unit</td>
                                <td className='ds_second_td'>{item.unit}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Stock Status</td>
                                <td className='ds_second_td'>{item.stockStatus ? 'In Stock' : 'Out of Stock'}</td>
                            </tr>

                            <tr>
                                <td className='ds_first_td' >Price</td>
                                <td className='ds_second_td'>₹ {item.price}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Discount</td>
                                <td className='ds_second_td'>{item.discount}%</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Short Description</td>
                                <td className='ds_second_td'>{item.shortDescription}</td>
                            </tr>
                            <tr>
                                <td className='ds_first_td' >Description</td>
                                <td className='ds_second_td'>{item.description}</td>
                            </tr>
                            </tbody>
                        </table>  
                    ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ViewProducts
