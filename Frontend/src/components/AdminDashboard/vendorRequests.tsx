import { useEffect, useState } from "react";
import { getVendorsByStatus, updateVendorStatus } from "@/services/admin/adminService";
import toast from "react-hot-toast";
import type { Vendor } from "@/interface/vendorInterface";

interface Props {
  filter: "pending" | "approved" | "rejected";
}

const VendorRequests: React.FC<Props> = ({ filter }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVendors = () => {
  setLoading(true);
  getVendorsByStatus(filter)
    .then((data) => {
      console.log("Fetched Vendors:", data); 
      setVendors(data);
    })
    .catch(() => toast.error("Failed to fetch vendors"))
    .finally(() => setLoading(false));
};

  useEffect(() => {
    fetchVendors();
  }, [filter]);

  const handleStatusChange = async (
    vendorId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await updateVendorStatus(vendorId, newStatus);
      toast.success(`Vendor ${newStatus}`);
      fetchVendors();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 capitalize">{filter} Vendors</h2>

      {loading ? (
        <p>Loading...</p>
      ) : vendors.length === 0 ? (
        <p>No {filter} vendors found.</p>
      ) : (
        <ul className="space-y-4">
          {vendors.map((vendor) => (
            <li key={vendor._id} className="p-4 bg-white rounded shadow">
              <p><strong>Name:</strong> {vendor.name}</p>
              <p><strong>Email:</strong> {vendor.email}</p>
              <p><strong>Phone:</strong> {vendor.phone}</p>
              <p><strong>Status:</strong> {vendor.status}</p>
              <p>
                <strong>Document:</strong>{" "}
                <a
                  href={vendor.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View Document
                </a>
              </p>

              {filter === "pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(vendor._id, "approved")}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(vendor._id, "rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VendorRequests;
