import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useContext } from "react";
import ChatHeader from "@/components/chat/header";
import MessageInput from "@/components/chat/messageinput";
import toast from "react-hot-toast";
import { findOrCreateChat } from "@/services/chat/chatService";
import LoadingSpinner from "@/components/chat/spinner";
import type { Imessage } from "@/interface/MessageInterface";
import { socketContext } from "@/utilities/socket";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const VendorMessageContainer = () => {
  const { chatId } = useParams();
const ownerId=useSelector((state:RootState)=>state.vendorAuth.vendor?.id)
  // chatId format: userId_vendorId
  const [userId, vendorId] = chatId?.split("_") || [];
 const [isVendorOnline, setIsVendorOnline] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatData, setChatData] = useState<any>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { socket } = useContext(socketContext);
  const roomId = chatId;

  // Fetch existing chat messages
  useEffect(() => {
    const loadChat = async () => {
      if (!userId || !ownerId) {
        console.error("Missing userId or ownerId:", { userId, ownerId });
        setIsLoading(false);
        toast.error("Invalid chat parameters");
        return;
      }

      try {
        setIsLoading(true);

        setChatData({ _id: chatId });

        const response = await findOrCreateChat(userId, ownerId);
        setMessages(response.data?.messages || []);

        setIsLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load chat");
        setIsLoading(false);
      }
    };

    loadChat();
  }, [chatId, userId, ownerId]);

  // SOCKET LISTENERS
  useEffect(() => {
     if (socket && !socket?.connected) {
      socket.connect();
    }

    const handleConnected = (id: string) => {
      console.log("socket connected", id);
    };

    const handleReceiveMessage = (data: any) => {
      setMessages((prev) => [...prev, data]);
      triggerSidebarRefetch();
    };

    const handleTyping = () => {
      setIsTyping(true);
    };

    const handleStopTyping = () => {
      setIsTyping(false);
    };

    const handleUserStatusChange = ({
      userId: changedUserId,
      isOnline,
    }: {
      userId: string;
      isOnline: boolean;
    }) => {
      if (changedUserId === ownerId) {
        setIsVendorOnline(isOnline);
      }
    };

    socket.on("recive-message", handleReceiveMessage);
    socket.on("typing", handleTyping);
    socket.on("stop-typing", handleStopTyping);
    socket.on("user-status-changed", handleUserStatusChange);

    socket.emit("join_room", { roomId, userId });
    return () => {
      socket.off("connected", handleConnected);
      socket.off("recive-message", handleReceiveMessage);
      socket.off("typing", handleTyping);
      socket.off("stop-typing", handleStopTyping);
      socket.off("user-status-changed", handleUserStatusChange);
      socket.emit("leave-room", { roomId, userId });
    };
  }, [roomId, userId, ownerId, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEND MESSAGE
  const handleSendMessage = (e?: any) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    const newMsg: Imessage = {
      _id: "",
      chatId: vendorId,
      messageContent: message,
      senderId: vendorId,
      senderType: "vendor",
      receiverId: userId,
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

      {/* Chat Header */}
      <ChatHeader
        user={{
          _id: userId,
          name: "User",
          avatar: "",
          isOnline: true,
          lastSeen: "Online",
        }}
        onBackClick={() => window.history.back()}
        showBackButton={true}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white chat-scrollbar">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const messageDate = new Date(msg.sendedTime);

            return (
              <motion.div
                key={msg._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`flex ${
                    msg.senderId === vendorId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[280px] lg:max-w-md px-4 py-3 rounded-3xl shadow-md ${
                      msg.senderId === vendorId
                        ? "bg-purple-600 text-white rounded-br-lg"
                        : "bg-white border border-gray-200 rounded-bl-lg"
                    }`}
                  >
                    <p className="break-words">{msg.messageContent}</p>
                    <div className="text-xs text-right mt-1 opacity-70">
                      {messageDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <div className="text-gray-500 px-4 italic">typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput
        message={message}
        setMessage={setMessage}
        onSend={handleSendMessage}
        inputRef={inputRef}
        roomId={roomId}
      />
    </div>
  );
};

export default VendorMessageContainer;
function triggerSidebarRefetch() {
  throw new Error("Function not implemented.");
}

