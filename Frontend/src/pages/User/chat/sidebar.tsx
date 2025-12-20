import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { useChatContext } from '@/context/chatContext';

const IMG_URL = import.meta.env.VITE_IMAGE_URL;

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatLastMessageTime = (date: Date | string) => {
  const now = new Date();
  const messageDate = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(messageDate.getTime())) {
    return 'now';
  }

  const diffInHours = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60));

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
    return diffInMinutes < 1 ? 'now' : `${diffInMinutes}m`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  }
};

const ChatSidebar = ({ isOpen, onClose }: ChatSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();

  const isVendorRoute = location.pathname.startsWith("/vendor");

  const user = useSelector((state: RootState) => state.auth.user);
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);

  const userId = isVendorRoute ? vendor?.id : user?.id;

  // Use Context
  const { chats, vendors, loading, error } = useChatContext();

  const [activeTab, setActiveTab] = useState<'chats' | 'vendors'>('chats');

  const currentChatUserId = chatId ? chatId.split('_').find(id => id !== userId) : null;

  const handleUserSelect = (chatUserId: string) => {
    const prefix = isVendorRoute ? '/vendor/chat' : '/chat';
    // Ensure format is always userId_vendorId
    const link = isVendorRoute ? `${chatUserId}_${userId}` : `${userId}_${chatUserId}`;
    navigate(`${prefix}/${link}`);
    onClose();
  };

  const handleVendorSelect = (vendorId: string) => {
    // Vendors are only selectable by users
    navigate(`/chat/${userId}_${vendorId}`);
    onClose();
  };

  if (!userId) {
    return (
      <div className="w-80 bg-[#1e1e1e] flex items-center justify-center">
        <p className="text-red-400">Please log in to view chats</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        w-full bg-[#1e1e1e] flex flex-col z-50 h-full
        lg:w-80 lg:relative lg:translate-x-0 lg:border-r lg:border-[#2f2f2f]
        fixed inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header with Tabs */}
        <div className="px-4 py-4 border-b border-[#2f2f2f] bg-[#1e1e1e] flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-medium text-white">Messages</h1>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2">
                <Search className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white hover:bg-[#2f2f2f] rounded-full p-2 lg:hidden"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-[#2a2a2a] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === 'chats'
                ? 'bg-[#007AFF] text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-[#3a3a3a]'
                }`}
            >
              Chats ({chats.length})
            </button>

            {/* Vendors tab removed intentionally as strict booking rules apply */}
          </div>
        </div>

        {/* Lists */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32 space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <p className="text-gray-400 text-sm">Loading...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32 px-4">
              <div className="text-center">
                <p className="text-red-400 text-sm mb-2">⚠️ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-400 text-sm hover:underline"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : activeTab === 'chats' ? (
            chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 px-4">
                <p className="text-gray-500 text-sm text-center">No chats available</p>
                <p className="text-gray-600 text-xs mt-2 text-center">
                  Start a conversation to see it here
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <motion.div
                  key={chat._id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleUserSelect(chat._id!)}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 border-b border-[#2f2f2f]/30 relative ${currentChatUserId === chat._id
                    ? 'bg-gradient-to-r from-[#007AFF]/10 to-[#007AFF]/5 border-r-2 border-r-[#007AFF] shadow-lg shadow-[#007AFF]/10'
                    : 'hover:bg-[#2a2a2a] active:bg-[#2f2f2f] hover:shadow-md'
                    }`}
                >
                  {currentChatUserId === chat._id && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-[#007AFF] rounded-r-full"></div>
                  )}
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          chat.profile_image
                            ? chat.profile_image.startsWith("http")
                              ? chat.profile_image
                              : `${IMG_URL}${chat.profile_image}`
                            : "/default-avatar.png"
                        }
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-avatar.png";
                        }}
                      />
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CAF50] rounded-full border-2 border-[#1e1e1e]"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-medium text-white truncate text-base">{chat.name}</h3>
                        {isVendorRoute && (
                          <span className="text-[10px] text-gray-400 block truncate ml-2">ID: {chat._id}</span>
                        )}
                        {chat.lastMessageAt && (
                          <span className="text-sm text-[#8E8E93] flex-shrink-0">
                            {formatLastMessageTime(chat.lastMessageAt)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-[#8E8E93] truncate">
                          {chat.lastMessage || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )
          ) : (
            // Vendors List
            vendors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 px-4">
                <p className="text-gray-500 text-sm text-center">No vendors available</p>
              </div>
            ) : (
              vendors.map((vendor) => (
                <motion.div
                  key={vendor.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleVendorSelect(vendor.id)}
                  className={`px-4 py-3 cursor-pointer transition-all duration-200 border-b border-[#2f2f2f]/30 relative hover:bg-[#2a2a2a] active:bg-[#2f2f2f] hover:shadow-md`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          vendor.profileImage
                            ? vendor.profileImage.startsWith("http")
                              ? vendor.profileImage
                              : `${IMG_URL}${vendor.profileImage}`
                            : "/default-avatar.png"
                        }
                        alt={vendor.name}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/default-avatar.png";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-medium text-white truncate text-base">{vendor.name}</h3>
                      </div>
                      <p className="text-sm text-[#8E8E93] truncate">
                        Tap to chat
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))
            )
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;