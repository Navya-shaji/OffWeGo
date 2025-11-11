import type { IWallet } from "@/interface/wallet";
import { getUserWallet } from "@/services/Wallet/UserWalletService";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Wallet, ArrowDownRight, ArrowUpRight, Clock, Receipt } from "lucide-react";

export default function WalletManagement() {
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
      } catch (err) {
        console.log(err);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="text-red-600" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Wallet</h3>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Wallet Found</h3>
          <p className="text-gray-500">No wallet found for your account.</p>
        </div>
      </div>
    );
  }

  const totalCredits = wallet.transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebits = wallet.transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Wallet className="text-blue-600" size={40} />
            My Wallet
          </h1>
          <p className="text-slate-600 mt-2">Manage your balance and view transactions</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-6 text-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
              <h2 className="text-5xl font-bold">{formatCurrency(wallet.balance)}</h2>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Wallet size={24} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-blue-500 border-opacity-30">
            <div>
              <p className="text-blue-100 text-xs mb-1">Owner Type</p>
              <p className="font-semibold capitalize">{wallet.ownerType}</p>
            </div>
            <div>
              <p className="text-blue-100 text-xs mb-1">Total Transactions</p>
              <p className="font-semibold">{wallet.transactions.length}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <ArrowDownRight className="text-green-600" size={24} />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                Credits
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalCredits)}</p>
            <p className="text-sm text-slate-500 mt-1">
              {wallet.transactions.filter((t) => t.type === "credit").length} transactions
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <ArrowUpRight className="text-red-600" size={24} />
              </div>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                Debits
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(totalDebits)}</p>
            <p className="text-sm text-slate-500 mt-1">
              {wallet.transactions.filter((t) => t.type === "debit").length} transactions
            </p>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Receipt className="text-slate-600" size={24} />
            <h3 className="text-xl font-semibold text-slate-800">Transaction History</h3>
          </div>

          {wallet.transactions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="text-slate-300" size={40} />
              </div>
              <p className="text-slate-500 font-medium">No transactions yet</p>
              <p className="text-slate-400 text-sm mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {wallet.transactions.map((tx, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all border border-slate-100"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tx.type === "credit"
                          ? "bg-green-50 text-green-600 border-2 border-green-200"
                          : "bg-red-50 text-red-600 border-2 border-red-200"
                      }`}
                    >
                      {tx.type === "credit" ? (
                        <ArrowDownRight size={24} />
                      ) : (
                        <ArrowUpRight size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 mb-1">
                        {tx.description || "Transaction"}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(tx.date)} at {formatTime(tx.date)}
                        </span>
                        {tx.refId && (
                          <span className="font-mono text-xs bg-slate-200 px-2 py-0.5 rounded">
                            {tx.refId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p
                      className={`font-bold text-xl whitespace-nowrap ${
                        tx.type === "credit" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        tx.type === "credit"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {tx.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}