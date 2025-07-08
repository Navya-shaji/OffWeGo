import type { Vendor } from '@/interface/vendorInterface';
import React from 'react';

interface VendorListProps {
  title: string;
  vendors?: Vendor[];
  bgColor: string;
  showActions?: boolean;
  onAction?: (vendorId: string, status: 'approved' | 'rejected') => void;
}

const VendorList: React.FC<VendorListProps> = ({
  title,
  vendors = [],
  bgColor,
  showActions = false,
  onAction,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {vendors.length === 0 ? (
        <p className="text-gray-500">No vendors found.</p>
      ) : (
        vendors.map((vendor) => (
          <div
            key={vendor._id}
            className={`p-4 mb-2 rounded-md shadow ${bgColor}`}
          >
            <p><strong>Name:</strong> {vendor.name}</p>
            <p><strong>Email:</strong> {vendor.email}</p>
            {vendor.phone && <p><strong>Phone:</strong> {vendor.phone}</p>}
            {vendor.status && <p><strong>Status:</strong> {vendor.status}</p>}

            {showActions && vendor.status === 'pending' && onAction && (
              <div className="mt-2 flex gap-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => onAction(vendor._id, 'approved')}
                >
                  Accept
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => onAction(vendor._id, 'rejected')}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default VendorList;
