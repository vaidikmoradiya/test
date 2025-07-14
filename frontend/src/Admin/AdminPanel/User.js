import React, { useState, useEffect } from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import editImg from '../Image/Sujal/edit.svg'
import deleteImg from '../Image/Sujal/delete.svg'
import eye from '../Image/Savani/eye.svg'
import { Modal, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import profile from '../Image/Sujal/user.jpg'
import search from '../Image/Savani/search_icon.svg'
import { useDispatch, useSelector } from 'react-redux';
import { GetUserData, DeleteUserData } from '../../Redux-Toolkit/ToolkitSlice/User/UserSlice';

const User = () => {
    const dispatch = useDispatch();
    const { allUserData } = useSelector((state) => state.user);
    const [deleteShow, setDeleteShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();
    const [view, setView] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(GetUserData());
    }, [dispatch]);

    const Back_URL = 'http://localhost:5000/'

    const filteredUsers = allUserData.filter(user => 
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);
    console.log("sujuuu",currentUsers);
    

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handlePrev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleView = (user) => {
        setSelectedUser(user);
        setView(true);
    };

    const handleDelete = (user) => {
        setSelectedUser(user);
        setDeleteShow(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(DeleteUserData(selectedUser._id)).unwrap();
            setDeleteShow(false);
            dispatch(GetUserData()); // Refresh the user list after deletion
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const renderPagination = () => {
        let pages = [];

        pages.push(
            <div
                key="prev"
                className={`sp_pagination text-center ${currentPage === 1 ? "disabled" : ""}`}
                onClick={handlePrev}
            >
                <FaAngleLeft />
            </div>
        );

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
                pages.push(
                    <div
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`text-center ${currentPage === i ? "sp_pagination1" : "sp_pagination"}`}
                    >
                        {i}
                    </div>
                );
            } else if (
                (i === currentPage - 2 && currentPage > 3) ||
                (i === currentPage + 2 && currentPage < totalPages - 2)
            ) {
                pages.push(
                    <div key={`dots-${i}`} className="sp_pagination text-center">
                        ...
                    </div>
                );
            }
        }

        pages.push(
            <div
                key="next"
                className={`sp_pagination text-center ${currentPage === totalPages ? "disabled" : ""}`}
                onClick={handleNext}
            >
                <FaAngleRight />
            </div>
        );

        return pages;
    };

    return (
        <div className='sp_main pt-2'>
            <div className='d-flex flex-wrap justify-content-between align-items-center'>
                <div className='mt-3'>
                    <h4>User</h4>
                    <span><a className='sp_text_gray'>Dashboard</a><span> / User</span></span>
                </div>
                <div className='position-relative mt-3'>
                    <input 
                        type="text" 
                        className='ds_page_input' 
                        placeholder='Search...' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <img src={search} alt="" className='ds_page_icon' />
                </div>
            </div>
            <div className='sp_table overflow-x-auto'>
                <table className='w-100'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            {/* <th>Gender</th> */}
                            <th>Contact No</th>
                            <th className='sp_th_action'>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user, index) => (
                            <tr key={user._id}>
                                <td>{startIndex + index + 1}</td>
                                <td className='sp_table_img'>
                                    <img src={`${Back_URL}${user?.image}`} alt={user.firstName} />
                                </td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.email}</td>
                                {/* <td>{user.gender || 'N/A'}</td> */}
                                <td>{user.mobileNo || 'N/A'}</td>
                                <td>
                                    <div className='sp_table_action d-flex'>
                                        <div onClick={() => handleView(user)}>
                                            <img src={eye} alt="View" />
                                        </div>
                                        <div onClick={() => handleDelete(user)}>
                                            <img src={deleteImg} alt="Delete" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* PAGINATION CODE */}
            <div className="py-3 d-flex justify-content-center justify-content-md-end">
                {renderPagination()}
            </div>

            {/* Delete Modal */}
            <Modal
                show={deleteShow}
                onHide={() => setDeleteShow(false)}
                aria-labelledby="contained-modal-title-vcenter"
                className='sp_add_modal'
                centered
            >
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    <h4 className='text-center'>Delete</h4>
                    <div className='spmodal_main_div'>
                        <p className='mb-0 sp_text_gray text-center'>
                            Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}?
                        </p>
                    </div>
                    <div className='d-flex justify-content-center py-2 mt-sm-3 mt-3'>
                        <button onClick={() => setDeleteShow(false)} className='ds_user_cancel'>Cancel</button>
                        <button onClick={handleDeleteConfirm} className='ds_user_add'>Delete</button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* View User Modal */}
            <Modal 
                show={view} 
                onHide={() => setView(false)} 
                size="xl" 
                className='ds_viewuser_modal' 
                aria-labelledby="contained-modal-title-vcenter" 
                centered
            >
                <Modal.Header closeButton className='border-0 pb-0 px-sm-4'>
                    <h4 className='mb-0 text-center ps-2'>User</h4>
                </Modal.Header>
                <Modal.Body className='pt-0'>
                    <div className='px-sm-3 px-2'>
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-12 mt-4">
                                <div className='text-lg-start text-center'>
                                    <img 
                                        src={`${Back_URL}${selectedUser?.image}`}
                                        alt={selectedUser?.firstName} 
                                        className='ds_viewprofile_img' 
                                    />
                                </div>
                            </div>
                            <div className="col-xl-9 col-lg-9 col-12 px-2 mt-4">
                                <div className="row">
                                    <div className="col-xl-5 col-lg-5 col-md-5 col-5">
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-2'>First Name</p>
                                            <p className='mb-2'>:</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-7 col-lg-7 col-md-7 col-7">
                                        <div>
                                            <p className='ds_600 mb-2'>{selectedUser?.firstName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-5 col-lg-5 col-md-5 col-5">
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-2'>Last Name</p>
                                            <p className='mb-2'>:</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-7 col-lg-7 col-md-7 col-7">
                                        <div>
                                            <p className='ds_600 mb-2'>{selectedUser?.lastName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-5 col-lg-5 col-md-5 col-5">
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-2'>Email</p>
                                            <p className='mb-2'>:</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-7 col-lg-7 col-md-7 col-7">
                                        <div>
                                            <p className='ds_600 mb-2' style={{wordBreak:"break-all"}}>
                                                {selectedUser?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row">
                                    <div className="col-xl-5 col-lg-5 col-md-5 col-5">
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-2'>Gender</p>
                                            <p className='mb-2'>:</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-7 col-lg-7 col-md-7 col-7">
                                        <div>
                                            <p className='ds_600 mb-2'>{selectedUser?.gender || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div> */}
                                <div className="row">
                                    <div className="col-xl-5 col-lg-5 col-md-5 col-5">
                                        <div className='d-flex justify-content-between'>
                                            <p className='mb-2' style={{whiteSpace:'nowrap'}}>Contact No</p>
                                            <p className='mb-2'>:</p>
                                        </div>
                                    </div>
                                    <div className="col-xl-7 col-lg-7 col-md-7 col-7">
                                        <div>
                                            <p className='ds_600 mb-2'>{selectedUser?.mobileNo || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                                {selectedUser?.addresses?.map((address, index) => (
                                    <div className="row" key={index}>
                                        <div className="col-xl-5 col-lg-5 col-md-5 col-5">
                                            <div className='d-flex justify-content-between'>
                                                <p className='mb-2' style={{whiteSpace:'nowrap'}}>
                                                    Address ({address.addressType || 'N/A'})
                                                </p>
                                                <p className='mb-2'>:</p>
                                            </div>
                                        </div>
                                        <div className="col-xl-7 col-lg-7 col-md-7 col-7">
                                            <div>
                                                <p className='ds_600 mb-2'>{address.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default User;
