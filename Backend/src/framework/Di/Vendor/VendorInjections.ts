import { VendorSignupController } from "../../../adapters/controller/Vendor/VendorSignup";
import { VendorVerifyOtpController } from "../../../adapters/controller/Vendor/verifyVendorOtp";
import { PackageController } from "../../../adapters/controller/packages/PackageController";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { OtpService } from "../../services/otpService";
import { HashPassword } from "../../services/hashPassword";
import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase";
import { verifyOtpUsecase } from "../../../useCases/vendor/Signup/verifyOtpUsecase";
import { VendorStatusCheckUseCase } from "../../../useCases/vendor/Signup/VendorStatusCheckUseCase"; 
import { VendorStatusCheckController } from "../../../adapters/controller/Vendor/vendorStatusCheckController";
import { VendorLoginUsecase } from "../../../useCases/vendor/Login/VendorLoginUsecase";
import { VendorLoginController } from "../../../adapters/controller/Vendor/vendorLoginController";
import { VendorProfileController } from "../../../adapters/controller/Vendor/VendorProfileController";
import { VendorProfileUsecase } from "../../../useCases/vendor/profile/VendorProfileUsecase";
import { JwtSevice } from "../../services/jwtService";
import { DestinationRepository } from "../../../adapters/repository/Destination/destinationRepository";
import { CreatePackagesUseCase } from "../../../useCases/package/addPackageUsecase";
import { PackageRepository } from "../../../adapters/repository/package/PackageRepository";
import { GetAllPackages } from "../../../useCases/package/getAllPackageUsecase";
import { EditPackage } from "../../../useCases/package/EditPackageUsecase";
import { DeletePackage } from "../../../useCases/package/DeletePackageUsecase";
import { EditVendorProfile } from "../../../useCases/vendor/profile/Edit profileUsecase";
import { PackageWiseGroupingController } from "../../../adapters/controller/packages/PackageWiseGroupingController";
import { CreatePackageWiseGroup } from "../../../useCases/package/PackageWiseGroupUsecase";
import { PackageWiseGrouping } from "../../../adapters/repository/package/PackagewiseGroupingRepository";
import { GetAllPackageWiseGroup } from "../../../useCases/package/GetAllPackageWiseGroupsusecase";

//  Setup Repository and Services
const vendorRepository = new VendorRepository();
const otpService = new OtpService();
const hashPassword = new HashPassword();
const jwtService = new JwtSevice();
const destinationRepo=new DestinationRepository()
const packageRepo=new PackageRepository()
const groupRepo=new PackageWiseGrouping()

//  Use Cases
const vendorSignupUsecase = new VendorRegisterUseCase(vendorRepository, otpService,hashPassword);
const vendorVerifyOtpUseCase = new verifyOtpUsecase(otpService,);
const vendorStatusUseCase = new VendorStatusCheckUseCase(vendorRepository);
const vendorloginusecase=new VendorLoginUsecase(vendorRepository,hashPassword,jwtService);
const vendorProfileusecase=new VendorProfileUsecase(vendorRepository);
const createPackageUsecase=new CreatePackagesUseCase(packageRepo);
const getallPackageUsecase=new GetAllPackages(packageRepo);
const editpackage=new EditPackage()
const deletepackage=new DeletePackage(packageRepo)
const editvendorProfile=new EditVendorProfile()
const packagewisegroupusecase=new CreatePackageWiseGroup(groupRepo)
const getallpackagewisegroups=new GetAllPackageWiseGroup(groupRepo)

//  Controllers
export const vendorsignupcontroller = new VendorSignupController(vendorSignupUsecase);
export const vendorVerifyOtpController = new VendorVerifyOtpController(vendorVerifyOtpUseCase);
export const vendorstatusCheckController =new  VendorStatusCheckController(vendorStatusUseCase);
export const vendorloginController=new VendorLoginController(vendorloginusecase);
export const vendorProfilecontroller=new VendorProfileController(vendorProfileusecase,editvendorProfile);
export const packagecontroller=new PackageController(getallPackageUsecase,createPackageUsecase,editpackage,deletepackage)
export const packagewisegroupcontroller=new PackageWiseGroupingController(packagewisegroupusecase,getallpackagewisegroups)

