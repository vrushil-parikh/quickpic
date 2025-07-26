import React, { useEffect, useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';
import { FaShoppingBasket } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import AxiosToastError from '../utils/AxiosToastError';
import Axios from '../utils/Axios';

const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return strongPasswordRegex.test(password);
};

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validValue = Object.values(data).every(el => el) && isStrongPassword(data.newPassword);

  useEffect(() => {
    if (!(location?.state?.data?.success)) {
      navigate("/");
    }

    if (location?.state?.email) {
      setData((prev) => ({
        ...prev,
        email: location?.state?.email
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password must be same.");
      return;
    }

    if (!isStrongPassword(data.newPassword)) {
      toast.error("Password is not strong enough.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: data
      });

      if (response.data.error) {
        toast.error(response.data.message);
      }

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        setData({
          email: "",
          newPassword: "",
          confirmPassword: ""
        });
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-600 py-6 px-8 text-center">
            <div className="flex justify-center items-center gap-2">
              <FaShoppingBasket className="text-white text-3xl" />
              <h1 className="text-2xl font-bold text-white">Fresh Market</h1>
            </div>
            <p className="text-green-100 mt-1">Reset your password</p>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Create New Password</h2>
            <p className="text-gray-600 text-sm mb-6">
              Please create a new secure password for your account
              {location?.state?.email && <span className="block mt-1 font-medium">{location.state.email}</span>}
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={data.newPassword}
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
                {data.newPassword && !isStrongPassword(data.newPassword) && (
                  <p className="text-xs text-red-500 mt-1">
                    Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <FaRegEye size={18} /> : <FaRegEyeSlash size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!validValue || isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors mt-4 flex items-center justify-center
                  ${validValue && !isLoading
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"}`}
              >
                {isLoading ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-50 border-t text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
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

export default ResetPassword;
