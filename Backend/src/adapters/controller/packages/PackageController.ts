import { ICreatePackage } from "../../../domain/interface/vendor/IAddPackageUsecase";
import { IGetPackageUsecase } from "../../../domain/interface/vendor/IGetPackageUsecase";
import { HttpStatus } from "../../../domain/statusCode/statuscode";
import { Request,Response } from "express";
import { DestinationModel } from "../../../framework/database/Models/deestinationModel";
import { IEditPackageUsecase } from "../../../domain/interface/vendor/IPackageEditUsecase";

export class PackageController{
    constructor(private getPackage:IGetPackageUsecase ,
        private createPackage: ICreatePackage,
        private editpackage:IEditPackageUsecase
    ){}
    async getAllPackage(req:Request,res:Response){
        try {
            const result=await this.getPackage.execute()
            res.status(HttpStatus.OK).json(result)
        } catch (error) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({message:"failed to get Destinations"})

        }
    }

     async addPackage(req: Request, res: Response) {
    try {
      const packageData = req.body;
      console.log("Package Data:", packageData);

      
      const destination = await DestinationModel.findById(packageData.destinationId);

      if (!destination) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Destination not found",
        });
      }

      packageData.destination = destination._id;

      const result = await this.createPackage.execute(packageData);
      console.log("Created Package:", result);

      res.status(HttpStatus.CREATED).json({ result });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Failed to create package",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
  async EditPackage(req:Request,res:Response){
    try {
      const packageId=req.params.id
      const packageData=req.body

      const result=await this.editpackage.execute(packageId,packageData)

      res.status(HttpStatus.OK).json({
        success:true,
        message:"Package updated successfully",
        data:result
      })
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:"Package updation failed"
      })
    }
  }
}