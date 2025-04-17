import React, { useEffect, useRef, useState } from 'react';
import { FaShoppingBasket } from "react-icons/fa";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const OtpVerification = () => {
    const [data, setData] = useState(["","","","","",""]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const inputRef = useRef([]);
    const location = useLocation();

    useEffect(() => {
        if(!location?.state?.email) {
            navigate("/forgot-password");
        }
    }, []);

    const validValue = data.every(el => el);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await Axios({
                ...SummaryApi.forgot_password_otp_verification,
                data: {
                    otp: data.join(""),
                    email: location?.state?.email
                }
            });
            
            if(response.data.error) {
                toast.error(response.data.message);
            }

            if(response.data.success) {
                toast.success(response.data.message);
                setData(["","","","","",""]);
                navigate("/reset-password", {
                    state: {
                        data: response.data,
                        email: location?.state?.email
                    }
                });
            }
        } catch (error) {
            AxiosToastError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e, index) => {
        // Handle backspace key
        if (e.key === "Backspace" && !data[index] && index > 0) {
            inputRef.current[index - 1].focus();
        }
    };

    const handleChange = (e, index) => {
        const value = e.target.value;
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;
        
        const newData = [...data];
        newData[index] = value;
        setData(newData);

        // Auto-focus to next input if value is entered
        if (value && index < 5) {
            inputRef.current[index + 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        
        // Check if pasted content is all digits
        if (!/^\d+$/.test(pastedData)) return;
        
        const pastedChars = pastedData.split('').slice(0, 6);
        const newData = [...data];
        
        pastedChars.forEach((char, index) => {
            if (index < 6) newData[index] = char;
        });
        
        setData(newData);
        
        // Focus on the appropriate input after paste
        if (pastedChars.length < 6) {
            inputRef.current[pastedChars.length].focus();
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
                        <p className="text-green-100 mt-1">Verify your account</p>
                    </div>
                    
                    {/* Form section */}
                    <div className="p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">OTP Verification</h2>
                        <p className="text-gray-600 text-sm mb-6">
                            Enter the 6-digit code sent to {location?.state?.email ? 
                            <span className="font-medium">{location.state.email}</span> : 
                            "your email"}
                        </p>
                        
                        <form className="space-y-6" onSubmit={handleSubmit} onPaste={handlePaste}>
                            <div>
                                <div className="flex items-center justify-between gap-2">
                                    {data.map((element, index) => (
                                        <input
                                            key={`otp${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            autoFocus={index === 0}
                                            ref={(ref) => {
                                                inputRef.current[index] = ref;
                                                return ref;
                                            }}
                                            value={data[index]}
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            maxLength={1}
                                            className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-3 text-center">
                                    Didn't receive code? <button type="button" className="text-green-600 font-medium hover:text-green-800">Resend</button>
                                </p>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={!validValue || isLoading} 
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center
                                    ${validValue && !isLoading 
                                        ? "bg-green-600 hover:bg-green-700" 
                                        : "bg-gray-400 cursor-not-allowed"}`}
                            >
                                {isLoading ? "Verifying..." : "Verify OTP"}
                            </button>
                        </form>
                    </div>
                    
                    {/* Footer */}
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
    );
};

export default OtpVerification;