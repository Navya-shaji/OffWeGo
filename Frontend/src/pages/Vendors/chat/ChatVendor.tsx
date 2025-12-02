import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import ChatHeader from "@/components/chat/header";
import MessageInput from "@/components/chat/messageinput";
import { findOrCreateChat, getMessages } from "@/services/chat/chatService";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/chat/spinner";
import { useChatContext } from "@/context/chatContext";
import type { Imessage } from "@/interface/MessageInterface";
import type { IChat } from "@/interface/ChatInterface";
import { socketContext } from "@/utilities/socket";

const VendorMessageContainer = () => {
  const { chatId } = useParams();

  // vendorId_userId format
  const [vendorId, userId] = chatId?.split("_") || [];

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<IChat>({
    _id: "",
    lastMessage: "",
    lastMessageAt: new Date(),
    name: "",
    profile_image: "",
    isOnline: false,
  });

  const [isUserOnline, setIsUserOnline] = useState(false);
  const { triggerSidebarRefetch } = useChatContext();
  const roomId = chatId;

  const { socket } = useContext(socketContext);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);

        const chatData = await findOrCreateChat(vendorId, userId, "vendor");
        setUser(chatData);

        const chats = await getMessages(chatData._id);
        setMessages(chats.data?.messages || chats.messages || []);

        setIsLoading(false);
      } catch (error: any) {
        toast.error("Failed to load chat");
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (socket && !socket.connected) {
      socket.connect();
    }

    socket.emit("join_room", { roomId, vendorId });

    socket.on("recive-message", (data: any) => {
      setMessages((prev) => [...prev, data]);
      triggerSidebarRefetch();
    });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));

    socket.on("user-status-changed", ({ userId: changedUserId, isOnline }) => {
      if (changedUserId === userId) setIsUserOnline(isOnline);
    });

    return () => {
      socket.emit("leave-room", { roomId, vendorId });
      socket.off("recive-message");
      socket.off("typing");
      socket.off("stop-typing");
      socket.off("user-status-changed");
    };
  }, [roomId, vendorId, userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Imessage = {
      _id: "",
      chatId: user._id!,
      messageContent: message,
      senderId: vendorId,
      senderType: "vendor", // <<<<<< CHANGE MADE HERE
      seen: false,
      sendedTime: new Date(),
      messageType: "text",
    };

    socket.emit(
      "send_message",
      { ...newMessage, receiverId: userId },
      (id: string) => {
        setMessages((prev) => [...prev, { ...newMessage, _id: id }]);
      }
    );

    setMessage("");
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader
        user={{
          _id: user._id || "",
          name: user.name,
          avatar: user.profile_image,
          isOnline: isUserOnline,
          lastSeen: isUserOnline ? "Online" : "Offline",
        }}
        onBackClick={() => window.history.back()}
        showBackButton={true}
      />

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence>
          {messages.map((message, index) => {
            const isVendor = message.senderId === vendorId;

            return (
              <motion.div
                key={message._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${isVendor ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[280px] px-4 py-3 rounded-3xl shadow-md ${
                    isVendor
                      ? "bg-blue-600 text-white rounded-br-lg"
                      : "bg-white text-gray-800 border rounded-bl-lg"
                  }`}
                >
                  {message.messageContent}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-3 rounded-2xl shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={handleSendMessage}
        inputRef={inputRef}
        disabled={isLoading}
        roomId={roomId}
      />
    </div>
  );
};

export default VendorMessageContainer;
