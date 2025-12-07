// In messageinput.tsx
import { Send, Paperclip } from "lucide-react";
import socket from "@/hooks/connectSocketIo";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: (e: React.FormEvent) => void; // Changed from onSend
  inputRef: React.RefObject<HTMLInputElement>;
  disabled?: boolean;
  roomId: string;
}

const MessageInput = ({
  message,
  setMessage,
  onSend, // Changed from onSend
  inputRef,
  disabled,
  roomId,
}: MessageInputProps) => {
  const handleTyping = () => {
    socket.emit("typing", { roomId });
  };

  const handleStopTyping = () => {
    socket.emit("stop-typing", { roomId });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(e as any); 
    }
  };

  return (
    <div className="bg-[#1c1c1e] border-t border-[#2f2f2f] px-4 py-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(e);
        }}
        className="flex items-center gap-2"
      >
        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 text-[#8E8E93] hover:text-white transition-colors rounded-full hover:bg-[#2f2f2f]"
          disabled={disabled}
        >
          <Paperclip size={22} />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={handleTyping}
            onBlur={handleStopTyping}
            placeholder="Message..."
            disabled={disabled}
            className="w-full bg-[#2f2f2f] text-white placeholder-[#8E8E93] rounded-full px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-[#007AFF] transition-all"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`p-2 rounded-full transition-all ${
            message.trim()
              ? "bg-[#007AFF] text-white hover:bg-[#0066CC]"
              : "bg-[#2f2f2f] text-[#8E8E93] cursor-not-allowed"
          }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
