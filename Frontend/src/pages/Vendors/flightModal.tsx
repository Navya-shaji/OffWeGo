
import  { useState } from "react";
import { X, Plane, MapPin, CreditCard, CheckCircle } from "lucide-react";

interface FlightOptionModalProps {
  show: boolean;
  onClose: () => void;
  onProceed: (option: "with-flight" | "without-flight") => void;
  selectedPackage: {
    price: number;
    flightPrice: number;
  };
}

export default function FlightOptionModal({
  show,
  onClose,
  onProceed,
  selectedPackage,
}: FlightOptionModalProps) {
  const [selectedOption, setSelectedOption] = useState<
    "with-flight" | "without-flight" | null
  >(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Select Your Travel Option</h2>
            <p className="text-sm text-white/80 mt-1">
              Choose the package that suits you best
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 grid md:grid-cols-2 gap-6">
          {/* Without Flight */}
          <div
            onClick={() => setSelectedOption("without-flight")}
            className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
              selectedOption === "without-flight"
                ? "border-emerald-600 shadow-xl scale-105"
                : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
            }`}
          >
            {selectedOption === "without-flight" && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center z-10">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <MapPin className="h-10 w-10 text-blue-600 mb-3" />
              <h3 className="text-xl font-bold">Without Flight</h3>
              <p className="text-sm text-gray-600 mb-3">Ground transport only</p>
              <p className="text-lg font-semibold">
                {formatCurrency(selectedPackage.price)}
              </p>
            </div>
          </div>

          {/* With Flight */}
          <div
            onClick={() => setSelectedOption("with-flight")}
            className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
              selectedOption === "with-flight"
                ? "border-emerald-600 shadow-xl scale-105"
                : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
            }`}
          >
            {selectedOption === "with-flight" && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center z-10">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="flex flex-col items-center">
              <Plane className="h-10 w-10 text-purple-600 mb-3" />
              <h3 className="text-xl font-bold">With Flight</h3>
              <p className="text-sm text-gray-600 mb-3">Air + ground travel</p>
              <p className="text-lg font-semibold">
                {formatCurrency(selectedPackage.flightPrice)}
              </p>
              <p className="text-xs text-purple-700 mt-1">
                +{formatCurrency(
                  selectedPackage.flightPrice - selectedPackage.price
                )}{" "}
                for flights
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 p-6">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            disabled={!selectedOption}
            onClick={() =>
              selectedOption ? onProceed(selectedOption) : undefined
            }
            className={`flex-1 px-6 py-3 font-bold rounded-xl transition ${
              selectedOption
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white hover:scale-105"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <CreditCard className="h-5 w-5 inline-block mr-2" />
            Continue to Booking
          </button>
        </div>
      </div>
    </div>
  );
}
