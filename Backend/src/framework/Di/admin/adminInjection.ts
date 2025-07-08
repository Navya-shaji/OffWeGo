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
import { AdminGetAllVendorController } from "../../../adapters/controller/Admin/getAllVendorsController";
import { GetAllVendorsUseCase } from "../../../useCases/admin/Vendor/getAllVendorsUsecase";
import { GetVendorsByStatusController } from "../../../adapters/controller/Admin/getVendorByStatusController"; 
import { GetAllUsers } from "../../../useCases/admin/user/getAllUserUsecase";
import { AdminGetAllUserController } from "../../../adapters/controller/Admin/getAllUsers";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { UpdateUserUseCase } from "../../../useCases/admin/user/updateUserusecase";
import { AdminUpdateUserStatusController } from "../../../adapters/controller/Admin/UpdateUserByAdminController";


// Repositories
const adminRepository = new AdminRepository();
const vendorRepository = new VendorRepository();
const userRepository=new UserRepository()


// Services
const hashPassword = new HashPassword();
const jwtService = new JwtSevice();


// Use Cases
const adminLoginuseCase = new AdminLoginuseCase(adminRepository, hashPassword, jwtService);
const adminvendorfindByemailUsecase = new GetVendorByEmailUseCase(vendorRepository);
const updateVendorStatusUseCase = new UpdateVendorstatusUseCase(vendorRepository);
const getAllVendorsUsecase=new GetAllVendorsUseCase(vendorRepository)
const getallusers=new GetAllUsers(userRepository)
const updateUserusecase=new UpdateUserUseCase(userRepository)


// Controllers
export const adminController = new AdminController(adminLoginuseCase);
export const adminVendorController = new AdminVendorController(adminvendorfindByemailUsecase);
export const updateVendorStatusController = new UpdateVendorstatusController(updateVendorStatusUseCase);
export const getAllVendorsController = new AdminGetAllVendorController(getAllVendorsUsecase);
export const getAllUsersController=new AdminGetAllUserController(getallusers)
export const getVendorsByStatusController = new GetVendorsByStatusController(vendorRepository);
export const userstatusController=new AdminUpdateUserStatusController(updateUserusecase)