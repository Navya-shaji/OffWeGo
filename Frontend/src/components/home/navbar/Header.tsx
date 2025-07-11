// src/components/Header.tsx
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Link } from "react-router-dom";
import { logout, setUserFromSession } from "@/store/slice/user/authSlice";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // On initial mount, restore user from localStorage (or session storage)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUserFromSession({ user: JSON.parse(storedUser) }));
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    window.location.reload(); // Optional: or use navigate("/login")
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-extrabold font-serif bg-gradient-to-r from-coral-500 to-black bg-clip-text text-transparent">
            OffeGo
          </h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {["Home", "Destinations", "Articles", "Buddy Travel", "Search"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-700 hover:text-coral-500 font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" className="text-gray-700 hover:text-coral-500" asChild>
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
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  Hello, {user?.username || "User"}
                </span>
                {user?.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              {["Home", "Destinations", "Articles", "Buddy Travel", "Search"].map((item) => (
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
                  <Button variant="ghost" className="w-full justify-start" asChild>
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
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-medium">
                      Hello, {user?.username || "User"}
                    </span>
                    {user?.imageUrl && (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                  </div>
                  <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
                    Logout
                  </Button>
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
