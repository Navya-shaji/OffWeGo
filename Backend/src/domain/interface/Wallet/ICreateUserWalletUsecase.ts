import { IWallet } from "../../entities/WalletEntity";

export interface ICreateUserWalletUsecase{
    execute(ownerId:string,ownerType:string):Promise<IWallet>
}