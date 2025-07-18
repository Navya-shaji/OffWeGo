import React from "react";
import { Check } from "lucide-react";

interface SubCategoryCheckboxesProps {
  typeMain: string;
  typeSub: string[];
  setTypeSub: React.Dispatch<React.SetStateAction<string[]>>;
}

const subCategories: Record<string, string[]> = {
  Destination: ["resort", "beach", "mountain", "city", "desert"],
  season: ["summer", "winter", "spring", "autumn", "monsoon"],
  Travel: ["solo", "family", "honeymoon", "adventure", "group"],
  Theme: ["budget", "luxury", "wildlife", "spiritual", "cultural"],
};

const SubCategory: React.FC<SubCategoryCheckboxesProps> = ({
  typeMain,
  typeSub,
  setTypeSub,
}) => {
  const handleSubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setTypeSub([...typeSub, value]);
    } else {
      setTypeSub(typeSub.filter((item) => item !== value));
    }
  };

  if (!typeMain || !subCategories[typeMain]) return null;

  return (
    <div className="bg-black text-white p-6 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-6 bg-white rounded-full"></div>
          <label className="text-lg font-semibold text-white">
            Subcategories for {typeMain}
          </label>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subCategories[typeMain].map((sub) => (
            <label
              key={sub}
              className="group relative flex items-center p-3 bg-gray-900 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-800 cursor-pointer transition-all duration-200"
            >
              <input
                type="checkbox"
                value={sub}
                checked={typeSub.includes(sub)}
                onChange={handleSubChange}
                className="sr-only"
              />
              
            
              <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                    typeSub.includes(sub)
                      ? "bg-white border-white"
                      : "bg-transparent border-gray-500 group-hover:border-gray-400"
                  }`}
                >
                  {typeSub.includes(sub) && (
                    <Check className="w-3 h-3 text-black absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
            
              <span
                className={`text-sm font-medium transition-colors duration-200 ${
                  typeSub.includes(sub)
                    ? "text-white"
                    : "text-gray-300 group-hover:text-white"
                }`}
              >
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </span>
              
            
              {typeSub.includes(sub) && (
                <div className="absolute inset-0 rounded-lg ring-2 ring-white ring-opacity-50 pointer-events-none"></div>
              )}
            </label>
          ))}
        </div>
        
   
        <div className="flex items-center justify-between pt-3 border-t border-gray-700">
          <span className="text-sm text-gray-400">
            {typeSub.length} selected
          </span>
          {typeSub.length > 0 && (
            <button
              onClick={() => setTypeSub([])}
              className="text-xs text-gray-400 hover:text-white transition-colors duration-200 underline"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategory;