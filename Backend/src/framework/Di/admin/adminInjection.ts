import { AdminRepository } from "../../../adapters/repository/Admin/AdminRepository";
import { AdminLoginuseCase } from "../../../useCases/admin/Login/AdminLoginuseCase";
import { AdminController } from "../../../adapters/controller/Admin/AdminController";
import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";
import { HashPassword } from "../../services/hashPassword";
import { JwtService } from "../../services/jwtService";
import { GetVendorByEmailUseCase } from "../../../useCases/admin/Vendor/getVendorByEmailUsecase";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { UpdateVendorstatusUseCase } from "../../../useCases/vendor/Signup/updateVendorStatusUsecase";
import { GetAllVendorsUseCase } from "../../../useCases/admin/Vendor/GetAllVendorsUsecase";
import { GetAllUsers } from "../../../useCases/admin/user/GetAllUserUsecase";
import { UserRepository } from "../../../adapters/repository/user/userRepository";
import { UpdateUserUseCase } from "../../../useCases/admin/user/UpdateUserusecase";
import { GetAllDestinations } from "../../../useCases/Destination/getAllDestinationUsecase";
import { CreateDestination } from "../../../useCases/Destination/createDestinationUsecase";
import { DestinationRepository } from "../../../adapters/repository/Destination/DestinationRepository";
import { EditDestination } from "../../../useCases/Destination/editDestinationUsecase";
import { UpdateVendorUsecase } from "../../../useCases/admin/Vendor/updateVendorUsecase";
import { CreateCategory } from "../../../useCases/category/CreateCategoryUsecase";
import { CreateCatogoryController } from "../../../adapters/controller/category/CategoryController";
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
import { EditBanner } from "../../../useCases/banner/EditBannerUsecase";
import { DeleteBanner } from "../../../useCases/banner/DeleteBannerUSecase";
import { SubscriptionController } from "../../../adapters/controller/Subscriptionplan/SubscriptionPlanController";
import { CreateSubscriptionPlanUseCase } from "../../../useCases/subscription/createSubscriptionusecase";
import { SubscriptionPlanRepository } from "../../../adapters/repository/Subscription/subscriptionRepo";
import { GetAllSubscription } from "../../../useCases/subscription/GetSubscriptionusecase";
import { SearchUserUSeCase } from "../../../useCases/admin/user/SearchUserUSecase";
import { SearchVendorUsecase } from "../../../useCases/admin/Vendor/SearchVendorUsecase";
import { SearchDestination } from "../../../useCases/Destination/searchDestinationUsecase";
import { SearchCategoryUsecase } from "../../../useCases/category/searchcategoryUSecase";

// Repositories
const adminRepository = new AdminRepository();
const vendorRepository = new VendorRepository();
const userRepository=new UserRepository()
const destinationRepository=new DestinationRepository()
const catogoryRepo=new CategoryRepository()
const bannerRepo=new BannerRepository()
const subscriptionrepo=new SubscriptionPlanRepository()


// Services
const hashPassword = new HashPassword();
const jwtService = new JwtService();


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
const editbanner=new EditBanner()
const deleteBanner=new DeleteBanner()
const subscriptionusecase=new CreateSubscriptionPlanUseCase(subscriptionrepo)
const getallsubscriptions=new GetAllSubscription(subscriptionrepo)
const searchuserusecase=new SearchUserUSeCase(userRepository)
const searchvendorusecase=new SearchVendorUsecase(vendorRepository)
const searchdestinationusecase=new SearchDestination(destinationRepository)
const searchcategory=new SearchCategoryUsecase(catogoryRepo)

// Controllers
export const adminController = new AdminController(adminLoginuseCase);
export const adminVendorController = new AdminVendorController(adminvendorfindByemailUsecase,getAllVendorsUsecase,updateVendorStatusUseCase,vendorblockUnblockUsecase,vendorRepository,searchvendorusecase);
export const AdminuserController=new AdminUserController(getallusers,updateUserusecase,searchuserusecase);
export const destinationController = new DestinationController(
  createdestinationusecase,
  editDestination,           
  getallDestinations,        
  getDestinationsingleUsecase ,
  deleteDestinationusecase,
  searchdestinationusecase
)
export const categoryController=new CreateCatogoryController(createcategoryUsecase,getAllcategoryUsecase,editCategory,deleteCategory,searchcategory);
export const bannerController=new Bannercontroller(createbannerUsecase,getbannerUsecase,editbanner,deleteBanner);
export const subscriptionController=new SubscriptionController(subscriptionusecase,getallsubscriptions)

