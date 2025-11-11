import { WalletDto } from "../../dto/Wallet/WalletDto";

export interface ICreateWalletUsecase{
    execute(ownerId:string,ownerType:string):Promise<WalletDto>
}