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
    <aside className="w-full">

      {/* User Card */}
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 text-white shadow-lg mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 border border-white/20">
            {user?.imageUrl ? (
              <img src={user.imageUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold truncate">{user?.username}</h3>
            <p className="text-sm text-gray-300 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-white/20">
          <p className="text-xs text-gray-400 uppercase">Member Since</p>
          <p className="text-sm font-medium">January 2024</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.section;
            const Icon = item.icon;

            return (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition 
                  ${
                    isActive 
                      ? "bg-black text-white shadow" 
                      : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className={`text-xs ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                    {item.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-4 flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
