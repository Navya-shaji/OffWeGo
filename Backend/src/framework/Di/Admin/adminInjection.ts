import { AdminRepository } from "../../../adapters/repository/Admin/AdminRepository";
import { AdminLoginuseCase } from "../../../useCases/Admin/Login/AdminLoginuseCase";
import { AdminController } from "../../../adapters/controller/Admin/AdminController";
import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";
import { HashPassword } from "../../Services/hashPassword";
import { JwtService } from "../../Services/jwtService";
import { GetVendorByEmailUseCase } from "../../../useCases/Admin/Vendor/getVendorByEmailUsecase";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { UpdateVendorstatusUseCase } from "../../../useCases/Vendor/Signup/updateVendorStatusUsecase";
import { GetAllVendorsUseCase } from "../../../useCases/Admin/Vendor/getAllVendorsUsecase";
import { GetAllUsersUsecase } from "../../../useCases/Admin/user/getAllUserUsecase";
import { UserRepository } from "../../../adapters/repository/User/UserRepository";
import { UpdateUserUseCase } from "../../../useCases/Admin/user/updateUserusecase";
import { GetAllDestinations } from "../../../useCases/destination/getAllDestinationUsecase";
import { CreateDestination } from "../../../useCases/destination/createDestinationUsecase";
import { DestinationRepository } from "../../../adapters/repository/Destination/DestinationRepository";
import { EditDestination } from "../../../useCases/destination/editDestinationUsecase";
import { UpdateVendorUsecase } from "../../../useCases/Admin/Vendor/updateVendorUsecase";
import { CreateCategory } from "../../../useCases/Category/CreateCategoryUsecase";
import { CategoryRepository } from "../../../adapters/repository/Category/CategoryRepository";
import { GetAllCategories } from "../../../useCases/Category/getAllCategoryUsecase";
import { CreateBanner } from "../../../useCases/Banner/createBannerUsecase";
import { BannerRepository } from "../../../adapters/repository/Banner/BannerRepository";
import { GetAllBanners } from "../../../useCases/Banner/getAllBannerUsecase";
import { AdminUserController } from "../../../adapters/controller/Admin/AdminUserController";
import { BannerController } from "../../../adapters/controller/Banner/BannerController";
import { DestinationController } from "../../../adapters/controller/Destination/DestinationController";
import { GetDestination } from "../../../useCases/destination/getDestinationDetailUsecase";
import { DeleteDestination } from "../../../useCases/destination/deleteDestinationUsecase";
import { EditCategory } from "../../../useCases/Category/editCategoryUsecase";
import { DeleteCategory } from "../../../useCases/Category/DeleteCategoryusecase";
import { EditBanner } from "../../../useCases/Banner/EditBannerUsecase";
import { DeleteBanner } from "../../../useCases/Banner/DeleteBannerUSecase";
import { CreateSubscriptionUseCase } from "../../../useCases/Subscription/createSubscriptionusecase";
import { SubscriptionPlanRepository } from "../../../adapters/repository/Subscription/SubscriptionRepo";
import { GetAllSubscription } from "../../../useCases/Subscription/GetSubscriptionusecase";
import { SearchUserUseCase } from "../../../useCases/Admin/user/SearchUserUSecase";
import { SearchVendorUsecase } from "../../../useCases/Admin/Vendor/SearchVendorUsecase";
import { SearchDestination } from "../../../useCases/destination/searchDestinationUsecase";
import { SearchCategoryUsecase } from "../../../useCases/Category/searchcategoryUSecase";
import { BannerActionUsecase } from "../../../useCases/Banner/BannerActionusecase";
import { EditSubscriptionUseCase } from "../../../useCases/Subscription/EditSubscriptionusecase";
import { DeleteSubscriptionUsecase } from "../../../useCases/Subscription/DeleteSubscriptionusecase";
import { SubscriptionController } from "../../../adapters/controller/Subscriptionplan/SubscriptionPlanController";
import { GetNearByDestinationUSecase } from "../../../useCases/destination/GetNearByDestinationUsecase";
import { CreateCategoryController } from "../../../adapters/controller/Category/CategoryController";
import { FirebaseNotificationService } from "../../Services/FirebaseNotificationService";
// import { SendNotificationUseCase } from "../../../useCases/notifications/SendNotificationUsecase";
import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";
import { GetSubscriptionBookingUseCase } from "../../../useCases/Subscription/GetAllSubscriptionBookingUsecase";
import { SubscriptionBookingRepository } from "../../../adapters/repository/Booking/SubscriptionBookingRepo";
import { ListTravelPostsUsecase } from "../../../useCases/TravelPost/ListTravelPostsUsecase";
import { ApproveTravelPostUsecase } from "../../../useCases/TravelPost/ApproveTravelPostUsecase";
import { RejectTravelPostUsecase } from "../../../useCases/TravelPost/RejectTravelPostUsecase";
import { AdminTravelPostController } from "../../../adapters/controller/Admin/AdminTravelPostController";
import { GetVendorSubscriptionHistoryUseCase } from "../../../useCases/Subscription/GetVendorSubscriptionUsecase";
import { TravelPostRepository } from "../../../adapters/repository/TravelPost/TravelPostRepository";
// import { NotificationController } from "../../../adapters/controller/Notifications/NotificationController";
// import { SendNotificationUseCase } from "../../../useCases/notifications/SendNotificationUsecase";
// import { GetNotificationUseCase } from "../../../useCases/notifications/GetNotificationusecase";
// import { NotificationRepository } from "../../../adapters/repository/Notification/NotificationRepo";

