

interface ChatHeaderProps {
  name: string;
  avatarUrl?: string;
  onBack?: () => void;
}

const ChatHeader = ({ name, avatarUrl, onBack }: ChatHeaderProps) => {
  return (
    <div className="flex items-center p-3 border-b">
      {onBack && (
        <button onClick={onBack} className="mr-2">
          ←
        </button>
      )}
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="w-10 h-10 rounded-full mr-2" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 mr-2"></div>
      )}
      <span className="font-semibold">{name}</span>
    </div>
  );
};

export default ChatHeader;
