import { useEffect, useState, useCallback, useRef } from "react";
import ReusableTable from "../Modular/Table";
import {
  getAllVendors,
  searchVendor,
  updateVendorBlockStatus,
} from "@/services/admin/adminVendorService";
import type { ColumnDef } from "@tanstack/react-table";
import type { Vendor } from "@/interface/vendorInterface";
import Pagination from "../pagination/pagination";
import { SearchBar } from "../Modular/searchbar";

export const VendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [originalVendors, setOriginalVendors] = useState<Vendor[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVendors, setTotalVendors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  
  const fetchVendors = useCallback(async (pageNum: number = 1) => {
    
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError("");
      
      const response = await getAllVendors(pageNum, 10);
      
      setVendors(response.vendors);
      setOriginalVendors(response.vendors);
      setTotalPages(Math.ceil(response.totalvendors / 10));
      setTotalVendors(response.totalvendors);
      setPage(pageNum);
      
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to fetch vendors.");
      setVendors([]);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, []);


  const handleSearch = useCallback(async (query: string) => {
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);

  
    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
      
        setIsSearchMode(false);
        setVendors(originalVendors);
        setTotalPages(Math.ceil(totalVendors / 10));
        setPage(1);
        return;
      }

      setIsSearchMode(true);
      try {
        const response = await searchVendor(query);
        const searchResults = Array.isArray(response) ? response : [];
        
        setVendors(searchResults);
        setTotalPages(Math.ceil(searchResults.length / 10));
        setPage(1);
        
      } catch (error) {
        console.error("Error during search:", error);
        setVendors([]);
        setTotalPages(1);
      }
    }, 300);
  }, [originalVendors, totalVendors]);


  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === page) return; 
    
    setPage(newPage);
    
    if (!isSearchMode) {
   
      fetchVendors(newPage);
    }
  }, [page, isSearchMode, fetchVendors]);

  const handleBlockToggle = useCallback(async (
    vendorId: string,
    currentStatus: boolean
  ) => {
    const previousVendors = [...vendors];
    const previousOriginalVendors = [...originalVendors];
    
    const updateVendor = (vendorList: Vendor[]) =>
      vendorList.map((vendor) =>
        vendor._id === vendorId ? { ...vendor, isBlocked: !currentStatus } : vendor
      );

    setVendors(updateVendor);
    if (!isSearchMode) {
      setOriginalVendors(updateVendor);
    }

    try {
      await updateVendorBlockStatus(vendorId, !currentStatus);
    } catch (err) {
      console.error("Failed to update vendor status", err);
      setVendors(previousVendors);
      setOriginalVendors(previousOriginalVendors);
      setError("Failed to update vendor status. Please try again.");
      
      setTimeout(() => setError(""), 3000);
    }
  }, [vendors, originalVendors, isSearchMode]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchVendors(1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []); 

 
  const getCurrentPageData = () => {
    if (!isSearchMode) {
      return vendors; 
    } else {
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      return vendors.slice(startIndex, endIndex);
    }
  };

  const columns: ColumnDef<Vendor>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => {
        const baseIndex = (page - 1) * 10;
        return baseIndex + row.index + 1;
      },
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass =
          status === "approved"
            ? "bg-green-100 text-green-800"
            : status === "rejected"
            ? "bg-red-100 text-red-800"
            : "bg-yellow-100 text-yellow-800";
        
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Blocked Status",
      cell: ({ row }) => {
        const blocked = row.original.isBlocked;
        return (
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            blocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
          }`}>
            {blocked ? "Blocked" : "Unblocked"}
          </span>
        );
      },
    },
    {
      header: "Document",
      cell: ({ row }) => {
        const url = row.original.documentUrl;
        return url ? (
          <img
            src={url}
            alt="Vendor Document"
            className="w-16 h-16 object-cover rounded border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-document.png";
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Doc</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt ?? "");
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!row.original.isBlocked}
            onChange={() =>
              handleBlockToggle(row.original._id, row.original.isBlocked)
            }
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all duration-300 peer-focus:ring-2 peer-focus:ring-green-300" />
          <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300" />
        </label>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading vendors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Vendors</h1>
          <p className="text-sm text-gray-600 mt-1">
            {isSearchMode 
              ? `Found ${vendors.length} vendor${vendors.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `${totalVendors} total vendors`
            }
          </p>
        </div>
        
        <div className="w-60">
          <SearchBar 
            placeholder="Search Vendors..." 
            onSearch={handleSearch}
            value={searchQuery}
          />
        </div>
      </div>

     
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

   
      {vendors.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300 text-6xl">
            🏪
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No vendors found
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No vendors match your search for "${searchQuery}"`
              : "No vendors are available at the moment"
            }
          </p>
        </div>
      ) : (
        <>
         
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ReusableTable<Vendor> 
              data={getCurrentPageData()} 
              columns={columns} 
            />
          </div>

         
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                total={totalPages} 
                current={page} 
                setPage={handlePageChange}
              />
            </div>
          )}

        
          <div className="text-center text-sm text-gray-500">
            {isSearchMode 
              ? `Showing ${Math.min((page - 1) * 10 + 1, vendors.length)}-${Math.min(page * 10, vendors.length)} of ${vendors.length} search results`
              : `Showing ${((page - 1) * 10) + 1}-${Math.min(page * 10, totalVendors)} of ${totalVendors} vendors`
            }
          </div>
        </>
      )}
    </div>
  );
};