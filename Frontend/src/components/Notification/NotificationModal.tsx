import React from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: { title: string; body: string }[];
}

const NotificationPanel: React.FC<Props> = ({ open, onClose, notifications }) => {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 transform transition-transform duration-300 z-50 
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button onClick={onClose}>
          <X className="w-5 h-5 text-gray-600 hover:text-black" />
        </button>
      </div>

      {/* List */}
      <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-60px)]">
        {notifications.length === 0 && (
          <p className="text-gray-500 text-center mt-10">No notifications</p>
        )}

        {notifications.map((n, index) => (
          <div
            key={index}
            className="p-3 bg-gray-100 rounded-lg shadow-sm border border-gray-200"
          >
            <p className="font-medium">{n.title}</p>
            <p className="text-sm text-gray-600">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
