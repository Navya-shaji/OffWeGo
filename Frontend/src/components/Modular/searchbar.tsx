import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

export function SearchBar({
  placeholder = "Search...",
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query);
    }, 400);
    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative flex items-center">
        <Search
          className={`
            absolute left-0 w-5 h-5 transition-all duration-300
            ${
              isFocused || query
                ? "text-gray-600 opacity-100"
                : "text-gray-400 opacity-60"
            }
          `}
        />

        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full pl-8 pr-8 py-2 bg-transparent outline-none border-none
            text-gray-800 placeholder-gray-400
            text-lg font-normal
            transition-all duration-300
          "
          style={{
            borderBottom:
              isFocused || query
                ? "2px solid rgba(156, 163, 175, 0.5)"
                : "2px solid transparent",
          }}
        />

        {query && (
          <button
            onClick={clearSearch}
            className="
              absolute right-0 p-1
              text-gray-400 hover:text-gray-600
              transition-all duration-200
              opacity-60 hover:opacity-100
            "
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function SearchBarDemo() {
  const [searchResults, setSearchResults] = useState<string>("");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setSearchResults(`Searching for: "${query}"`);
    } else {
      setSearchResults("");
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto pt-20">
        <SearchBar placeholder="Search anything..." onSearch={handleSearch} />

        {searchResults && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-700 font-medium">{searchResults}</p>
          </div>
        )}
      </div>
    </div>
  );
}
