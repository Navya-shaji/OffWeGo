import React from "react";

interface MainCategorySelectProps {
  typeMain: string;
  setTypeMain: (value: string) => void;
}

const MainCategorySelect: React.FC<MainCategorySelectProps> = ({
  typeMain,
  setTypeMain,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        Main Category
      </label>
      <select
        value={typeMain}
        onChange={(e) => setTypeMain(e.target.value)}
        className="w-full px-3 py-2 text-sm border-2 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition border-gray-200"
      >
        <option value="">Select Main Category</option>
        <option value="Destination">Destination Type</option>
        <option value="Season">Seasonal Categories</option>
        <option value="Travel">Travel Type</option>
        <option value="Theme">Theme Based</option>
      </select>
    </div>
  );
};

export default MainCategorySelect;
