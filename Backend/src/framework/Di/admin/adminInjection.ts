import { AdminRepository } from "../../../adapters/repository/Admin/adminRepository";
import { AdminLoginuseCase } from "../../../useCases/admin/Login/AdminLoginuseCase";
import { AdminController } from "../../../adapters/controller/Admin/adminController";
import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";
import { HashPassword } from "../../services/hashPassword";
import { JwtSevice } from "../../services/jwtService";
import { GetVendorByEmailUseCase } from "../../../useCases/admin/Vendor/getVendorByEmailUsecase";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { UpdateVendorstatusUseCase } from "../../../useCases/vendor/Signup/updateVendorStatusUsecase";
import { GetAllVendorsUseCase } from "../../../useCases/admin/Vendor/getAllVendorsUsecase";
import { GetAllUsers } from "../../../useCases/admin/user/getAllUserUsecase";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { UpdateUserUseCase } from "../../../useCases/admin/user/updateUserusecase";
import { GetAllDestinations } from "../../../useCases/Destination/getAllDestinationUsecase";
import { CreateDestination } from "../../../useCases/Destination/createDestinationUsecase";
import { DestinationRepository } from "../../../adapters/repository/Destination/destinationRepository";
import { EditDestination } from "../../../useCases/Destination/editDestinationUsecase";
import { UpdateVendorUsecase } from "../../../useCases/admin/Vendor/updateVendorUsecase";
import { CreateCategory } from "../../../useCases/category/CreateCategoryUsecase";
import { CreateCatogoryController } from "../../../adapters/controller/category/categoryController";
import { CategoryRepository } from "../../../adapters/repository/category/categoryRepository";
import { GetAllCategories } from "../../../useCases/category/getAllCategoryUsecase";
import { CreateBanner } from "../../../useCases/banner/createBannerUsecase";
import { BannerRepository } from "../../../adapters/repository/banner/BannerRepository";
import { GetAllBanners } from "../../../useCases/banner/getAllBannerUsecase";
import { AdminUserController } from "../../../adapters/controller/Admin/AdminUserController";
import { Bannercontroller } from "../../../adapters/controller/Banner/BannerController";
import { DestinationController } from "../../../adapters/controller/Destination/DestinationController";
import { GetDestination } from "../../../useCases/Destination/getDestinationDetailUsecase";
import { DeleteDestination } from "../../../useCases/Destination/deleteDestinationUsecase";
import { EditCategory } from "../../../useCases/category/editCategoryUsecase";
import { DeleteCategory } from "../../../useCases/category/DeleteCategoryusecase";
// Repositories
const adminRepository = new AdminRepository();
const vendorRepository = new VendorRepository();
const userRepository=new UserRepository()
const destinationRepository=new DestinationRepository()
const catogoryRepo=new CategoryRepository()
const bannerRepo=new BannerRepository()


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
const getAllcategoryUsecase=new GetAllCategories(catogoryRepo)
const createbannerUsecase=new CreateBanner(bannerRepo)
const getbannerUsecase=new GetAllBanners(bannerRepo)
const getDestinationsingleUsecase = new GetDestination(destinationRepository);
const deleteDestinationusecase=new DeleteDestination()
const editCategory=new EditCategory()
const deleteCategory=new DeleteCategory()


// Controllers
export const adminController = new AdminController(adminLoginuseCase);
export const adminVendorController = new AdminVendorController(adminvendorfindByemailUsecase,getAllVendorsUsecase,updateVendorStatusUseCase,vendorblockUnblockUsecase,vendorRepository);
export const AdminuserController=new AdminUserController(getallusers,updateUserusecase);
export const destinationController = new DestinationController(
  createdestinationusecase,
  editDestination,           
  getallDestinations,        
  getDestinationsingleUsecase ,
  deleteDestinationusecase
)
export const categoryController=new CreateCatogoryController(createcategoryUsecase,getAllcategoryUsecase,editCategory,deleteCategory);
export const bannerController=new Bannercontroller(createbannerUsecase,getbannerUsecase);

