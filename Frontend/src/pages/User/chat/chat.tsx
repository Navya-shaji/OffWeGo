
import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sendMessage } from "@/services/chat/chatService";
import ChatComponent from "@/utilities/socket";


interface ChatMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  senderRole: string;
  receiverRole: string;
  message: string;
  createdAt: string | Date;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentUserRole: string;
  vendorId: string;
  packageName: string;
}

export const ChatModal = ({
  isOpen,
  onClose,
  currentUserId,
  currentUserRole,
  vendorId,
  packageName,
}: ChatModalProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
  if (isOpen && currentUserId && vendorId) {
    fetchMessages();

    const chatRoom = `${currentUserId}-${vendorId}`; // unique room
    ChatComponent.emit("joinChat", chatRoom);

    const handleReceiveMessage = (msg: ChatMessage) => {
      const isRelevant =
        (msg.senderId === vendorId && msg.receiverId === currentUserId) ||
        (msg.senderId === currentUserId && msg.receiverId === vendorId);

      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    ChatComponent.on("receiveMessage", handleReceiveMessage);

    return () => {
      ChatComponent.off("receiveMessage", handleReceiveMessage);
    };
  }
}, [isOpen, currentUserId, vendorId]);
// re-run when modal opens or user changes

  // const handleReceiveMessage = (msg: ChatMessage) => {
  //   // only append if message is part of this conversation
  //   // (either sent to this user from current chat vendor OR vice versa)
  //   const isRelevant =
  //     (msg.senderId === vendorId && msg.receiverId === currentUserId) ||
  //     (msg.senderId === currentUserId && msg.receiverId === vendorId);

  //   if (isRelevant) {
  //     setMessages((prev) => [...prev, msg]);
  //   }
  // };

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/chat/messages?userId=${currentUserId}&vendorId=${vendorId}`
      );
      if (!response.ok) {
        console.error("Failed to fetch messages", response.statusText);
        setIsLoading(false);
        return;
      }
      const data = await response.json();
      setMessages(data.data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setIsLoading(false);
    }
  };

 const handleSendMessage = async () => {
  if (!newMessage.trim() || isSending) return;

  const text = newMessage.trim();
  setNewMessage("");
  setIsSending(true);

  try {
    const saved: ChatMessage = await sendMessage({
      senderId: currentUserId,
      receiverId: vendorId,
      senderRole: currentUserRole,
      receiverRole: "vendor",
      message: text,
    });

    if (saved) {
      setMessages((prev) => [...prev, saved]);
      scrollToBottom();

      // Emit to the correct room
      const chatRoom = `${currentUserId}-${vendorId}`;
      ChatComponent.emit("sendMessage", { ...saved, chatId: chatRoom });
    } else {
      throw new Error("Message not saved");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    alert("Failed to send message. Please try again.");
    setNewMessage(text);
  } finally {
    setIsSending(false);
  }
};

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-xl">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold">Chat with Vendor</div>
                <div className="text-sm text-white/80 font-normal">
                  {packageName}
                </div>
              </div>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No messages yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Start a conversation about this package
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => {
                const isCurrentUser = msg.senderId === currentUserId;
                const time = new Date(msg.createdAt);
                return (
                  <div
                    key={msg._id || idx}
                    className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                        isCurrentUser
                          ? "bg-gradient-to-r from-slate-800 to-slate-900 text-white"
                          : "bg-white border border-slate-200 text-slate-900"
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{msg.message}</p>
                      <p className={`text-xs mt-2 ${isCurrentUser ? "text-white/70" : "text-slate-500"}`}>
                        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        <div className="border-t border-slate-200 p-4 bg-white flex-shrink-0">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-300 disabled:bg-slate-100 disabled:cursor-not-allowed"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || isSending}
              className="bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const ChatButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
      aria-label="Open chat"
    >
      <MessageCircle className="h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
    </button>
  );
};
