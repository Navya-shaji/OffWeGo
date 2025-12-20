import { motion } from "framer-motion";
import type { Imessage } from "@/interface/MessageInterface";

interface Props {
  msg: Imessage;
  isMine: boolean;
}

const ChatBubble = ({ msg, isMine }: Props) => {
  const date = new Date(msg.sendedTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`max-w-[280px] lg:max-w-md px-4 py-3 rounded-3xl shadow-md ${
          isMine
            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-lg"
            : "bg-white border border-gray-200 rounded-bl-lg"
        }`}
      >
        <p className="text-base break-words">{msg.messageContent}</p>

        <div
          className={`text-xs mt-1 text-right ${
            isMine ? "text-purple-100" : "text-gray-500"
          }`}
        >
          {date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default ChatBubble;
