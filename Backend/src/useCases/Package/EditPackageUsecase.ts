import { PackageDTO } from "../../domain/dto/Package/PackageDto";
import { Package } from "../../domain/entities/PackageEntity";
import { packageModel } from "../../framework/database/Models/packageModel";
import { mapToPackageDTO } from "../../mappers/Packages/mapTopackages";

export class EditPackage {
  async execute(id: string, updatedData: Package): Promise<PackageDTO | null> {
    const updatedDoc = await packageModel.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    return updatedDoc ? mapToPackageDTO(updatedDoc) : null;
  }
}
