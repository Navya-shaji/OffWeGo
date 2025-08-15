import React from "react";

interface DataStatusFooterProps {
  destinationsCount: number;
  hotelsCount: number;
  activitiesCount: number;
  loadingDestinations: boolean;
  loadingHotels: boolean;
  loadingActivities: boolean;
}

const DataStatusFooter: React.FC<DataStatusFooterProps> = ({
  destinationsCount,
  hotelsCount,
  activitiesCount,
  loadingDestinations,
  loadingHotels,
  loadingActivities
}) => {
  const isLoading = loadingDestinations || loadingHotels || loadingActivities;

  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <span className={`flex items-center ${destinationsCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${destinationsCount > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {destinationsCount} Destinations
          </span>
          <span className={`flex items-center ${hotelsCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${hotelsCount > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {hotelsCount} Hotels
          </span>
          <span className={`flex items-center ${activitiesCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${activitiesCount > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
            {activitiesCount} Activities
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {isLoading ? 'Loading data...' : 'All data loaded'}
        </div>
      </div>
    </div>
  );
};

export default DataStatusFooter;
