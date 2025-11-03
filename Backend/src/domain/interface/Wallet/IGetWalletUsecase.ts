import { WalletDto } from "../../dto/Wallet/WalletDto";

export interface IGetWalletUSecase{
    execute(id:string):Promise<WalletDto|null>
}