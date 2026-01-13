import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { VendorDto } from "../../../domain/dto/Vendor/VendorDto";
import { IPasswordService } from "../../../domain/interface/ServiceInterface/IhashpasswordService";
import { IOtpService } from "../../../domain/interface/ServiceInterface/Iotpservice";
import { IVendorRepository } from "../../../domain/interface/Vendor/IVendorRepository";
import { IRegisterVendorUseCase } from "../../../domain/interface/Vendor/IVendorUsecase";
import { mapToVendor } from "../../../mappers/Vendor/vendorMapper";

export class VendorRegisterUseCase implements IRegisterVendorUseCase {
  constructor(
    private _vendorRepository: IVendorRepository,
    private _otpService: IOtpService,
    private _hashService: IPasswordService
  ) { }

  async execute(vendorInput: RegistervendorDto): Promise<VendorDto> {
    const { name, email, password, phone, documentUrl } = vendorInput;

    const existingVendor = await this._vendorRepository.findByEmail(email);

    if (existingVendor) {
      if (existingVendor.status !== "rejected") {
        throw new Error("Vendor Already Exists");
      }

      // If rejected, allow re-registration by updating existing record
      const hashedPassword = await this._hashService.hashPassword(password);
      const otp = this._otpService.generateOtp();

      const updatedVendor = await this._vendorRepository.update(existingVendor._id.toString(), {
        name,
        phone,
        password: hashedPassword,
        documentUrl,
        status: "pending",
        rejectionReason: "" // Clear the reason when they retry
      } as any);

      if (!updatedVendor) throw new Error("Failed to update vendor details");

      await this._otpService.storeOtp(email, otp);
      await this._otpService.sendOtpEmail(email, otp);

      return mapToVendor(updatedVendor);
    }

    const existingPhone = await this._vendorRepository.findByPhone(phone);
    if (existingPhone) throw new Error("Phone number already exists");

    if (!documentUrl || typeof documentUrl !== "string") {
      throw new Error("Document is required for vendor Registration");
    }

    const hashedPassword = await this._hashService.hashPassword(password);
    const otp = this._otpService.generateOtp();
    console.log("Generated OTP:", otp);


    const createdDoc = await this._vendorRepository.createVendor({
      name,
      email,
      phone,
      password: hashedPassword,
      documentUrl,
      status: "pending"
    });

    await this._otpService.storeOtp(email, otp);
    await this._otpService.sendOtpEmail(email, otp);

    return mapToVendor(createdDoc);
  }
}
