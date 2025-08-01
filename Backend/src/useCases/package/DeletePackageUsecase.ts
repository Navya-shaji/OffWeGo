import { Package } from "../../domain/entities/packageEntity";
import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository";

export class DeletePackage{
    constructor(private packageRepo:IPackageRepository){}

async execute(id: string): Promise<{ success: boolean; message: string }> {
  await this.packageRepo.delete(id);
  return {
    success: true,
    message: "Package deleted successfully"
  };
}

}