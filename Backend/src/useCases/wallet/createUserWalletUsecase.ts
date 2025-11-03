import { Role } from "../../domain/constants/Roles";
import { IWallet } from "../../domain/entities/WalletEntity";
import { ICreateUserWalletUsecase } from "../../domain/interface/Wallet/ICreateUserWalletUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";

export class CreateUserWalletUsecase implements ICreateUserWalletUsecase{
    constructor(
        private _walletRepo:IWalletRepository
    ){}

    async execute(ownerId: string, ownerType: string): Promise<IWallet> {
        const existing=await this._walletRepo.findByOwnerId(ownerId)
        if(existing) return existing

        const newWallet:IWallet={
            ownerId,
            ownerType:ownerType as Role,
            balance:0,
            transactions:[]
        }
        return this._walletRepo.createWallet(newWallet)
    }
}