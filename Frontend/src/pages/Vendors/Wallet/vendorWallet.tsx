import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { IWallet } from "@/interface/wallet";
import {
  Wallet,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Home,
  Sparkles,
  ArrowUpRight,
  CreditCard,
  Activity,
  Loader2,
} from "lucide-react";
import { getVendorWallet } from "@/services/Wallet/VendorWalletService";

export default function VendorWalletManagement() {
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Infinite scroll states
  const [displayedTransactions, setDisplayedTransactions] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const TRANSACTIONS_PER_PAGE = 10;

  useEffect(() => {
    if (vendor?.id) fetchWallet();
  }, [vendor]);

  // Initialize displayed transactions when wallet data changes
  useEffect(() => {
    if (wallet?.transactions) {
      const initial = wallet.transactions.slice(0, TRANSACTIONS_PER_PAGE);
      setDisplayedTransactions(initial);
      setHasMore(wallet.transactions.length > TRANSACTIONS_PER_PAGE);
    }
  }, [wallet]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getVendorWallet(vendor?.id || "");
      setWallet(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch vendor wallet");
    } finally {
      setLoading(false);
    }
  };

  // Load more transactions
  const loadMoreTransactions = useCallback(() => {
    if (!wallet?.transactions || loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    // Simulate network delay for smooth UX
    setTimeout(() => {
      const currentLength = displayedTransactions.length;
      const nextTransactions = wallet.transactions.slice(
        currentLength,
        currentLength + TRANSACTIONS_PER_PAGE
      );

      if (nextTransactions.length > 0) {
        setDisplayedTransactions(prev => [...prev, ...nextTransactions]);
        setHasMore(currentLength + nextTransactions.length < wallet.transactions.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 500);
  }, [wallet, displayedTransactions, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMoreTransactions();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMoreTransactions]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto mb-4"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 bg-indigo-200 opacity-20"></div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading wallet details...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your financial data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-red-200 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-red-500 mb-6">{error}</p>
          <button
            onClick={fetchWallet}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw className="inline-block mr-2" size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const totalEarnings = wallet?.transactions
    ?.filter((t: any) => t.type === "credit")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const creditTransactions = wallet?.transactions?.filter((t: any) => t.type === "credit") || [];
  const debitTransactions = wallet?.transactions?.filter((t: any) => t.type === "debit") || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => (window.location.href = "/vendor/profile")}
              className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r bg-black  text-white rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-black to-black rounded-xl flex items-center justify-center shadow-lg">
                  <Wallet className="text-white" size={24} />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r bg-black  bg-clip-text text-transparent">
                  Vendor Wallet
                </h1>
              </div>
              <p className="text-gray-600">Manage and view your earnings and transactions</p>
            </div>

            <button
              onClick={fetchWallet}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Wallet Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-xl border border-white/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-blue-100 font-medium">Wallet Balance</span>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Wallet size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {formatCurrency(wallet?.balance || 0)}
              </p>
              <div className="flex items-center gap-1 text-blue-100 text-sm">
                <Sparkles size={14} />
                <span>Available for withdrawal</span>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl border border-white/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-green-100 font-medium">Total Earnings</span>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {formatCurrency(totalEarnings || 0)}
              </p>
              <div className="flex items-center gap-1 text-green-100 text-sm">
                <ArrowUpRight size={14} />
                <span>90% of completed trips</span>
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-xl border border-white/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-purple-100 font-medium">Transactions</span>
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Activity size={20} className="text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {(wallet?.transactions?.length || 0)}
              </p>
              <div className="flex items-center gap-1 text-purple-100 text-sm">
                <CreditCard size={14} />
                <span>Total transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Recent Transactions</h3>
              <p className="text-gray-600">Your latest financial activities</p>
            </div>

            <div className="flex gap-3">
              <div className="px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                {creditTransactions.length} Credits
              </div>
              <div className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                {debitTransactions.length} Debits
              </div>
            </div>
          </div>

          {wallet && wallet.transactions?.length > 0 ? (
            <>
              <div className="space-y-4">
                {displayedTransactions.map((tx: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg shadow-md ${
                          tx.type === "credit"
                            ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                            : "bg-gradient-to-br from-red-400 to-red-600 text-white"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 text-lg">{tx.description}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <CheckCircle size={14} className="text-gray-400" />
                          {new Date(tx.date).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p
                        className={`font-bold text-2xl ${
                          tx.type === "credit" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {tx.type === "credit" ? "+" : "-"} {formatCurrency(tx.amount)}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tx.type === "credit" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {tx.type === "credit" ? "Earning" : "Withdrawal"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite Scroll Loading Indicator */}
              {hasMore && (
                <div ref={observerTarget} className="flex justify-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-3 text-indigo-600">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="font-medium">Loading more transactions...</span>
                    </div>
                  )}
                </div>
              )}

              {/* End of List Indicator */}
              {!hasMore && displayedTransactions.length > TRANSACTIONS_PER_PAGE && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-xl text-indigo-700">
                    <CheckCircle size={18} />
                    <span className="font-medium">All transactions loaded</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-3">
                    Showing {displayedTransactions.length} of {wallet.transactions.length} transactions
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-gray-400" size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No transactions yet</h3>
              <p className="text-gray-500">Start earning by completing trips to see your transactions here</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}