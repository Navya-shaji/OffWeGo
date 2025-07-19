import { getCategory } from "@/services/category/categoryService";
import type { Category } from "@/interface/categoryInterface";
import { useEffect, useState } from "react";

export const CategoryTable = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data: Category[] = await getCategory();
      setCategory(data);
    } catch (error) {
      console.error("failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Category Table</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="p-3 border-b">Image</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Description</th>
              <th className="p-3 border-b">Type</th>
            </tr>
          </thead>
          <tbody>
            {category.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 border-b">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">No image</span>
                  )}
                </td>
                <td className="p-3 border-b">{cat.name}</td>
                <td className="p-3 border-b">{cat.description}</td>
                <td className="p-3 border-b">
                  {cat.type.main}, {cat.type.sub}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
