import { useState, useEffect } from "react";
import { User, Calendar, Users } from "lucide-react";

interface Traveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

interface TravelerFormProps {
  travelerType: "Adult" | "Child";
  count: number;
  onChange: (travelers: Traveler[]) => void;
}

export default function TravelerForm({
  travelerType,
  count,
  onChange,
}: TravelerFormProps) {
  const [travelers, setTravelers] = useState<Traveler[]>(
    Array.from({ length: count }, () => ({ name: "", age: 0, gender: "" as "male" | "female" | "other" }))
  );

  useEffect(() => {
    setTravelers((prev) => {
      const newTravelers = Array.from({ length: count }, (_, i) => 
        prev[i] || { name: "", age: 0, gender: "" as "male" | "female" | "other" }
      );
      return newTravelers;
    });
  }, [count]);

  useEffect(() => {
    onChange(travelers);
  }, [travelers]);

  const handleChange = <K extends keyof Traveler>(
    index: number,
    field: K,
    value: Traveler[K]
  ) => {
    const newTravelers = [...travelers];
    newTravelers[index][field] = value;
    setTravelers(newTravelers);
  };

  const isAdult = travelerType === "Adult";
 
  const bgGradient = isAdult 
    ? "from-purple-50 to-purple-100" 
    : "from-fuchsia-50 to-fuchsia-100";
  const iconBg = isAdult ? "bg-purple-100" : "bg-fuchsia-100";
  const iconColor = isAdult ? "text-purple-600" : "text-fuchsia-600";
  const borderColor = isAdult ? "border-purple-200" : "border-fuchsia-200";
  const focusBorder = isAdult ? "focus:border-purple-500" : "focus:border-fuchsia-500";
  const focusRing = isAdult ? "focus:ring-purple-200" : "focus:ring-fuchsia-200";

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 ${iconBg} rounded-lg`}>
          {isAdult ? (
            <Users className={`w-5 h-5 ${iconColor}`} />
          ) : (
            <User className={`w-5 h-5 ${iconColor}`} />
          )}
        </div>
        <h3 className="text-gray-800 text-lg font-bold">
          {travelerType} Details
          <span className="text-gray-500 text-sm font-normal ml-2">
            ({count} {count === 1 ? 'traveler' : 'travelers'})
          </span>
        </h3>
      </div>
      
      <div className="space-y-4">
        {travelers.map((traveler, idx) => (
          <div
            key={`${travelerType}-${idx}`}
            className={`bg-gradient-to-br ${bgGradient} p-5 rounded-xl border-2 ${borderColor} shadow-sm hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
                <span className={`text-sm font-bold ${iconColor}`}>
                  {idx + 1}
                </span>
              </div>
              <span className="text-gray-700 font-semibold">
                {travelerType} {idx + 1}
              </span>
            </div>

            <div className="space-y-3">
              {/* Name Input */}
              <div className="relative group">
                <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:${iconColor} transition-colors`}>
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={traveler.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm ${focusBorder} focus:ring-2 ${focusRing} focus:outline-none transition-all duration-200 placeholder:text-gray-400`}
                  />
                </div>
              </div>

          
              <div className="grid grid-cols-2 gap-3">
                {/* Age Input */}
                <div className="relative group">
                  <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                    Age
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:${iconColor} transition-colors`}>
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      placeholder="Age"
                      value={traveler.age || ""}
                      onChange={(e) => handleChange(idx, "age", Number(e.target.value))}
                      min="0"
                      max="120"
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm ${focusBorder} focus:ring-2 ${focusRing} focus:outline-none transition-all duration-200 placeholder:text-gray-400`}
                    />
                  </div>
                </div>

                {/* Gender Select */}
                <div className="relative group">
                  <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={traveler.gender}
                      onChange={(e) => handleChange(idx, "gender", e.target.value as "male" | "female" | "other")}
                      className={`w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm ${focusBorder} focus:ring-2 ${focusRing} focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
                        !traveler.gender ? "text-gray-400" : "text-gray-700"
                      }`}
                    >
                      <option value="" disabled>Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}