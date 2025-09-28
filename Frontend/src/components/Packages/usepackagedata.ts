import { useState, useEffect } from "react";
import { getAllHotel } from "@/services/Hotel/HotelService";
import { getActivities } from "@/services/Activity/ActivityService";
import { fetchAllDestinations } from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import type { Activity, Hotel } from "@/interface/PackageInterface";

export const usePackageData = () => {
  const [allHotels, setAllHotels] = useState<Hotel[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingDestinations, setLoadingDestinations] = useState(false);
console.log(allActivities,"actiivties another page")
  const extractApiData = (response): any[] => {
    if (!response) return [];

    if (Array.isArray(response)) return response;
    if (response.hotels && Array.isArray(response.hotels)) return response.hotels;
    if (response.activities && Array.isArray(response.activities)) return response.activities;
    if (response.destinations && Array.isArray(response.destinations)) return response.destinations;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;

    console.warn("Could not extract array data from response:", response);
    return [];
  };

  useEffect(() => {
    const loadData = async () => {
      setLoadingDestinations(true);
      setLoadingHotels(true);
      setLoadingActivities(true);

      try {
        // Fetch destinations
        let destinationsResult: DestinationInterface[] = [];
        try {
          const destResp = await fetchAllDestinations();
          destinationsResult = extractApiData(destResp);
        } catch (destError) {
          console.error("Error loading destinations:", destError);
        }
        setDestinations(destinationsResult);
        setLoadingDestinations(false);

        // Fetch hotels
        let hotelsResult: Hotel[] = [];
        try {
          const hotelsResp = await getAllHotel();
          hotelsResult = extractApiData(hotelsResp);
        } catch (hotelsError) {
          console.error("Error loading hotels:", hotelsError);
        }
        setAllHotels(hotelsResult);
        setLoadingHotels(false);

        // Fetch activities
        let activitiesResult: Activity[] = [];
        console.log(activitiesResult,"resul")
        try {
          const activitiesResp = await getActivities();
          console.log(activitiesResp,"response")
          activitiesResult = extractApiData(activitiesResp);
        } catch (activitiesError) {
          console.error("Error loading activities:", activitiesError);
        }
        console.log(activitiesResult,"result")
        setAllActivities(activitiesResult);
        setLoadingActivities(false);

      } catch (error) {
        console.error("Failed to load data:", error);
        setLoadingHotels(false);
        setLoadingActivities(false);
        setLoadingDestinations(false);
      }
    };

    loadData();
  }, []);

  return {
    allHotels,
    allActivities,
    destinations,
    loadingHotels,
    loadingActivities,
    loadingDestinations
  };
};
