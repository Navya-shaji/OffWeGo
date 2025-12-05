import { Transaction } from "../../entities/TransactionEntity";
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

  addTransaction(ownerId: string, transaction: Transaction): Promise<IWallet>;


  markTransactionCompleted(
    ownerId: string,
    refId: string
  ): Promise<IWallet>;

  updateTransactionStatus(
    ownerId: string,
    refId: string,
    status: string
  ): Promise<IWallet>;

  getTransactionByRef(
    ownerId: string,
    refId: string
  ): Promise<Transaction | null>;
}
