import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Axios from '../utils/Axios'; // Assuming path is correct
import SummaryApi from '../common/SummaryApi'; // Assuming path is correct
import { logout } from '../store/userSlice'; // Assuming path is correct
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError'; // Assuming path is correct
import { HiOutlineExternalLink, HiOutlineUserCircle, HiOutlineCog, HiOutlineLogout, HiOutlineChevronDown, HiOutlineChevronRight, HiOutlineArchive, HiOutlineClipboardList, HiOutlineLocationMarker, HiOutlineBookOpen, HiOutlinePlusCircle, HiOutlineViewGrid, HiOutlineTicket } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'; // Assuming path is correct

const UserMenu = ({ close }) => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [adminOpen, setAdminOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await Axios({ ...SummaryApi.logout });
            if (response.data.success) {
                if (close) close();
                dispatch(logout());
                localStorage.clear(); // Consider if clearing all localStorage is intended
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    const handleCloseAndNavigate = (path) => {
        if (close) close();
        navigate(path);
    };

    const toggleAdminMenu = (e) => {
        e.stopPropagation(); // Prevent closing the menu if clicking the toggle
        setAdminOpen(prev => !prev);
    };

    const menuLinkClasses = "flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-md transition-colors duration-150 cursor-pointer";
    const adminMenuLinkClasses = "flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors duration-150 cursor-pointer";

    return (
        <div className="w-64 bg-white rounded-lg shadow-lg p-4 flex flex-col gap-2">
            {/* User Info Section */}
            <div className="flex items-center gap-3 px-4 pt-2 pb-4 border-b border-gray-100">
                <HiOutlineUserCircle className="w-8 h-8 text-gray-400" />
                <div className="flex-1 overflow-hidden">
                    <div className='font-semibold text-gray-800 text-ellipsis whitespace-nowrap overflow-hidden'>
                        {user.name || user.mobile}
                        {user.role === "ADMIN" && <span className='text-xs text-orange-600 font-medium ml-1'>(Admin)</span>}
                    </div>
                    <Link 
                        onClick={() => handleCloseAndNavigate("/dashboard/profile")} 
                        to="/dashboard/profile" 
                        className='text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group'
                    >
                        <span>View Profile</span>
                        <HiOutlineExternalLink className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-150" />
                    </Link>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1 mt-2">
                {/* Admin Panel */} 
                {isAdmin(user.role) && (
                    <div className="flex flex-col gap-1">
                        <button
                            onClick={toggleAdminMenu}
                            className={`${menuLinkClasses} justify-between w-full group hover:bg-amber-50 hover:text-amber-700`}
                        >
                            <div className="flex items-center gap-3">
                                <HiOutlineCog className="w-5 h-5" />
                                <span>Admin Panel</span>
                            </div>
                            {adminOpen ? 
                                <HiOutlineChevronDown className="w-4 h-4 text-gray-400 group-hover:text-amber-600" /> : 
                                <HiOutlineChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                            }
                        </button>

                        {adminOpen && (
                            <div className='pl-7 flex flex-col gap-1 border-l-2 border-amber-100 ml-2 py-1'>
                                <Link onClick={() => handleCloseAndNavigate("/dashboard/category")} to="/dashboard/category" className={adminMenuLinkClasses}><HiOutlineArchive className="w-4 h-4"/>Category</Link>
                                <Link onClick={() => handleCloseAndNavigate("/dashboard/subcategory")} to="/dashboard/subcategory" className={adminMenuLinkClasses}><HiOutlineViewGrid className="w-4 h-4"/>Sub Category</Link>
                                <Link onClick={() => handleCloseAndNavigate("/dashboard/orders")} to="/dashboard/orders" className={adminMenuLinkClasses}><HiOutlineTicket className="w-4 h-4"/>Orders</Link>
                                <Link onClick={() => handleCloseAndNavigate("/dashboard/upload-product")} to="/dashboard/upload-product" className={adminMenuLinkClasses}><HiOutlinePlusCircle className="w-4 h-4"/>Upload Product</Link>
                                <Link onClick={() => handleCloseAndNavigate("/dashboard/admin-recipe")} to="/dashboard/admin-recipe" className={adminMenuLinkClasses}><HiOutlineBookOpen className="w-4 h-4"/>Admin Recipe</Link>
                                <Link onClick={() => handleCloseAndNavigate("/dashboard/product")} to="/dashboard/product" className={adminMenuLinkClasses}><HiOutlineClipboardList className="w-4 h-4"/>Product List</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Regular User Links */} 
                <Link onClick={() => handleCloseAndNavigate("/dashboard/recipes")} to="/dashboard/recipes" className={menuLinkClasses}>
                    <HiOutlineBookOpen className="w-5 h-5" />
                    <span>Recipes</span>
                </Link>
                <Link onClick={() => handleCloseAndNavigate("/dashboard/myorders")} to="/dashboard/myorders" className={menuLinkClasses}>
                    <HiOutlineClipboardList className="w-5 h-5" />
                    <span>My Orders</span>
                </Link>
                <Link onClick={() => handleCloseAndNavigate("/dashboard/address")} to="/dashboard/address" className={menuLinkClasses}>
                    <HiOutlineLocationMarker className="w-5 h-5" />
                    <span>Saved Addresses</span>
                </Link>
            </nav>

            {/* Logout Button */}
            <div className="mt-2 pt-3 border-t border-gray-100">
                <button 
                    onClick={handleLogout} 
                    className={`${menuLinkClasses} text-red-600 hover:bg-red-50 hover:text-red-700 w-full group`}
                >
                    <HiOutlineLogout className="w-5 h-5" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );
};

export default UserMenu;

