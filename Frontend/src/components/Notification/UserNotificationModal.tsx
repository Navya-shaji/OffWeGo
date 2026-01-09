import { useEffect, useState, useCallback } from "react";
import { Bell, X, Loader2, MessageCircle, CheckCircle, Calendar, Star, Heart, Gift, MapPin, User as UserIcon } from "lucide-react";
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
      const data = await fetchNotifications();
    
      
      if (!Array.isArray(data)) {
        console.warn("⚠️ Data is not an array:", data);
        setNotifications([]);
        if (onUnreadCountChange) {
          onUnreadCountChange(0);
        }
        return;
      }

      let userNotifications = data;
      
      if (data.length > 0) {
        userNotifications = data.filter(n => {
          const isUserNotification = n.recipientType === "user";
          return isUserNotification;
        });
      }


      setNotifications(userNotifications);
      
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
      
      setNotifications(prev => {
        const updated = prev.map(n => 
          (n._id === notificationId || n.id === notificationId) 
            ? { ...n, read: true } 
            : n
        );
        
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

  useEffect(() => {
    if (open) { /* empty */ }
  }, [open, notifications.length, loading, error, user?.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (title: string, message: string) => {
    const lowerTitle = title.toLowerCase();
    const lowerMessage = message.toLowerCase();
    
    if (lowerTitle.includes('new message') || lowerMessage.includes('message')) {
      return { icon: MessageCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' };
    }
    if (lowerTitle.includes('booking') || lowerMessage.includes('booking')) {
      if (lowerTitle.includes('confirmed') || lowerMessage.includes('confirmed')) {
        return { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' };
      }
      if (lowerTitle.includes('cancelled') || lowerMessage.includes('cancelled')) {
        return { icon: X, color: 'text-red-600', bgColor: 'bg-red-100' };
      }
      return { icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' };
    }
    if (lowerTitle.includes('payment') || lowerMessage.includes('payment')) {
      return { icon: Star, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    }
    if (lowerTitle.includes('review') || lowerMessage.includes('review')) {
      return { icon: Heart, color: 'text-pink-600', bgColor: 'bg-pink-100' };
    }
    if (lowerTitle.includes('offer') || lowerMessage.includes('offer') || lowerTitle.includes('deal')) {
      return { icon: Gift, color: 'text-orange-600', bgColor: 'bg-orange-100' };
    }
    if (lowerTitle.includes('destination') || lowerMessage.includes('destination')) {
      return { icon: MapPin, color: 'text-teal-600', bgColor: 'bg-teal-100' };
    }
    if (lowerTitle.includes('profile') || lowerMessage.includes('profile')) {
      return { icon: UserIcon, color: 'text-indigo-600', bgColor: 'bg-indigo-100' };
    }
    
    return { icon: Bell, color: 'text-gray-600', bgColor: 'bg-gray-100' };
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6 text-blue-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-blue-600 font-medium">{unreadCount} new notification{unreadCount > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-xl transition-all duration-200 group"
            >
              <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
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
            <div className="flex flex-col items-center justify-center py-20 px-6">
              <div className="relative">
                <Bell className="w-16 h-16 text-gray-300" />
                <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-30" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-gray-900">All caught up!</h3>
              <p className="text-gray-500 text-center mt-2 max-w-sm">
                You have no notifications right now. We'll notify you when something important happens.
              </p>
            </div>
          )}

          {/* Notifications List */}
          {!loading && !error && notifications.length > 0 && (
            <div className="p-4 space-y-4">
              {notifications.map((n) => {
                const notificationId = n._id || n.id || "";
                if (!notificationId) return null;

                const isChat = isChatNotification(n);
                const { icon: Icon, color, bgColor } = getNotificationIcon(n.title, n.message);

                return (
                  <div
                    key={notificationId}
                    className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                      n.read
                        ? "bg-white border-gray-100 hover:border-gray-200"
                        : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
                    }`}
                  >
                    {/* Unread indicator bar */}
                    {!n.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500" />
                    )}
                    
                    <div className="p-5">
                      <div className="flex gap-4">
                        {/* Icon */}
                        <div className={`p-3 rounded-xl ${bgColor} ${!n.read ? 'ring-2 ring-white shadow-sm' : ''} transition-all duration-200`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
                                {n.title}
                              </h4>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                {n.message}
                              </p>
                            </div>
                            {!n.read && (
                              <div className="flex-shrink-0 mt-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-400 font-medium">
                                {formatTimeAgo(n.createdAt)}
                              </p>
                              {isChat && (
                                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                                  Chat
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {isChat && (
                                <button
                                  onClick={async () => {
                                    if (!n.read) {
                                      await handleMarkAsRead(notificationId);
                                    }
                                    await handleOpenChat(n);
                                  }}
                                  className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  Open
                                </button>
                              )}

                              {!n.read && (
                                <button
                                  onClick={() => handleMarkAsRead(notificationId)}
                                  className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
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

