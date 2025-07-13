import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_ROUTES } from '@/Routes/Admin/adminApiRoutes';
import axios from 'axios';
import {
  setPendingVendors,
  setApprovedVendors,
  setRejectedVendors,
} from '@/store/slice/vendor/vendorSlice';
import type { RootState } from '@/store/store';
import type { Vendor } from '@/interface/vendorInterface';

interface ModalProps {
  onClose: () => void;
}

const VendorRequestModal: React.FC<ModalProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { pendingVendors, approvedVendors, rejectedVendors } = useSelector(
    (state: RootState) => state.vendor
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pending, approved, rejected] = await Promise.all([
          axios.get(API_ROUTES.VENDOR.PENDING),
          axios.get(API_ROUTES.VENDOR.APPROVED),
          axios.get(API_ROUTES.VENDOR.REJECTED),
        ]);
        dispatch(setPendingVendors(pending.data.vendors));
        dispatch(setApprovedVendors(approved.data.vendors));
        dispatch(setRejectedVendors(rejected.data.vendors));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [dispatch]);

  const renderVendors = (
    title: string,
    list: Vendor[],
    colorClasses: string
  ) => (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 border-b pb-1">
        {title}
      </h2>
      {list.length === 0 ? (
        <p className="text-gray-500 italic">No {title.toLowerCase()}.</p>
      ) : (
        <div className="space-y-3">
          {list.map((v) => (
            <div
              key={v._id}
              className={`p-4 rounded-md shadow-sm ${colorClasses} border border-gray-200`}
            >
              <p className="text-sm">
                <strong>Name:</strong> {v.name}
              </p>
              <p className="text-sm">
                <strong>Email:</strong> {v.email}
              </p>
              <p className="text-sm">
                <strong>Status:</strong>{' '}
                <span className="capitalize font-medium">{v.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center px-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl overflow-y-auto max-h-[90vh] border border-gray-300 relative">
      
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Vendor Requests</h1>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-800 transition text-lg font-bold"
            title="Close"
          >
            ✖
          </button>
        </div>

        {renderVendors('Pending Requests', pendingVendors, 'bg-yellow-50')}
        {renderVendors('Approved Vendors', approvedVendors, 'bg-green-50')}
        {renderVendors('Rejected Vendors', rejectedVendors, 'bg-red-50')}
      </div>
    </div>
  );
};

export default VendorRequestModal;
