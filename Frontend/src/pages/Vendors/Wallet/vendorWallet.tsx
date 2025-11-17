import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Wallet, TrendingUp, RefreshCw, AlertCircle, ArrowDownCircle, CheckCircle } from "lucide-react";
import { getVendorWallet } from "@/services/Wallet/VendorWalletService";

export default function VendorWalletManagement() {
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (vendor?.id) fetchWallet();
  }, [vendor]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVendorWallet(vendor.id);
      setWallet(response);
    } catch (err: any) {
      setError(err.message || "Failed to fetch vendor wallet");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <RefreshCw className="animate-spin text-blue-600 mx-auto mb-3" size={40} />
          <p className="text-slate-600 text-lg">Loading wallet details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-6 rounded-xl shadow-md text-center border border-red-300 max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
          <h2 className="text-xl font-semibold text-red-700">Error</h2>
          <p className="text-red-600 mt-2">{error}</p>
          <button
            onClick={fetchWallet}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalEarnings = wallet?.transactions
    ?.filter((t: any) => t.type === "credit")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const totalWithdrawals = wallet?.transactions
    ?.filter((t: any) => t.type === "debit")
    .reduce((sum: number, t: any) => sum + t.amount, 0);


  const creditTransactions = wallet?.transactions?.filter((t: any) => t.type === "credit") || [];
  const debitTransactions = wallet?.transactions?.filter((t: any) => t.type === "debit") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
              <Wallet className="text-blue-600" /> Vendor Wallet
            </h1>
            <p className="text-slate-600 mt-2">
              Manage and view your wallet balance and transactions.
            </p>
          </div>
          <button
            onClick={fetchWallet}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Wallet Balance</span>
              <Wallet size={24} />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(wallet?.balance)}</p>
            <p className="text-blue-200 text-sm mt-1">Available to withdraw</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Earnings</span>
              <TrendingUp size={24} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {formatCurrency(totalEarnings || 0)}
            </p>
            <p className="text-slate-500 text-sm mt-1">From completed trips (90%)</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Withdrawals</span>
              <ArrowDownCircle size={24} className="text-red-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {formatCurrency(totalWithdrawals || 0)}
            </p>
            <p className="text-slate-500 text-sm mt-1">Amount withdrawn</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Transactions</span>
              <CheckCircle size={24} className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">
              {wallet?.transactions?.length || 0}
            </p>
            <p className="text-slate-500 text-sm mt-1">Total count</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How earnings work:</p>
              <p>When a customer completes a trip booking, 90% of the booking amount is automatically transferred to your wallet. The remaining 10% is the platform fee.</p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-800">
              Recent Transactions
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {creditTransactions.length} Credits
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                {debitTransactions.length} Debits
              </span>
            </div>
          </div>

          {wallet?.transactions?.length > 0 ? (
            <div className="space-y-3">
              {wallet.transactions.slice(0, 15).map((tx: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
                        tx.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{tx.description}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(tx.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-bold text-lg whitespace-nowrap ml-4 ${
                      tx.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"} {formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="mx-auto text-slate-300 mb-3" size={48} />
              <p className="text-slate-500 text-lg">No transactions yet</p>
              <p className="text-slate-400 text-sm mt-1">
                Earnings from completed trips will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}