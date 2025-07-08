import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_ROUTES } from '@/Routes/Admin/adminApiRoutes';
import axios from 'axios';
import { setPendingVendors, setApprovedVendors, setRejectedVendors } from '@/store/slice/vendor/vendorSlice';
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

  const renderVendors = (title: string, list: Vendor[], color: string) => (
    <div>
      <h2 className="text-lg font-bold mt-4">{title}</h2>
      {list.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()}.</p>
      ) : (
        list.map((v) => (
          <div key={v._id} className={`p-2 my-2 rounded-md ${color}`}>
            <p><strong>Name:</strong> {v.name}</p>
            <p><strong>Email:</strong> {v.email}</p>
            <p><strong>Status:</strong> {v.status}</p>
          </div>
        ))
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Vendor Requests</h1>
          <button onClick={onClose} className="text-red-500 font-semibold">✖</button>
        </div>

        {renderVendors('Pending Requests', pendingVendors, 'bg-yellow-100')}
        {renderVendors('Approved Vendors', approvedVendors, 'bg-green-100')}
        {renderVendors('Rejected Vendors', rejectedVendors, 'bg-red-100')}
      </div>
    </div>
  );
};

export default VendorRequestModal;
