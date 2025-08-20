import { Package } from "../../domain/entities/packageEntity";
import { IPackageModel } from "../../framework/database/Models/packageModel";

export const mapToPackageDto = (doc: IPackageModel): Package => ({
  id: doc._id.toString(),
  destinationId: doc.destinationId.toString(),
  packageName: doc.packageName,
  description: doc.description,
  price: doc.price,
  duration: doc.duration,
  startDate: doc.startDate,
  endDate: doc.endDate,
  images: doc.images || [],
  hotels: Array.isArray(doc.hotels)
    ? doc.hotels.filter(h => h).map(hotel => ({
        name: hotel.name || "",
        address: hotel.address || "",
        rating: hotel.rating || 0,
      }))
    : [],
  activities: Array.isArray(doc.activities)
    ? doc.activities.filter(a => a).map(activity => ({
        title: activity.title || "",
        description: activity.description || "",
        imageUrl: activity.imageUrl || "",
      }))
    : [],

});
