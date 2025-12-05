import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useState } from "react";
import { Mail, Phone, Lock, Edit2 } from "lucide-react";

import Navbar from "@/components/profile/navbar";
import ProfileSidebar from "@/components/profile/sidebar";
import EditProfileModal from "./EditProfile";
import ChangePasswordModal from "./changePassword";
import BookingDetailsSection from "../Bookings/UserBookings";
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

  const getSectionTitle = () => {
    switch (activeSection) {
      case "profile": return "Profile Settings";
      case "bookings": return "My Bookings";
      case "wallet": return "Wallet Management";
      case "chat": return "Messages & Support";
      default: return "My Account";
    }
  };

  const getSectionDescription = () => {
    switch (activeSection) {
      case "profile": return "Manage your personal information and security";
      case "bookings": return "View and manage your booking history";
      case "wallet": return "Track your balance and transactions";
      case "chat": return "Connect with our support team";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar
              activeSection={activeSection}
              setActiveSection={(section: string) =>
                setActiveSection(section as "profile" | "bookings" | "chat" | "wallet")
              }
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-900 text-white border shadow">
                  {user?.imageUrl ? (
                    <img src={user.imageUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-gray-900 truncate">{getSectionTitle()}</h1>
                  <p className="text-sm text-gray-600 truncate">{getSectionDescription()}</p>
                </div>
              </div>

              {activeSection === "profile" && (
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* MAIN DATA CARD */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="space-y-10">

                  {/* Personal Info */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Mail className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Email */}
                      <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow border">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase">Email Address</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow border">
                          <Phone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-500 uppercase">Phone Number</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Lock className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow border">
                          <Lock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase">Password</p>
                          <p className="text-sm font-semibold text-gray-900">••••••••</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setPasswordModalOpen(true)}
                        className="px-5 py-2 text-sm font-semibold text-gray-900 hover:text-white hover:bg-gray-900 rounded-lg border transition"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "bookings" && <BookingDetailsSection />}
              {activeSection === "wallet" && <WalletManagement />}
              {activeSection === "chat" && <ChatPage />}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setEditOpen(false)} />
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
};

export default Profile;
