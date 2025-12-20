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

 const extractApiData = <T>(response: unknown): T[] => {
  if (!response) return [];

  if (Array.isArray(response)) return response as T[];


  if (typeof response === "object" && response !== null) {
    const obj = response as Record<string, unknown>;

    if (Array.isArray(obj.hotels)) {
      return obj.hotels as T[];
    }

    if (Array.isArray(obj.activities)) {
      return obj.activities as T[];
    }

    if (Array.isArray(obj.destinations)) {
      return obj.destinations as T[];
    }

    if (Array.isArray(obj.data)) {
      return obj.data as T[];
    }

    if (
      obj.data &&
      typeof obj.data === "object" &&
      Array.isArray((obj.data as Record<string, unknown>).data)
    ) {
      return (obj.data as Record<string, unknown>).data as T[];
    }
  }

  console.warn("Could not extract array data from response:", response);
  return [];
};

  useEffect(() => {
    const loadData = async () => {
      setLoadingDestinations(true);
      setLoadingHotels(true);
      setLoadingActivities(true);

      try {
        // Fetch destinations - fetch all destinations with a high limit
        let destinationsResult: DestinationInterface[] = [];
        try {
          // Fetch first page with a high limit to get all destinations
          const destResp = await fetchAllDestinations(1, 1000);
          // Handle both response structures
          if (destResp.destinations && Array.isArray(destResp.destinations)) {
            destinationsResult = destResp.destinations;
          } else {
            destinationsResult = extractApiData<DestinationInterface>(destResp);
          }
          
          // If there are more pages, fetch them all
          if (destResp.totalPages && destResp.totalPages > 1) {
            const allDestinations = [...destinationsResult];
            for (let page = 2; page <= destResp.totalPages; page++) {
              try {
                const pageResp = await fetchAllDestinations(page, 1000);
                if (pageResp.destinations && Array.isArray(pageResp.destinations)) {
                  allDestinations.push(...pageResp.destinations);
                }
              } catch (pageError) {
                console.error(`Error loading destinations page ${page}:`, pageError);
              }
            }
            destinationsResult = allDestinations;
          }
        } catch (destError) {
          console.error("Error loading destinations:", destError);
        }
        setDestinations(destinationsResult);
        setLoadingDestinations(false);

        // Fetch hotels
        let hotelsResult: Hotel[] = [];
        try {
          const hotelsResp = await getAllHotel();
          hotelsResult = extractApiData<Hotel>(hotelsResp);
        } catch (hotelsError) {
          console.error("Error loading hotels:", hotelsError);
        }
        setAllHotels(hotelsResult);
        setLoadingHotels(false);

        // Fetch activities
        let activitiesResult: Activity[] = [];
        try {
          const activitiesResp = await getActivities();
          activitiesResult = extractApiData<Activity>(activitiesResp);
        } catch (activitiesError) {
          console.error("Error loading activities:", activitiesError);
        }
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
