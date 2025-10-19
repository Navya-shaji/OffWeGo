import { useState, useEffect } from "react";
import {
  X,
  Search,
  Plane,
  Loader2,
  AlertCircle,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllFlights } from "@/services/Flight/FlightService";
import type { Flight } from "@/interface/flightInterface";
import type { Package } from "@/interface/PackageInterface";

interface FlightSearchModalProps {
  show: boolean;
  onClose: () => void;
  onProceed: (
    flightOption: "with-flight" | "without-flight",
    selectedFlight?: Flight,
    selectedClass?: string
  ) => void;
  selectedPackage: Package;
}

const FlightSearchModal = ({
  show,
  onClose,
  onProceed,
  selectedPackage,
}: FlightSearchModalProps) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("economy");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (show) {
      loadFlights();
    }
  }, [show]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredFlights(flights);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = flights.filter((flight) =>
        flight.airLine?.toLowerCase().includes(query)
      );
      setFilteredFlights(filtered);
    }
  }, [searchQuery, flights]);

  const loadFlights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAllFlights();
      setFlights(data);
      setFilteredFlights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load flights");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
  };

  const handleClassSelect = (cls: string) => {
    setSelectedClass(cls);
  };

  const handleProceedWithFlight = () => {
    if (selectedFlight) {
      onProceed("with-flight", selectedFlight, selectedClass);
      onClose();
    }
  };

  const handleProceedWithoutFlight = () => {
    onProceed("without-flight");
    onClose();
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const getSelectedPrice = () => {
    if (!selectedFlight) return 0;
    const { price } = selectedFlight;
    return (
      price[selectedClass as keyof typeof price] ??
      price.economy ??
      0
    );
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Select Your Flight</h2>
              <p className="text-sm text-white/80">
                Choose your airline and class type
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-6 bg-slate-50 border-b">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by airline name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Flight list */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-slate-400 mb-4" />
              <p className="text-slate-600">Loading flights...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-red-600 font-semibold mb-2">
                Failed to load flights
              </p>
              <Button onClick={loadFlights} className="bg-slate-800 hover:bg-slate-900">
                Try Again
              </Button>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              No flights found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <Card
                  key={flight.id}
                  onClick={() => handleFlightSelect(flight)}
                  className={`cursor-pointer transition-all ${
                    selectedFlight?.id === flight.id
                      ? "ring-2 ring-emerald-500"
                      : "hover:border-slate-300"
                  }`}
                >
                  <CardContent className="p-5 flex justify-between items-center">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">
                        {flight.airLine}
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        Created: {new Date(flight.createdAt || "").toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-500">Economy from</div>
                      <div className="text-xl font-bold text-slate-900">
                        {formatCurrency(flight.price.economy)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-slate-50 p-6 space-y-4">
          {/* Flight class selection */}
          {selectedFlight && (
            <div className="bg-white border rounded-xl p-4">
              <h4 className="font-semibold text-slate-800 mb-3">
                Choose Flight Class
              </h4>
              <div className="flex gap-3">
                {["economy", "premium", "business"].map((cls) =>
                  selectedFlight.price[cls as keyof typeof selectedFlight.price] ? (
                    <Button
                      key={cls}
                      variant={selectedClass === cls ? "default" : "outline"}
                      onClick={() => handleClassSelect(cls)}
                      className={`flex-1 capitalize ${
                        selectedClass === cls
                          ? "bg-emerald-600 text-white"
                          : "border-slate-300"
                      }`}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {cls} –{" "}
                      {formatCurrency(
                        selectedFlight.price[cls as keyof typeof selectedFlight.price] || 0
                      )}
                    </Button>
                  ) : null
                )}
              </div>
            </div>
          )}

          {/* Price summary */}
          {selectedFlight && (
            <div className="bg-white border rounded-xl p-4">
              <div className="flex justify-between text-sm text-slate-700">
                <span>Package Price:</span>
                <span>{formatCurrency(selectedPackage.price)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-700 mt-1">
                <span>Flight ({selectedClass}):</span>
                <span>{formatCurrency(getSelectedPrice())}</span>
              </div>
              <div className="h-px bg-slate-200 my-2"></div>
              <div className="flex justify-between font-semibold text-lg text-emerald-700">
                <span>Total:</span>
                <span>
                  {formatCurrency(selectedPackage.price + getSelectedPrice())}
                </span>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleProceedWithoutFlight}
              variant="outline"
              className="flex-1 h-12 border-2 border-slate-300 hover:bg-slate-100 font-semibold"
            >
              Continue Without Flight
            </Button>
            <Button
              onClick={handleProceedWithFlight}
              disabled={!selectedFlight}
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold disabled:opacity-50"
            >
              {selectedFlight ? (
                <>
                  Proceed with {selectedClass} Class
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "Select a Flight"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchModal;
