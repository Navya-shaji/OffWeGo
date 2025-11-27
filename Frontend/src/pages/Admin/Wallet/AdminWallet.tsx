// import React, { useState, useEffect } from 'react';
// import { Wallet, TrendingDown, TrendingUp, RefreshCw, CheckCircle, Clock } from 'lucide-react';
// import { getFinishedTrips, getWallet } from '@/services/Wallet/AdminWalletService';
// import { useSelector } from 'react-redux';
// import type { RootState } from '@/store/store';

//  const AdminWalletManagement = () => {
//   const [wallet, setWallet] = useState(null);
//   const [completedBookings, setCompletedBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [processedBookings, setProcessedBookings] = useState(new Set());
//   const [error, setError] = useState(null);

//   const adminId =useSelector((state: RootState) => state.adminAuth.admin.id);
//   console.log(adminId,"id of admin")
//   useEffect(() => {
//     fetchWalletData();
//     fetchCompletedBookings();
//   }, []);

//   const fetchWalletData = async () => {
//     try {
//       setError(null);
//       const data = await getWallet(adminId);
//       console.log(data, "datas")
//       setWallet(data);
//     } catch (error) {
//       console.error("Error fetching wallet:", error);
//       // setError("Failed to load wallet data");
//     }
//   };

//   console.log(wallet,"whole wallet")

//   const fetchCompletedBookings = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await getFinishedTrips();
//       console.log(data,"data comlted")
//       setCompletedBookings(data);
//     } catch (error) {
//       console.error("Error fetching bookings:", error);
//       setError("Failed to load completed bookings");
//     } finally {
//       setLoading(false);
//     }
//   };
// const res=completedBookings.data
// const processAllBookings = async () => {
//   try {
//     setProcessing(true);

//     for (const booking of res) {
//       console.log(booking,"boo")
//       const id = booking.bookingId;  // <-- Correct ID

//       if (!processedBookings.has(id)) {
//         await new Promise(resolve => setTimeout(resolve, 500));

//         const vendorShare = booking.totalAmount * 0.9;
//         const adminCommission = booking.totalAmount * 0.1;

//         setWallet(prev => ({
//           ...prev,
//           balance: prev.balance - vendorShare,
//           transactions: [
//             {
//               _id: `txn_${Date.now()}`,
//               type: "debit",
//               amount: vendorShare,
//               description: `Transfer to Vendor - Booking #${id}`,
//               date: new Date().toISOString(),
//             },
//             ...prev.transactions,
//           ],
//         }));

//         setProcessedBookings(prev => new Set([...prev, id]));
//       }
//     }

//     alert("All bookings processed successfully!");
//   } catch (err) {
//     console.error("Error processing bookings:", err);
//     alert("Failed to process bookings");
//   } finally {
//     setProcessing(false);
//   }
// };


//   console.log(processAllBookings,"processallBooking")
//   const processSingleBooking = async (booking) => {
//     try {
//       const vendorShare = booking.totalAmount * 0.9;
//       const adminCommission = booking.totalAmount * 0.1;
      
//       // Replace with: await transferWalletAmount(adminId, booking.selectedPackage.vendorId, vendorShare);
      
//       setWallet(prev => ({
//         ...prev,
//         balance: prev.balance - vendorShare,
//         transactions: [
//           {
//             _id: `txn_${Date.now()}`,
//             type: "debit",
//             amount: vendorShare,
//             description: `Transfer to Vendor - Booking #${booking._id}`,
//             date: new Date().toISOString(),
//           },
//           ...prev.transactions,
//         ],
//       }));
      
//       setProcessedBookings(prev => new Set([...prev, booking._id]));
//       alert(`Booking #${booking._id} processed successfully!`);
//     } catch (error) {
//       console.error("Error processing booking:", error);
//       alert("Failed to process booking");
//     }
//   };
//   console.log(processSingleBooking,"processallBooking")
// console.log(processedBookings,"processedBooking")
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0,
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <RefreshCw className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600">Loading wallet data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Wallet</h1>
//           <p className="text-gray-600">Manage bookings and vendor payments</p>
//         </div>

//         {/* Wallet Balance Card */}
//         <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
//           <div className="flex items-center justify-between mb-4">
//             <div className="flex items-center">
//               <Wallet className="w-12 h-12 mr-4" />
//               <div>
//                 <p className="text-indigo-200 text-sm">Available Balance</p>
//                 <h2 className="text-5xl font-bold">{formatCurrency(wallet?.balance || 0)}</h2>
//               </div>
//             </div>
//             <button
//               onClick={fetchWalletData}
//               className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition"
//             >
//               <RefreshCw className="w-6 h-6" />
//             </button>
//           </div>
          
