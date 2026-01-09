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
    <aside className="w-full">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* User Card */}
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-900 text-white border shadow">
              {user?.imageUrl ? (
                <img src={user.imageUrl} alt={user.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{user?.username}</h3>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200" />

        {/* Navigation List */}
        <nav className="p-3">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.section;
            const Icon = item.icon;

            return (
              <button
                key={item.section}
                onClick={() => setActiveSection(item.section)}
                className={`group flex items-center justify-between w-full px-4 py-3 rounded-xl transition-colors mb-2 border
                  ${
                    isActive
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-800 border-transparent hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive ? "bg-white/10" : "bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium truncate">{item.label}</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 transition-opacity ${
                    isActive ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className="group flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Logout</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50 group-hover:opacity-80 transition-opacity" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
