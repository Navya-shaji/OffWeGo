import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { IRegisterVendorUseCase } from "../../../domain/interface/vendor/IVendorUsecase";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { Vendor } from "../../../domain/entities/vendorEntities";

export class VendorRegisterUseCase implements IRegisterVendorUseCase {
  constructor(
    private vendorRepository: IVendorRepository,
    private otpService: IOtpService
  ) {}
  async execute(vendorInput: RegistervendorDto): Promise<Vendor> {
    const { name, email, password, phone, documentUrl } = vendorInput;

    const existingVendor = await this.vendorRepository.findByEmail(email);
    if (existingVendor) throw new Error("Vendor Already Exists");

    const existingPhoneNumber = await this.vendorRepository.findByPhone(phone);
    if (existingPhoneNumber) throw new Error("Phone number is already exists");

    if (!documentUrl || typeof documentUrl !== "string") {
      throw new Error("Document is required for vendor Registration");
    }
    const newVendor = await this.vendorRepository.createVendor({...vendorInput,status:"pending"});
    const otp=this.otpService.generateOtp()
    await this.otpService.storeOtp(email,otp)
    await this.otpService.sendOtpEmail(email,otp)
    return newVendor
  }
}
