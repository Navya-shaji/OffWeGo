import { VendorSignupController } from "../../../adapters/controller/Vendor/VendorSignup";
import { VendorVerifyOtpController } from "../../../adapters/controller/Vendor/verifyVendorOtp";
import { PackageController } from "../../../adapters/controller/Packages/PackageController";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { OtpService } from "../../Services/otpService";
import { HashPassword } from "../../Services/hashPassword";
import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase";
import { verifyOtpUsecase } from "../../../useCases/vendor/Signup/verifyOtpUsecase";
import { VendorStatusCheckUseCase } from "../../../useCases/vendor/Signup/VendorStatusCheckUseCase"; 
import { VendorStatusCheckController } from "../../../adapters/controller/Vendor/vendorStatusCheckController";
import { VendorLoginUsecase } from "../../../useCases/vendor/Login/VendorLoginUsecase";
import { VendorLoginController } from "../../../adapters/controller/Vendor/VendorLoginController";
import { VendorProfileController } from "../../../adapters/controller/Vendor/VendorProfileController";
import { VendorProfileUsecase } from "../../../useCases/vendor/profile/VendorProfileUsecase";
import { JwtService } from "../../Services/jwtService";
import { CreatePackagesUseCase } from "../../../useCases/package/addPackageUsecase";
import { PackageRepository } from "../../../adapters/repository/Package/PackageRepository";
import { EditPackage } from "../../../useCases/package/EditPackageUsecase";
import { DeletePackage } from "../../../useCases/package/DeletePackageUsecase";
import { EditVendorProfile } from "../../../useCases/vendor/profile/Edit profileUsecase";
import { CreateHotelUsecase } from "../../../useCases/hotel/createHotelUsecase";
import { HotelRepository } from "../../../adapters/repository/Hotel/HotelRepository";
import { ActivityRepository } from "../../../adapters/repository/Activity/ActivityRepository";
import { HotelController } from "../../../adapters/controller/Packages/HotelController";
import { ActivityController } from "../../../adapters/controller/Packages/ActivityController";
import { createActivityUsecase } from "../../../useCases/activity/createActivityUsecase";
import { GetHotelUsecase } from "../../../useCases/hotel/getHotelUsecase";
import { GetAllActivitiesUsecase } from "../../../useCases/activity/getallActivitiesusecase";
import { EditActivity } from "../../../useCases/activity/editActivityUsecase";
import { DeleteActivity } from "../../../useCases/activity/deleteActivityUsecase";
import { EditHotelusecase } from "../../../useCases/hotel/editHotelUsecase";
import { DeleteHotelUsecase } from "../../../useCases/hotel/deleteHotelusecase";
import { SearchPackage } from "../../../useCases/package/SearchPackageUsecase";
import { searchHotelusecase } from "../../../useCases/hotel/HotelSearchUsecase";
import { SearchActivityusecase } from "../../../useCases/activity/searchActivityusecase";
import { GetDestinationBasedPackageUseCase } from "../../../useCases/package/getDestinationBasedPackages";
import { GetPackages } from "../../../useCases/package/getAllPackageUsecase";
import { CreateflightUsecase } from "../../../useCases/flight/CreateFlightUsecase";
import { FlightRepository } from "../../../adapters/repository/Flight/FlightRepository";
import { FlightController } from "../../../adapters/controller/Flight/FlightController";
import { GetAllFlightUsecase } from "../../../useCases/flight/GetAllFlightUsecase";
import { EditFlightUsecase } from "../../../useCases/flight/EditFlightUsecase";
import { DeleteFlightUsecase } from "../../../useCases/flight/DeleteFlightUSecase";

//  Setup Repository and Services
const vendorRepository = new VendorRepository();
const otpService = new OtpService();
const hashPassword = new HashPassword();
const jwtService = new JwtService();
const packageRepo=new PackageRepository()
const hotelRepo=new HotelRepository()
const activityRepo=new ActivityRepository()
const flightRepo=new FlightRepository()


//  Use Cases
const vendorSignupUsecase = new VendorRegisterUseCase(vendorRepository, otpService,hashPassword);
const vendorVerifyOtpUseCase = new verifyOtpUsecase(otpService,);
const vendorStatusUseCase = new VendorStatusCheckUseCase(vendorRepository);
const vendorloginusecase=new VendorLoginUsecase(vendorRepository,hashPassword,jwtService);
const vendorProfileusecase=new VendorProfileUsecase(vendorRepository);
const createPackageUsecase=new CreatePackagesUseCase(packageRepo);
const editpackage=new EditPackage()
const deletepackage=new DeletePackage(packageRepo)
const editvendorProfile=new EditVendorProfile()
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
const createflightusecase=new CreateflightUsecase(flightRepo)
const getallflightusecase=new GetAllFlightUsecase(flightRepo)
const editflightusecase=new EditFlightUsecase(flightRepo)
const deleteflightusecase=new DeleteFlightUsecase(flightRepo)

//  Controllers
export const vendorsignupcontroller = new VendorSignupController(vendorSignupUsecase);
export const vendorVerifyOtpController = new VendorVerifyOtpController(vendorVerifyOtpUseCase);
export const vendorstatusCheckController =new  VendorStatusCheckController(vendorStatusUseCase);
export const vendorloginController=new VendorLoginController(vendorloginusecase,jwtService);
export const vendorProfilecontroller=new VendorProfileController(vendorProfileusecase,editvendorProfile);
export const packagecontroller=new PackageController(getAllpackageByVendor,createPackageUsecase,editpackage,deletepackage,searchPackage,getPAckageByDestination);
export const hotelcontroller=new HotelController(createHotelUsecase,getallHotels,editHotelusecase,deletehotelusecase,searchhotelusecase);
export const activitycontroller=new ActivityController(createactivityUsecase,getallActivities,editActivityusecase,deleteactivityusecase,searchActivityusecase)
export const flightcontroller=new FlightController(createflightusecase,getallflightusecase,editflightusecase,deleteflightusecase)