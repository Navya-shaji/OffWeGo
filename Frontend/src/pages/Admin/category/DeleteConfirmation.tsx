import type { CategoryType } from "@/interface/categoryInterface";

interface DeleteModalProps {
  isOpen: boolean;
  category?: CategoryType | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({
  isOpen,
  category,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all duration-200 animate-fadeIn">
        {/* Header */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Delete
        </h3>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-medium text-black">"{category.name}"</span>? This
          action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-black text-white hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
