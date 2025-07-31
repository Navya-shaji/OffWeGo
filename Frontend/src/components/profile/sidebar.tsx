
import {
  User,
  History,
  Calendar,
  Wallet,
  Bell,
  MessageCircle,
  FileText,
  LogOut,
  ChevronRight
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import ImageUploader from "./uploadImage";

const ProfileSidebar = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const sidebarItems = [
    { icon: User, label: "My Profile", active: true },
    { icon: History, label: "Travel History" },
    { icon: Calendar, label: "Booking" },
    { icon: Wallet, label: "Wallet" },
    { icon: Bell, label: "Notifications" },
    { icon: MessageCircle, label: "Chat" },
    { icon: FileText, label: "Posts" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
  <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-xs">

  <div className="flex items-center space-x-4 mb-6">
    <div className="w-16 h-16 rounded-full overflow-hidden border border-gray-200">
      <ImageUploader />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">
        {user?.username || "Your name"}
      </h3>
      <p className="text-sm text-gray-500">
        {user?.email || "your.email@gmail.com"}
      </p>
    </div>
  </div>


  <nav className="space-y-1">
    {sidebarItems.map((item, index) => (
      <button
        key={index}
        className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
          item.active
            ? "bg-blue-100 text-blue-700 font-semibold"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
      >
        <div className="flex items-center space-x-3">
          <item.icon
            className={`w-5 h-5 ${
              item.active ? "text-blue-600" : "group-hover:text-gray-800"
            }`}
          />
          <span>{item.label}</span>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
      </button>
    ))}
  </nav>
</div>
)}

export default ProfileSidebar;
