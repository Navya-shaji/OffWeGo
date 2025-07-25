import { VendorSignupController } from "../../../adapters/controller/Vendor/VendorSignup";
import { VendorVerifyOtpController } from "../../../adapters/controller/Vendor/verifyVendorOtp";
// import { UpdateVendorstatusController } from "../../../adapters/controller/Admin/updateVendorController";

import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { OtpService } from "../../services/otpService";
import { HashPassword } from "../../services/hashPassword";

import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase";
import { verifyOtpUsecase } from "../../../useCases/vendor/Signup/verifyOtpUsecase";
import { UpdateVendorstatusUseCase } from "../../../useCases/vendor/Signup/updateVendorStatusUsecase"; 
import { GetVendorByEmailUseCase } from "../../../useCases/admin/Vendor/getVendorByEmailUsecase";
// import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";
import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";
import { VendorStatusCheckUseCase } from "../../../useCases/vendor/Signup/VendorStatusCheckUseCase"; 
import { VendorStatusCheckController } from "../../../adapters/controller/Vendor/vendorStatusCheckController";

import { VendorLoginUsecase } from "../../../useCases/vendor/Login/VendorLoginUsecase";
import { VendorLoginController } from "../../../adapters/controller/Vendor/vendorLoginController";

import { VendorProfileController } from "../../../adapters/controller/Vendor/VendorProfileController";
import { VendorProfileUsecase } from "../../../useCases/vendor/profile/VendorProfileUsecase";

import { GetAllDestinationController } from "../../../adapters/controller/Destination/getDestinationController";
import { GetAllDestinations } from "../../../useCases/Destination/getAllDestinationUsecase";

import { JwtSevice } from "../../services/jwtService";
import { DestinationRepository } from "../../../adapters/repository/Destination/destinationRepository";

import { CreatePackagesUseCase } from "../../../useCases/package/addPackageUsecase";
import { CreatePackagecontroller } from "../../../adapters/controller/packages/addPackageController";
import { PackageRepository } from "../../../adapters/repository/package/PackageRepository";
import { GetAllPackageController } from "../../../adapters/controller/packages/getAllPackageController";
import { GetAllPackages } from "../../../useCases/package/getAllPackageUsecase";


//  Setup Repository and Services
const vendorRepository = new VendorRepository();
const otpService = new OtpService();
const hashPassword = new HashPassword();
const jwtService = new JwtSevice();
const destinationRepo=new DestinationRepository()
const packageRepo=new PackageRepository()

//  Use Cases
const vendorSignupUsecase = new VendorRegisterUseCase(vendorRepository, otpService,hashPassword);
const vendorVerifyOtpUseCase = new verifyOtpUsecase(otpService,);
const updateVendorstatusUsecase = new UpdateVendorstatusUseCase(vendorRepository);
const getVendorByEmailUsecase = new GetVendorByEmailUseCase(vendorRepository);
const updateVendorstatususecase = new UpdateVendorstatusUseCase(vendorRepository); 
const vendorStatusUseCase = new VendorStatusCheckUseCase(vendorRepository);
const vendorloginusecase=new VendorLoginUsecase(vendorRepository,hashPassword,jwtService);
const vendorProfileusecase=new VendorProfileUsecase(vendorRepository);
const getAlldestinationusecase=new GetAllDestinations(destinationRepo);
const createPackageUsecase=new CreatePackagesUseCase(packageRepo);
const getallPackageUsecase=new GetAllPackages(packageRepo)

//  Controllers
export const vendorsignupcontroller = new VendorSignupController(vendorSignupUsecase);
export const vendorVerifyOtpController = new VendorVerifyOtpController(vendorVerifyOtpUseCase);
// export const updateVendorStatusController = new AdminVendorController(updateVendorstatususecase); 
// export const updateVendorstatusController = new AdminVendorController(updateVendorstatusUsecase);
// export const adminVendorController = new AdminVendorController(getVendorByEmailUsecase);
export const vendorstatusCheckController =new  VendorStatusCheckController(vendorStatusUseCase);
export const vendorloginController=new VendorLoginController(vendorloginusecase);
export const vendorProfilecontroller=new VendorProfileController(vendorProfileusecase);
export const vendorDestinationController=new GetAllDestinationController(getAlldestinationusecase);
export const createPackageController=new CreatePackagecontroller(createPackageUsecase);
export const getallPackageController=new GetAllPackageController(getallPackageUsecase)
