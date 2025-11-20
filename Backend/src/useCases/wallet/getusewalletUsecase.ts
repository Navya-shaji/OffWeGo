import { WalletDto } from "../../domain/dto/Wallet/WalletDto";
import { IGetWalletUSecase } from "../../domain/interface/Wallet/IGetWalletUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { mapToWalletDto } from "../../mappers/Wallet/mapToWallet";

export class GetUserWalletUsecase implements IGetWalletUSecase {
  constructor(private _walletRepo: IWalletRepository) {}

  async execute(id: string): Promise<WalletDto | null> {
    const wallet = await this._walletRepo.findByOwnerId(id);
    if (!wallet) return null; 
    return mapToWalletDto(wallet);
  }
}
