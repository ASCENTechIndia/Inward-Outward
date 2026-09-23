import React, { useState } from "react";
import { User, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../Context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UserIconDropdown = ({ name = "",imageUrl = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, setUser, logout } = useAuth();

  const userId = user?.userId;
  const ulbId = user?.ulbId;
  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    localStorage.clear();
    try {
      const res = await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          in_UserId: String(userId), // use logged-in user's ID if available
          in_ipaddr: "23.3.1",
        }),
      });

      const data = await res.json();

      if (res.ok && data.errorCode === 9999) {
        console.log("Logout successful:", data.errorMessage);
        console.log("Logout successful");

        // Remove cookies on successful logout
        Cookies.remove("token", { path: "/" });
        Cookies.remove("username", { path: "/" });
        Cookies.remove("acccounttype", { path: "/" });
        localStorage.removeItem("username", { path: "/" });
        localStorage.removeItem("token", { path: "/" });
        localStorage.removeItem("deptid", { path: "/" });
        localStorage.removeItem("ulbId", { path: "/" });
        localStorage.clear();
        // Redirect
        // Redirect to home page
        logout(); // ✅ use the one from context
        setUser(null);
      } else {
        console.warn("Logout API responded with an error:", data);
      }
    } catch (err) {
      console.error("Error calling logout API:", err);
    } finally {
      logout(); // Always clear local state and redirect
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Icon/Button */}
      <div
        onClick={toggleDropdown}
        className="cursor-pointer rounded-full border border-gray-300 p-1 w-10 h-10 flex items-center justify-center bg-gray-100"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="User"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <User className="text-gray-600" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="User"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-10 h-10 text-gray-500" />
              )}
            </div>
            <div>
              <div className="font-semibold text-sm">{userId}</div>
              <div className="text-xs text-gray-500">{name}</div>
            </div>
          </div>

          <div className="py-2">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2 text-red-600 hover:cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserIconDropdown;
