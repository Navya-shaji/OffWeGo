import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Outlet, useParams } from 'react-router-dom';
import { Menu } from 'lucide-react';
import ChatSidebar from './sidebar';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { chatId } = useParams();

  return (
    <div className="min-h-screen flex bg-[#f6f6f6]">
      <ChatSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0 border-l border-gray-200 bg-white">
        {/* Mobile Header with Menu Button */}
        {chatId && (
          <div className="lg:hidden flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-gray-700" />
            </button>
            <p className="text-sm text-gray-600">Chat</p>
          </div>
        )}
        
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage