import React, { useEffect, useState } from "react";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  CheckCircle,
  Clock,
} from "lucide-react";

import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import {
  getWallet,
  getFinishedTrips,
  transferWalletAmount,
} from "@/services/Wallet/AdminWalletService";

import type { IWallet } from "@/interface/wallet";
import type { Booking } from "@/interface/Boooking";

const AdminWalletManagement = () => {
  const adminId = useSelector(
    (state: RootState) => state.adminAuth.admin.id
  );

  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [completedBookings, setCompletedBookings] = useState<Booking[]>([]);
  const [processedBookings, setProcessedBookings] = useState<Set<string>>(
    new Set()
  );

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // ---------------------------
  // FETCH WALLET + BOOKINGS
  // ---------------------------
  useEffect(() => {
    loadWallet();
    loadBookings();
  }, []);

  const loadWallet = async () => {
    try {
      const data = await getWallet(adminId);
      setWallet(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadBookings = async () => {
    try {
      const data = await getFinishedTrips();
      setCompletedBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // PROCESS A SINGLE BOOKING
  // ---------------------------
  const processSingleBooking = async (booking: Booking) => {
    try {
      const vendorId = booking.selectedPackage?.vendorId;
      if (!vendorId) return;

      const vendorShare = booking.totalAmount * 0.9;

      await transferWalletAmount(adminId, vendorId, vendorShare);

      setProcessedBookings((prev) => new Set([...prev, booking._id]));

      alert(`Booking #${booking._id} processed successfully!`);
    } catch (err) {
      console.error(err);
      alert("Failed to process booking");
    }
  };

  // ---------------------------
  // PROCESS ALL BOOKINGS
  // ---------------------------
  const processAllBookings = async () => {
    try {
      setProcessing(true);

      for (const booking of completedBookings) {
        if (processedBookings.has(booking._id)) continue;

        await processSingleBooking(booking);
      }

      alert("All bookings processed!");
    } catch (err) {
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  // ---------------------------
  // HELPERS
  // ---------------------------
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // ---------------------------
  // UI
  // ---------------------------

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <RefreshCw className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <h1 className="text-3xl font-bold mb-6">Admin Wallet</h1>

        {/* WALLET */}
        <div className="bg-white shadow p-6 rounded-xl mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Wallet className="w-12 h-12 text-indigo-600 mr-4" />
              <div>
                <p className="text-gray-600">Available Balance</p>
                <h1 className="text-4xl font-bold">
                  {wallet ? formatCurrency(wallet.balance) : "₹0"}
                </h1>
              </div>
            </div>

            <button
              onClick={loadWallet}
              className="p-3 bg-indigo-600 text-white rounded-full"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* COMPLETED BOOKINGS */}
        <div className="bg-white shadow p-6 rounded-xl mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Completed Bookings</h2>

            <button
              onClick={processAllBookings}
              disabled={processing}
              className="px-5 py-2 bg-indigo-600 text-white rounded-lg flex items-center"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Process All
                </>
              )}
            </button>
          </div>

          {completedBookings.map((booking) => {
            const vendorShare = booking.totalAmount * 0.9;
            const commission = booking.totalAmount * 0.1;

            const done = processedBookings.has(booking._id);

            return (
              <div
                key={booking._id}
                className={`p-5 border rounded-xl mb-3 ${
                  done ? "bg-green-50" : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-bold">#{booking._id}</h3>
                    <p className="text-gray-600">
                      Customer: {booking.customerName}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Completed: {formatDate(booking.completedDate)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold mb-2">
                      {formatCurrency(booking.totalAmount)}
                    </p>

                    <div className="bg-white border rounded p-2 mb-2">
                      <div className="flex justify-between text-red-600">
                        <span className="flex items-center">
                          <TrendingDown className="w-4 h-4 mr-1" /> Vendor (90%)
                        </span>
                        -{formatCurrency(vendorShare)}
                      </div>

                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center">
                          <TrendingUp className="w-4 h-4 mr-1" /> Admin (10%)
                        </span>
                        +{formatCurrency(commission)}
                      </div>
                    </div>

                    {!done && (
                      <button
                        onClick={() => processSingleBooking(booking)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        Process Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminWalletManagement;
