import { WalletDto } from "../../domain/dto/Wallet/WalletDto";
import { Role } from "../../domain/constants/Roles";

export const mapToWalletDto = (wallet: WalletDto): WalletDto => {
  return {
    _id: wallet._id?.toString(),
    ownerId: wallet.ownerId?.toString(),
    ownerType: wallet.ownerType as Role,
    balance: wallet.balance,
    transactions: wallet.transactions?.map((t) => ({
      type: t.type,
      amount: t.amount,
      description: t.description || "",
      date: t.date,
    })) || [],
  };
};
