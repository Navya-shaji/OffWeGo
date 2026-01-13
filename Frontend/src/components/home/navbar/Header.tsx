import React, { useState, useEffect } from "react";
import { Bell, MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "@/store/slice/user/authSlice";
import { addNotification } from "@/store/slice/Notifications/notificationSlice";
import { NotificationPanel } from "../../Notification/NotificationModal";
import { useChatContext } from "@/context/chatContext";
import { messaging } from "@/Firebase/firebase";
import { onMessage } from "firebase/messaging";
const logo = "/images/logo.png";

interface HeaderProps {
  forceSolid?: boolean;
}

const Header: React.FC<HeaderProps> = ({ forceSolid = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [notificationUnreadCount, setNotificationUnreadCount] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { unreadChatCount } = useChatContext();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Destinations", path: "/destinations" },
    { name: "Travel Stories", path: "/posts" },
    { name: "About Us", path: "/about" },
    { name: "Partner with us", path: "/choose-role" },
  ];

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = onMessage(messaging, (payload) => {
      const title = payload.notification?.title || payload.data?.title || "New Notification";
      const body = payload.notification?.body || payload.data?.body || payload.data?.message || "";

      dispatch(addNotification({ title, body }));
      setNotificationUnreadCount((prev) => prev + 1);
    });

    return () => unsubscribe();
  }, [user?.id, dispatch]);

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
    <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${(isScrolled || forceSolid) ? "bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100" : "bg-transparent border-b border-transparent"}`}>
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center">
            <img
              src={logo}
              alt="logo"
              className={`h-12 w-auto cursor-pointer hover:scale-105 transition-all duration-300 ${!(isScrolled || forceSolid) ? "invert brightness-200" : ""}`}
              onClick={() => navigate("/")}
            />
          </div>
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 ${(isScrolled || forceSolid) ? "text-slate-800 hover:text-emerald-600" : "text-white hover:text-emerald-400 drop-shadow-md"}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  className={`transition-all duration-300 ${(isScrolled || forceSolid) ? "text-slate-700 hover:text-emerald-600" : "text-white hover:text-white/80"}`}
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
              <div className="flex items-center space-x-3">
                {/* Notifications Bell */}
                <div
                  className={`relative cursor-pointer p-2 rounded-lg transition-colors ${(isScrolled || forceSolid) ? "hover:bg-gray-100 text-slate-700" : "hover:bg-white/10 text-white"}`}
                  onClick={() => setPanelOpen(true)}
                >
                  <Bell className="w-5 h-5" />
                  {notificationUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-pulse">
                      {notificationUnreadCount > 99 ? "99+" : notificationUnreadCount}
                    </span>
                  )}
                </div>

                {/* Chat Icon */}
                <button
                  onClick={() => navigate("/chat")}
                  className={`relative p-2 rounded-md transition-colors ${(isScrolled || forceSolid) ? "hover:bg-gray-100 text-slate-700" : "hover:bg-white/10 text-white"}`}
                  title="Messages"
                >
                  <MessageCircle className="w-5 h-5" />
                  {(unreadChatCount ?? 0) > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                      {(unreadChatCount ?? 0) > 99 ? "99+" : unreadChatCount}
                    </span>
                  )}
                </button>

                <Button className={`${(isScrolled || forceSolid) ? "bg-black text-white hover:bg-emerald-600" : "bg-transparent border border-white/40 text-white hover:bg-white hover:text-black"} transition-all duration-500 rounded-none uppercase text-[10px] tracking-[0.2em] font-bold`} asChild>
                  <Link to="/posts/new">Share story</Link>
                </Button>
                <div className="relative">
                  <div
                    className={`flex items-center space-x-2 cursor-pointer px-3 py-2 rounded-md transition-colors ${(isScrolled || forceSolid) ? "hover:bg-gray-100 text-slate-700" : "hover:bg-white/10 text-white"}`}
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  >
                    <span className="font-medium">
                      Hello, {user?.username || "User"}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-colors ${(isScrolled || forceSolid) ? "text-slate-500" : "text-slate-200"}`} />
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
              </div>
            )}
          </div>

          <button
            className={`md:hidden transition-colors ${(isScrolled || forceSolid) ? "text-slate-900" : "text-white"}`}
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
          <div className="md:hidden py-4 border-t border-white/10 bg-white/80 backdrop-blur-2xl">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-coral-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
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
                  <Button
                    className="w-full bg-indigo-500 text-white"
                    asChild
                  >
                    <Link to="/posts/new" onClick={() => setIsMenuOpen(false)}>
                      Share story
                    </Link>
                  </Button>
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
      <NotificationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onUnreadCountChange={setNotificationUnreadCount}
      />
    </header>
  );
};

export default Header;
