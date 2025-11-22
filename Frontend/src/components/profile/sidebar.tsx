import {
  User,
  Calendar,
  LogOut,
  ChevronRight,
  Wallet,
  MessageCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";

interface ProfileSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ProfileSidebar = ({
  activeSection,
  setActiveSection,
}: ProfileSidebarProps) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const handleNavigation = (label: string) => {
    switch (label) {
      case "Booking":
        setActiveSection("bookings");
        break;
      case "My Profile":
        setActiveSection("profile");
        break;
      case "Wallet":
        setActiveSection("wallet");
        break;
      case "Chat":
        setActiveSection("chat");
        break;
      case "Logout":
        localStorage.removeItem("user");
        navigate("/login");
        break;
      default:
        break;
    }
  };

  const sidebarItems = [
    { icon: User, label: "My Profile", section: "profile", color: "from-blue-500 to-cyan-500" },
    { icon: Calendar, label: "Booking", section: "bookings", color: "from-purple-500 to-pink-500" },
    { icon: Wallet, label: "Wallet", section: "wallet", color: "from-emerald-500 to-teal-500" },
    { icon: MessageCircle, label: "Chat", section: "chat", color: "from-orange-500 to-rose-500" },
    { icon: LogOut, label: "Logout", section: "logout", color: "from-gray-700 to-gray-900" },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden sticky top-24 border border-gray-100">
      {/* Header Section with Gradient */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
        
        <div className="relative flex flex-col items-center">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
            {/* Online Indicator */}
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 rounded-full border-4 border-slate-900 shadow-lg"></div>
          </div>

          {/* User Info */}
          <div className="mt-4 text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {user?.username || "Your name"}
            </h2>
            <p className="text-sm text-white/70 mt-1 font-light">
              {user?.email || "your.email@gmail.com"}
            </p>
          </div>

          {/* Decorative Line */}
          <div className="mt-4 w-16 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item, index) => {
          const isActive = activeSection === item.section;
          const Icon = item.icon;
          
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.label)}
              className={`group w-full relative overflow-hidden transition-all duration-300 ${
                isActive
                  ? "scale-[1.02]"
                  : "hover:scale-[1.01]"
              }`}
            >
              {/* Background */}
              <div
                className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? `bg-gradient-to-r ${item.color} opacity-100`
                    : "bg-gray-50 opacity-0 group-hover:opacity-100"
                }`}
              ></div>

              {/* Content */}
              <div
                className={`relative flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Icon Container */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-white/20 shadow-lg"
                        : "bg-white group-hover:bg-white/50"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-all duration-300 ${
                        isActive
                          ? "text-white"
                          : `bg-gradient-to-br ${item.color} bg-clip-text text-transparent`
                      }`}
                    />
                  </div>

                  {/* Label */}
                  <span className="font-semibold text-base tracking-tight">
                    {item.label}
                  </span>
                </div>

                {/* Arrow */}
                <ChevronRight
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? "text-white translate-x-1"
                      : "text-gray-400 group-hover:translate-x-1 group-hover:text-gray-600"
                  }`}
                />
              </div>

              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-blue-50/30 border-t border-gray-100">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="font-medium">Account Active</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;