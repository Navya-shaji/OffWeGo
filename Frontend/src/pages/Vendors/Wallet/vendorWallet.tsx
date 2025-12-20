import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  Wallet,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  ArrowDownCircle,
  CheckCircle,
  Home,
} from "lucide-react";
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <RefreshCw className="animate-spin text-gray-500 mx-auto mb-3" size={40} />
          <p className="text-gray-600 text-lg">Loading wallet details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow max-w-md border border-gray-200 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
          <h2 className="text-xl font-semibold text-gray-800">Error</h2>
          <p className="text-red-500 mt-2">{error}</p>
          <button
            onClick={fetchWallet}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Wallet className="text-blue-600" /> Vendor Wallet
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage and view wallet balance and transactions
              </p>
            </div>

            <button
              onClick={fetchWallet}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 font-medium">Wallet Balance</span>
              <Wallet size={22} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(wallet?.balance)}
            </p>
          </div>

          {/* Earnings */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 font-medium">Total Earnings</span>
              <TrendingUp size={22} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalEarnings || 0)}
            </p>
          </div>

          {/* Withdrawals */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 font-medium">Total Withdrawals</span>
              <ArrowDownCircle size={22} className="text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(totalWithdrawals || 0)}
            </p>
          </div>

          {/* Transaction Count */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-500 font-medium">Transactions</span>
              <CheckCircle size={22} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {wallet?.transactions?.length || 0}
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-blue-700 mt-1" size={20} />
            <p className="text-sm text-blue-700">
              <strong>How earnings work:</strong> Vendors receive <b>90%</b> of each
              completed trip. The remaining <b>10%</b> is the platform fee.
            </p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>

            <div className="flex gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                {creditTransactions.length} Credits
              </span>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                {debitTransactions.length} Debits
              </span>
            </div>
          </div>

          {wallet?.transactions?.length > 0 ? (
            <div className="space-y-3">
              {wallet.transactions.slice(0, 15).map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded font-bold text-lg ${
                        tx.type === "credit"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.type === "credit" ? "+" : "-"}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">{tx.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(tx.date).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`font-bold text-lg ${
                      tx.type === "credit" ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"} {formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Wallet className="mx-auto mb-3 text-gray-400" size={48} />
              No transactions available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
