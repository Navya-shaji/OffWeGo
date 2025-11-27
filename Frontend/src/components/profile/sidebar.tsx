import {
  User,
  Calendar,
  LogOut,
  Wallet,
  MessageCircle,
  Home,
  Settings,
  Bell,
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
    { icon: Home, label: "Dashboard", section: "dashboard" },
    { icon: User, label: "My Profile", section: "profile" },
    { icon: Calendar, label: "Booking", section: "bookings" },
    { icon: Wallet, label: "Wallet", section: "wallet" },
    { icon: MessageCircle, label: "Chat", section: "chat" },
    { icon: Bell, label: "Notifications", section: "notifications" },
    { icon: Settings, label: "Settings", section: "settings" },
    { icon: LogOut, label: "Logout", section: "logout" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full">
      {/* Navigation Section */}
      <nav className="py-2">
        {sidebarItems.map((item, index) => {
          const isActive = activeSection === item.section;
          const Icon = item.icon;
          
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.label)}
              className={`w-full flex items-center gap-3 px-4 sm:px-6 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-500" : "text-gray-400"}`} />
              <span className={`text-sm font-medium truncate ${isActive ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileSidebar;