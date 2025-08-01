import { ICreateGroupUseCase } from "../../../domain/interface/vendor/IPackageWiseGroupUsecase";
import { Request, Response } from "express";
import { HttpStatus } from "../../../domain/statusCode/statuscode";

export class PackageWiseGroupingController{
    constructor(private createGroupUsecase:ICreateGroupUseCase){}

    async CreatePackageWiseGrouping(req:Request,res:Response){
        try {
            const groupData=req.body
            const result=await this.createGroupUsecase.execute(groupData)
            res.status(HttpStatus.OK).json({
                success:true,
                message:"Package wise group created",
                data:result
            })
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                message:"Package wise group creation failed"
            })
        }
    }
}