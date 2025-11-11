import React from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  description?: string;
  icon?: string;
  iconBgColor?: string;
  confirmText?: string;
  confirmButtonColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  description,
  icon = "⚠",
  iconBgColor = "bg-red-100",
  confirmText = "Confirm",
  confirmButtonColor = "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all">
        <div className="flex items-start mb-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${iconBgColor}`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
            {description && (
              <p className="mt-2 text-sm text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${confirmButtonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};