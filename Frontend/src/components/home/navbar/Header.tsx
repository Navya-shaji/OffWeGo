import React, { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { logout } from "@/store/slice/user/authSlice";
import logo from "../../../../public/images/logo.png";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log(storedUser);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    setIsUserDropdownOpen(false);
    window.location.reload();
  };

  const handleProfileClick = () => {
    setIsUserDropdownOpen(false);
    navigate("/profile");
  };

  return (
    <header className="bg-white backdrop-blur-sm shadow-sm sticky top-4 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center p-4">
            <img src={logo} alt="logo" className="w-35 h-10 mr-2" />
          </div>
          <nav className="hidden md:flex space-x-8">
            {[
              { name: "Home", path: "/" },
              { name: "Destinations", path: "/destinations" },
              { name: "Articles", path: "/articles" },
              { name: "Buddy Travel", path: "/buddy-travel" },
              // { name: "Search", path: "/search" },
            ].map((item) =>
              item.name === "Destinations" ? (
                <Link
                  key={item.name}
                  to={item.path} 
                  className="text-gray-700 hover:text-coral-500 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-coral-500 font-medium transition-colors"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-coral-500"
                  asChild
                >
                  <Link to="/login">Login</Link>
                </Button>
                <Button
                  className="bg-gradient-to-r from-coral-500 to-black text-white hover:from-coral-600 hover:to-black"
                  asChild
                >
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            ) : (
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-md transition-colors"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <span className="text-gray-700 font-medium">
                    Hello, {user?.username || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-48 z-20">
                    <button
                      onClick={handleProfileClick}
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

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {[
                "Home",
                "Destinations",
                "Articles",
                "Buddy Travel",
                
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-700 hover:text-coral-500 transition-colors py-2"
                >
                  {item}
                </a>
              ))}
              {!isAuthenticated ? (
                <div className="pt-4 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button
                    className="w-full bg-gradient-to-r from-coral-500 to-orange-500 text-white"
                    asChild
                  >
                    <Link to="/signup">Sign Up</Link>
                  </Button>
                </div>
              ) : (
                <div className="pt-4 space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2">
                    <span className="text-gray-700 font-medium">
                      Hello, {user?.username || "User"}
                    </span>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-coral-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
