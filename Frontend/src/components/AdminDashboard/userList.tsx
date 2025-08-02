import React, { useEffect, useState } from "react";
import { getAllUsers, updateUserStatus } from "@/services/admin/adminUserService";
import type { User } from "@/interface/userInterface";
import ReusableTable from "../Modular/Table";
import {type ColumnDef } from "@tanstack/react-table";

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

  const filteredUsers = users.filter((user) => user.role === "user");

  const columns: ColumnDef<User>[] = [
    {
      header: "#",
      cell: ({ row }) => (page - 1) * 10 + row.index + 1,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      cell: ({ row }) => row.original.phone || "N/A",
    },
    {
      header: "Status",
      cell: ({ row }) =>
        row.original.status === "blocked" ? (
          <span className="text-red-500 font-semibold">Blocked</span>
        ) : (
          <span className="text-green-600 font-semibold">Active</span>
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
              handleActionChange(
                row.original._id,
                row.original.status === "active" ? "blocked" : "active"
              )
            }
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all duration-300" />
          <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300" />
        </label>
      ),
    },
  ];

  if (loading) return <p className="p-4 text-gray-600 italic">Loading users...</p>;
  if (error) return <p className="p-4 text-red-600 font-medium">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Users</h2>
      <ReusableTable data={filteredUsers} columns={columns} />

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
