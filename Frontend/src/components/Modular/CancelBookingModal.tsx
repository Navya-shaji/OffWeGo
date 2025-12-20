import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface CancelBookingModalProps {
  open: boolean;
  onClose: () => void;
  bookingId?: string;
  onConfirm: (reason: string) => Promise<void>;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  open,
  onClose,
  bookingId,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters long");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await onConfirm(reason.trim());
      handleClose();
    } catch (err: any) {
      setError(err?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-600">
            <AlertTriangle className="w-7 h-7" />
            Cancel Booking
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-5">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Cancellation <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none ${
                error
                  ? "border-red-300 focus:ring-red-200 focus:border-red-500"
                  : "border-gray-300 focus:ring-red-100 focus:border-red-500"
              }`}
              rows={4}
              placeholder="Please provide a reason for cancelling this booking (minimum 10 characters)..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/500 characters
            </p>
            {error && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="px-6"
          >
            Keep Booking
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !reason.trim() || reason.trim().length < 10}
            className="bg-red-600 hover:bg-red-700 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Cancelling..." : "Confirm Cancellation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

