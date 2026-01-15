import { RegistervendorDto } from "../../dto/Vendor/RegisterVendorDto";

export interface IVendorProfileUseCase{
    execute(email: string):Promise<RegistervendorDto|null>
}