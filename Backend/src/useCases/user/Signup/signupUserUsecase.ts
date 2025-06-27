import { IUserRepository } from "../../../domain/interface/userRepository/IuserRepository";
import { IOtpService } from "../../../domain/interface/serviceInterface/Iotpservice";
import { HashPassword } from "../../../framework/services/hashPassword";
import { generateUUID } from "../../../framework/services/uuidGenerator";
import { User } from "../../../domain/entities/userEntity";
import { RegisterDTO } from "../../../domain/dto/user/userDto";
import { IregisterUserUseCase } from "../../../domain/interface/usecaseInterface/IusecaseInterface";


export class  RegisterUserUseCase implements IregisterUserUseCase{
    private userRepository:IUserRepository;
    private otpService:IOtpService
    constructor(userRepository:IUserRepository,otpService:IOtpService ){
        this.userRepository=userRepository;
        this.otpService = otpService;
    }

    async execute (userInput:RegisterDTO):Promise<boolean>{
        const {name,email,password,phone,profileImage} =userInput

        const existingUser=await this.userRepository.findByEmail(email)

        if(existingUser) throw new Error("User Already exists")

        const otp=this.otpService.generateOtp()
        await this.otpService.storeOtp(email,otp)

       return true
    }
}


