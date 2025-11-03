import { IWallet } from "../../entities/WalletEntity";

export interface IWalletRepository {
  createWallet(data: IWallet): Promise<IWallet>;
  findByOwnerId(ownerId: string): Promise<IWallet | null>;
  updateBalance(
    ownerId: string,
    ownerType: string,
    amount: number,
    type: "credit" | "debit",
    description: string,
    refId?: string
  ): Promise<IWallet>;
}
