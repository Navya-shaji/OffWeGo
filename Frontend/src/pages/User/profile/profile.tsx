import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useState } from "react";
import { Edit2 } from "lucide-react";

import Navbar from "@/components/profile/navbar";
import ProfileSidebar from "@/components/profile/sidebar";
import EditProfileModal from "./EditProfile";
import ChangePasswordModal from "./changePassword";
import BookingDetailsSection from "../Bookings/UserBookings";
import WalletManagement from "../wallet/userWallet";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [isEditOpen, setEditOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  const [activeSection, setActiveSection] = useState<
    "profile" | "bookings" | "wallet"
  >("profile");

  if (!user) return null;

  const getSectionTitle = () => {
    switch (activeSection) {
      case "profile": return "My Account";
      case "bookings": return "My Bookings";
      case "wallet": return "Wallet Management";
      default: return "My Account";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />

      <div className="w-full px-4 sm:px-6 lg:px-10 py-10">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-5 sm:p-8 lg:p-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
                <ProfileSidebar
                  activeSection={activeSection}
                  setActiveSection={(section: string) =>
                    setActiveSection(section as "profile" | "bookings" | "wallet")
                  }
                />
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-8 xl:col-span-9 min-w-0">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">{getSectionTitle()}</h1>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">


                {activeSection === "profile" && (
                  <div className="space-y-6">


                    <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-900 text-white shadow">
                          {user?.imageUrl ? (
                            <img src={user.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                              {user?.username?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">{user.username}</h2>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setEditOpen(true)}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>

                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-600">Name</p>
                        <p className="text-sm font-semibold text-gray-900">{user.username || "-"}</p>
                      </div>
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-600">Email account</p>
                        <p className="text-sm font-semibold text-gray-900">{user.email || "-"}</p>
                      </div>
                      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-600">Mobile number</p>
                        <p className="text-sm font-semibold text-gray-900">{user.phone || "-"}</p>
                      </div>
                      <div className="flex items-center justify-between px-5 py-4">
                        <p className="text-sm font-medium text-gray-600">Location</p>
                        <p className="text-sm font-semibold text-gray-900">{user.location || "India"}</p>
                      </div>
                    </div>


                    {/* Security Section - Hide for Google Users */}
                    {!user.isGoogleUser && (
                      <div className="pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">Password</h3>
                            <p className="text-sm text-gray-500">Change your account password</p>
                          </div>
                          <button
                            onClick={() => setPasswordModalOpen(true)}
                            className="px-6 py-2.5 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    )}


                  </div>
                )}

                {activeSection === "bookings" && <BookingDetailsSection embedded />}
                {activeSection === "wallet" && <WalletManagement embedded />}
              </div>
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