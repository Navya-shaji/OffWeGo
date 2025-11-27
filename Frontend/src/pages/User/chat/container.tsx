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

const MessageContainer = () => {
  const { chatId } = useParams();

  // Extract user IDs from chat ID (format: userId_ownerId)
  const [userId, ownerId] = chatId?.split("_") || [];

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

  // Create consistent room ID by sorting user IDs
  const sortedIds = [userId, ownerId].sort();
  const roomId = chatId;
  const { socket } = useContext(socketContext);

  // FIXED: Single useEffect for initial data fetch
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !ownerId) {
        console.error("Missing userId or ownerId:", { userId, ownerId });
        setIsLoading(false);
        toast.error("Invalid chat parameters");
        return;
      }

      try {
        setIsLoading(true);

        console.log("Fetching chat for:", { userId, ownerId });

        // FIXED: findOrCreateChat already returns the unwrapped data
        const chatData = await findOrCreateChat(userId, ownerId);
        console.log("Chat data received:", chatData);

        if (!chatData || !chatData._id) {
          throw new Error("Invalid chat data received");
        }

        setUser(chatData);

        const chats = await getMessages(chatData._id);
        setMessages(chats.data?.messages || chats.messages || []);

        setIsLoading(false);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to load chat";
        console.error("Error fetching messages:", error);
        setIsLoading(false);
        toast.error(errorMessage);
      }
    };

    fetchMessages();
  }, [chatId, userId, ownerId]);

  // Socket connection and event handlers
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
        setIsUserOnline(isOnline);
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

  // Auto-scroll to bottom when messages change
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
      senderId: userId,
      senderType: "user",
      seen: false,
      sendedTime: new Date(),
      messageType: "text",
    };

    socket.emit(
      "send_message",
      { ...newMessage, receiverId: ownerId },
      (id: string) => {
        setMessages((prev) => ([...prev, {...newMessage, _id: id}]));
      }
    );
    // setMessages((prev) => [...prev, newMessage]);
    // setMessage("");
    // triggerSidebarRefetch();
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white relative min-h-0 chat-scrollbar">
        <AnimatePresence>
          {messages.map((message, index) => {
            const messageDate = new Date(message.sendedTime);
            const prevMessage = index > 0 ? messages[index - 1] : null;
            const prevMessageDate = prevMessage
              ? new Date(prevMessage.sendedTime)
              : null;

            const showDateSeparator =
              !prevMessage ||
              messageDate.toDateString() !== prevMessageDate?.toDateString();

            return (
              <div key={message._id || index}>
                {/* Date Separator */}
                {showDateSeparator && (
                  <div className="flex justify-center my-6">
                    <span className="bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full font-medium">
                      {messageDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${
                    message.senderId === userId
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                >
                  <div
                    className={`max-w-[280px] lg:max-w-md px-4 py-3 rounded-3xl shadow-md ${
                      message.senderId === userId
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-lg"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
                    }`}
                  >
                    <p className="text-base leading-relaxed break-words">
                      {message.messageContent}
                    </p>
                    <div
                      className={`flex items-center justify-end mt-2 space-x-1 text-xs ${
                        message.senderId === userId
                          ? "text-purple-100"
                          : "text-gray-500"
                      }`}
                    >
                      <span>
                        {messageDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </AnimatePresence>

        {/* Typing Indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 px-6 py-5 rounded-3xl rounded-bl-lg max-w-xs shadow-md">
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
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
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

export default MessageContainer;
