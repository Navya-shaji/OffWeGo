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
    { icon: User, label: "My Profile", section: "profile" },
    { icon: Calendar, label: "Booking", section: "bookings" },
    { icon: Wallet, label: "Wallet", section: "wallet" },
    { icon: MessageCircle, label: "Chat", section: "chat" },
    { icon: LogOut, label: "Logout", section: "logout" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <div className="flex flex-col items-center mb-8">
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          {user?.username || "Your name"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {user?.email || "your.email@gmail.com"}
        </p>
      </div>

      <nav className="space-y-1">
        {sidebarItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleNavigation(item.label)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
              activeSection === item.section
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
        ))}
      </nav>
    </div>
  );
};

export default ProfileSidebar;
