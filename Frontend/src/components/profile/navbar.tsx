import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "@/store/store";
import { logout } from "@/store/slice/user/authSlice";
import logo from "../../../public/images/logo.png";
import { ChevronDown, Menu, X } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    setIsProfileDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white-50 backdrop-blur-sm shadow-sm sticky top-4 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="logo" className="w-35 h-10 mr-2"  />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
          
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-coral-500 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-coral-500 to-black text-white px-4 py-2 rounded-md hover:from-coral-600 hover:to-black transition-colors"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                >
                  <span className="text-gray-700 font-medium">
                    Hello, {user.username}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-20">
                    <button
                      onClick={() => navigate("/profile")}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors border-t"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden py-4 border-t border-gray-200">
          <Link
            to="/"
            className="block px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/destinations"
            className="block px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
          >
            Destinations
          </Link>
          <Link
            to="/articles"
            className="block px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
          >
            Articles
          </Link>
          <Link
            to="/buddy-travel"
            className="block px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
          >
            Buddy Travel
          </Link>
          <Link
            to="/search"
            className="block px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
          >
            Search
          </Link>

          {!user ? (
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block w-full text-left px-3 py-2 bg-gradient-to-r from-coral-500 to-black text-white rounded-md hover:from-coral-600 hover:to-black transition-colors"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="pt-4 space-y-2">
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
