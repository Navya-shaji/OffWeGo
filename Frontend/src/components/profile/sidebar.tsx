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

const ProfileSidebar = ({
  activeSection,
  setActiveSection,
}: ProfileSidebarProps) => {
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: User, label: "Account settings", section: "profile" },
    { icon: Calendar, label: "Bookings", section: "bookings" },
    { icon: Wallet, label: "Wallet", section: "wallet" },
    { icon: MessageCircle, label: "Chat", section: "chat" },
  ];

  const handleNavigation = (section: string) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside >
      <nav >
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.section;
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => handleNavigation(item.section)}
              className={`flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg mb-1 ${
                isActive
                  ? "text-gray-900 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="text-base">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <div >
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;