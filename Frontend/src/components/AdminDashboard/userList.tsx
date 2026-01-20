import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import {
  getAllUsers,
  searchUser,
  updateUserStatus,
} from "@/services/admin/adminUserService";
import type { User } from "@/interface/userInterface";
import ReusableTable from "../Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { SearchBar } from "../Modular/searchbar";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    status: string;
    name: string;
  } | null>(null);

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ---------------- Fetch Users ---------------- */
  const fetchUsers = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");

      const response = await getAllUsers(pageNum, 10);

      if (append) {
        setUsers((prev) => [...prev, ...response.users]);
      } else {
        setUsers(response.users);
      }

      setTotalUsers(response.totalUsers);
      setHasMore(pageNum < response.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users.");
      if (!append) {
        setUsers([]);
      }
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  /* ---------------- Load More Users ---------------- */
  const loadMoreUsers = useCallback(() => {
    if (!isSearchMode && hasMore && !isLoadingRef.current) {
      fetchUsers(page + 1, true);
    }
  }, [page, hasMore, isSearchMode, fetchUsers]);



  /* ---------------- Search Users ---------------- */
  const handleSearch = useCallback(
    async (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setSearchQuery(query);

      searchTimeoutRef.current = setTimeout(async () => {
        if (!query.trim()) {
          setIsSearchMode(false);
          setPage(1);
          setHasMore(true);
          fetchUsers(1, false);
          return;
        }

        setIsSearchMode(true);
        setLoading(true);
        try {
          const response = await searchUser(query);
          const searchResults = Array.isArray(response) ? response : [];

          setUsers(searchResults);
          setHasMore(false);
        } catch (error) {
          console.error("Error during search:", error);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      }, 300);
    },
    [fetchUsers]
  );

  /* ---------------- Status Modal ---------------- */
  const openStatusModal = (
    userId: string,
    currentStatus: string,
    name: string
  ) => {
    setSelectedUser({ id: userId, status: currentStatus, name });
    setModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === "active" ? "blocked" : "active";
    const action = newStatus === "blocked" ? "block" : "unblock";

    try {
      await handleActionChange(selectedUser.id, newStatus);

      toast.success(
        `Successfully ${action}ed user "${selectedUser.name}"`,
        {
          position: "top-right",
          autoClose: 3000,
          style: {
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.9)",
          },
        }
      );
    } catch {
      toast.error(
        `Failed to ${action} user "${selectedUser.name}". Please try again.`,
        {
          position: "top-right",
          autoClose: 5000,
          style: {
            backdropFilter: "blur(10px)",
            background: "rgba(255, 255, 255, 0.9)",
          },
        }
      );
    }

    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  /* ---------------- Update Status ---------------- */
  const handleActionChange = useCallback(
    async (userId: string, newStatus: "active" | "blocked") => {
      const prevUsers = [...users];

      const updateUser = (list: User[]) =>
        list.map((u) => (u._id === userId ? { ...u, status: newStatus } : u));

      setUsers((prev) => updateUser(prev));

      try {
        await updateUserStatus(userId, newStatus);
      } catch (err) {
        setUsers(prevUsers);
        setError("Failed to update status");
        setTimeout(() => setError(""), 3000);
        throw err;
      }
    },
    [users]
  );

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchUsers(1);
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      header: "#",
      cell: ({ row }) => row.index + 1,
    },

    {
      id: "image",
      header: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
        </svg>
      ),
      cell: ({ row }) => {
        const imageUrl = row.original.imageUrl;
        return imageUrl ? (
          <img src={imageUrl} alt="User" className="w-10 h-10 rounded-full" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 rounded-full text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
        );
      },
    },
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Phone",
      cell: ({ row }) => row.original.phone || "N/A",
    },

    {
      header: "Status",
      cell: ({ row }) =>
        row.original.status === "blocked" ? (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
            Blocked
          </span>
        ) : (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
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
          <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all" />
          <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow transform peer-checked:translate-x-6 transition" />
        </label>
      ),
    },
  ];

  if (loading && users.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full mx-auto" />
        <p className="mt-2 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* ---------------- Modal ---------------- */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold">
              {selectedUser.status === "active" ? "Block User" : "Unblock User"}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Confirm to{" "}
              {selectedUser.status === "active" ? "block" : "unblock"}{" "}
              <strong>{selectedUser.name}</strong>?
            </p>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded border hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 text-white rounded transition ${selectedUser.status === "active"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
                  }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Header ---------------- */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">All Users</h2>
          <p className="text-sm text-gray-500">
            {isSearchMode
              ? `Found ${users.length} results`
              : `Showing ${users.length} of ${totalUsers} total users`}
          </p>
        </div>

        <div className="w-60">
          <SearchBar placeholder="Search users..." onSearch={handleSearch} />
        </div>
      </div>

      {/* ---------------- Error ---------------- */}
      {error && (
        <div className="px-4 py-2 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* ---------------- Table ---------------- */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ReusableTable
          data={users}
          columns={columns}
          loading={false}
        />


        {/* Load More Button */}
        {!isSearchMode && hasMore && users.length > 0 && !loading && (
          <div className="py-8 px-4 text-center border-t border-gray-100 bg-gray-50/30">
            <button
              onClick={loadMoreUsers}
              disabled={loadingMore}
              className={`group relative px-8 py-3 bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold flex items-center gap-3 mx-auto overflow-hidden ${loadingMore ? "opacity-80 cursor-not-allowed" : ""
                }`}
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                  <span>Fetching Users...</span>
                </>
              ) : (
                <>
                  <span>Load More Users</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* End of list message */}
        {!hasMore && users.length > 0 && !isSearchMode && (
          <div className="p-6 text-center text-sm text-gray-500 bg-gray-50 border-t border-gray-100 italic">
            You've reached the end of the list
          </div>
        )}

        {/* No results message */}
        {users.length === 0 && !loading && (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? "No users found matching your search" : "No users available"}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
