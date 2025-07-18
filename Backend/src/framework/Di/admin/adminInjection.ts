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
import { GetAllDestinationController } from "../../../adapters/controller/Destination/getDestinationController";
import { GetAllDestinations } from "../../../useCases/Destination/getAllDestinationUsecase";
import { CreateDestinationController } from "../../../adapters/controller/Destination/CreateDestinationController";
import { CreateDestination } from "../../../useCases/Destination/createDestinationUsecase";
import { DestinationRepository } from "../../../adapters/repository/Destination/destinationRepository";
import { EditDestination } from "../../../useCases/Destination/editDestinationUsecase";
import { EditDestinationController } from "../../../adapters/controller/Destination/editDestinationController";
import { AdminVenodrBlockandUnblockController } from "../../../adapters/controller/Admin/VenodrBlockAndUnblockController";
import { UpdateVendorUsecase } from "../../../useCases/admin/Vendor/updateVendorUsecase";
import { CreateCategory } from "../../../useCases/category/CreateCategoryUsecase";
import { CreateCatogoryController } from "../../../adapters/controller/category/categoryController";
import { CategoryRepository } from "../../../adapters/repository/category/categoryRepository";


// Repositories
const adminRepository = new AdminRepository();
const vendorRepository = new VendorRepository();
const userRepository=new UserRepository()
const destinationRepository=new DestinationRepository()
const catogoryRepo=new CategoryRepository()


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
const createdestinationusecase=new CreateDestination(destinationRepository)
const getallDestinations=new GetAllDestinations(destinationRepository)
const editDestination=new EditDestination()
const vendorblockUnblockUsecase=new UpdateVendorUsecase(vendorRepository)
const createcategoryUsecase=new CreateCategory(catogoryRepo)


// Controllers
export const adminController = new AdminController(adminLoginuseCase);
export const adminVendorController = new AdminVendorController(adminvendorfindByemailUsecase);
export const updateVendorStatusController = new UpdateVendorstatusController(updateVendorStatusUseCase);
export const getAllVendorsController = new AdminGetAllVendorController(getAllVendorsUsecase);
export const getAllUsersController=new AdminGetAllUserController(getallusers);
export const getVendorsByStatusController = new GetVendorsByStatusController(vendorRepository);
export const userstatusController=new AdminUpdateUserStatusController(updateUserusecase);
export const destinationController=new CreateDestinationController(createdestinationusecase);
export const getDestinationController=new GetAllDestinationController(getallDestinations);
export const editDestinationController=new EditDestinationController(editDestination);
export const vendorblockUnblockController=new AdminVenodrBlockandUnblockController(vendorblockUnblockUsecase)
export const catogoryController=new CreateCatogoryController(createcategoryUsecase)
