import type { IWallet } from "@/interface/wallet";
import { getUserWallet } from "@/services/Wallet/UserWalletService";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, Receipt } from "lucide-react";

export default function WalletManagement({ embedded = false }: { embedded?: boolean }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchWallet = async () => {
      try {
        const data = await getUserWallet(user.id);
        setWallet(data);
      } catch  {
        setError("Failed to load wallet");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [user]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className={embedded ? "flex items-center justify-center py-14" : "flex items-center justify-center min-h-screen"}>
        <div className="text-center">
          <div className={embedded ? "animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-gray-800 mx-auto" : "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"}></div>
          <p className={embedded ? "mt-3 text-gray-600" : "mt-4 text-gray-600"}>Loading your wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={embedded ? "flex items-center justify-center py-14" : "flex items-center justify-center min-h-screen"}>
        <div className="text-center">
          <div className={embedded ? "text-red-600 text-lg font-semibold" : "text-red-600 text-xl font-semibold"}>Error Loading Wallet</div>
          <p className={embedded ? "mt-2 text-sm text-gray-600" : "mt-2 text-gray-600"}>{error}</p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className={embedded ? "flex items-center justify-center py-14" : "flex items-center justify-center min-h-screen"}>
        <div className="text-center">
          <div className={embedded ? "text-gray-900 text-lg font-semibold" : "text-gray-800 text-xl font-semibold"}>No Wallet Found</div>
          <p className={embedded ? "mt-2 text-sm text-gray-600" : "mt-2 text-gray-600"}>No wallet found for your account.</p>
        </div>
      </div>
    );
  }

  const totalCredits = wallet.transactions
    .filter((t) => t.type.toLowerCase() === "credit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalDebits = wallet.transactions
    .filter((t) => t.type.toLowerCase() === "debit")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const creditCount = wallet.transactions.filter(
    (t) => t.type.toLowerCase() === "credit"
  ).length;

  const debitCount = wallet.transactions.filter(
    (t) => t.type.toLowerCase() === "debit"
  ).length;

  const sortedTransactions = [...wallet.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={embedded ? "" : "min-h-screen bg-gray-50 p-4 md:p-8"}>
      <div className={embedded ? "bg-gray-900 rounded-2xl p-6 mb-6 text-white" : "bg-gradient-to-r bg-black rounded-xl shadow-lg p-6 mb-6 text-white"}>
        {!embedded && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-8 h-8" />
              My Wallet
            </h1>
          </div>
        )}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-blue-100 text-sm mb-2">Available Balance</p>
            <h2 className={embedded ? "text-3xl font-bold" : "text-4xl font-bold"}>{formatCurrency(wallet.balance)}</h2>
          </div>
        </div>
        <div className="mt-6 flex gap-6">
          <div>
            <p className="text-blue-100 text-xs">Owner Type</p>
            <p className="font-semibold capitalize">{wallet.ownerType}</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs">Total Transactions</p>
            <p className="font-semibold">{wallet.transactions.length}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={embedded ? "bg-white rounded-xl border border-gray-200 p-6" : "bg-white rounded-lg shadow p-6 border-l-4 border-green-500"}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Credits</h3>
            <ArrowDownRight className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCredits)}</p>
          <p className="text-gray-500 text-sm mt-2">
            {creditCount} {creditCount === 1 ? "transaction" : "transactions"}
          </p>
        </div>

        <div className={embedded ? "bg-white rounded-xl border border-gray-200 p-6" : "bg-white rounded-lg shadow p-6 border-l-4 border-red-500"}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Debits</h3>
            <ArrowUpRight className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDebits)}</p>
          <p className="text-gray-500 text-sm mt-2">
            {debitCount} {debitCount === 1 ? "transaction" : "transactions"}
          </p>
        </div>
      </div>

      {/* Transaction History */}
      <div className={embedded ? "bg-white rounded-xl border border-gray-200" : "bg-white rounded-lg shadow"}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Transaction History
          </h2>
        </div>

        {wallet.transactions.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-500">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="divide-y">
            {sortedTransactions.map((tx, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`p-2 rounded-full ${
                        tx.type.toLowerCase() === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.type.toLowerCase() === "credit" ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {tx.description || "Transaction"}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>
                          {formatDate(tx.date.toString())} at {formatTime(tx.date.toString())}
                        </span>
                        {(tx).refId && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-xs">{(tx).refId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p
                      className={`text-lg font-semibold ${
                        tx.type.toLowerCase() === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {tx.type.toLowerCase() === "credit" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${
                        tx.type.toLowerCase() === "credit"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}