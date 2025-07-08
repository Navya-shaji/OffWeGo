import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    navigate("/admin/login");
  };

  return (
    <div className="bg-white shadow-sm border-b px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        </div>
        <div className="flex items-center space-x-4 relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-gray-400">🔍</span>
            </div>
          </div>
          <Bell className="w-5 h-5 text-gray-600" />

          <div
            className="flex items-center space-x-2 cursor-pointer relative"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Admin</span>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-32 bg-white shadow-lg border rounded-lg z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
