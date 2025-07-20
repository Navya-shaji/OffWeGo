import { Package } from "../../domain/entities/packageEntity"; 
import { IPackageModel } from "../../framework/database/Models/packageModel";

export const mapToPackageDto = (doc: IPackageModel): Package => ({
  id: doc._id.toString(),
  destinationId: doc.destinationId,
  packageName: doc.packageName,
  description: doc.description,
  price: doc.price,
  duration: doc.duration,
  startDate: doc.startDate,
  endDate: doc.endDate,
  images: doc.images,
  hotelDetails: doc.hotelDetails.map(hotel => ({
    hotelId: hotel.hotelId,
    name: hotel.name,
    address: hotel.address,
    rating: hotel.rating,
    destinationId: hotel.destinationId,
  })),
  activities: doc.activities.map(activity => ({
    activityId: activity.activityId,
    title: activity.title,
    description: activity.description,
    destinationId: activity.destinationId,
  })),
});
