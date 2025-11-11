import { Document, model, ObjectId } from "mongoose";
import { IWallet } from "../../../domain/entities/WalletEntity";
import { WalletSchema } from "../Schema/walletSchema"; 

export interface IWalletModel extends Omit<IWallet, "_id">, Document {
  _id: ObjectId;
}

export const WalletModel = model<IWalletModel>("Wallet", WalletSchema);
