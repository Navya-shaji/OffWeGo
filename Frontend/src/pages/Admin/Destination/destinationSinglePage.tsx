// 👇 Your imports remain unchanged
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getsingleDestination } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import { fetchPackages } from "@/store/slice/packages/packageSlice";
import Navbar from "@/components/profile/navbar";

export const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState<DestinationInterface | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { packages, loading: packagesLoading } = useSelector(
    (state: RootState) => state.package
  );
  const navigate = useNavigate();
  const relevantPackages = packages.filter((pkg) => pkg.destinationId === id);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      getsingleDestination(id)
        .then(setDestination)
        .catch((err) => console.error("Failed to load destination", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading destination...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">Destination not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                {destination.name}
              </h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{destination.location}</span>
              </div>
            </div>

           
            {Array.isArray(destination.imageUrls) &&
              destination.imageUrls.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-1">
                    <img
                      src={destination.imageUrls[0] || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-80 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                  {destination.imageUrls.length > 1 && (
                    <div className="space-y-4">
                      {destination.imageUrls.slice(1, 3).map((url, idx) => (
                        <img
                          key={idx}
                          src={url || "/placeholder.svg"}
                          alt={`${destination.name} ${idx + 2}`}
                          className="w-full h-36 object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

           
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Tour Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {destination.description}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Packages
              </h2>

              {packagesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">
                    Loading packages...
                  </span>
                </div>
              ) : relevantPackages.length > 0 ? (
                <div className="space-y-4">
                  <div className="text-gray-700 text-lg font-semibold">
                    Total Packages: {relevantPackages.length}
                  </div>
                  <ul className="space-y-4">
                    {relevantPackages.map((pkg) => (
                      <li
                        key={pkg.id}
                        className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow-sm"
                      >
                        <span className="bg-blue-600 text-white font-bold text-sm rounded-full h-8 w-8 flex items-center justify-center">
                          {pkg.packageName.charAt(0)}
                        </span>
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">
                            {pkg.packageName}
                          </h4>
                        </div>
                        <button
                          className="text-blue-600 font-semibold hover:underline"
                          onClick={() => {
                            navigate("/timeline", {
                              state: { selectedPackage: pkg },
                            });
                          }}
                        >
                          View Details
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No packages available
                  </h3>
                  <p className="text-gray-500">
                    No travel packages are currently available for this
                    destination
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tour Map */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tour Map
                </h3>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Latitude:</strong> {destination.coordinates.lat}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Longitude:</strong> {destination.coordinates.lng}
                  </p>
                </div>
                <div className="h-64 w-full rounded-lg overflow-hidden">
                  <MapContainer
                    center={[
                      destination.coordinates.lat,
                      destination.coordinates.lng,
                    ]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        destination.coordinates.lat,
                        destination.coordinates.lng,
                      ]}
                    >
                      <Popup>{destination.name}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
