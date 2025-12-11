import { useEffect, useState, useCallback } from "react";
import { markAllAsRead, markAsRead } from "@/store/slice/Notifications/notificationSlice";
import { Bell, X, Loader2, MessageCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, ReadNotification, type Notification as ServiceNotification } from "@/services/Notification/Notification";
import { getChatsOfUser, getMessages } from "@/services/chat/chatService";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  onUnreadCountChange?: (count: number) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ open, onClose, onUnreadCountChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ServiceNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedChats, setExpandedChats] = useState<Set<string>>(new Set());
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({});
  const [loadingMessages, setLoadingMessages] = useState<Set<string>>(new Set());

  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const user = useSelector((state: RootState) => state.auth.user);
  const isVendorAuthenticated = useSelector((state: RootState) => state.vendorAuth.isAuthenticated);
  const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Determine if we're on vendor side - prioritize vendor authentication
  const isVendor = (isVendorAuthenticated && vendor?.id) ? true : (isUserAuthenticated && user?.id) ? false : !!vendor?.id;

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications();
      console.log(data, "data");
      
      // Filter to only show vendor notifications if on vendor side
      const filteredData = isVendor 
        ? data.filter(n => n.recipientType === "vendor")
        : data.filter(n => n.recipientType === "user");
      
      setNotifications(filteredData);
      // Notify parent of unread count
      const unreadCount = filteredData.filter(n => !n.read).length;
      if (onUnreadCountChange) {
        onUnreadCountChange(unreadCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, [isVendor, onUnreadCountChange]);

  useEffect(() => {
    if (open) {
      loadNotifications();
    }
  }, [open, loadNotifications]);

  // Check if notification is a chat notification
  const isChatNotification = (notification: ServiceNotification): boolean => {
    return notification.title.toLowerCase().includes("new message from");
  };

  // Extract sender name from notification title
  const extractSenderName = (title: string): string => {
    const match = title.match(/New message from (.+)/i);
    return match ? match[1] : "";
  };

  // Load messages for a chat notification
  const loadChatMessages = async (notification: ServiceNotification) => {
    if (!isVendor || !vendor?.id) return;
    
    const senderName = extractSenderName(notification.title);
    if (!senderName) return;

    try {
      // Get all chats for the vendor
      const chatsResponse = await getChatsOfUser(vendor.id);
      const chats = chatsResponse?.data || chatsResponse || [];
      
      // Find chat with matching sender name
      const matchingChat = chats.find((chat: any) => {
        const chatName = chat.name || "";
        return chatName.toLowerCase().includes(senderName.toLowerCase()) ||
               senderName.toLowerCase().includes(chatName.toLowerCase());
      });

      if (matchingChat?._id) {
        const chatId = matchingChat._id;
        setLoadingMessages(prev => new Set(prev).add(notification._id));
        
        try {
          const messagesResponse = await getMessages(chatId);
          const messages = messagesResponse?.data?.messages || messagesResponse?.messages || messagesResponse || [];
          setChatMessages(prev => ({ ...prev, [notification._id]: messages }));
        } catch (err) {
          console.error("Error loading messages:", err);
        } finally {
          setLoadingMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(notification._id);
            return newSet;
          });
        }
      }
    } catch (err) {
      console.error("Error finding chat:", err);
    }
  };

  const toggleChatExpansion = (notification: ServiceNotification) => {
    const notificationId = notification._id;
    const isExpanded = expandedChats.has(notificationId);
    
    if (isExpanded) {
      setExpandedChats(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    } else {
      setExpandedChats(prev => new Set(prev).add(notificationId));
      // Load messages if not already loaded
      if (!chatMessages[notificationId]) {
        loadChatMessages(notification);
      }
    }
  };

  const handleOpenChat = async (notification: ServiceNotification) => {
    if (!isVendor || !vendor?.id) return;
    
    const senderName = extractSenderName(notification.title);
    if (!senderName) return;

    try {
      const chatsResponse = await getChatsOfUser(vendor.id);
      const chats = chatsResponse?.data || chatsResponse || [];
      
      const matchingChat = chats.find((chat: any) => {
        const chatName = chat.name || "";
        return chatName.toLowerCase().includes(senderName.toLowerCase()) ||
               senderName.toLowerCase().includes(chatName.toLowerCase());
      });

      if (matchingChat?._id) {
        navigate(`/vendor/chat/${matchingChat._id}`);
        onClose();
      }
    } catch (err) {
      console.error("Error opening chat:", err);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setNotifications(prev => {
        const updated = prev.map(n => (n.id === notificationId || n._id === notificationId) ? { ...n, read: true } : n);
        const unreadCount = updated.filter(n => !n.read).length;
        onUnreadCountChange?.(unreadCount);
        return updated;
      });
      console.log(notificationId,"idd")
      await ReadNotification(notificationId);
      
      dispatch(markAsRead(notificationId));
    } catch (err) {
      console.error("Failed to mark as read:", err);
      await loadNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, read: true }));
        if (onUnreadCountChange) {
          onUnreadCountChange(0);
        }
        return updated;
      });
   
      dispatch(markAllAsRead());

    } catch (err) {
      console.error("Failed to mark all as read:", err);
      await loadNotifications();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0bg-opacity-30 z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-50 
          ${open ? "translate-x-0" : "translate-x-full"}`}
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
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="mt-2 text-sm text-gray-500">Loading notifications...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={loadNotifications}
                className="mt-2 text-xs text-red-700 underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && notifications.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
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
                const isChat = isChatNotification(n);
                const isExpanded = expandedChats.has(n._id);
                const messages = chatMessages[n._id] || [];
                const isLoadingMsg = loadingMessages.has(n._id);

                return (
                  <div
                    key={n.id || n._id}
                    className={`p-4 rounded-lg shadow-sm border transition-all hover:shadow-md ${
                      n.read
                        ? "bg-white border-gray-200"
                        : "bg-blue-50 border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2 flex-1">
                        {isChat && <MessageCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{n.message}</p>
                    
                    {/* Chat Messages Section */}
                    {isChat && isVendor && (
                      <div className="mt-3 border-t border-gray-200 pt-3">
                        {isExpanded ? (
                          <div>
                            {isLoadingMsg ? (
                              <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                <span className="ml-2 text-xs text-gray-500">Loading messages...</span>
                              </div>
                            ) : messages.length > 0 ? (
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {messages.slice(-5).map((msg: any) => (
                                  <div
                                    key={msg._id}
                                    className={`p-2 rounded-lg text-xs ${
                                      msg.senderId === vendor?.id
                                        ? "bg-blue-100 ml-auto text-right"
                                        : "bg-gray-100 mr-auto text-left"
                                    }`}
                                  >
                                    <p className="text-gray-800">{msg.messageContent}</p>
                                    <p className="text-gray-500 text-[10px] mt-1">
                                      {new Date(msg.sendedTime).toLocaleTimeString(undefined, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                ))}
                                {messages.length > 5 && (
                                  <button
                                    onClick={() => handleOpenChat(n)}
                                    className="text-xs text-blue-600 hover:underline w-full text-center"
                                  >
                                    View all messages →
                                  </button>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500 text-center py-2">No messages found</p>
                            )}
                            <button
                              onClick={() => toggleChatExpansion(n)}
                              className="text-xs text-gray-600 hover:text-gray-800 mt-2"
                            >
                              Hide messages
                            </button>
                            <button
                              onClick={() => handleOpenChat(n)}
                              className="text-xs text-blue-600 hover:underline ml-3 mt-2"
                            >
                              Open chat →
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => toggleChatExpansion(n)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            Show messages
                          </button>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-400">
                        {new Date(n.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        {isChat && isVendor && !isExpanded && (
                          <button
                            onClick={() => handleOpenChat(n)}
                            className="text-xs text-blue-600 font-medium hover:underline"
                          >
                            Open chat
                          </button>
                        )}
                        {!n.read && (
                          <button
                            className="text-xs text-blue-600 font-medium hover:underline"
                            onClick={() => handleMarkAsRead(n.id || n._id || "")}
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Mark All as Read Button */}
              {unreadCount > 0 && (
                <button
                  className="w-full mt-4 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all as read
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};