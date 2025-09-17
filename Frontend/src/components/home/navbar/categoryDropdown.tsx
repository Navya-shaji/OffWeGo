import React, { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  main: string;
  sub: string[];
}

interface Props {
  onSelectCategory: (categoryId: string) => void;
}

const CategoryDropdown: React.FC<Props> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/categories`);
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <select
      className="px-3 py-2 border rounded-md shadow-sm"
      onChange={(e) => onSelectCategory(e.target.value)}
    >
      <option value="">-- Select Category --</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
