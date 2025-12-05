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
          status: "completed",
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


  async markTransactionCompleted(ownerId: string, refId: string): Promise<IWallet> {
    const updatedWallet = await this.model.findOneAndUpdate(
      { ownerId, "transactions.refId": refId },
      {
        $set: {
          "transactions.$.status": "completed",
        },
      },
      { new: true }
    );

    if (!updatedWallet) {
      throw new Error("Transaction not found for this wallet");
    }

    return updatedWallet as unknown as IWallet;
  }

  async updateTransactionStatus(
    ownerId: string,
    refId: string,
    status: string
  ): Promise<IWallet> {
    const updated = await this.model.findOneAndUpdate(
      {
        ownerId,
        "transactions.refId": refId,
      },
      {
        $set: {
          "transactions.$.status": status,
        },
      },
      { new: true }
    );

    if (!updated) {
      throw new Error("Transaction not found");
    }

    return updated as unknown as IWallet;
  }

async getTransactionByRef(
  refId: string
): Promise<Transaction | null> {
  const wallet = await this.model.findOne(
    {
  
      "transactions.refId": refId,
    },
    {
      transactions: { $elemMatch: { refId } },
    }
  );

  if (!wallet || wallet.transactions.length === 0) return null;

  return wallet.transactions[0] as Transaction;
}


}
