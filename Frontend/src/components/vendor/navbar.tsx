import React, { useEffect } from "react";
import { Bell, CreditCard, User, ChevronDown, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logout } from "@/store/slice/vendor/authSlice";
import {NotificationPanel} from "../Notification/NotificationModal";
import { onMessageListener } from "@/Firebase/firebase";
import { addNotification } from "@/store/slice/Notifications/notificationSlice";

const VendorNavbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const notifications = useAppSelector(
  (state) => state.notifications.notifications
);


  // Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/vendor/login");
  };

  const handleSubscriptionPlans = () => {
    setDropdownOpen(false);
    navigate("/vendor/subscriptionplans");
  };

useEffect(() => {
  onMessageListener().then((payload) => {

    console.log("Message Received:", payload);  

    dispatch(
      addNotification({
        title: payload.notification?.title || "New Notification",
        body: payload.notification?.body || "",
      })
    );
  });
}, []);


  return (
    <>
      <header className="bg-white border-b border-gray-200 text-gray-900 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-semibold tracking-tight"></h1>

          <div className="flex items-center gap-6 relative">

            <button
              onClick={handleSubscriptionPlans}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-lg text-sm font-medium transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Explore Plans
            </button>

            {/* 🔔 Bell Button */}
            <div
              className="relative cursor-pointer"
              onClick={() => setPanelOpen(true)}
            >
              <Bell className="w-5 h-5 text-gray-700 hover:text-indigo-600 transition-all" />

              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* Profile Dropdown */}
            <div
              className="flex items-center gap-2 cursor-pointer relative select-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <User className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium">Vendor</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform text-gray-600 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
              />

              {dropdownOpen && (
                <div className="absolute right-0 top-10 w-40 bg-white text-gray-800 shadow-lg border border-gray-100 rounded-xl overflow-hidden z-50 animate-fadeIn">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-all"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <NotificationPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        notifications={notifications}
      />
    </>
  );
};

export default VendorNavbar;
