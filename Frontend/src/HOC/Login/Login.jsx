import { FaLock, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import Button from "../../Components/Button";
import Captcha from "../Captcha/Captcha";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import apiService from "../../../apiService";
import axios from "axios";
import { setLocale } from "yup";
import { useLoader } from "../../Context/LoaderContext";

const Login = () => {
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [error, setError] = useState(null);
  const [captchaKey, setCaptchaKey] = useState(0);
  const { setLoading } = useLoader();
  const navigate = useNavigate();
  const [realPassword, setRealPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("");
  const [formData, setFormData] = useState({
    in_UserId: "",
    in_password: "",
  });
  const { login } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "in_password") {
      setRealPassword(value);
      setDisplayPassword(value);
    }
  };

  const handleBlur = () => {
    if (realPassword.length > 0) {
      setDisplayPassword("•".repeat(10));
    }
  };

  const handleFocus = () => {
    setDisplayPassword(realPassword);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!formData.in_UserId || !formData.in_password) {
      setError("Username and password are required.");
      return;
    }

    if (!isCaptchaValid) {
      setError("Invalid Captcha. Please try again.");
      return;
    }

    try {
      const res = await apiService.post(`login`, formData);
      console.log("Form Data:", formData);
      console.log("API Response:", res);

      // ❌ First check if login failed
      if (
        !res.data ||
        (res.data?.result?.out_ErrorCode !== 0 && !res.data.token)
      ) {
        setError(res.data?.message || "Invalid username or password.");
        setCaptchaKey((prev) => prev + 1); // 🔄 refresh captcha
        setIsCaptchaValid(false);
        return; // stop execution here
      }

      // ✅ Only destructure when login succeeded
      const { token, user, userConfig } = res.data;
      console.log("Login Successful! Proceeding...");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userConfig", JSON.stringify(userConfig));
      login(user, token, userConfig);

      if (user.otpValidate === "Y") {
        console.log("OTP Validated. Redirecting to Dashboard...");
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/dashboard";
      } else {
        window.location.href = "/dashboard";
        // navigate();
      }
    } catch (err) {
      console.error("Login API Error:", err);

      // Correctly read backend error message
      const backendMessage = err?.response?.data?.message;
      const fallbackMessage = err?.message?.includes("salt")
        ? "Invalid username or password."
        : backendMessage || err.message || "An error occurred";

      setError(fallbackMessage);
      setCaptchaKey((prev) => prev + 1); // 🔄 refresh captcha
      setIsCaptchaValid(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 py-6 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">Inward Outward</h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="in_UserId"
                  name="in_UserId"
                  placeholder="User Name"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.in_UserId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="in_password"
                  name="in_password"
                  placeholder="Enter Password"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  value={displayPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
              </div>
            </div>

            {/* Simplified Captcha Component */}
            <Captcha
              key={captchaKey}
              onValidate={(isValid) => setIsCaptchaValid(isValid)}
            />
            {error && <div className="error-message text-danger">{error}</div>}
            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
