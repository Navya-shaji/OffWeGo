import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "@/components/chat/header";
import MessageInput from "@/components/chat/messageinput";
import LoadingSpinner from "@/components/chat/spinner";
import { useChatContext } from "@/context/chatContext";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const MessageContainer = () => {
  const { chatId } = useParams();
  const [urlUserId, urlVendorId] = chatId?.split("_") || [];

  const user = useSelector((state: RootState) => state.auth.user);
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const currentUserId = user?.id || vendor?.id;

  const {
    messages,
    currentChat,
    loading,
    selectChat,
    sendMessage,
    isTyping
  } = useChatContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageContent, setMessageContent] = useState("");

  // Initialize chat when URL changes
  useEffect(() => {
    if (urlUserId && urlVendorId && currentUserId) {
      if (urlUserId.toString() === currentUserId.toString()) {
        // I am the user, so the other ID is the vendor
        selectChat(currentUserId, urlVendorId);
      } else if (urlVendorId.toString() === currentUserId.toString()) {
        // I am the vendor, so the other ID is the user
        // selectChat expects (myId, otherId) which translates to (actualUserId, actualVendorId) inside checking isVendor
        // Wait, selectChat's args are (myId, otherId).
        // If I am vendor: myId = VendorID, otherId = UserID.
        selectChat(currentUserId, urlUserId);
      } else {
        console.warn("URL IDs do not match Current User ID", {
          urlUserId, urlVendorId, currentUserId
        });
      }
    }
  }, [chatId, urlUserId, urlVendorId, currentUserId, selectChat]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim()) return;

    await sendMessage(messageContent);
    setMessageContent("");
  };

  if (loading && !currentChat) {
    return <LoadingSpinner />;
  }

  // If no chat selected yet (or loading), show spinner or empty
  if (!currentChat) {
    return <div className="flex-1 bg-[#e9edef]" />;
  }

  return (
    <div className="flex flex-col h-full bg-[#e9edef]">
      {/* Chat Header */}
      <ChatHeader
        user={{
          _id: currentChat._id || "",
          name: currentChat.name,
          avatar: currentChat.profile_image,
          isOnline: currentChat.isOnline,
          lastSeen: currentChat.isOnline ? "Online" : "Offline",
        }}
        onBackClick={() => window.history.back()}
        showBackButton={true}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#e9edef] relative min-h-0 chat-scrollbar">
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

            const isMyMessage = message.senderId === currentUserId;

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
                  className={`flex ${isMyMessage ? "justify-end" : "justify-start"
                    } mb-2`}
                >
                  <div
                    className={`max-w-[300px] lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${isMyMessage
                      ? "bg-[#d9fdd3] text-gray-900 rounded-br-lg"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-lg"
                      }`}
                  >
                    <p className="text-base leading-relaxed break-words">
                      {message.messageContent}
                    </p>
                    <div
                      className={`flex items-center justify-end mt-2 space-x-1 text-xs ${isMyMessage
                        ? "text-gray-600"
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
              <div className="bg-white border border-gray-200 px-6 py-4 rounded-2xl rounded-bl-lg max-w-xs shadow-sm">
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
        message={messageContent}
        setMessage={setMessageContent}
        onSend={handleSendMessage}
        inputRef={inputRef}
        disabled={loading}
        roomId={currentChat._id || ""}
      />
    </div>
  );
};

export default MessageContainer;
