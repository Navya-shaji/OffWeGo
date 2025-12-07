import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getChatsOfUser } from "@/services/chat/chatService";
import { useSelector } from "react-redux";
import { socketContext } from "@/utilities/socket";
import type { RootState } from "@/store/store";
import type { IChat } from "@/interface/ChatInterface";
import { Search } from "lucide-react";

const IMG_URL = import.meta.env.VITE_IMAGE_URL;

const formatTime = (date: string | Date) => {
  const messageDate = new Date(date);
  const now = new Date();
  const diff = (now.getTime() - messageDate.getTime()) / 1000;

  if (diff < 60) return "now";
  if (diff < 3600) return Math.floor(diff / 60) + "m";
  if (diff < 86400) return Math.floor(diff / 3600) + "h";
  return messageDate.toLocaleDateString();
};

const VendorChatList = () => {
  const navigate = useNavigate();
  const { socket } = useContext(socketContext);

  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const vendorId = vendor?.id;

  const [chatUsers, setChatUsers] = useState<IChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vendorId) return;

    const loadChats = async () => {
      try {
        setLoading(true);

        const response = await getChatsOfUser(vendorId);

        const chats =
          response.data?.chats ||
          response.chats ||
          response.data ||
          [];

        setChatUsers(chats.map((c: IChat) => ({ ...c, isOnline: false })));
        setLoading(false);
      } catch (error) {
        console.error("Error loading vendor chats:", error);
        setLoading(false);
      }
    };

    loadChats();
  }, [vendorId]);

  // SOCKET: user online/offline status
  useEffect(() => {
    if (!socket) return;

    socket.on("user-status-changed", ({ userId, isOnline }) => {
      setChatUsers((prev) =>
        prev.map((chat) =>
          chat._id === userId ? { ...chat, isOnline } : chat
        )
      );
    });

    return () => {
      socket.off("user-status-changed");
    };
  }, [socket]);

  const openChat = (userId: string) => {
    navigate(`/vendor/chat/${userId}_${vendorId}`);
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Chats</h1>
        <Search className="w-5 h-5 text-gray-400" />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center text-gray-400 py-4">
          Loading chats...
        </div>
      )}

      {/* Empty State */}
      {!loading && chatUsers.length === 0 && (
        <div className="text-center text-gray-400 py-6">
          No chats available.
        </div>
      )}

      {/* Chat List */}
      <div className="space-y-3">
        {chatUsers.map((chat) => (
          <motion.div
            key={chat._id}
            whileTap={{ scale: 0.97 }}
            onClick={() => openChat(chat._id!)}
            className="flex items-center gap-4 p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#333] cursor-pointer transition"
          >
            {/* Avatar */}
            <div className="relative">
              <img
                src={IMG_URL + chat.profile_image || "/default-avatar.png"}
                alt={chat.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) =>
                  ((e.target as HTMLImageElement).src = "/default-avatar.png")
                }
              />
              {chat.isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2a2a2a]" />
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1">
              <h3 className="text-md font-medium truncate">{chat.name}</h3>
              <p className="text-sm text-gray-400 truncate">
                {chat.lastMessage || "Start a conversation"}
              </p>
            </div>

            {/* Time */}
            {chat.lastMessageAt && (
              <span className="text-xs text-gray-500">
                {formatTime(chat.lastMessageAt)}
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VendorChatList;
