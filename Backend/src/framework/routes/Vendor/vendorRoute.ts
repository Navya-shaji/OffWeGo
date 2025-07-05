import { Request,Response,Router } from "express";
import { vendorsignupcontroller } from "../../Di/Vendor/VendorInjections";


export class VendorRoute{
    public vendorRouter:Router;

    constructor(){
        this.vendorRouter=Router()
        this.setRoutes()
    }

    private setRoutes():void{
        this.vendorRouter.post("/signup",(req:Request,res:Response)=>{
            vendorsignupcontroller.VendorSignup(req,res)
        })
    }
}