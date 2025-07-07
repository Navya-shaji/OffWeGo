import { AdminRepository } from "../../../adapters/repository/Admin/adminRepository";
import { AdminLoginuseCase } from "../../../useCases/admin/Login/AdminLoginuseCase";
import { AdminController } from "../../../adapters/controller/Admin/adminController";
import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";
import { HashPassword } from "../../services/hashPassword";
import { JwtSevice } from "../../services/jwtService";
import { GetVendorByEmailUseCase } from "../../../useCases/admin/Vendor/getVendorByEmailUsecase";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { UpdateVendorstatusUseCase } from "../../../useCases/vendor/Signup/updateVendorStatusUsecase";
import { UpdateVendorstatusController } from "../../../adapters/controller/Admin/updateVendorController";

//Repositories...........................................

const adminRepository=new AdminRepository()
const vendorRepository=new VendorRepository()


//Services..............................................
const hashPassword=new HashPassword()
const jwtService=new JwtSevice()

//useCases................................................

const adminLoginuseCase=new AdminLoginuseCase(adminRepository,hashPassword,jwtService)
const adminvendorfindByemailUsecase= new GetVendorByEmailUseCase(vendorRepository)
const updateVendorStatusUseCase=new UpdateVendorstatusUseCase(vendorRepository)



//Controller................................................

export const  adminController=new AdminController(adminLoginuseCase)
export const  adminVendorController=new AdminVendorController(adminvendorfindByemailUsecase)
export const updateVendorStatusController=new UpdateVendorstatusController(updateVendorStatusUseCase)