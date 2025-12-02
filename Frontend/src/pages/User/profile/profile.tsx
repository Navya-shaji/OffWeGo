import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { useState } from "react";

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

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <Navbar />

      {/* Main Container with Sidebar and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={(section: string) =>
              setActiveSection(section as "profile" | "bookings" | "chat" | "wallet")
            }
          />

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100">
              <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
            </div>

            {/* USER INFO */}
            <div className="px-6 py-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-white font-bold">
                      {user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* ===================== PROFILE SECTION ===================== */}
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-600">Full Name</span>
                    <span className="text-sm text-gray-900">{user.username}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-600">
                      Email Address
                    </span>
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-600">
                      Phone Number
                    </span>
                    <span className="text-sm text-gray-900">{user.phone}</span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-600">Password</span>
                    <button
                      onClick={() => setPasswordModalOpen(true)}
                      className="text-sm font-semibold text-blue-600 hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setEditOpen(true)}
                      className="w-full bg-black text-white py-3 rounded-xl font-semibold transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}

              {/* ===================== BOOKINGS SECTION ===================== */}
              {activeSection === "bookings" && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <BookingDetailsSection />
                </div>
              )}

              {/* ===================== CHAT SECTION ===================== */}
              {activeSection === "chat" && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <ChatPage />
                </div>
              )}

              {/* ===================== WALLET SECTION ===================== */}
              {activeSection === "wallet" && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                  <WalletManagement />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <EditProfileModal isOpen={isEditOpen} onClose={() => setEditOpen(false)} />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;