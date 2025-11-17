import { BaseRepository } from "../BaseRepo/BaseRepo";
import { IWalletRepository } from "../../../domain/interface/Wallet/IWalletRepository";
import {
  IWalletModel,
  WalletModel,
} from "../../../framework/database/Models/walletModel";
import { IWallet } from "../../../domain/entities/WalletEntity";
import { Transaction } from "../../../domain/entities/TransactionEntity";

export class WalletRepository
  extends BaseRepository<IWalletModel>
  implements IWalletRepository
{
  constructor() {
    super(WalletModel);
  }

  async createWallet(data: IWallet): Promise<IWallet> {
    const createdWallet = await this.model.create(data);
    return createdWallet as unknown as IWallet;
  }

  async findByOwnerId(ownerId: string): Promise<IWallet | null> {
    const wallet = await this.model.findOne({ ownerId });
    return wallet as unknown as IWallet;
  }

  async updateBalance(
    ownerId: string,
    ownerType: string,
    amount: number,
    type: "credit" | "debit",
    description: string,
    refId?: string
  ): Promise<IWallet> {
    const updatedWallet = await this.model.findOneAndUpdate(
      { ownerId, ownerType },
      {
        $push: {
          transactions: {
            type,
            amount,
            description,
            date: new Date(),
            ...(refId && { refId }),
          },
        },
        $inc: { balance: type === "credit" ? amount : -amount },
      },
      { new: true }
    );

    if (!updatedWallet) {
      throw new Error("Wallet not found");
    }

    return updatedWallet as unknown as IWallet;
  }
  async addTransaction(ownerId: string, transaction: Transaction): Promise<IWallet> {
    const updated = await WalletModel.findOneAndUpdate(
      { ownerId },
      { $push: { transactions: transaction } },
      { new: true }
    )
      .lean<IWallet>()
      .exec();

    if (!updated) throw new Error("Wallet not found");
    return updated;
  }
}
