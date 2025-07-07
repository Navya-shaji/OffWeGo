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
//  Setup Repository and Services
const vendorRepository = new VendorRepository();
const otpService = new OtpService();
const hashPassword = new HashPassword();

//  Use Cases
const vendorSignupUsecase = new VendorRegisterUseCase(vendorRepository, otpService);
const vendorVerifyOtpUseCase = new verifyOtpUsecase(otpService,);
const updateVendorstatusUsecase = new UpdateVendorstatusUseCase(vendorRepository);
const getVendorByEmailUsecase = new GetVendorByEmailUseCase(vendorRepository);
const updateVendorstatususecase = new UpdateVendorstatusUseCase(vendorRepository); 

//  Controllers
export const vendorsignupcontroller = new VendorSignupController(vendorSignupUsecase);
export const vendorVerifyOtpController = new VendorVerifyOtpController(vendorVerifyOtpUseCase);
export const updateVendorStatusController = new UpdateVendorstatusController(updateVendorstatususecase); 
export const updateVendorstatusController = new UpdateVendorstatusController(updateVendorstatusUsecase);
export const adminVendorController = new AdminVendorController(getVendorByEmailUsecase);
