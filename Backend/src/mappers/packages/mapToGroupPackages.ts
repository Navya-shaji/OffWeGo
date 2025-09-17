import { PackageWiseGroup } from "../../domain/entities/PackagewiseGroup";
import { IPackageWiseGrouping } from "../../framework/database/Models/PackageWiseGroupingModel";

export const mapToPackageGroups=(doc:IPackageWiseGrouping):PackageWiseGroup=>({
id: doc._id.toString(),
  package_id: doc.package_id,
  minPeople: doc.minPeople,
  MaxPeople: doc.MaxPeople,
  startDate: doc.startDate,
  endDate: doc.endDate,
  currentBookings: doc.currentBookings,
  status: doc.status
})