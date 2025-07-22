import { IGetPackageUsecase } from "../../domain/interface/vendor/IGetPackageUsecase";
import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository"; 
import { IPackageModel } from "../../framework/database/Models/packageModel"; 
export class GetPackageUsecase implements IGetPackageUsecase {
  constructor(private packageRepository: IPackageRepository) {}

  async execute(destination?: string): Promise<IPackageModel[]> {
    if (destination) {
      return await this.packageRepository.getPackagesByDestination(destination);
    } else {
      return await this.packageRepository.getAllPackages();
    }
  }
}
