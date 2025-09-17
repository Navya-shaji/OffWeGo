import { AdminRepository } from "../../../adapters/repository/Admin/AdminRepository";
import { AdminLoginuseCase } from "../../../useCases/admin/Login/AdminLoginuseCase";
import { AdminController } from "../../../adapters/controller/Admin/AdminController";
import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";
import { HashPassword } from "../../Services/hashPassword";
import { JwtService } from "../../Services/jwtService";
import { GetVendorByEmailUseCase } from "../../../useCases/admin/vendor/GetVendorByEmailUsecase";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { UpdateVendorstatusUseCase } from "../../../useCases/vendor/Signup/UpdateVendorStatusUsecase";
import { GetAllVendorsUseCase } from "../../../useCases/admin/vendor/GetAllVendorsUsecase";
import { GetAllUsers } from "../../../useCases/admin/user/GetAllUserUsecase";
import { UserRepository } from "../../../adapters/repository/User/UserRepository";
import { UpdateUserUseCase } from "../../../useCases/admin/user/UpdateUserusecase";
import { GetAllDestinations } from "../../../useCases/destination/GetAllDestinationUsecase";
import { CreateDestination } from "../../../useCases/destination/CreateDestinationUsecase";
import { DestinationRepository } from "../../../adapters/repository/Destination/DestinationRepository";
import { EditDestination } from "../../../useCases/destination/EditDestinationUsecase";
import { UpdateVendorUsecase } from "../../../useCases/admin/vendor/UpdateVendorUsecase";
import { CreateCategory } from "../../../useCases/category/CreateCategoryUsecase";
import { CreateCatogoryController } from "../../../adapters/controller/category/CategoryController";
import { CategoryRepository } from "../../../adapters/repository/Category/CategoryRepository";
import { GetAllCategories } from "../../../useCases/category/GetAllCategoryUsecase";
import { CreateBanner } from "../../../useCases/banner/CreateBannerUsecase";
import { BannerRepository } from "../../../adapters/repository/Banner/BannerRepository";
import { GetAllBanners } from "../../../useCases/banner/GetAllBannerUsecase";
import { AdminUserController } from "../../../adapters/controller/Admin/AdminUserController";
import { Bannercontroller } from "../../../adapters/controller/Banner/BannerController";
import { DestinationController } from "../../../adapters/controller/Destination/DestinationController";
import { GetDestination } from "../../../useCases/destination/GetDestinationDetailUsecase";
import { DeleteDestination } from "../../../useCases/destination/DeleteDestinationUsecase";
import { EditCategory } from "../../../useCases/category/EditCategoryUsecase";
import { DeleteCategory } from "../../../useCases/category/DeleteCategoryusecase";
import { EditBanner } from "../../../useCases/banner/EditBannerUsecase";
import { DeleteBanner } from "../../../useCases/banner/DeleteBannerUSecase";
import { SubscriptionController } from "../../../adapters/controller/Subscriptionplan/SubscriptionPlanController";
import { CreateSubscriptionPlanUseCase } from "../../../useCases/subscription/CreateSubscriptionusecase";
import { SubscriptionPlanRepository } from "../../../adapters/repository/Subscription/SubscriptionRepo";
import { GetAllSubscription } from "../../../useCases/subscription/GetSubscriptionusecase";
import { SearchUserUSeCase } from "../../../useCases/admin/user/SearchUserUSecase";
import { SearchVendorUsecase } from "../../../useCases/admin/vendor/SearchVendorUsecase";
import { SearchDestination } from "../../../useCases/destination/SearchDestinationUsecase";
import { SearchCategoryUsecase } from "../../../useCases/category/SearchcategoryUSecase";
import { BannerActionUsecase } from "../../../useCases/banner/BannerActionusecase";

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
const editCategory=new EditCategory(catogoryRepo)
const deleteCategory=new DeleteCategory()
const editbanner=new EditBanner()
const deleteBanner=new DeleteBanner()
const subscriptionusecase=new CreateSubscriptionPlanUseCase(subscriptionrepo)
const getallsubscriptions=new GetAllSubscription(subscriptionrepo)
const searchuserusecase=new SearchUserUSeCase(userRepository)
const searchvendorusecase=new SearchVendorUsecase(vendorRepository)
const searchdestinationusecase=new SearchDestination(destinationRepository)
const searchcategory=new SearchCategoryUsecase(catogoryRepo)
const Banneractionusecase=new BannerActionUsecase(bannerRepo)

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
export const bannerController=new Bannercontroller(createbannerUsecase,getbannerUsecase,editbanner,deleteBanner,Banneractionusecase);
export const subscriptionController=new SubscriptionController(subscriptionusecase,getallsubscriptions)

