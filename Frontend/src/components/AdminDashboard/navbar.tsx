import React, { useState } from "react";
import { Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/hooks";
import { logout } from "@/store/slice/Admin/adminAuthSlice";

const Navbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login");
  };

  return (
    <div className="bg-white shadow-sm border-b px-8 py-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-sans text-gray-900">Overview</h1>
        </div>
        <div className="flex items-center space-x-4 relative">
          <div className="relative"></div>
          <Bell className="w-5 h-5 text-gray-600" />

          <div
            className="flex items-center space-x-2 cursor-pointer relative"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">Admin</span>

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
