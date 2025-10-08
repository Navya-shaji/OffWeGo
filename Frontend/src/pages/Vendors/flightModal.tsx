import { useState, useEffect } from "react";
import { X, Search, Plane, MapPin, Clock, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchAllFlights } from "@/services/Flight/FlightService"; 
import type { Flight } from "@/interface/flightInterface";
import type { Package } from "@/interface/PackageInterface";

interface FlightSearchModalProps {
  show: boolean;
  onClose: () => void;
  onProceed: (flightOption: "with-flight" | "without-flight", selectedFlight?: Flight) => void;
  selectedPackage:Package
}
const FlightSearchModal = ({ show, onClose, onProceed, selectedPackage }: FlightSearchModalProps) => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
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
      const filtered = flights.filter(
        (flight) =>
          flight.airLine?.toLowerCase().includes(query) ||
          flight.fromLocation?.toLowerCase().includes(query) ||
          flight.toLocation?.toLowerCase().includes(query)
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

  const handleProceedWithFlight = () => {
    if (selectedFlight) {
      onProceed("with-flight", selectedFlight);
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

  const formatDate = (date: Date | string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Select Your Flight</h2>
              <p className="text-sm text-white/80">Choose a flight or continue without one</p>
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

        {/* Search Bar */}
        <div className="p-6 bg-slate-50 border-b">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by airline, departure or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all duration-300"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-slate-400 mb-4" />
              <p className="text-slate-600">Loading available flights...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-red-50 rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-red-500" />
              </div>
              <p className="text-red-600 font-semibold mb-2">Failed to Load Flights</p>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={loadFlights} className="bg-slate-800 hover:bg-slate-900">
                Try Again
              </Button>
            </div>
          ) : filteredFlights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-4 bg-slate-100 rounded-full mb-4">
                <Plane className="h-12 w-12 text-slate-400" />
              </div>
              <p className="text-slate-600 font-semibold mb-2">No Flights Found</p>
              <p className="text-slate-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFlights.map((flight) => (
                <Card
                  key={flight.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedFlight?.id === flight.id
                      ? "ring-2 ring-emerald-500 shadow-lg"
                      : "hover:border-slate-300"
                  }`}
                  onClick={() => handleFlightSelect(flight)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-6">
                      {/* Flight Info */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Departure */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4" />
                            Departure
                          </div>
                          <div className="font-bold text-lg text-slate-900">
                            {flight.fromLocation || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="h-4 w-4" />
                            {formatDate(flight.date)}
                          </div>
                        </div>

                        {/* Flight Details */}
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <div className="flex items-center gap-2 text-slate-400">
                            <div className="h-px w-12 bg-slate-300"></div>
                            <Plane className="h-5 w-5 rotate-90" />
                            <div className="h-px w-12 bg-slate-300"></div>
                          </div>
                          <div className="font-bold text-slate-900">{flight.airLine}</div>
                          <div className="text-sm text-slate-600">Direct Flight</div>
                        </div>

                        {/* Arrival */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin className="h-4 w-4" />
                            Arrival
                          </div>
                          <div className="font-bold text-lg text-slate-900">
                            {flight.toLocation || "N/A"}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600">
                            <Clock className="h-4 w-4" />
                            {formatDate(flight.date)}
                          </div>
                        </div>
                      </div>

                      {/* Price & Selection */}
                      <div className="flex flex-col items-end gap-3 border-l pl-6">
                        <div className="text-right">
                          <div className="text-sm text-slate-600 mb-1">Flight Price</div>
                          <div className="text-2xl font-bold text-slate-900">
                            {formatCurrency(flight.price || 0)}
                          </div>
                        </div>
                        {selectedFlight?.id === flight.id && (
                          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Selected
                          </div>
                        )}
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
          {/* Price Summary */}
          {selectedFlight && (
            <div className="bg-white rounded-xl p-4 border-2 border-emerald-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Package Price:</span>
                  <span className="font-semibold">{formatCurrency(selectedPackage.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Flight Price:</span>
                  <span className="font-semibold">{formatCurrency(selectedFlight.price || 0)}</span>
                </div>
                <div className="h-px bg-slate-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Total Price:</span>
                  <span className="font-bold text-xl text-emerald-600">
                    {formatCurrency(selectedPackage.price + (selectedFlight.price || 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
          

          {/* Action Buttons */}
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
              className="flex-1 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedFlight ? (
                <>
                  Proceed with Selected Flight
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              ) : (
                "Select a Flight to Continue"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSearchModal;