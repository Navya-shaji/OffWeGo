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

  const extractApiData = (response:any, dataPath: string[] = []) => {
    if (!response) return [];
    
    const possiblePaths = [
      ['data', 'data'],
      ['data'],
      ['destinations'],
      []
    ];
    
    if (dataPath.length > 0) {
      possiblePaths.unshift(dataPath);
    }
    
    for (const path of possiblePaths) {
      let result = response;
      
      for (const key of path) {
        if (result && typeof result === 'object' && key in result) {
          result = result[key];
        } else {
          result = null;
          break;
        }
      }
      
      if (Array.isArray(result)) {
        return result;
      }
    }
    
    if (Array.isArray(response)) {
      return response;
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
        let destinationsResult = [];
        try {
          const destinationsResponse = await fetchAllDestinations();
          destinationsResult = extractApiData(destinationsResponse, ['destinations']);
          
          if (destinationsResult.length === 0) {
            const paginatedResponse = await fetchAllDestinations(1, 100);
            destinationsResult = extractApiData(paginatedResponse, ['destinations']);
          }
        } catch (destError) {
          console.error("Error loading destinations:", destError);
        }
        
        setDestinations(destinationsResult);
        setLoadingDestinations(false);

        // Load hotels
        let hotelsResult = [];
        try {
          const hotelsResponse = await getAllHotel();
          hotelsResult = extractApiData(hotelsResponse);
        } catch (hotelsError) {
          console.error("Error loading hotels:", hotelsError);
        }
        
        setAllHotels(hotelsResult);
        setLoadingHotels(false);

        
        let activitiesResult = [];
        try {
          const activitiesResponse = await getActivities();
          activitiesResult = extractApiData(activitiesResponse);
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