import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Wallet, 
  TrendingUp, 
  Users,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ArrowDownRight,
  ArrowUpRight,
  Percent
} from 'lucide-react';
import { 
  getWallet, 
  completeTripAndDistribute 
} from '@/services/Wallet/AdminWalletService';
import type { IWallet } from '@/interface/wallet';

type ITransaction = IWallet['transactions'][0];

import type { RootState } from '@/store/store';

export default function AdminWalletManagement() {
  const Admin = useSelector((state: RootState) => state.adminAuth.admin);

  const [adminWallet, setAdminWallet] = useState<IWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [processingBooking, setProcessingBooking] = useState<string | null>(null);

  useEffect(() => {
    if (Admin?.id) {
      
      fetchWalletData();
    }
  }, [Admin]);

  const fetchWalletData = async () => {
    if (!Admin?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const wallet = await getWallet(Admin.id);
      console.log(wallet,"wall")
      setAdminWallet(wallet);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
    if (!adminWallet) return { 
      totalRevenue: 0, 
      totalTransactions: 0,
      totalCommission: 0,
      pendingBookings: 0
    };
    
    const totalRevenue = adminWallet.transactions
      .filter((t: ITransaction) => t.type === 'credit')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);
    
    const totalCommission = adminWallet.transactions
      .filter((t: ITransaction) => t.type === 'commission')
      .reduce((sum: number, t: ITransaction) => sum + t.amount, 0);
    
    const pendingBookings = adminWallet.transactions
      .filter((t: ITransaction) => t.type === 'credit' && t.status === 'pending').length;
    
    return {
      totalRevenue,
      totalTransactions: adminWallet.transactions.length,
      totalCommission,
      pendingBookings
    };
  };

  const handleCompleteTrip = async (booking: ITransaction) => {
    if (!Admin?._id) {
      setError('Admin not authenticated');
      return;
    }

    const vendorAmount = booking.amount * 0.90;
    const adminCommission = booking.amount * 0.10;
    
    if (!window.confirm(`Complete trip for ${booking.bookingId}?\n\nDistribution:\n• Admin Commission (10%): ${formatCurrency(adminCommission)}\n• Vendor Payment (90%): ${formatCurrency(vendorAmount)}`)) {
      return;
    }

    setProcessingBooking(booking.bookingId || null);
    setError(null);
    setSuccess(null);

    try {

      if (!booking.vendorId) {
        throw new Error('Vendor ID not found in booking transaction');
      }
      

      const result = await completeTripAndDistribute({
        bookingId: booking.bookingId!,
        adminId: Admin._id,
        vendorId: booking.vendorId!,
        amount: booking.amount
      });
      if (result.success) {
        setSuccess(
          `Trip completed successfully! Commission earned: ${formatCurrency(adminCommission)}, Transferred to vendor: ${formatCurrency(vendorAmount)}`
        );
        
    
        await fetchWalletData();
      } else {
        throw new Error(result.message || 'Transfer failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to complete trip');
    } finally {
      setProcessingBooking(null);
    }
  };

  const stats = calculateStats();

  const getTransactionIcon = (type: ITransaction['type']) => {
    switch(type) {
      case 'credit': return <ArrowDownRight className="text-green-600" size={20} />;
      case 'debit': return <ArrowUpRight className="text-red-600" size={20} />;
      case 'commission': return <Percent className="text-blue-600" size={20} />;
      default: return <Wallet size={20} />;
    }
  };

  const getTransactionColor = (type: ITransaction['type']) => {
    switch(type) {
      case 'credit': return 'bg-green-100';
      case 'debit': return 'bg-red-100';
      case 'commission': return 'bg-blue-100';
      default: return 'bg-slate-100';
    }
  };

  const pendingBookings = adminWallet?.transactions?.filter(
    (t: ITransaction) => t.type === 'credit' && t.status === 'pending'
  ) || [];

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-800 flex items-center gap-3">
                <Wallet className="text-blue-600" size={40} />
                Admin Wallet Management
              </h1>
              <p className="text-slate-600 mt-2">Manage bookings and track commissions</p>
            </div>
            <button
              onClick={fetchWalletData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-slate-400"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
              Refresh
            </button>
          </div>
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

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-green-800">Success</h3>
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100">Current Balance</span>
              <Wallet size={24} />
            </div>
            <p className="text-3xl font-bold">{formatCurrency(adminWallet?.balance || 0)}</p>
            <p className="text-blue-100 text-sm mt-1">Available funds</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Total Commission</span>
              <Percent className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(stats.totalCommission)}</p>
            <p className="text-slate-500 text-sm mt-1">10% earnings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Total Revenue</span>
              <TrendingUp size={24} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-slate-500 text-sm mt-1">All bookings</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600">Pending Trips</span>
              <Users size={24} className="text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.pendingBookings}</p>
            <p className="text-slate-500 text-sm mt-1">Awaiting completion</p>
          </div>
        </div>

        {pendingBookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-orange-500">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle className="text-orange-500" size={24} />
              Pending Trip Completions
            </h3>
            <p className="text-slate-600 mb-4 text-sm">
              Complete these trips to distribute funds (10% commission, 90% to vendor)
            </p>
            <div className="space-y-3">
              {pendingBookings.map((booking: ITransaction, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200"
                >
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{booking.description}</p>
                    {booking.vendorName && (
                      <p className="text-sm text-slate-600">
                        Vendor: {booking.vendorName}
                      </p>
                    )}
                    <p className="text-sm text-slate-500">
                      Booked: {new Date(booking.date).toLocaleDateString()}
                    </p>
                    {booking.bookingDetails && (
                      <div className="text-sm text-slate-600 space-y-1">
                        <p>Package: {booking.bookingDetails.packageName}</p>
                        {booking.bookingDetails.destinationName && (
                          <p>Destination: {booking.bookingDetails.destinationName}</p>
                        )}
                        {booking.bookingDetails.userName && (
                          <p>Customer: {booking.bookingDetails.userName}</p>
                        )}
                      </div>
                    )}
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-slate-600">
                        Total: <span className="font-semibold">{formatCurrency(booking.amount)}</span>
                      </span>
                      <span className="text-blue-600">
                        Commission (10%): <span className="font-semibold">{formatCurrency(booking.amount * 0.10)}</span>
                      </span>
                      <span className="text-green-600">
                        To Vendor (90%): <span className="font-semibold">{formatCurrency(booking.amount * 0.90)}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCompleteTrip(booking)}
                    disabled={processingBooking === (booking.bookingId || null)}
                    className="ml-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {processingBooking === (booking.bookingId || null) ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        Complete Trip
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4">Transaction History</h3>
          {adminWallet?.transactions?.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No transactions yet</p>
          ) : (
            <div className="space-y-2">
              {adminWallet?.transactions?.slice(0, 20).map((tx: ITransaction, idx: number) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    tx.status === 'pending' ? 'bg-orange-50 border border-orange-200' : 'bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTransactionColor(tx.type)}`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-800">{tx.description}</p>
                        {tx.status === 'pending' && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                      {tx.vendorName && (
                        <p className="text-sm text-slate-600">
                          Vendor: {tx.vendorName}
                        </p>
                      )}
                      {tx.bookingDetails && (
                        <div className="text-sm text-slate-600 space-y-1">
                          <p>Package: {tx.bookingDetails.packageName}</p>
                          {tx.bookingDetails.destinationName && (
                            <p>Destination: {tx.bookingDetails.destinationName}</p>
                          )}
                          {tx.bookingDetails.userName && (
                            <p>Customer: {tx.bookingDetails.userName}</p>
                          )}
                        </div>
                      )}
                      <p className="text-sm text-slate-500">
                        {new Date(tx.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-bold text-lg ${
                      tx.type === 'credit' ? 'text-green-600' : 
                      tx.type === 'debit' ? 'text-red-600' : 
                      'text-blue-600'
                    }`}
                  >
                    {tx.type === 'debit' ? '-' : '+'}
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