import React, { useState } from 'react';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    
    const validValue = Object.values(data).every(el => el);
    
    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data
            });
            
            if(response.data.error) {
                toast.error(response.data.message);
            }
            
            if(response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);
                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));
                setData({
                    email: "",
                    password: "",
                });
                navigate("/");
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">
                {/* Card container */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header with logo */}
                    <div className="bg-green-600 py-6 px-8 text-center">
                        <div className="flex justify-center items-center gap-2">
                            <FaShoppingBasket className="text-white text-3xl" />
                            <h1 className="text-2xl font-bold text-white">QuickPick</h1>
                        </div>
                        <p className="text-green-100 mt-1">Groceries & recipes at your doorstep</p>
                    </div>
                    
                    {/* Form section */}
                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>
                        
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                                    required
                                />
                            </div>
                            
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                                    <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-800 font-medium">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={data.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                                        required
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(prev => !prev)} 
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                                    </button>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={!validValue || isLoading} 
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center
                                    ${validValue && !isLoading 
                                        ? "bg-green-600 hover:bg-green-700" 
                                        : "bg-gray-400 cursor-not-allowed"}`}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>
                    </div>
                    
                    {/* Footer */}
                    <div className="px-8 py-4 bg-gray-50 border-t text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-semibold text-green-600 hover:text-green-800">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;