import React, { useState } from 'react'
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";

const ForgotPassword = () => {
    const [data, setData] = useState({
        email: "",
    })
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target

        setData((preve) => {
            return {
                ...preve,
                [name]: value
            }
        })
    }

    const valideValue = Object.values(data).every(el => el)


    const handleSubmit = async(e)=>{
        e.preventDefault()

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password,
                data : data
            })
            
            if(response.data.error){
                toast.error(response.data.message)
            }

            if(response.data.success){
                toast.success(response.data.message)
                navigate("/verification-otp",{
                  state : data
                })
                setData({
                    email : "",
                })
                
            }

        } catch (error) {
            AxiosToastError(error)
        }



    }

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
             
                    {/* <button disabled={!valideValue} className={` ${valideValue ? "bg-green-800 hover:bg-green-700" : "bg-gray-500" }    text-white py-2 rounded font-semibold my-3 tracking-wide`}>Send Otp</button> */}
                    <button 
                                type="submit" 
                                disabled={!valideValue || isLoading} 
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center
                                    ${valideValue && !isLoading 
                                        ? "bg-green-600 hover:bg-green-700" 
                                        : "bg-gray-400 cursor-not-allowed"}`}
                            >
                                {isLoading ? "Sending OTP..." : "Send OTP"}
                            </button>
                </form>
                                        </div>
                <div className="px-8 py-4 bg-gray-50 border-t text-center">
                                        <p className="text-sm text-gray-600">
                                            Already have an account?{" "}
                                            <Link to="/login" className="font-semibold text-green-600 hover:text-green-800">
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                    </div>
            </div>
        </section>
    )
}

export default ForgotPassword


