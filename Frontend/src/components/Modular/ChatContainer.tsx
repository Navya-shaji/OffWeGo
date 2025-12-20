import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, useContext } from "react";
import ChatHeader from "@/components/chat/header";
import MessageInput from "@/components/chat/messageinput";
import { findOrCreateChat, getMessages } from "@/services/chat/chatService";
import ChatBubble from "./chatBubble";
import DateSeparator from "./DateSeparator";
import TypingIndicator from "./TypingIndicator";
import LoadingSpinner from "@/components/chat/spinner";
import toast from "react-hot-toast";
import type { Imessage } from "@/interface/MessageInterface";
import { socketContext } from "@/utilities/socket";
import { useChatContext } from "@/context/chatContext";

interface ChatProps {
  chatId: string;       // userId_vendorId
  myId: string;         // vendorId OR userId
  myType: "user" | "vendor";
  other: {
    id: string;
    name: string;
    avatar: string;
  };
}

const ChatContainer = ({ chatId, myId, myType, other }: ChatProps) => {
  const { triggerSidebarRefetch } = useChatContext();
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isUserOnline, setIsUserOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [userId, ownerId] = chatId.split("_"); 
  const roomId = chatId;

  const { socket } = useContext(socketContext);

  useEffect(() => {
    const fetchChat = async () => {
      setIsLoading(true);

      try {
        const chat = await findOrCreateChat(userId, ownerId);

        const chats = await getMessages(chat._id);
        setMessages(chats.data?.messages || chats.messages || []);
        setIsUserOnline(chat.isOnline);

        setIsLoading(false);
      } catch (err: any) {
        toast.error("Failed to load chat");
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [chatId]);


  useEffect(() => {
    if (socket && !socket.connected) socket.connect();

    socket.emit("join_room", { roomId, userId: myId });

    const receiveMessage = (msg: Imessage) => {
      setMessages((prev) => [...prev, msg]);
      triggerSidebarRefetch();
    };

    socket.on("recive-message", receiveMessage);
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));

    socket.on("user-status-changed", (data) => {
      if (data.userId === other.id) setIsUserOnline(data.isOnline);
    });

    return () => {
      socket.emit("leave-room", { roomId, userId: myId });
      socket.off("recive-message", receiveMessage);
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg: Imessage = {
      _id: "",
      chatId,
      messageContent: message,
      senderId: myId,
      senderType: myType,
      receiverId: other.id,
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

      <ChatHeader
        user={{
          _id: other.id,
          name: other.name,
          avatar: other.avatar,
          isOnline: isUserOnline,
          lastSeen: isUserOnline ? "Online" : "Offline",
        }}
        onBackClick={() => window.history.back()}
        showBackButton={true}
      />

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gradient-to-b from-gray-50 to-white chat-scrollbar">
        <AnimatePresence>
          {messages.map((msg, index) => {
            const date = new Date(msg.sendedTime);
            const prev = index > 0 ? new Date(messages[index - 1].sendedTime) : null;
            const showSeparator = !prev || date.toDateString() !== prev.toDateString();

            return (
              <div key={msg._id || index}>
                {showSeparator && <DateSeparator date={date} />}
                <ChatBubble msg={msg} isMine={msg.senderId === myId} />
              </div>
            );
          })}

          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

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

export default ChatContainer;
