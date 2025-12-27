import React, { useEffect } from "react";
import { Bell, CreditCard, User, LogOut, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logout } from "@/store/slice/vendor/authSlice";
import {NotificationPanel} from "../Notification/NotificationModal";
import { useChatContext } from "@/context/chatContext";
import { addNotification } from "@/store/slice/Notifications/notificationSlice";
import { messaging } from "@/Firebase/firebase";
import { onMessage } from "firebase/messaging";

const VendorNavbar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [notificationUnreadCount, setNotificationUnreadCount] = React.useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const logo = "/images/logo.png";

  const vendor = useAppSelector((state) => state.vendorAuth.vendor);
  const { unreadChatCount } = useChatContext();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/vendor/login");
  };

  const handleSubscriptionPlans = () => {
    setDropdownOpen(false);
    navigate("/vendor/subscriptionplans");
  };

  // FCM Message Listener - Continuous listening using Firebase onMessage
  useEffect(() => {
    if (!vendor?.id) return;

    const unsubscribe = onMessage(messaging, (payload: any) => {
      console.log("📬 Vendor FCM Message Received:", payload);
      
      // Handle both notification and data payload
      const title = payload.notification?.title || payload.data?.title || "New Notification";
      const body = payload.notification?.body || payload.data?.body || payload.data?.message || "";

      dispatch(
        addNotification({
          title,
          body,
        })
      );
    });

    return () => {
      unsubscribe();
    };
  }, [vendor?.id, dispatch]);


  return (
    <>
      <header className="bg-white text-gray-900 z-30 h-[73px] w-full shadow-sm">
        <div className="flex items-center justify-between w-full px-6 h-full">
          {/* Logo Section */}
          <div className="flex items-center">
            <img 
              src={logo} 
              alt="OffWeGo" 
              className="w-32 h-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/vendor/profile")}
            />
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-4 relative">
            {/* 💬 Chat Button */}
            <button
              onClick={() => navigate("/vendor/chat")}
              className="relative p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Messages"
            >
              <MessageCircle className="w-5 h-5" />
              {(unreadChatCount ?? 0) > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gray-800 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1">
                  {(unreadChatCount ?? 0) > 99 ? '99+' : unreadChatCount}
                </span>
              )}
            </button>

            {/* 🔔 Bell Button */}
            <div
              className="relative cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setPanelOpen(true)}
            >
              <Bell className="w-5 h-5 text-gray-700" />

              {notificationUnreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gray-800 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1">
                  {notificationUnreadCount > 99 ? '99+' : notificationUnreadCount}
                </span>
              )}
            </div>

            {/* Profile Dropdown */}
            <div
              className="flex items-center gap-2 cursor-pointer relative select-none p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {vendor?.profileImage ? (
                <img 
                  src={vendor.profileImage.startsWith('http') ? vendor.profileImage : `${import.meta.env.VITE_IMAGE_URL}${vendor.profileImage}`}
                  alt={vendor?.name || "Vendor"} 
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = '';
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center" style={{display: vendor?.profileImage ? 'none' : 'flex'}}>
                <User className="w-5 h-5 text-gray-700" />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white text-gray-800 shadow-lg border border-gray-100 rounded-xl overflow-hidden z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{vendor?.name || "Vendor"}</p>
                    <p className="text-xs text-gray-500">{vendor?.email || ""}</p>
                  </div>
                  <button
                    onClick={handleSubscriptionPlans}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-all"
                  >
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    Explore Plans
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition-all"
                  >
                    <LogOut className="w-4 h-4 text-gray-600" />
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
        onUnreadCountChange={setNotificationUnreadCount}
      />
    </>
  );
};

export default VendorNavbar;
