import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { Vendor } from "../../../domain/entities/vendorEntities";
import { IPasswordService } from "../../../domain/interface/serviceInterface/IhashpasswordService";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { IVendorRepository } from "../../../domain/interface/vendor/IVendorRepository";
import { IRegisterVendorUseCase } from "../../../domain/interface/vendor/IVendorUsecase";

export class VendorRegisterUseCase implements IRegisterVendorUseCase {
  constructor(
    private vendorRepository: IVendorRepository,
    private otpService: IOtpService,
    private hashService: IPasswordService // 👈 inject this
  ) {}

  async execute(vendorInput: RegistervendorDto): Promise<Vendor> {
    const { name, email, password, phone, documentUrl } = vendorInput;

    const existingVendor = await this.vendorRepository.findByEmail(email);
    if (existingVendor) throw new Error("Vendor Already Exists");

    const existingPhone = await this.vendorRepository.findByPhone(phone);
    if (existingPhone) throw new Error("Phone number already exists");

    if (!documentUrl || typeof documentUrl !== "string") {
      throw new Error("Document is required for vendor Registration");
    }

    const hashedPassword = await this.hashService.hashPassword(password); // ✅ Hash password

    const otp = this.otpService.generateOtp();
    console.log("Generated OTP:", otp);

    const newVendor = await this.vendorRepository.createVendor({
      name,
      email,
      phone,
      password: hashedPassword, // ✅ store hashed password
      documentUrl,
      status: "pending",
    });

    await this.otpService.storeOtp(email, otp);
    await this.otpService.sendOtpEmail(email, otp);

    return newVendor;
  }
}
