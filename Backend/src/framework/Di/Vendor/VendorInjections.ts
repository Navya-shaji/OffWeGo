import { VendorSignupController } from "../../../adapters/controller/Vendor/VendorSignup";
import { VendorVerifyOtpController } from "../../../adapters/controller/Vendor/VerifyVendorOtp";
import { PackageController } from "../../../adapters/controller/packages/PackageController";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { OtpService } from "../../Services/otpService";
import { HashPassword } from "../../Services/hashPassword";
import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/SignupVendorUseCase";
import { verifyOtpUsecase } from "../../../useCases/vendor/Signup/VerifyOtpUsecase";
import { VendorStatusCheckUseCase } from "../../../useCases/vendor/Signup/VendorStatusCheckUseCase"; 
import { VendorStatusCheckController } from "../../../adapters/controller/Vendor/VendorStatusCheckController";
import { VendorLoginUsecase } from "../../../useCases/vendor/Login/VendorLoginUsecase";
import { VendorLoginController } from "../../../adapters/controller/Vendor/VendorLoginController";
import { VendorProfileController } from "../../../adapters/controller/Vendor/VendorProfileController";
import { VendorProfileUsecase } from "../../../useCases/vendor/profile/VendorProfileUsecase";
import { JwtService } from "../../Services/jwtService";
// import { DestinationRepository } from "../../../adapters/repository/Destination/DestinationRepository";
import { CreatePackagesUseCase } from "../../../useCases/package/AddPackageUsecase";
import { PackageRepository } from "../../../adapters/repository/Package/PackageRepository";
// import { GetPackageUsecase } from "../../../useCases/destination/GetPackageByDestinationUsecase";
import { EditPackage } from "../../../useCases/package/EditPackageUsecase";
import { DeletePackage } from "../../../useCases/package/DeletePackageUsecase";
import { EditVendorProfile } from "../../../useCases/vendor/profile/Edit profileUsecase";
import { PackageWiseGroupingController } from "../../../adapters/controller/packages/PackageWiseGroupingController";
import { CreatePackageWiseGroup } from "../../../useCases/package/PackageWiseGroupUsecase";
import { PackageWiseGrouping } from "../../../adapters/repository/Package/PackagewiseGroupingRepository";
import { GetAllPackageWiseGroup } from "../../../useCases/package/GetAllPackageWiseGroupsusecase";
import { CreateHotelUsecase } from "../../../useCases/hotel/CreateHotelUsecase";
import { HotelRepository } from "../../../adapters/repository/Hotel/HotelRepository";
import { ActivityRepository } from "../../../adapters/repository/Activity/ActivityRepository";
import { HotelController } from "../../../adapters/controller/packages/HotelController";
import { ActivityController } from "../../../adapters/controller/packages/ActivityController";
import { createActivityUsecase } from "../../../useCases/activity/CreateActivityUsecase";
import { GetHotelUsecase } from "../../../useCases/hotel/GetHotelUsecase";
import { GetAllActivitiesUsecase } from "../../../useCases/activity/GetallActivitiesusecase";
import { EditActivity } from "../../../useCases/activity/EditActivityUsecase";
import { DeleteActivity } from "../../../useCases/activity/DeleteActivityUsecase";
import { EditHotelusecase } from "../../../useCases/hotel/EditHotelUsecase";
import { DeleteHotelUsecase } from "../../../useCases/hotel/DeleteHotelusecase";
import { SearchPackage } from "../../../useCases/package/SearchPackageUsecase";
import { searchHotelusecase } from "../../../useCases/hotel/HotelSearchUsecase";
import { SearchActivityusecase } from "../../../useCases/activity/SearchActivityusecase";
import { GetDestinationBasedPackageUseCase } from "../../../useCases/package/getDestinationBasedPackages";
import { GetPackages } from "../../../useCases/package/GetAllPackageUsecase";

//  Setup Repository and Services
const vendorRepository = new VendorRepository();
const otpService = new OtpService();
const hashPassword = new HashPassword();
const jwtService = new JwtService();
// const destinationRepo=new DestinationRepository()
const packageRepo=new PackageRepository()
const groupRepo=new PackageWiseGrouping()
const hotelRepo=new HotelRepository()
const activityRepo=new ActivityRepository()


//  Use Cases
const vendorSignupUsecase = new VendorRegisterUseCase(vendorRepository, otpService,hashPassword);
const vendorVerifyOtpUseCase = new verifyOtpUsecase(otpService,);
const vendorStatusUseCase = new VendorStatusCheckUseCase(vendorRepository);
const vendorloginusecase=new VendorLoginUsecase(vendorRepository,hashPassword,jwtService);
const vendorProfileusecase=new VendorProfileUsecase(vendorRepository);
const createPackageUsecase=new CreatePackagesUseCase(packageRepo);
// const getallPackageUsecase=new GetPackageUsecase(packageRepo);
const editpackage=new EditPackage()
const deletepackage=new DeletePackage(packageRepo)
const editvendorProfile=new EditVendorProfile()
const packagewisegroupusecase=new CreatePackageWiseGroup(groupRepo)
const getallpackagewisegroups=new GetAllPackageWiseGroup(groupRepo)
const createHotelUsecase=new CreateHotelUsecase(hotelRepo)
const createactivityUsecase=new createActivityUsecase(activityRepo)
const getallHotels=new GetHotelUsecase(hotelRepo)
const getallActivities=new GetAllActivitiesUsecase(activityRepo)
const editActivityusecase=new EditActivity(activityRepo)
const deleteactivityusecase=new DeleteActivity(activityRepo)
const editHotelusecase=new EditHotelusecase(hotelRepo)
const deletehotelusecase=new DeleteHotelUsecase(hotelRepo)
const searchPackage=new SearchPackage(packageRepo)
const searchhotelusecase=new searchHotelusecase(hotelRepo)
const searchActivityusecase=new SearchActivityusecase(activityRepo)
const getPAckageByDestination=new GetDestinationBasedPackageUseCase(packageRepo)
const getAllpackageByVendor=new GetPackages(packageRepo)

//  Controllers
export const vendorsignupcontroller = new VendorSignupController(vendorSignupUsecase);
export const vendorVerifyOtpController = new VendorVerifyOtpController(vendorVerifyOtpUseCase);
export const vendorstatusCheckController =new  VendorStatusCheckController(vendorStatusUseCase);
export const vendorloginController=new VendorLoginController(vendorloginusecase,jwtService);
export const vendorProfilecontroller=new VendorProfileController(vendorProfileusecase,editvendorProfile);
export const packagecontroller=new PackageController(getAllpackageByVendor,createPackageUsecase,editpackage,deletepackage,searchPackage,getPAckageByDestination);
export const packagewisegroupcontroller=new PackageWiseGroupingController(packagewisegroupusecase,getallpackagewisegroups);
export const hotelcontroller=new HotelController(createHotelUsecase,getallHotels,editHotelusecase,deletehotelusecase,searchhotelusecase);
export const activitycontroller=new ActivityController(createactivityUsecase,getallActivities,editActivityusecase,deleteactivityusecase,searchActivityusecase)