import { PackageDTO } from "../../domain/dto/Package/PackageDto";
import { IPackageModel } from "../../framework/database/Models/packageModel";

export const mapToPackageDTO = (doc: IPackageModel): PackageDTO => ({
  id: doc._id?.toString() || "",
  vendorId: doc.vendorId?.toString() || "",
  destinationId: doc.destinationId?.toString() || "",
  packageName: doc.packageName || "",
  description: doc.description || "",
  price: doc.price || 0,
  flightPrice: doc.flight?.price.economy || 0,
  duration: doc.duration || 0,
  startDate: doc.startDate || null,
  endDate: doc.endDate || null,
  images: Array.isArray(doc.images) ? doc.images : [],

  hotels: Array.isArray(doc.hotels)
    ? doc.hotels.map((hotel) => ({
      name: hotel.name || "",
      address: hotel.address || "",
      rating: hotel.rating ?? 0,
      destinationId: hotel.destinationId?.toString() || "",
    }))
    : [],

  activities: Array.isArray(doc.activities)
    ? doc.activities
      .filter((activity) => activity)
      .map((activity) => ({
        id: activity._id?.toString() || "",
        title: activity.title || "",
        description: activity.description || "",
        imageUrl: activity.imageUrl || "",
        destinationId: activity.destinationId?.toString() || "",
      }))
    : [],

  checkInTime: doc.checkInTime || "",
  checkOutTime: doc.checkOutTime || "",

  itinerary: Array.isArray(doc.itinerary)
    ? doc.itinerary.map((item) => ({
      day: item.day ?? 0,
      time: item.time || "",
      activity: item.activity || "",
    }))
    : [],

  inclusions: Array.isArray(doc.inclusions) ? doc.inclusions : [],
  amenities: Array.isArray(doc.amenities) ? doc.amenities : [],

  flightOption: doc.flightOption || false,
  flight: doc.flight
    ? {
      id: doc.flight.id,
      airLine: doc.flight.airLine || "",
      price: {
        economy: doc.flight.price.economy || 0,
        premium: doc.flight.price.premium,
        business: doc.flight.price.business,
      },
    }
    : null,
});
