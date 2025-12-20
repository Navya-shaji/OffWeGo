import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import ChatHeader from "@/components/chat/header";
import MessageInput from "@/components/chat/messageinput";
import toast from "react-hot-toast";
import { findOrCreateChat, getMessages } from "@/services/chat/chatService";
import LoadingSpinner from "@/components/chat/spinner";
import type { Imessage } from "@/interface/MessageInterface";
import { socketContext } from "@/utilities/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useChatContext } from "@/context/chatContext";

const VendorMessageContainer = () => {
  const { chatId } = useParams();

  const ownerId = useSelector(
    (state: RootState) => state.vendorAuth.vendor?.id
  );

  const [userId, vendorId] = chatId?.split("_") || [];

  const { triggerSidebarRefetch } = useChatContext();

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const [chatInfo, setChatInfo] = useState({
    chatId: "",     // ✔ REAL chat ID
    userName: "",
    userAvatar: "",
    isOnline: false,
  });

  const roomId = chatId;
  const { socket } = useContext(socketContext);

  useEffect(() => {
    const fetchVendorChat = async () => {
      if (!userId || !ownerId) {
        toast.error("Invalid chat parameters");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // ✔ Get chat document from backend
        const chatData = await findOrCreateChat(userId, ownerId);

        if (!chatData?._id) throw new Error("Invalid chat data");

        // ✔ Store actual chatId
        setChatInfo({
          chatId: chatData._id,
          userName: chatData.name,
          userAvatar: chatData.profile_image,
          isOnline: chatData.isOnline,
        });

        // ✔ Load messages
        const response = await getMessages(chatData._id);
        setMessages(response.data?.messages || response.messages || []);

        setIsLoading(false);
      } catch (err: any) {
        toast.error(err.message || "Failed to load chat");
        setIsLoading(false);
      }
    };

    fetchVendorChat();
  }, [chatId, userId, ownerId]);

  // Socket listeners
  useEffect(() => {
    if (socket && !socket.connected) socket.connect();

    const handleReceiveMessage = (msg: Imessage) => {
      setMessages((prev) => [...prev, msg]);
      triggerSidebarRefetch();
    };

    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    const handleUserStatusChange = ({ userId: changed, isOnline }) => {
      if (changed === userId) {
        setChatInfo((p) => ({ ...p, isOnline }));
      }
    };

    socket.on("recive-message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("user-status-changed", handleUserStatusChange);

    socket.emit("join_room", { roomId, userId: ownerId });

    return () => {
      socket.off("recive-message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("user-status-changed", handleUserStatusChange);
      socket.emit("leave-room", { roomId, userId: ownerId });
    };
  }, [socket, userId, ownerId, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!chatInfo.chatId) {
      return toast.error("Chat not fully loaded");
    }

    const newMsg: Imessage = {
      _id: "",
      chatId: chatInfo.chatId,   // ✔ FIXED — REAL CHAT ID
      messageContent: message,
      senderId: ownerId!,
      senderType: "vendor",
      receiverId: userId!,
      seen: false,
      sendedTime: new Date(),
      messageType: "text",
    };

    socket.emit("send_message", newMsg, (id: string) => {
      setMessages((prev) => [...prev, { ...newMsg, _id: id }]);
    });

    setMessage("");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <ChatHeader
        user={{
          _id: chatInfo.chatId,
          name: chatInfo.userName,
          avatar: chatInfo.userAvatar,
          isOnline: chatInfo.isOnline,
          lastSeen: chatInfo.isOnline ? "Online" : "Offline",
        }}
        onBackClick={() => window.history.back()}
        showBackButton={true}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white chat-scrollbar relative">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const date = new Date(msg.sendedTime);

            const prev =
              index > 0 ? new Date(messages[index - 1].sendedTime) : null;
            const showSeparator =
              !prev || date.toDateString() !== prev.toDateString();

            return (
              <div key={msg._id || index}>
                {showSeparator && (
                  <div className="flex justify-center my-6">
                    <span className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full font-medium">
                      {date.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${
                    msg.senderId === ownerId ? "justify-end" : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-[280px] lg:max-w-md px-4 py-3 rounded-3xl shadow-md ${
                      msg.senderId === ownerId
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-lg"
                        : "bg-white border border-gray-200 rounded-bl-lg"
                    }`}
                  >
                    <p className="text-base break-words">
                      {msg.messageContent}
                    </p>

                    <div
                      className={`text-xs mt-1 text-right ${
                        msg.senderId === ownerId
                          ? "text-purple-100"
                          : "text-gray-500"
                      }`}
                    >
                      {date.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border px-6 py-5 rounded-3xl rounded-bl-lg shadow-md">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={handleSendMessage}
        inputRef={inputRef}
        roomId={roomId}
        disabled={isLoading}
      />
    </div>
  );
};

export default VendorMessageContainer;
