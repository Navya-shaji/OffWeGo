import { IActivityRepository } from "../../domain/interface/Vendor/IactivityRepository";
import { IdeleteActivity } from "../../domain/interface/Vendor/IdeleteActivityUsecase";

export class DeleteActivity implements IdeleteActivity{
  constructor(private _ActivityRepo:IActivityRepository){}

  async execute(id: string): Promise<{ success: boolean; message: string; }> {
      const result=await this._ActivityRepo.delete(id)
     

        return {success:true,message:"Activity deleted successfully"}
  }
}