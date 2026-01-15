// In messageinput.tsx
import { Send, Paperclip } from "lucide-react";
import socket from "@/hooks/connectSocketIo";

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSend: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
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
      onSend(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
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
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
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
            className="w-full bg-gray-100 text-gray-900 placeholder-gray-500 rounded-full px-4 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all border border-gray-200"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className={`p-2 rounded-full transition-all ${message.trim()
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
