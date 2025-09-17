import { RegistervendorDto } from "../../../domain/dto/Vendor/RegisterVendorDto";
import { Vendor } from "../../../domain/entities/VendorEntities";
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
  ) {}

  async execute(vendorInput: RegistervendorDto): Promise<Vendor> {
    const { name, email, password, phone, documentUrl } = vendorInput;

    const existingVendor = await this._vendorRepository.findByEmail(email);
    if (existingVendor) throw new Error("Vendor Already Exists");

    const existingPhone = await this._vendorRepository.findByPhone(phone);
    if (existingPhone) throw new Error("Phone number already exists");

    if (!documentUrl || typeof documentUrl !== "string") {
      throw new Error("Document is required for vendor Registration");
    }

    const hashedPassword = await this._hashService.hashPassword(password);
    const otp = this._otpService.generateOtp();
    console.log("Generated OTP:", otp);

    // 👇 Construct the correct input for creation
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
