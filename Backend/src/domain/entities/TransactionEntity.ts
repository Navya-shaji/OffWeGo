export interface Transaction {
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: Date;
  transferred?: boolean;
  packageId?: string;
}
