import { IPackageRepository } from "../../domain/interface/Vendor/iPackageRepository";

export class DeletePackage{
    constructor(private _packageRepo:IPackageRepository){}

async execute(id: string): Promise<{ success: boolean; message: string }> {
  await this._packageRepo.delete(id);
  return {
    success: true,
    message: "Package deleted successfully"
  };
}

}