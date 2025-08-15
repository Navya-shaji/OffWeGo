import React from "react";
import type { Package } from "@/interface/PackageInterface";

interface EditPackageModalProps {
  pkg: Package;
  onClose: () => void;
  onChange: (updated: Package) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditPackageModal: React.FC<EditPackageModalProps> = ({
  pkg,
  onClose,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Edit Package</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            value={pkg.packageName}
            onChange={(e) => onChange({ ...pkg, packageName: e.target.value })}
            placeholder="Package Name"
            className="border rounded p-2 w-full"
          />
          <textarea
            value={pkg.description}
            onChange={(e) => onChange({ ...pkg, description: e.target.value })}
            placeholder="Description"
            className="border rounded p-2 w-full"
          />
          <input
            type="number"
            value={pkg.price}
            onChange={(e) =>
              onChange({ ...pkg, price: Number(e.target.value) })
            }
            placeholder="Price"
            className="border rounded p-2 w-full"
          />
          <input
            type="number"
            value={pkg.duration}
            onChange={(e) =>
              onChange({ ...pkg, duration: Number(e.target.value) })
            }
            placeholder="Duration (days)"
            className="border rounded p-2 w-full"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
