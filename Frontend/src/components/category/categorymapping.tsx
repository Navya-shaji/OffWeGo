
import React from "react";

interface MainCategorySelectProps {
  typeMain: string;
  setTypeMain: (value: string) => void;
}

const MainCategorySelect: React.FC<MainCategorySelectProps> = ({ typeMain, setTypeMain }) => {
  return (
    <select
      value={typeMain}
      onChange={(e) => setTypeMain(e.target.value)}
      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white"
    >
      <option value="">Select Main Category</option>
      <option value="Destination">Destination type</option>
      <option value="season">Seasonal Categories</option>
      <option value="Travel">Travel type</option>
      <option value="Theme">Theme Based</option>
    </select>
  );
};

export default MainCategorySelect;
