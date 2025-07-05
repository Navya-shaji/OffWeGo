import { AdminRepository } from "../../../adapters/repository/Admin/adminRepository";
import { AdminLoginuseCase } from "../../../useCases/admin/Login/AdminLoginuseCase";
import { AdminController } from "../../../adapters/controller/Admin/adminController";
import { HashPassword } from "../../services/hashPassword";
import { JwtSevice } from "../../services/jwtService";

//Repositories...........................................

const adminRepository=new AdminRepository()

//Services..............................................
const hashPassword=new HashPassword()
const jwtService=new JwtSevice()

//useCases................................................

const adminLoginuseCase=new AdminLoginuseCase(adminRepository,hashPassword,jwtService)

//Controller................................................

export const  adminController=new AdminController(adminLoginuseCase)