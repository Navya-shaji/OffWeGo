import { useState } from "react";
import { toast } from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { rescheduleBooking } from "@/services/Booking/bookingService";

interface RescheduleModalProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  onSuccess?: () => void;
}

const RescheduleModal = ({ open, onClose, bookingId, onSuccess }: RescheduleModalProps) => {
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!newDate) return toast.error("Please select a new date");

    try {
      setLoading(true);
      await rescheduleBooking(bookingId, newDate);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error("Failed to reschedule. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Reschedule Booking
          </DialogTitle>
        </DialogHeader>

        {/* Date Picker */}
        <div className="mt-4">
          <label className="text-sm font-medium">Select New Date</label>
          <input
            type="date"
            className="w-full mt-2 p-2 border rounded-lg"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Rescheduling..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RescheduleModal;
