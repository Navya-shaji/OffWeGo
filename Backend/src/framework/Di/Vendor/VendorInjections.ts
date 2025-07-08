import { VendorSignupController } from "../../../adapters/controller/Vendor/VendorSignup";
import { VendorVerifyOtpController } from "../../../adapters/controller/Vendor/verifyVendorOtp";
import { UpdateVendorstatusController } from "../../../adapters/controller/Admin/updateVendorController";

import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { OtpService } from "../../services/otpService";
import { HashPassword } from "../../services/hashPassword";

import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase";
import { verifyOtpUsecase } from "../../../useCases/vendor/Signup/verifyOtpUsecase";
import { UpdateVendorstatusUseCase } from "../../../useCases/vendor/Signup/updateVendorStatusUsecase"; 
import { GetVendorByEmailUseCase } from "../../../useCases/admin/Vendor/getVendorByEmailUsecase";
import { AdminVendorController } from "../../../adapters/controller/Admin/AdminVendorController";

import { VendorStatusCheckUseCase } from "../../../useCases/vendor/Signup/VendorStatusCheckUseCase"; 
import { VendorStatusCheckController } from "../../../adapters/controller/Vendor/vendorStatusCheckController";

import { VendorLoginUsecase } from "../../../useCases/vendor/Login/VendorLoginUsecase";
import { VendorLoginController } from "../../../adapters/controller/Vendor/vendorLoginController";
import { JwtSevice } from "../../services/jwtService";


//  Setup Repository and Services
const vendorRepository = new VendorRepository();
const otpService = new OtpService();
const hashPassword = new HashPassword();
const jwtService = new JwtSevice();

//  Use Cases
const vendorSignupUsecase = new VendorRegisterUseCase(vendorRepository, otpService,hashPassword);
const vendorVerifyOtpUseCase = new verifyOtpUsecase(otpService,);
const updateVendorstatusUsecase = new UpdateVendorstatusUseCase(vendorRepository);
const getVendorByEmailUsecase = new GetVendorByEmailUseCase(vendorRepository);
const updateVendorstatususecase = new UpdateVendorstatusUseCase(vendorRepository); 
const vendorStatusUseCase = new VendorStatusCheckUseCase(vendorRepository);
const vendorloginusecase=new VendorLoginUsecase(vendorRepository,hashPassword,jwtService)

//  Controllers
export const vendorsignupcontroller = new VendorSignupController(vendorSignupUsecase);
export const vendorVerifyOtpController = new VendorVerifyOtpController(vendorVerifyOtpUseCase);
export const updateVendorStatusController = new UpdateVendorstatusController(updateVendorstatususecase); 
export const updateVendorstatusController = new UpdateVendorstatusController(updateVendorstatusUsecase);
export const adminVendorController = new AdminVendorController(getVendorByEmailUsecase);
export const vendorstatusCheckController =new  VendorStatusCheckController(vendorStatusUseCase);
export const vendorloginController=new VendorLoginController(vendorloginusecase)
