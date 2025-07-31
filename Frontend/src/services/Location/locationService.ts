import axios from "axios";

const OPENCAGE_API_KEY = import.meta.env.VITE_OPENCAGE_API_KEY;

export const getCoordinatesFromPlace = async (
  place: string
): Promise<{ lat: number; lng: number }> => {
  const res = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
    params: {
      q: place,
      key: OPENCAGE_API_KEY,
    },
  });

  const result = res.data?.results?.[0];

  if (!result || !result.geometry) {
    throw new Error("Coordinates not found for this location.");
  }

  return {
    lat: result.geometry.lat,
    lng: result.geometry.lng,
  };
};

export const getLocationFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch location name.")
  }

  const data = await response.json()
  return data.display_name || "Unknown location"
}
