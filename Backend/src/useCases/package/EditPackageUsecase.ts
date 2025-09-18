import { Package } from "../../domain/entities/PackageEntity";
import { packageModel } from "../../framework/database/Models/packageModel";
import { mapToPackageDto } from "../../mappers/Packages/mapTopackages";

export class EditPackage {
  async execute(id: string, updatedData: Package): Promise<Package | null> {
    const updatedDoc = await packageModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return updatedDoc ? mapToPackageDto(updatedDoc) : null;
  }
}
