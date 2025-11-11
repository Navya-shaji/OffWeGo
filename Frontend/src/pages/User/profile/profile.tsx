import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Navbar from "@/components/profile/navbar";
import EditProfileModal from "./EditProfile";
import { useState } from "react";
import ProfileSidebar from "@/components/profile/sidebar";
import BookingDetailsSection from "../Bookings/UserBookings";
import UserAddReview from "./AddReview";
import ChangePasswordModal from "./changePassword"; 
import WalletManagement from "../wallet/userWallet";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
 const [activeSection, setActiveSection] = useState<
  "profile" | "bookings" | "create-review" | "wallet"
>("profile");


  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex gap-6 p-6 mt-16 max-w-7xl mx-auto">
        <div className="w-80 flex-shrink-0">
          <ProfileSidebar
            activeSection={activeSection}
            setActiveSection={(section: string) =>
              setActiveSection(section as "profile" | "bookings" |"wallet")
            }
          />
        </div>

        <div className="flex-1 min-w-0">
          {activeSection === "profile" && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-white font-bold">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">
                      My Profile
                    </h1>
                    <p className="text-gray-300">
                      Manage your account information
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user?.username || ""}
                      readOnly
                      className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-800 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      readOnly
                      className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-800 font-medium focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={user?.phone || ""}
                      readOnly
                      className="w-full px-4 py-3 border rounded-xl bg-gray-50 text-gray-800 font-medium focus:outline-none"
                    />
                  </div>

                  {/* Password Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="password"
                        value="••••••••"
                        readOnly
                        className="flex-1 px-4 py-3 border rounded-xl bg-gray-50 text-gray-800 font-medium focus:outline-none"
                      />
                      <button
                        onClick={() => setPasswordModalOpen(true)}
                        className="px-4 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-gray-700 transition-colors whitespace-nowrap"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    onClick={() => setEditOpen(true)}
                    className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 shadow-md"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "bookings" && <BookingDetailsSection />}
          {activeSection === "create-review" && <UserAddReview />}
          {activeSection === "wallet" && <WalletManagement />}

        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setEditOpen(false)}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </div>
  );
};

export default Profile;