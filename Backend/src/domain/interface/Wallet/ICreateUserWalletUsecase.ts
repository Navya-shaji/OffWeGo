import { WalletDto } from "../../dto/Wallet/WalletDto";

export interface ICreateUserWalletUsecase{
    execute(ownerId:string,ownerType:string):Promise<WalletDto>
}