import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Navbar from "@/components/profile/navbar";
import EditProfileModal from "./EditProfile";
import { useState } from "react";
import ProfileSidebar from "@/components/profile/sidebar";
import BookingDetailsSection from "../Bookings/UserBookings";
import ChangePasswordModal from "./changePassword";
import WalletManagement from "../wallet/userWallet";
import ChatPage from "../chat/chat";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<
    "profile" | "bookings" | "chat" | "wallet"
  >("profile");

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="flex flex-col lg:flex-row mt-16">
        <div className="w-full lg:w-64 flex-shrink-0 bg-white border-r border-gray-200">
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={(section: string) =>
              setActiveSection(section as "profile" | "bookings" | "wallet")
            }
          />
        </div>

        <div className="flex-1 min-w-0 bg-gray-50 p-4 sm:p-6 lg:p-8">
        {activeSection === "profile" && (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    
    {/* Top Section */}
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-8 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* User Info */}
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">
                  {user?.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.username}
            </h1>
            <p className="text-gray-600 mt-1 break-all">{user?.email}</p>
          </div>
        </div>

        {/* Edit Button */}
        <button
          onClick={() => setEditOpen(true)}
          className="px-6 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>

    {/* Form Section */}
    <div className="p-6 space-y-6">

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={user?.username || ""}
          readOnly
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="text"
          value={user?.email || ""}
          readOnly
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="text"
          value={user?.phone || ""}
          readOnly
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
        />
      </div>

      {/* Password Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="flex gap-3">
          <input
            type="password"
            value="••••••••"
            readOnly
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 text-sm"
          />
          <button
            onClick={() => setPasswordModalOpen(true)}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  </div>
)}


          {activeSection === "bookings" && <BookingDetailsSection />}
          {activeSection === "chat" && <ChatPage />}
          {activeSection === "wallet" && <WalletManagement />}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
      />

      {/* Change Password Modal

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;