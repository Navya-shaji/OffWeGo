import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Wallet, TrendingUp, RefreshCw, AlertCircle, ArrowDownCircle, CheckCircle, Home } from "lucide-react";
import { getVendorWallet } from "@/services/Wallet/VendorWalletService";

export default function VendorWalletManagement() {
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (vendor?.id) fetchWallet();
  }, [vendor]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVendorWallet(vendor.id);
      setWallet(response);
    } catch (err) {
      setError(err.message || "Failed to fetch vendor wallet");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <RefreshCw className="animate-spin text-white mx-auto mb-3" size={40} />
          <p className="text-gray-400 text-lg font-light tracking-wide">Loading wallet details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 p-6 border border-gray-700 text-center max-w-md">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
          <h2 className="text-xl font-light text-white">
            <span className="font-bold">Error</span>
          </h2>
          <p className="text-red-400 mt-2">{error}</p>
          <button
            onClick={fetchWallet}
            className="mt-4 px-6 py-2 bg-white text-black font-semibold tracking-wide uppercase text-sm hover:bg-gray-200 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalEarnings = wallet?.transactions
    ?.filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = wallet?.transactions
    ?.filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const creditTransactions = wallet?.transactions?.filter((t) => t.type === "credit") || [];
  const debitTransactions = wallet?.transactions?.filter((t) => t.type === "debit") || [];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => (window.location.href = "/")}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold tracking-wide uppercase text-sm hover:bg-gray-200 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <div>
                <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
                  <Wallet className="text-white" /> Vendor <span className="font-bold">Wallet</span>
                </h1>
                <p className="text-gray-400 mt-2 font-light">
                  Manage and view your wallet balance and transactions
                </p>
              </div>
            </div>
            <button
              onClick={fetchWallet}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-semibold tracking-wide uppercase text-sm hover:bg-gray-200 transition disabled:opacity-50"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-700 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90 tracking-wide uppercase font-semibold text-gray-400">Wallet Balance</span>
              <Wallet size={24} />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(wallet?.balance)}</p>
            <p className="text-gray-400 text-sm mt-1 font-light">Available to withdraw</p>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm tracking-wide uppercase font-semibold">Total Earnings</span>
              <TrendingUp size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(totalEarnings || 0)}
            </p>
            <p className="text-gray-400 text-sm mt-1 font-light">From completed trips (90%)</p>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm tracking-wide uppercase font-semibold">Total Withdrawals</span>
              <ArrowDownCircle size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(totalWithdrawals || 0)}
            </p>
            <p className="text-gray-400 text-sm mt-1 font-light">Amount withdrawn</p>
          </div>

          <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm tracking-wide uppercase font-semibold">Transactions</span>
              <CheckCircle size={24} className="text-white" />
            </div>
            <p className="text-3xl font-bold text-white">
              {wallet?.transactions?.length || 0}
            </p>
            <p className="text-gray-400 text-sm mt-1 font-light">Total count</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gray-900 border border-gray-700 p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-white flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm text-gray-300">
              <p className="font-medium mb-1 tracking-wide uppercase text-xs text-white">How earnings work:</p>
              <p className="font-light">When a customer completes a trip booking, 90% of the booking amount is automatically transferred to your wallet. The remaining 10% is the platform fee.</p>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-light text-white">
              Recent <span className="font-bold">Transactions</span>
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white text-black font-medium tracking-wide uppercase text-xs">
                {creditTransactions.length} Credits
              </span>
              <span className="px-3 py-1 bg-gray-700 text-white font-medium tracking-wide uppercase text-xs">
                {debitTransactions.length} Debits
              </span>
            </div>
          </div>

          {wallet?.transactions?.length > 0 ? (
            <div className="space-y-3">
              {wallet.transactions.slice(0, 15).map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-800/30 border border-gray-800 hover:bg-gray-800/50 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center font-bold ${
                        tx.type === "credit"
                          ? "bg-white text-black"
                          : "bg-gray-700 text-white"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{tx.description}</p>
                      <p className="text-sm text-gray-400 font-light">
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
                      tx.type === "credit" ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"} {formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Wallet className="mx-auto text-gray-700 mb-3" size={48} />
              <p className="text-gray-400 text-lg font-light">No transactions yet</p>
              <p className="text-gray-500 text-sm mt-1 font-light">
                Earnings from completed trips will appear here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}