import { useEffect, useState, useCallback } from "react";
import { Bell, X, Loader2, MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { fetchNotifications, ReadNotification, type Notification as ServiceNotification } from "@/services/Notification/Notification";
import type { RootState } from "@/store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getChatsOfUser } from "@/services/chat/chatService";

interface UserNotificationModalProps {
  open: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const UserNotificationModal: React.FC<UserNotificationModalProps> = ({ 
  open, 
  onClose, 
  onUnreadCountChange 
}) => {
  const [notifications, setNotifications] = useState<ServiceNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      console.warn("⚠️ No user ID found");
      setNotifications([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Loading user notifications for userId:", user.id);
      const data = await fetchNotifications();
      console.log("📬 Notifications fetched:", data);
      console.log("📬 Data type:", typeof data, "Is array:", Array.isArray(data));
      
      if (!Array.isArray(data)) {
        console.warn("⚠️ Data is not an array:", data);
        setNotifications([]);
        if (onUnreadCountChange) {
          onUnreadCountChange(0);
        }
        return;
      }

      // Filter for user notifications only
      // Backend already filters by recipientId and recipientType, so we can trust most data
      // But we'll do a lenient check to ensure type safety
      let userNotifications = data;
      
      // Only filter if we have data and need to ensure type safety
      if (data.length > 0) {
        userNotifications = data.filter(n => {
          const isUserNotification = n.recipientType === "user";
          
          if (!isUserNotification) {
            console.log("🔍 Filtered out notification (wrong type):", {
              id: n._id || n.id,
              recipientType: n.recipientType,
              expectedType: "user"
            });
          }
          
          // Only filter by type - trust backend for ID filtering
          return isUserNotification;
        });
      }

      console.log(`✅ Found ${userNotifications.length} user notifications out of ${data.length} total`);
      console.log("📊 User notifications sample:", userNotifications.slice(0, 3).map(n => ({
        id: n._id || n.id,
        title: n.title,
        message: n.message?.substring(0, 30),
        recipientType: n.recipientType,
        recipientId: n.recipientId,
        read: n.read
      })));

      console.log("✅ Setting notifications state with", userNotifications.length, "items");
      setNotifications(userNotifications);
      console.log("✅ State set - notifications should now display");
      
      const unreadCount = userNotifications.filter(n => !n.read).length;
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }
    } catch (err) {
      console.error("❌ Error loading notifications:", err);
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [user?.id, onUnreadCountChange]);

  useEffect(() => {
    if (open && user?.id) {
      loadNotifications();
    }
  }, [open, user?.id, loadNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await ReadNotification(notificationId);
      
      // Update the notification state optimistically
      setNotifications(prev => {
        const updated = prev.map(n => 
          (n._id === notificationId || n.id === notificationId) 
            ? { ...n, read: true } 
            : n
        );
        
        // Calculate new unread count
        const newUnreadCount = updated.filter(n => !n.read).length;
        if (onUnreadCountChange) {
          onUnreadCountChange(newUnreadCount);
        }
        
        return updated;
      });
      
      toast.success("Notification marked as read");
    } catch (err) {
      console.error("Error marking notification as read:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to mark notification as read";
      toast.error(errorMessage);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(n => ReadNotification(n._id || n.id || ""))
      );
      
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      if (onUnreadCountChange) {
        onUnreadCountChange(0);
      }
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Error marking all as read:", err);
      toast.error("Failed to mark all notifications as read");
    }
  };

  // Debug: Log when modal should render
  useEffect(() => {
    if (open) {
      console.log("🎨 UserNotificationModal - Modal opened", {
        notificationsCount: notifications.length,
        loading,
        error,
        userId: user?.id
      });
    }
  }, [open, notifications.length, loading, error, user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const isChatNotification = (notification: ServiceNotification): boolean => {
    return notification.title.toLowerCase().includes("new message from");
  };

  const extractSenderName = (title: string): string => {
    const match = title.match(/New message from (.+)/i);
    return match ? match[1] : "";
  };

  const handleOpenChat = async (notification: ServiceNotification) => {
    if (!user?.id) return;
    const senderName = extractSenderName(notification.title);
    if (!senderName) {
      navigate("/chat");
      onClose();
      return;
    }

    try {
      const chatsResponse = await getChatsOfUser(user.id, 'user');
      const chats = chatsResponse?.data || chatsResponse || [];
      const matchingChat = chats.find((chat: any) => {
        const chatName = (chat.name || "").toLowerCase();
        const target = senderName.toLowerCase();
        return chatName.includes(target) || target.includes(chatName);
      });

      if (matchingChat?._id) {
        navigate(`/chat/${matchingChat._id}`);
      } else {
        navigate("/chat");
      }

      onClose();
    } catch (err) {
      console.error("Error opening chat:", err);
      navigate("/chat");
      onClose();
    }
  };

  if (!open) return null;

  console.log("🎨 UserNotificationModal - Rendering modal", {
    open,
    notificationsCount: notifications.length,
    loading,
    error,
    userId: user?.id
  });

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 mb-1">Error loading notifications</p>
                  <p className="text-xs text-red-600 mb-3">{error}</p>
                  <button
                    onClick={loadNotifications}
                    className="text-xs text-red-700 hover:text-red-900 font-medium underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <Bell className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-500 text-center">No notifications yet</p>
              <p className="text-sm text-gray-400 text-center mt-1">
                We'll notify you when something arrives
              </p>
            </div>
          )}

          {/* Notifications List */}
          {!loading && !error && notifications.length > 0 && (
            <div className="p-4 space-y-3">
              {notifications.map((n) => {
                const notificationId = n._id || n.id || "";
                if (!notificationId) return null;

                const isChat = isChatNotification(n);

                return (
                  <div
                    key={notificationId}
                    className={`p-4 rounded-lg shadow-sm border transition-all hover:shadow-md ${
                      n.read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-3 flex-1">
                        {isChat && (
                          <MessageCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                            {!n.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{n.message}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>

                      <div className="flex items-center gap-2">
                        {isChat && (
                          <button
                            onClick={async () => {
                              if (!n.read) {
                                await handleMarkAsRead(notificationId);
                              }
                              await handleOpenChat(n);
                            }}
                            className="text-xs text-blue-600 font-medium hover:underline"
                          >
                            Open chat
                          </button>
                        )}

                        {!n.read && (
                          <button
                            onClick={() => handleMarkAsRead(notificationId)}
                            className="text-xs text-blue-600 font-medium hover:underline"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

