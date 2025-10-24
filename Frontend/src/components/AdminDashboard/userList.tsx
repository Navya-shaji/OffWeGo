import { useEffect, useState, useCallback, useRef } from "react";
import {
  getAllUsers,
  searchUser,
  updateUserStatus,
} from "@/services/admin/adminUserService";
import type { User } from "@/interface/userInterface";
import ReusableTable from "../Modular/Table";
import Pagination from "../pagination/pagination";
import type { ColumnDef } from "@tanstack/react-table";
import { SearchBar } from "../Modular/searchbar";


const UserList = () => { 
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: string; status: string; name: string } | null>(null);

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

 
  const fetchUsers = useCallback(async (pageNum: number = 1) => {
  
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError("");
      
      const response = await getAllUsers(pageNum, 10);
      
      setUsers(response.users);
      setOriginalUsers(response.users);
      setTotalPages(response.totalPages);
      setTotalUsers(response.totalUsers);
      setPage(pageNum);
      
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
      setUsers([]);
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
        setUsers(originalUsers);
        setTotalPages(Math.ceil(totalUsers / 10));
        setPage(1);
        return;
      }

      setIsSearchMode(true);
      try {
        const response = await searchUser(query);
        const searchResults = Array.isArray(response) ? response : [];
        
        setUsers(searchResults);
        setTotalPages(Math.ceil(searchResults.length / 10));
        setPage(1);
        
      } catch (error) {
        console.error("Error during search:", error);
        setUsers([]);
        setTotalPages(1);
      }
    }, 300);
  }, [originalUsers, totalUsers]);

 
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === page) return; 
    
    setPage(newPage);
    
    if (!isSearchMode) {
      fetchUsers(newPage);
    }
  }, [page, isSearchMode, fetchUsers]);

  const openStatusModal = (userId: string, currentStatus: string, userName: string) => {
    setSelectedUser({ id: userId, status: currentStatus, name: userName });
    setModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "active" ? "blocked" : "active";
    await handleActionChange(selectedUser.id, newStatus);
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancelStatusChange = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleActionChange = useCallback(async (
    userId: string,
    newStatus: "active" | "blocked"
  ) => {
    const previousUsers = [...users];
    const previousOriginalUsers = [...originalUsers];
    
    const updateUser = (userList: User[]) =>
      userList.map((user) =>
        user._id === userId ? { ...user, status: newStatus } : user
      );

    setUsers(updateUser);
    if (!isSearchMode) {
      setOriginalUsers(updateUser);
    }

    try {
      await updateUserStatus(userId, newStatus);
    } catch (err) {
      console.error("Failed to update user status", err);
      setUsers(previousUsers);
      setOriginalUsers(previousOriginalUsers);
      setError("Failed to update user status. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  }, [users, originalUsers, isSearchMode]);


  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchUsers(1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

 
  const getCurrentPageData = () => {
    if (!isSearchMode) {
      return users; 
    } else {
      const startIndex = (page - 1) * 10;
      const endIndex = startIndex + 10;
      return users.slice(startIndex, endIndex);
    }
  };

  const columns: ColumnDef<User>[] = [
    { 
      header: "#", 
      cell: ({ row }) => {
        const baseIndex = (page - 1) * 10;
        return baseIndex + row.index + 1;
      }
    },
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Phone", cell: ({ row }) => row.original.phone || "N/A" },
    {
      header: "Status",
      cell: ({ row }) =>
        row.original.status === "blocked" ? (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Blocked
          </span>
        ) : (
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        ),
    },
    {
      header: "Created At",
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={row.original.status === "active"}
            onChange={() =>
              openStatusModal(
                row.original._id,
                row.original.status,
                row.original.name
              )
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
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
    
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all scale-100 animate-in">
            <div className="flex items-start mb-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                selectedUser?.status === "blocked" ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-2xl">
                  {selectedUser?.status === "blocked" ? '✓' : '⚠'}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser?.status === "blocked" ? 'Unblock User' : 'Block User'}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to {selectedUser?.status === "blocked" ? 'unblock' : 'block'} <span className="font-medium">{selectedUser?.name}</span>?
                </p>
                {selectedUser?.status === "active" && (
                  <p className="mt-2 text-sm text-gray-500">
                    This user will not be able to access their account.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelStatusChange}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  selectedUser?.status === "blocked"
                    ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                    : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                }`}
              >
                {selectedUser?.status === "blocked" ? 'Unblock' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">All Users</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isSearchMode 
              ? `Found ${users.length} user${users.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `${totalUsers} total users`
            }
          </p>
        </div>
        
        <div className="w-60">
          <SearchBar 
            placeholder="Search users..." 
            onSearch={handleSearch}
          />
        </div>
      </div>

      {/* Error Message */}
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

      {/* Content */}
      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300 text-6xl">
            👤
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No users found
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No users match your search for "${searchQuery}"`
              : "No users are available at the moment"
            }
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ReusableTable 
              data={getCurrentPageData()} 
              columns={columns} 
            />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                total={totalPages} 
                current={page} 
                setPage={handlePageChange}
              />
            </div>
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-500">
            {isSearchMode 
              ? `Showing ${Math.min((page - 1) * 10 + 1, users.length)}-${Math.min(page * 10, users.length)} of ${users.length} search results`
              : `Showing ${((page - 1) * 10) + 1}-${Math.min(page * 10, totalUsers)} of ${totalUsers} users`
            }
          </div>
        </>
      )}
    </div>
  );
};

export default UserList;