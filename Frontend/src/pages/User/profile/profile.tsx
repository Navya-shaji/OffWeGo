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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="flex flex-col lg:flex-row mt-16">
        <div className="w-full lg:w-64 flex-shrink-0 bg-white border-r border-gray-200 shadow-sm">
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={(section: string) =>
              setActiveSection(section as "profile" | "bookings" | "wallet")
            }
          />
        </div>

        <div className="flex-1 min-w-0 bg-transparent p-4 sm:p-6 lg:p-8">
          {activeSection === "profile" && (
            <div className="max-w-5xl mx-auto">
            
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                <div className="relative h-40 bg-gradient-to-r from-black via-gray-500 to-white-600">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6bTAtNGgydjJoMnYtMmgtMnYtMmgtMnYyaC0ydjJoMnYtMnptLTJ2LTJoLTJ2MmgydjJ6bTAgMGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>

                  <div className="absolute -bottom-16 left-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                        {user?.imageUrl ? (
                          <img
                            src={user.imageUrl}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-4xl text-white font-bold">
                              {user?.username?.[0]?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                    </div>
                  </div>

                  <div className="absolute top-6 right-8">
                    <button
                      onClick={() => setEditOpen(true)}
                      className="px-6 py-2.5 bg-white/95 backdrop-blur-sm text-blue-600 text-sm font-semibold rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="pt-20 pb-8 px-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.username}
                  </h1>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Personal Info */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                      Personal Information
                    </h2>

                    <div className="space-y-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user?.username || ""}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Email Address
                        </label>
                        <input
                          type="text"
                          value={user?.email || ""}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={user?.phone || ""}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password Section */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                        Security
                      </h2>

                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Password
                        </label>
                        <div className="flex gap-3">
                          <input
                            type="password"
                            value="••••••••"
                            readOnly
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 text-sm font-medium"
                          />
                          <button
                            onClick={() => setPasswordModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-semibold rounded-xl hover:from-gray-800 hover:to-gray-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          Status
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          Active
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-3">
                      Your account is fully verified and active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "bookings" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <BookingDetailsSection />
            </div>
          )}
          {activeSection === "chat" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <ChatPage />
            </div>
          )}
          {activeSection === "wallet" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <WalletManagement />
            </div>
          )}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;
