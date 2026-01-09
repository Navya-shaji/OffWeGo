import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Wallet, TrendingUp, Users, RefreshCw, AlertCircle, CheckCircle, ArrowDownRight, ArrowUpRight, Percent } from 'lucide-react';
import { getWallet } from '@/services/Wallet/AdminWalletService';
import type { IWallet } from '@/interface/wallet';

type ITransaction = IWallet['transactions'][0];
import type { RootState } from '@/store/store';

export default function AdminWalletManagement() {
  const Admin = useSelector((state: RootState) => state.adminAuth.admin);
  const [adminWallet, setAdminWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (Admin?.id) {
      fetchWalletData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Admin]);

  const fetchWalletData = async () => {
    if (!Admin?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const wallet = await getWallet(Admin.id);
      setAdminWallet(wallet);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateStats = () => {
    if (!adminWallet) return { totalRevenue: 0, totalTransactions: 0, pendingBookings: 0 };

    const totalRevenue = adminWallet.transactions
      .filter((t: ITransaction) => t.type === 'credit')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);

    return {
      totalRevenue,
      totalTransactions: adminWallet.transactions.length,
    };
  };

  const stats = calculateStats();

  const getTransactionIcon = (type: ITransaction['type']) => {
    switch(type) {
      case 'credit':
        return <ArrowDownRight className="w-5 h-5 text-emerald-600" />;
      case 'debit':
        return <ArrowUpRight className="w-5 h-5 text-rose-600" />;
      default:
        return <Wallet className="w-5 h-5 text-slate-600" />;
    }
  };

  const getTransactionColor = (type: ITransaction['type']) => {
    switch(type) {
      case 'credit':
        return 'bg-emerald-50 border-emerald-100';
      case 'debit':
        return 'bg-rose-50 border-rose-100';
      default:
        return 'bg-slate-50 border-slate-100';
    }
  };

  const pendingBookings = adminWallet?.transactions?.filter(
    (t: ITransaction) => t.type === 'credit'
  ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <Wallet className="w-8 h-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 font-medium">Loading admin wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Wallet Management
                </h1>
              </div>
              <p className="text-slate-500 ml-[60px]">Manage bookings and track commissions</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 rounded-xl p-4 shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-rose-800">Error</h3>
                <p className="text-rose-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-4 shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-800">Success</h3>
                <p className="text-emerald-700 text-sm mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Current Balance */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                Available
              </span>
            </div>
            <h3 className="text-sm font-medium text-indigo-100 mb-1">Current Balance</h3>
            <p className="text-3xl font-bold mb-1">{formatCurrency(adminWallet?.balance || 0)}</p>
            <p className="text-xs text-indigo-100">Available funds</p>
          </div>

          {/* Commission Rate */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <Percent className="w-6 h-6 text-amber-600" />
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                Rate
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total Commission</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1">10%</p>
            <p className="text-xs text-slate-400">Per booking</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                Total
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Total Revenue</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-xs text-slate-400">All bookings</p>
          </div>

          {/* Pending Trips */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Pending
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">Pending Trips</h3>
            <p className="text-3xl font-bold text-slate-900 mb-1">{pendingBookings.length}</p>
            <p className="text-xs text-slate-400">Awaiting completion</p>
          </div>
        </div>

        {/* Pending Trip Completions */}
        {pendingBookings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pending Trip Completions</h2>
                <p className="text-sm text-slate-500">Complete these trips to distribute funds (10% commission, 90% to vendor)</p>
              </div>
            </div>
            {/* Add your pending bookings list here */}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50">
            <h2 className="text-xl font-bold text-slate-900">Transaction History</h2>
            <p className="text-sm text-slate-500 mt-1">Recent wallet activity</p>
          </div>

          <div className="p-6">
            {adminWallet?.transactions?.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                  <Wallet className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No transactions yet</p>
                <p className="text-sm text-slate-400 mt-1">Transactions will appear here once bookings are made</p>
              </div>
            ) : (
              <div className="space-y-3">
                {adminWallet?.transactions?.slice(0, 20).map((tx: ITransaction, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-4 rounded-xl border ${getTransactionColor(tx.type)} hover:shadow-md transition-all duration-200 group`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-lg ${tx.type === 'credit' ? 'bg-emerald-100' : 'bg-rose-100'} group-hover:scale-110 transition-transform duration-200`}>
                        {getTransactionIcon(tx.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{tx.description}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {new Date(tx.date).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className={`text-lg font-bold ${tx.type === 'debit' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {tx.type === 'debit' ? '-' : '+'} {formatCurrency(tx.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}