import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useState } from "react";
import {  Edit2 } from "lucide-react";

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
      case "profile": return "My Account";
      case "bookings": return "My Bookings";
      case "wallet": return "Wallet Management";
      case "chat": return "Messages & Support";
      default: return "My Account";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="flex gap-6 items-start">
  

  <div className="w-1/3 mt-15">
    <ProfileSidebar
      activeSection={activeSection}
      setActiveSection={(section: string) =>
        setActiveSection(section as "profile" | "bookings" | "chat" | "wallet")
      }
    />
  </div>


     
          <div className="flex-1 min-w-0">
            
         
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{getSectionTitle()}</h1>
            </div>

          
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

           
              {activeSection === "profile" && (
                <div className="space-y-8">

              
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-900 text-white shadow-lg">
                        {user?.imageUrl ? (
                          <img src={user.imageUrl} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user.username}</h2>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setEditOpen(true)}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>

  
                  <div className="space-y-6">
            
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={user.username || ""}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email account
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user.email || ""}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={user.phone || ""}
                          disabled
                          placeholder="Not provided"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Location Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={user.location || "India"}
                          disabled
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
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