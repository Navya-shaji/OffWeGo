import {
  User,
  Calendar,
  LogOut,
  Wallet,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProfileSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ProfileSidebar = ({ activeSection, setActiveSection }: ProfileSidebarProps) => {
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: User, label: "Account settings", section: "profile" },
    { icon: Calendar, label: "Bookings", section: "bookings" },
    { icon: Wallet, label: "Wallet", section: "wallet" },
    { icon: MessageCircle, label: "Chat", section: "chat" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-full lg:w-72 bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
      {/* Sidebar Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Account</h2>
        <p className="text-sm text-gray-500">Manage your profile & bookings</p>
      </div>

      {/* Sidebar Navigation */}
      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.section;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => setActiveSection(item.section)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border transition-all
                ${
                  isActive
                    ? "bg-gray-900 text-white border-gray-900 shadow-md scale-[1.02]"
                    : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-8 mt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
