import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { 
  Wallet, 
  TrendingUp, 
  Users,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getWallet } from '@/services/Wallet/AdminWalletService';

export default function AdminWalletManagement() {
  const Admin = useSelector((state: RootState) => state.adminAuth.admin);
  const [adminWallet, setAdminWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (Admin?.id) {
      fetchData();
    }
  }, [Admin]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const wallet = await getWallet(Admin.id);
      setAdminWallet(wallet);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateStats = () => {
    if (!adminWallet) return { totalRevenue: 0, totalTransactions: 0 };
    
    const totalRevenue = adminWallet.transactions
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalRevenue,
      totalTransactions: adminWallet.transactions.length
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
          <p className="text-slate-600 text-lg">Loading admin wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            <Wallet className="text-blue-600" size={40} />
            Admin Wallet Management
          </h1>
          <p className="text-slate-600 mt-2">View wallet information</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-800">Error</h3>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100">Admin Balance</span>
              <Wallet size={24} />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(adminWallet?.balance || 0)}</p>
            <p className="text-blue-100 text-sm mt-1">Available funds</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Total Revenue</span>
              <TrendingUp size={24} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-slate-500 text-sm mt-1">All-time earnings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Total Transactions</span>
              <Users size={24} className="text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.totalTransactions}</p>
            <p className="text-slate-500 text-sm mt-1">All transactions</p>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Recent Transactions</h3>
          {adminWallet?.transactions?.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {adminWallet?.transactions?.slice(0, 10).map((tx, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'credit'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{tx.description}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-bold text-lg ${
                      tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'credit' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}