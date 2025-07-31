import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "@/services/admin/adminUserService";
import type { User } from "@/interface/userInterface";

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchUsers = async (currentPage: number) => {
    try {
      setLoading(true);
      const res = await getAllUsers(currentPage, 10);
      setUsers(res.users);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleActionChange = async (userId: string, newStatus: "active" | "blocked") => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  if (loading) return <p className="p-4 text-gray-600 italic">Loading users...</p>;
  if (error) return <p className="p-4 text-red-600 font-medium">{error}</p>;

  const filteredUsers = users.filter((user) => user.role === "user");

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2"></th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={user._id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{(page - 1) * 10 + idx + 1}</td>
                <td className="border px-4 py-2">{user.name}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phone || "N/A"}</td>
                <td className="border px-4 py-2">
                  {user.status === "blocked" ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Active</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.status === "active"}
                      onChange={() =>
                        handleActionChange(
                          user._id,
                          user.status === "active" ? "blocked" : "active"
                        )
                      }
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all duration-300" />
                    <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
