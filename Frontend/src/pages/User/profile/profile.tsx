import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useState, useEffect, useMemo } from "react";
import { Edit2, Shield, Map, Award, Zap, Star, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "@/components/home/navbar/Header";
import EditProfileModal from "./EditProfile";
import ChangePasswordModal from "./changePassword";
import BookingDetailsSection from "../Bookings/UserBookings";
import WalletManagement from "../wallet/userWallet";
import { getUserBookings } from "@/services/Booking/bookingService";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [isEditOpen, setEditOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [bookingCount, setBookingCount] = useState(0);

  const [activeSection, setActiveSection] = useState<
    "profile" | "bookings" | "wallet"
  >("profile");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookings = await getUserBookings();
        setBookingCount(bookings?.length || 0);
      } catch (error) {
        console.error("Error fetching booking stats:", error);
      }
    };
    fetchStats();
  }, []);

  const badges = useMemo(() => {
    const list = [];
    if (bookingCount >= 0)
      list.push({
        icon: Compass,
        label: "Novice",
        desc: "Starting the journey",
        color: "bg-gray-100",
        threshold: 0,
      });
    if (bookingCount >= 1)
      list.push({
        icon: Map,
        label: "Explorer",
        desc: "First adventure",
        color: "bg-gray-200",
        threshold: 1,
      });
    if (bookingCount >= 5)
      list.push({
        icon: Zap,
        label: "Frequent",
        desc: "5+ Bookings",
        color: "bg-black text-white",
        threshold: 5,
      });
    if (bookingCount >= 10)
      list.push({
        icon: Award,
        label: "Elite",
        desc: "10+ Bookings",
        color: "bg-amber-400 text-black",
        threshold: 10,
      });
    if (bookingCount >= 20)
      list.push({
        icon: Star,
        label: "Legend",
        desc: "20+ Bookings",
        color: "bg-indigo-600 text-white",
        threshold: 20,
      });
    return list.slice(-3); // Show the top 3 earned badges
  }, [bookingCount]);

  if (!user) return null;

  const getSectionTitle = () => {
    switch (activeSection) {
      case "profile":
        return "Account Overview";
      case "bookings":
        return "My Travel History";
      case "wallet":
        return "Financial Hub";
      default:
        return "Account Overview";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header forceSolid />

      {/* Modern Hero & Profile Banner */}
      <div className="relative pt-20 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-br from-black via-gray-900 to-gray-800">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 mt-32 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-8 -mt-10 md:mt-0 relative">
              {/* Profile Image with Ring */}
              <div className="relative group">
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-gradient-to-tr from-gray-700 to-black shadow-2xl relative z-10 cursor-pointer overflow-hidden"
                  onClick={() => setIsPreviewOpen(true)}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-900 border-4 border-white">
                    {user?.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white bg-gradient-to-br from-gray-700 to-gray-900">
                        {user?.username?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full z-20">
                    <Zap className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
                <button
                  onClick={() => setEditOpen(true)}
                  className="absolute bottom-2 right-2 p-3 bg-black text-white rounded-full shadow-lg border border-gray-800 hover:scale-110 transition-transform z-30"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>

              {/* Informational Section */}
              <div className="flex-1 text-center md:text-left space-y-2 pb-2">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {user?.username}
                  </h1>
                  <span></span>
                </div>
                <p className="text-gray-500 font-medium flex items-center justify-center md:justify-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {user?.email}
                </p>
              </div>

              {/* Quick Actions / Stats */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveSection("wallet")}
                  className="hidden sm:flex flex-col items-center px-6 py-3 bg-gray-50 hover:bg-white rounded-2xl border border-gray-100 transition-all shadow-sm hover:shadow-md"
                >
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Balance
                  </span>
                </button>
                <button
                  onClick={() => setEditOpen(true)}
                  className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 hover:scale-[1.02] active:scale-95 transition-all text-sm"
                >
                  Edit Account
                </button>
              </div>
            </div>

            {/* Glass Navigation Tabs */}
            <div className="flex border-t border-gray-100/50 bg-gray-50/50">
              {(
                [
                  { id: "profile", label: "Overview", icon: Edit2 },
                  { id: "bookings", label: "Trip History", icon: Edit2 },
                  { id: "wallet", label: "Finances", icon: Edit2 },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex-1 py-5 text-sm font-bold transition-all relative ${activeSection === tab.id
                    ? "text-black"
                    : "text-gray-400 hover:text-black"
                    }`}
                >
                  {tab.label}
                  {activeSection === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-black rounded-full mx-8"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dynamic Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          {/* Main Workspace */}
          <div className="lg:col-span-12 space-y-8">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {getSectionTitle()}
              </h2>
            </div>

            <AnimatePresence mode="wait">
              {activeSection === "profile" ? (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid md:grid-cols-3 gap-8"
                >
                  {/* Personal Information Card */}
                  <div className="md:col-span-2 space-y-6">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                    >
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h3 className="text-xl font-extrabold text-gray-900">
                            Personal Data
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Basic information of your identity
                          </p>
                        </div>
                        <button
                          onClick={() => setEditOpen(true)}
                          className="p-3 text-white bg-black rounded-xl hover:bg-gray-800 transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-1.5 border-l-2 border-gray-100 pl-4">
                          <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            Full Name
                          </label>
                          <p className="text-lg font-bold text-gray-900">
                            {user?.username || "Not specified"}
                          </p>
                        </div>
                        <div className="space-y-1.5 border-l-2 border-gray-100 pl-4">
                          <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            Email Address
                          </label>
                          <p className="text-lg font-bold text-gray-900">
                            {user?.email}
                          </p>
                        </div>
                        <div className="space-y-1.5 border-l-2 border-gray-100 pl-4">
                          <label className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                            Phone Number
                          </label>
                          <p className="text-lg font-bold text-gray-900">
                            {user?.phone || "No contact linked"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Security Card */}
                    {!user?.isGoogleUser && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                      >
                        <div className="flex items-center gap-5 justify-between">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                              <Shield className="w-6 h-6 text-black" />
                            </div>
                            <div>
                              <h3 className="text-xl font-extrabold text-gray-900">
                                Privacy & Security
                              </h3>
                              <p className="text-sm text-gray-500">
                                Manage your access credentials
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setPasswordModalOpen(true)}
                            className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all text-sm"
                          >
                            Update Password
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Sidebar Stats / Info */}
                  <div className="space-y-6">
                    {/* Dynamic Badges based on Bookings */}
                    <motion.div
                      key="achievements"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                          <Award className="w-5 h-5 text-gray-400" />
                          Travel Badges
                        </h3>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full">
                          {bookingCount} Trips
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {badges.map((badge, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ y: -5, scale: 1.05 }}
                            className="flex flex-col items-center gap-2 group relative"
                          >
                            <div
                              className={`w-12 h-12 ${badge.color} rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300`}
                            >
                              <badge.icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-500">
                              {badge.label}
                            </span>

                            {/* Tooltip on hover */}
                            <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-transform bg-black text-white text-[9px] px-2 py-1 rounded whitespace-nowrap z-20">
                              {badge.desc}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Progress to next badge */}
                      <div className="mt-8 pt-6 border-t border-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Next Milestone
                          </span>
                          <span className="text-[10px] font-bold text-black">
                            {bookingCount} /{" "}
                            {bookingCount < 1
                              ? 1
                              : bookingCount < 5
                                ? 5
                                : bookingCount < 10
                                  ? 10
                                  : 20}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(
                                (bookingCount /
                                  (bookingCount < 1
                                    ? 1
                                    : bookingCount < 5
                                      ? 5
                                      : bookingCount < 10
                                        ? 10
                                        : 20)) *
                                100,
                                100
                              )}%`,
                            }}
                            className="h-full bg-black rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>

                    <div className="bg-gradient-to-br from-black via-gray-900 to-gray-800 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-white/10 transition-colors"></div>

                      <h3 className="text-lg font-bold mb-6 flex items-center gap-3 relative z-10">
                        <span className="w-1.5 h-6 bg-gray-400 rounded-full"></span>
                        Account Status
                      </h3>

                      <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:border-white/20 transition-all">
                          <span className="text-sm text-gray-400 font-medium tracking-tight">
                            Member Level
                          </span>
                          <span className="text-sm font-bold tracking-widest uppercase">
                            {bookingCount < 5
                              ? "Silver"
                              : bookingCount < 10
                                ? "Gold"
                                : bookingCount < 20
                                  ? "Platinum"
                                  : "Legendary"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : activeSection === "bookings" ? (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2rem] p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                >
                  <BookingDetailsSection embedded />
                </motion.div>
              ) : (
                <motion.div
                  key="wallet"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-[2rem] p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
                >
                  <WalletManagement embedded />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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

      {/* DP Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 md:p-10"
            onClick={() => setIsPreviewOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-md w-full aspect-square flex items-center justify-center p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-gray-950">
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    className="w-full h-full object-cover"
                    alt="Full Profile"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-7xl font-bold text-white bg-gradient-to-br from-gray-800 to-black">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute -top-10 -right-2 p-2 text-white hover:text-gray-300 transition-colors"
              >
                <Zap className="w-6 h-6 rotate-45" />
              </button>

              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
                  {user?.username}'s Profile Picture
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