import { WalletRepository } from "../../../adapters/repository/Wallet/WalletRepository";

// ... existing imports ...

// Repositories
const adminRepository = new AdminRepository();
const vendorRepository = new VendorRepository();
const userRepository = new UserRepository()
const destinationRepository = new DestinationRepository()
const catogoryRepo = new CategoryRepository()
const bannerRepo = new BannerRepository()
const subscriptionrepo = new SubscriptionPlanRepository()
const vendorRepo = new VendorRepository()
const userRepo = new UserRepository()
const notitifiactionRepo = new NotificationRepository()
const notificationRepo = new FirebaseNotificationService(notitifiactionRepo, userRepo, vendorRepo)
const subscriptionbookingRepo = new SubscriptionBookingRepository()
const travelPostRepo = new TravelPostRepository()
const walletRepo = new WalletRepository();

// Services
const hashPassword = new HashPassword();
const jwtService = new JwtService();

// Use Cases
const adminLoginuseCase = new AdminLoginuseCase(adminRepository, hashPassword, jwtService);
const adminvendorfindByemailUsecase = new GetVendorByEmailUseCase(vendorRepository);
const updateVendorStatusUseCase = new UpdateVendorstatusUseCase(vendorRepository, walletRepo);
// ... existing instantiations ...
const getallusers = new GetAllUsersUsecase(userRepository)
const getAllVendorsUseCase = new GetAllVendorsUseCase(vendorRepository)
const updateUserusecase = new UpdateUserUseCase(userRepository)
const createdestinationusecase = new CreateDestination(destinationRepository)
const getallDestinations = new GetAllDestinations(destinationRepository)
const editDestination = new EditDestination()
const vendorblockUnblockUsecase = new UpdateVendorUsecase(vendorRepository, notificationRepo)
const createcategoryUsecase = new CreateCategory(catogoryRepo, vendorRepo, notificationRepo)
const getAllcategoryUsecase = new GetAllCategories(catogoryRepo)
const createbannerUsecase = new CreateBanner(bannerRepo)
const getbannerUsecase = new GetAllBanners(bannerRepo)
const getDestinationsingleUsecase = new GetDestination(destinationRepository);
const deleteDestinationusecase = new DeleteDestination()
const editCategory = new EditCategory(catogoryRepo)
const deleteCategory = new DeleteCategory()
const editbanner = new EditBanner()
const deleteBanner = new DeleteBanner()
const subscriptionusecase = new CreateSubscriptionUseCase(subscriptionrepo, vendorRepo, notificationRepo)
const getallsubscriptions = new GetAllSubscription(subscriptionrepo)
const searchuserusecase = new SearchUserUseCase(userRepository)
const searchvendorusecase = new SearchVendorUsecase(vendorRepository)
const searchdestinationusecase = new SearchDestination(destinationRepository)
const searchcategory = new SearchCategoryUsecase(catogoryRepo)
const Banneractionusecase = new BannerActionUsecase(bannerRepo)
const subscriptioneditusecase = new EditSubscriptionUseCase(subscriptionrepo)
const deletesubscriptionusecase = new DeleteSubscriptionUsecase(subscriptionrepo)
const getnearbydestinationusecase = new GetNearByDestinationUSecase(destinationRepository)
const getVendorSubscriptionHistoryUseCase = new GetVendorSubscriptionHistoryUseCase(subscriptionbookingRepo)
// const sendnotificationusecase=new SendNotificationUseCase(notificationService)
// const getNotificationusecase=new GetNotificationUseCase(notificationRepo)
const getbookedsubscriptionusecase = new GetSubscriptionBookingUseCase(subscriptionbookingRepo)

const listTravelPostsUsecase = new ListTravelPostsUsecase(travelPostRepo,userRepo)
const approveTravelPostUsecase = new ApproveTravelPostUsecase(travelPostRepo)
const rejectTravelPostUsecase = new RejectTravelPostUsecase(travelPostRepo)

// Controllers
export const adminController = new AdminController(adminLoginuseCase);
export const adminVendorController = new AdminVendorController(adminvendorfindByemailUsecase, getAllVendorsUseCase, updateVendorStatusUseCase, vendorblockUnblockUsecase, vendorRepository, searchvendorusecase);
export const AdminuserController = new AdminUserController(getallusers, updateUserusecase, searchuserusecase);
export const destinationController = new DestinationController(
  createdestinationusecase,
  editDestination,
  getallDestinations,
  getDestinationsingleUsecase,
  deleteDestinationusecase,
  searchdestinationusecase,
  getnearbydestinationusecase
)
export const categoryController = new CreateCategoryController(createcategoryUsecase, getAllcategoryUsecase, editCategory, deleteCategory, searchcategory);
export const bannerController = new BannerController(createbannerUsecase, getbannerUsecase, editbanner, deleteBanner, Banneractionusecase);
export const subscriptionController = new SubscriptionController(subscriptionusecase, getallsubscriptions, subscriptioneditusecase, deletesubscriptionusecase, getbookedsubscriptionusecase, getVendorSubscriptionHistoryUseCase)
export const adminTravelPostController = new AdminTravelPostController(
  listTravelPostsUsecase,
  approveTravelPostUsecase,
  rejectTravelPostUsecase
)
// export const notificationcontroller=new NotificationController(sendnotificationusecase,getNotificationusecase)
