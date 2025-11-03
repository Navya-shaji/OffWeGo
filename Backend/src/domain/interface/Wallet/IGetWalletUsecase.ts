import { WalletDto } from "../../dto/Wallet/WalletDto";

export interface IGetWalletUserUSecase{
    execute(id:string):Promise<WalletDto|null>
}