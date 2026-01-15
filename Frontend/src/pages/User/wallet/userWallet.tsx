 
import type { IWallet } from "@/interface/wallet";
import { getUserWallet } from "@/services/Wallet/UserWalletService";
import type { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Header from "@/components/home/navbar/Header";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Receipt,
  ShieldCheck,
  TrendingUp
} from "lucide-react";

export default function WalletManagement({ embedded = false }: { embedded?: boolean }) {
  const user = useSelector((state: RootState) => state.auth.user);
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    if (!user?.id) return;

    const fetchWallet = async () => {
      try {
        const data = await getUserWallet(user.id);
        setWallet(data);
      } catch {
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className={embedded ? "flex items-center justify-center py-20" : "flex items-center justify-center min-h-screen bg-white"}>
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-10 h-10 border-4 border-gray-100 border-t-black rounded-full mx-auto mb-4"
          />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Synchronizing Wallet...</p>
        </div>
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <div className={embedded ? "flex items-center justify-center py-20" : "flex items-center justify-center min-h-screen bg-white"}>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-gray-900">{error || "Access Restricted"}</h2>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">We encountered a secure protocol error while accessing your financial records.</p>
        </div>
      </div>
    );
  }

  const sortedTransactions = [...wallet.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={embedded ? "" : "min-h-screen bg-white p-6 pt-24"}
    >
      {!embedded && <Header forceSolid />}

      <div className={embedded ? "" : "max-w-[1440px] mx-auto"}>
        {/* Top Section: Header & Quick Stats */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">

          {/* Main Balance Card */}
          <div className="flex-1 bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/10 transition-colors"></div>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Available Capital</p>
                  <h2 className="text-5xl font-black tracking-tighter">{formatCurrency(wallet.balance)}</h2>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Account Class</p>
                  <p className="text-sm font-black uppercase tracking-tighter">{wallet.ownerType} ELITE</p>
                </div>
                <div className="space-y-1 border-l border-white/10 pl-8">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Security ID</p>
                  <p className="text-sm font-black font-mono">****{user?.id?.slice(-4) || 'NULL'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="w-full lg:w-80 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                <ArrowDownRight className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inflow</p>
                <p className="text-lg font-black">{formatCurrency(wallet.transactions.filter(t => t.type === 'credit').reduce((s, t) => s + Number(t.amount), 0))}</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 p-6 rounded-3xl flex items-center gap-4 group hover:bg-white hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-black group-hover:text-white transition-colors">
                <ArrowUpRight className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Outflow</p>
                <p className="text-lg font-black">{formatCurrency(wallet.transactions.filter(t => t.type === 'debit').reduce((s, t) => s + Number(t.amount), 0))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-gray-900" />
              <h3 className="text-xl font-black tracking-tight">Ledger Records</h3>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
              <TrendingUp className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{wallet.transactions.length} Total Logs</span>
            </div>
          </div>

          <div className="border border-gray-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
            {wallet.transactions.length === 0 ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
                  <Clock className="w-8 h-8" />
                </div>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No Activity Recorded</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Transaction</th>
                      <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                      <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Reference ID</th>
                      <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTransactions.slice(0, visibleCount).map((tx, idx) => (
                      <motion.tr
                        key={idx}
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.01)" }}
                        className="border-b border-gray-100 last:border-0 group transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                              {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-black text-gray-900 group-hover:text-black transition-colors">{tx.description || "Capital Adjustment"}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tx.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-bold text-gray-900">{formatDate(tx.date.toString())}</p>
                          <p className="text-[10px] text-gray-400 font-medium">Recorded System Time</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">#{tx.refId?.slice(-12).toUpperCase() || 'EXTERNAL'}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                            {tx.type === 'credit' ? '+' : '-'} {formatCurrency(tx.amount)}
                          </p>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {sortedTransactions.length > visibleCount && (
            <div className="mt-8 flex justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setVisibleCount(prev => prev + 10)}
                className="px-10 py-4 bg-black text-white font-bold rounded-2xl shadow-xl hover:bg-gray-800 transition-all text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" /> Load More Activity
              </motion.button>
            </div>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="mt-12 flex items-center justify-center gap-2 text-gray-300">
          <ShieldCheck className="w-4 h-4" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">End-to-End Encrypted Financial Ledger</p>
        </div>
      </div>
    </motion.div>
  );
}