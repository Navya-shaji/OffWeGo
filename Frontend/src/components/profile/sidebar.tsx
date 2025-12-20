import {
  User,
  Calendar,
  LogOut,
  Wallet,
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
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-full space-y-5">

      {/* User Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-900 text-white border shadow">
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                {user?.username?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{user?.username}</h3>
            <p className="text-sm text-gray-600 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs font-medium text-gray-500 uppercase">Member Since</p>
          <p className="text-sm font-semibold text-gray-900 mt-1">January 2024</p>
        </div>
      </div>

      {/* Navigation List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        <nav className="p-2">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.section;
            const Icon = item.icon;

            return (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-lg transition-all mb-1
                  ${
                    isActive 
                      ? "bg-gray-900 text-white shadow-md" 
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  isActive ? "bg-white/10" : "bg-gray-50"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-semibold truncate">{item.label}</p>
                  <p className={`text-xs truncate ${isActive ? "text-gray-300" : "text-gray-500"}`}>
                    {item.desc}
                  </p>
                </div>
                <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isActive ? "opacity-100" : "opacity-40"}`} />
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
