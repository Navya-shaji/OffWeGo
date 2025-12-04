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

      <div className=" max-w-full mx-auto px-10 py-18">
        <div className="flex flex-col lg:flex-row gap-6">
          
    
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={(section: string) =>
              setActiveSection(section as "profile" | "bookings" | "chat" | "wallet")
            }
          />

    
          <div  >
     
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Profile Picture */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-gray-900 to-black border-2 border-gray-200 flex-shrink-0 shadow-lg">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl text-white font-bold">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                  </div>
         
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 truncate">{getSectionTitle()}</h1>
                    <p className="text-sm text-gray-600 truncate mt-0.5">{getSectionDescription()}</p>
                  </div>
                </div>
       
                {activeSection === "profile" && (
                  <button
                    onClick={() => setEditOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </button>
                )}
              </div>
            </div>

      
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              
           
              {activeSection === "profile" && (
                <div className="p-6">
           
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-5">
                      <Mail className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Email */}
                      <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0">
                          <Phone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Phone Number</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Security Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <Lock className="w-5 h-5 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">Security & Privacy</h3>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0">
                          <Lock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Password</p>
                          <p className="text-sm font-semibold text-gray-900">••••••••</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setPasswordModalOpen(true)}
                        className="px-5 py-2 text-sm font-semibold text-gray-900 hover:text-white hover:bg-gray-900 rounded-lg transition-colors border border-gray-300 flex-shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}

       
              {activeSection === "bookings" && (
                <div className="p-6">
                  <BookingDetailsSection />
                </div>
              )}

       
              {activeSection === "chat" && (
                <div className="p-6">
                  <ChatPage />
                </div>
              )}

              {activeSection === "wallet" && (
                <div className="p-6">
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