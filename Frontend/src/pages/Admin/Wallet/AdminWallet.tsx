import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { 
  Wallet, 
  TrendingUp, 
  Users,
  RefreshCw,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { getWallet, transferWalletAmount } from '@/services/Wallet/AdminWalletService';
import { toast } from 'react-hot-toast';

export default function AdminWalletManagement() {
  const Admin = useSelector((state: RootState) => state.adminAuth.admin);
  console.log(Admin,"id")
  const [adminWallet, setAdminWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transferring, setTransferring] = useState<string | null>(null);

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

  const handleTransferToVendor = async (transaction: any) => {
    if (!transaction.vendorId) {
      toast.error('Vendor information not found');
      return;
    }

    // Calculate 90% of the transaction amount
    const transferAmount = Math.floor(transaction.amount * 0.9);

    try {
      setTransferring(transaction._id);
      
      const result = await transferWalletAmount(
        Admin.id,
        transaction.vendorId,
        transferAmount,
        transaction.bookingId,
        transaction._id
      );
console.log(result,"res")
      if (result.success) {
        toast.success(`Successfully transferred ${formatCurrency(transferAmount)} to vendor`);
        // Refresh wallet data
        await fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to transfer amount');
    } finally {
      setTransferring(null);
    }
  };

  const formatCurrency = (amount: number) => {
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

  const isPackageCompleted = (transaction: any) => {
    // Check if transaction has endDate and if it's past current date
    if (!transaction.endDate) return false;
    
    const endDate = new Date(transaction.endDate);
    const today = new Date();
    return today > endDate;
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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
            Admin Wallet Management
          </h1>
          <p className="text-slate-600 mt-2">View wallet information and transfer funds to vendors</p>
        </div>

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
          <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-xl shadow-lg p-6 text-white">
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
          <div className="space-y-3">
            {adminWallet?.transactions?.slice(0, 10).map((tx, idx) => {
              const isCompleted = isPackageCompleted(tx);
              const isUserPayment = tx.description?.toLowerCase().includes("user") || 
                                   tx.description?.toLowerCase().includes("booking") ||
                                   tx.description?.toLowerCase().includes("package");
              const canTransfer = isCompleted && isUserPayment && tx.type === 'credit' && !tx.transferred;
              const transferAmount = Math.floor(tx.amount * 0.9);

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
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
                        {tx.endDate && (
                          <span className="ml-2">
                            • End: {new Date(tx.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                      {canTransfer && (
                        <p className="text-xs text-green-600 mt-1">
                          90% ({formatCurrency(transferAmount)}) ready to transfer
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p
                      className={`font-bold text-lg ${
                        tx.type === 'credit' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {tx.type === 'credit' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </p>

                    {canTransfer && (
                      <button
                        onClick={() => handleTransferToVendor(tx)}
                        disabled={transferring === tx._id}
                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {transferring === tx._id ? (
                          <>
                            <RefreshCw className="animate-spin" size={16} />
                            Transferring...
                          </>
                        ) : (
                          <>
                            Transfer to Vendor
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    )}

                    {tx.transferred && (
                      <span className="px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                        Transferred
                      </span>
                    )}

                    {isUserPayment && !isCompleted && tx.type === 'credit' && (
                      <span className="px-3 py-1 text-xs font-medium text-orange-700 bg-orange-100 rounded-full">
                        Package Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}