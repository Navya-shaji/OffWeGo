import { useEffect, useState } from "react";
import { getCategory } from "@/services/category/categoryService";
import type { CategoryType } from "@/interface/categoryInterface";
import ReusableTable from "@/components/Modular/Table";

import Pagination from "@/components/pagination/pagination";

export const CategoryTable = () => {
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const fetchCategories = async () => {
    const response = await getCategory(page, 5);
    setCategory(response.categories);
    const total = Number(response?.totalCategories || 0);
    settotalPages(Math.ceil(total / 5));
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  interface Column {
    accessorKey?: string;
    header: string;
    cell: (info: any) => React.ReactNode;
  }

  const columns: Column[] = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: (info: { getValue: () => string }) => (
        <img
          src={info.getValue() as string}
          alt="category"
          className="h-10 w-16 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (info: { getValue: () => string }) => info.getValue(),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info: { getValue: () => string }) => info.getValue(),
    },

    {
      accessorKey: "type.main",
      header: "Type",
      cell: (info: { row: { original: CategoryType } }) =>
        info.row.original.type?.main || "Nothing",
    },
    {
      accessorKey: "type.sub",
      header: "Sub Types",
      cell: (info: { row: { original: CategoryType } }) => {
        const sub = info.row.original.type?.sub;
        return Array.isArray(sub)
          ? sub.join(", ")
          : typeof sub === "string"
          ? sub
          : "";
      },
    },
    
  ];
  

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Category Listing</h2>
      <ReusableTable data={category} columns={columns} />

      <Pagination total={totalPages} current={page} setPage={setPage} />
    </div>
  );
};
