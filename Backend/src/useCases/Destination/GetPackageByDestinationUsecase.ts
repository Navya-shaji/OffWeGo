import { IGetPackageUsecase } from "../../domain/interface/Vendor/IGetPackageUsecase";
import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository"; 
import { IPackageModel } from "../../framework/database/Models/packageModel"; 

export class GetPackageUsecase implements IGetPackageUsecase {
  constructor(private _packageRepository: IPackageRepository) {}

  async execute(destination?: string): Promise<IPackageModel[]> {
    if (destination) {
      return await this._packageRepository.getPackagesByDestination(destination);
    }
    return []; 
  }
}
