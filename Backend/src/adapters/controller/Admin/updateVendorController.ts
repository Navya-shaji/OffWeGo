import {Request,Response} from "express"
import { UpdateVendorstatusUseCase } from "../../../useCases/vendor/Signup/updateVendorStatusUsecase"
import { HttpStatus } from "../../../domain/statusCode/statuscode"

export class UpdateVendorstatusController{
    constructor(private updateVendorstatususecase:UpdateVendorstatusUseCase){}

    async VendorStatusController(req:Request,res:Response):Promise<void>{
        try {
            const email=req.params.email.toString().trim()
            const {status}=req.body

            if(!["approved","rejected"].includes(status)){
                res.status(HttpStatus.BAD_REQUEST).json({
                    success:false,message:"Invalid status value"

                })

                return 
            }

            await this.updateVendorstatususecase.execute(email,status)

            res.status(HttpStatus.OK).json({
                success:true,
                message:`vendor ${status} successfully`
            })

        } catch (error) {
            const err=error as Error
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                success:false,
                meassage:err.message
            })
        }
    }
}