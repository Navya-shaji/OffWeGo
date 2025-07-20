import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { getsingleDestination } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";


L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState<DestinationInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getsingleDestination(id)
        .then(setDestination)
        .catch((err) => console.error("Failed to load destination", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!destination) return <p className="p-4 text-red-500">Destination not found</p>;

  return (
    
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">{destination.name}</h1>
      <p className="text-gray-600">
        <strong>Location:</strong> {destination.location}
      </p>
      <p className="text-gray-800">{destination.description}</p>

      {/* Image Grid */}
      {Array.isArray(destination.imageUrls) && destination.imageUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {destination.imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`Destination ${idx}`}
              className="w-full h-64 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      )}

      {/* Coordinates & Map */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">Map</h2>
        <p className="text-gray-600">
          <strong>Latitude:</strong> {destination.coordinates.lat} <br />
          <strong>Longitude:</strong> {destination.coordinates.lng}
        </p>

        <div className="h-80 w-full rounded-lg overflow-hidden">
          <MapContainer
            center={[destination.coordinates.lat, destination.coordinates.lng]}
            zoom={13}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[destination.coordinates.lat, destination.coordinates.lng]}>
              <Popup>{destination.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};
