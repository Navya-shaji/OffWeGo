import { VendorSignupController } from "../../../adapters/controller/Vendor/VendorSignup";
import { VendorRepository } from "../../../adapters/repository/Vendor/VendorRepository";
import { OtpService } from "../../services/otpService";
import { HashPassword } from "../../services/hashPassword";
import { VendorRegisterUseCase } from "../../../useCases/vendor/Signup/signupVendorUseCase";




// setup Repos and Services

const vendorRepository=new VendorRepository()
const otpService = new OtpService();
const hashPassword=new HashPassword()


//Use cases

const vendorSignupUsecase=new VendorRegisterUseCase(vendorRepository,otpService)


//Controllers

export const vendorsignupcontroller=new VendorSignupController(vendorSignupUsecase)
