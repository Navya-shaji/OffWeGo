import { IGetPackageUsecase } from "../../domain/interface/vendor/IGetPackageUsecase";
import { IPackageRepository } from "../../domain/interface/vendor/iPackageRepository"; 
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