//           <div className="grid grid-cols-2 gap-4 mt-6">
//             <div className="bg-white/10 rounded-lg p-4">
//               <p className="text-indigo-200 text-sm mb-1">Pending Bookings</p>
//               <p className="text-2xl font-semibold">
//                 {/* {completedBookings.filter(b => !processedBookings.has(b.id)).length} */}
//               </p>
//             </div>
//             <div className="bg-white/10 rounded-lg p-4">
//               <p className="text-indigo-200 text-sm mb-1">Processed Today</p>
//               <p className="text-2xl font-semibold">{processedBookings.size}</p>
//             </div>
//           </div>
//         </div>

//         {/* Completed Bookings Section */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-2xl font-bold text-gray-800">Completed Bookings</h3>
//             <button
//               onClick={processAllBookings}
//               // disabled={processing || completedBookings.every(b => processedBookings.has(b._id))}
//               className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center"
//             >
//               {processing ? (
//                 <>
//                   <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-5 h-5 mr-2" />
//                   Process All
//                 </>
//               )}
//             </button>
//           </div>

//           <div className="space-y-4">
//             {completedBookings.map((booking) => {
//               const vendorShare = booking.totalAmount * 0.9;
//               const adminCommission = booking.totalAmount * 0.1;
//               const isProcessed = processedBookings.has(booking._id);

//               return (
//                 <div
//                   key={booking._id}
//                   className={`border rounded-xl p-6 transition ${
//                     isProcessed
//                       ? 'bg-green-50 border-green-200'
//                       : 'bg-gray-50 border-gray-200 hover:shadow-md'
//                   }`}
//                 >
//                   <div className="flex items-start justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center mb-2">
//                         <span className="text-lg font-bold text-gray-800 mr-3">
//                           #{booking._id}
//                         </span>
//                         {isProcessed ? (
//                           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
//                             <CheckCircle className="w-4 h-4 mr-1" />
//                             Processed
//                           </span>
//                         ) : (
//                           <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
//                             <Clock className="w-4 h-4 mr-1" />
//                             Pending
//                           </span>
//                         )}
//                       </div>
                      
//                       <p className="text-gray-600 mb-1">
//                         <span className="font-semibold">Customer:</span> {booking.customerName}
//                       </p>
//                       <p className="text-gray-600 mb-1">
//                         <span className="font-semibold">Package:</span> {booking.selectedPackage?.name}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         Completed: {formatDate(booking.completedDate)}
//                       </p>
//                     </div>

//                     <div className="text-right ml-6">
//                       <div className="mb-4">
//                         <p className="text-gray-600 text-sm mb-1">Total Amount</p>
//                         <p className="text-2xl font-bold text-gray-800">
//                           {formatCurrency(booking.totalAmount)}
//                         </p>
//                       </div>
                      
//                       <div className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-gray-600 text-sm flex items-center">
//                             <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
//                             Vendor (90%)
//                           </span>
//                           <span className="font-semibold text-red-600">
//                             -{formatCurrency(vendorShare)}
//                           </span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           <span className="text-gray-600 text-sm flex items-center">
//                             <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
//                             Commission (10%)
//                           </span>
//                           <span className="font-semibold text-green-600">
//                             +{formatCurrency(adminCommission)}
//                           </span>
//                         </div>
//                       </div>

//                       {!isProcessed && (
//                         <button
//                           onClick={() => processSingleBooking(booking)}
//                           className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition w-full"
//                         >
//                           Process Payment
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Recent Transactions */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <h3 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h3>
//           <div className="space-y-3">
//             {wallet?.transactions?.slice(0, 10).map((transaction) => (
//               <div
//                 key={transaction._id}
//                 className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
//               >
//                 <div className="flex items-center">
//                   {transaction.type === 'credit' ? (
//                     <div className="bg-green-100 p-2 rounded-full mr-4">
//                       <TrendingUp className="w-5 h-5 text-green-600" />
//                     </div>
//                   ) : (
//                     <div className="bg-red-100 p-2 rounded-full mr-4">
//                       <TrendingDown className="w-5 h-5 text-red-600" />
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-semibold text-gray-800">{transaction.description}</p>
//                     <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
//                   </div>
//                 </div>
//                 <span
//                   className={`text-lg font-bold ${
//                     transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
//                   }`}
//                 >
//                   {transaction.type === 'credit' ? '+' : '-'}
//                   {formatCurrency(transaction.amount)}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminWalletManagement


import React from 'react'

function AdminWalletManagement() {
  return (
    <div>
      <h1>Ha</h1>
    </div>
  )
}

export default AdminWalletManagement
