

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import Navbar from "@/components/profile/navbar";
import EditProfileModal from "./EditProfile";
import { useState } from "react";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("Redux user:", user);

  const [isEditOpen, setEditOpen] = useState(false);
  if (!user) return null;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="flex">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r bg-black px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm overflow-hidden">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="User Avatar"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl flex items-center justify-center h-full text-white font-bold">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">My Profile</h1>
                  <p className="text-blue-100">
                    Manage your account information
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="grid gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.username || ""}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 font-medium focus:outline-none focus:border-blue-400 transition-colors duration-200"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 font-medium focus:outline-none focus:border-blue-400 transition-colors duration-200"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={user?.phone || ""}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 font-medium focus:outline-none transition-colors duration-200"
                  />
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex-1 bg-gradient-to-r text-white px-6 py-3 rounded-xl font-semibold bg-black transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Edit Profile
                </button>
                <EditProfileModal
                  isOpen={isEditOpen}
                  onClose={() => setEditOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
