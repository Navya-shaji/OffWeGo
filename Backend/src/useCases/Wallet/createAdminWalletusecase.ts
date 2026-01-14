import { Role } from "../../domain/constants/Roles";
import { WalletDto } from "../../domain/dto/Wallet/WalletDto";
import { ICreateWalletUsecase } from "../../domain/interface/Wallet/ICreateUserWalletUsecase";
import { IWalletRepository } from "../../domain/interface/Wallet/IWalletRepository";
import { mapToWalletDto } from "../../mappers/Wallet/mapToWallet";

export class CreateAdminWalletUsecase implements ICreateWalletUsecase {
  constructor(private _walletRepo: IWalletRepository) {}

  async execute(ownerId: string, ownerType: string): Promise<WalletDto> {

    const existing = await this._walletRepo.findByOwnerId(ownerId);
    if (existing) return existing;

    const newWallet: WalletDto = {
      ownerId,
      ownerType: ownerType as Role,
      balance: 0,
      transactions: [],
    };
    const createdWallet = await this._walletRepo.createWallet(newWallet);
    return mapToWalletDto(createdWallet);
  }
}
