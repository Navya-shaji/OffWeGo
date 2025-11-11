import { Role } from "../../domain/constants/Roles";
import { WalletDto } from "../../domain/dto/Wallet/WalletDto";
import { ICreateWalletUsecase } from "../../domain/interface/Wallet/ICreateUserWalletUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";

export class CreateUserWalletUsecase implements ICreateWalletUsecase{
    constructor(
        private _walletRepo:IWalletRepository
    ){}

    async execute(ownerId: string, ownerType: string): Promise<WalletDto> {
        const existing=await this._walletRepo.findByOwnerId(ownerId)
        if(existing) return existing

        const newWallet:WalletDto={
            ownerId,
            ownerType:ownerType as Role,
            balance:0,
            transactions:[]
        }
        return this._walletRepo.createWallet(newWallet)
    }
}