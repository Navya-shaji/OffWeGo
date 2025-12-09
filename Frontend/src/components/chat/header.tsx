import { ChevronLeft } from 'lucide-react';

interface ChatHeaderProps {
  user: {
    _id: string;
    name: string;
    avatar?: string;
    isOnline: boolean;
    lastSeen: string;
  };
  onBackClick: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ user, onBackClick, showBackButton = true }: ChatHeaderProps) => {
  const IMG_URL = import.meta.env.VITE_IMAGE_URL;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3 flex-1">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-700" />
          </button>
        )}

        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar.startsWith('http') ? user.avatar : `${IMG_URL}${user.avatar}`}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          {user.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.lastSeen}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
