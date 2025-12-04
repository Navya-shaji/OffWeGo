// ProfileSidebar.tsx
import {
  User,
  Calendar,
  LogOut,
  Wallet,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface ProfileSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const ProfileSidebar = ({ activeSection, setActiveSection }: ProfileSidebarProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const sidebarItems = [
    { icon: User, label: "Profile Settings", section: "profile", desc: "Manage your account" },
    { icon: Calendar, label: "My Bookings", section: "bookings", desc: "View booking history" },
    { icon: Wallet, label: "Wallet", section: "wallet", desc: "Manage your balance" },
    { icon: MessageCircle, label: "Messages", section: "chat", desc: "Chat with support" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-full lg:w-80">
      {/* User Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-white shadow-lg mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-2 border-white/20 flex-shrink-0">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{user?.username}</h3>
            <p className="text-sm text-gray-300 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 uppercase tracking-wider">Member Since</p>
          <p className="text-sm font-medium mt-1">January 2024</p>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Navigation</h2>
        </div>
        
        <nav className="p-3">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.section;
            const Icon = item.icon;

            return (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-lg transition-all group mb-1.5
                  ${
                    isActive
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{item.label}</p>
                  <p className={`text-xs truncate ${isActive ? "text-gray-300" : "text-gray-500"}`}>{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 flex-shrink-0" />
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
