export const calculatePackagePrice = (
  price: number,
  selectedHotels: string[],
  selectedActivities: string[],
  duration: number,
  hotelCostPerNight: number = 2000,
  activityCost: number = 1500
) => {
  const hotelsCost = selectedHotels.length * hotelCostPerNight * duration;
  const activitiesCost = selectedActivities.length * activityCost;
  return price + hotelsCost + activitiesCost;
};

export const validatePackageForm = (formData: {
  destinationId: string;
  packageName: string;
  description: string;
  price: number;
}) => {
  return {
    isValid: formData.destinationId && 
             formData.packageName.trim() && 
             formData.description.trim() && 
             formData.price > 0,
    errors: {
      destinationId: !formData.destinationId ? "Please select a destination" : "",
      packageName: !formData.packageName.trim() ? "Package name is required" : "",
      description: !formData.description.trim() ? "Description is required" : "",
      price: formData.price <= 0 ? "Base price must be greater than 0" : ""
    }
  };
};