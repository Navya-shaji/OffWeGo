import { Bell, X, MessageCircle, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { fetchNotifications, ReadNotification } from "@/services/Notification/Notification";
import { toast } from "react-toastify";

export const UserNotificationModal = ({ open, onClose, onUnreadCountChange }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await fetchNotifications();
      const filtered = data.filter(n => n.recipientType === "user");

      setNotifications(filtered);
      onUnreadCountChange?.(filtered.filter(n => !n.read).length);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (open) loadNotifications();
  }, [open]);

  const markAsRead = async (notificationId: string) => {
    try {
      console.log("=== Mark as Read Debug ===");
      console.log("Notification ID:", notificationId);
      console.log("All notifications:", notifications);
      
      // Make the API call first
      const response = await ReadNotification(notificationId);
      console.log("API Response:", response);
      
      // Then update UI
      setNotifications(prev => {
        console.log("Previous notifications:", prev);
        const updated = prev.map(n => {
          const currentId = n.id || n._id;
          console.log(`Comparing ${currentId} with ${notificationId}:`, currentId === notificationId);
          return currentId === notificationId ? { ...n, read: true } : n;
        });
        console.log("Updated notifications:", updated);
        const unreadCount = updated.filter(n => !n.read).length;
        console.log("New unread count:", unreadCount);
        onUnreadCountChange?.(unreadCount);
        return updated;
      });
      
      toast.success("Marked as read");
    } catch (error) {
      console.error("=== Mark as Read Error ===");
      console.error("Error details:", error);
      console.error("Error message:", error?.message);
      console.error("Error response:", error?.response);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      
      const unreadNotifications = notifications.filter(n => !n.read);
    
      await Promise.all(
        unreadNotifications.map(n => ReadNotification(n.id || n._id))
      );
      
      // Update UI
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        onUnreadCountChange?.(0);
        return updated;
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to mark all as read");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/60 flex items-start justify-end p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mt-20 mr-4 overflow-hidden animate-slideInRight backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideInRight 0.3s ease-out"
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-gray-900 text-lg">Notifications</h2>
            {notifications.some(n => !n.read) && (
              <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <X
            className="w-5 h-5 text-gray-500 cursor-pointer hover:text-black transition"
            onClick={onClose}
          />
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-3 space-y-3">
          {/* Loading State */}
          {loading && (
            <div className="py-10 flex flex-col items-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <p className="text-sm mt-2 text-gray-500">Loading notifications...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && notifications.length === 0 && (
            <div className="py-14 text-center">
              <Bell className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-2">No notifications yet</p>
              <p className="text-xs text-gray-400">We'll notify you when something arrives</p>
            </div>
          )}

          {/* Notification Items */}
          {!loading &&
            notifications.map((n) => {
              const id = n.id || n._id;
              const isChat = n.title?.toLowerCase().includes("message");

              return (
                <div
                  key={id}
                  className={`p-4 rounded-xl shadow-md border transition hover:shadow-lg ${
                    n.read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2 items-start">
                      {isChat && (
                        <MessageCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{n.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                      </div>
                    </div>

                    {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>

                    {!n.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Button clicked for ID:", id);
                          markAsRead(id);
                        }}
                        className="text-xs text-blue-600 font-medium hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          {/* Mark All as Read Button */}
          {!loading && notifications.some(n => !n.read) && (
            <div className="px-3 pb-3">
              <button
                onClick={markAllAsRead}
                className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
              >
                Mark all as read
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};