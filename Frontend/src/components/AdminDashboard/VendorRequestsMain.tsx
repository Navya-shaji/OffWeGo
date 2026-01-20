import { useState } from "react";
import VendorRequests from "./vendorRequests";

const VendorRequestsMain = () => {
    const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

    return (
        <div className="bg-gray-50 min-h-screen p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vendor Requests</h1>
                    <p className="text-gray-500 mt-1">Manage new vendor applications and viewing history</p>
                </div>

                <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                    {(["pending", "approved", "rejected"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab
                                ? "bg-gray-900 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                <VendorRequests filter={activeTab} />
            </div>
        </div>
    );
};

export default VendorRequestsMain;
