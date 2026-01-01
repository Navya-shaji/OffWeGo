import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-toastify";
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
  const [, setSearchQuery] = useState("");
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
    },
    [originalUsers, totalUsers]
  );

  /* ---------------- Page Change ---------------- */
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === page) return;

      setPage(newPage);

      if (!isSearchMode) {
        fetchUsers(newPage);
      }
    },
    [page, isSearchMode, fetchUsers]
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
      
      // Show success toast with blur background
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
    } catch (error) {
      // Show error toast with blur background
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
      const prevOriginal = [...originalUsers];

      const updateUser = (list: User[]) =>
        list.map((u) => (u._id === userId ? { ...u, status: newStatus } : u));

      setUsers(updateUser);
      if (!isSearchMode) setOriginalUsers(updateUser);

      try {
        await updateUserStatus(userId, newStatus);
      } catch (err) {
        setUsers(prevUsers);
        setOriginalUsers(prevOriginal);
        setError("Failed to update status");
        setTimeout(() => setError(""), 3000);
        // Re-throw the error so it can be caught by the calling function
        throw err;
      }
    },
    [users, originalUsers, isSearchMode]
  );


  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchUsers(1);
    }

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);


  const getCurrentPageData = () => {
    if (!isSearchMode) return users;
    const start = (page - 1) * 10;
    return users.slice(start, start + 10);
  };


  const columns: ColumnDef<User>[] = [
    {
      header: "#",  
      cell: ({ row }) => (page - 1) * 10 + row.index + 1,
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

  if (loading) {
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
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
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
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmStatusChange}
                className={`px-4 py-2 text-white rounded ${
                  selectedUser.status === "active"
                    ? "bg-red-600"
                    : "bg-green-600"
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
              : `${totalUsers} total users`}
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
      <div className="bg-white rounded-lg shadow">
        <ReusableTable
          data={getCurrentPageData()}
          columns={columns}
          loading={loading}
        />
      </div>

      {/* ---------------- Pagination ---------------- */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            current={page}
            setPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default UserList;
