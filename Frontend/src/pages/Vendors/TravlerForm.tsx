import { useState, useEffect } from "react";
import { User, Calendar, Users, AlertCircle } from "lucide-react";

interface Traveler {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
}

interface TravelerFormProps {
  travelerType: "Adult" | "Child";
  count: number;
  onChange: (travelers: Traveler[]) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export default function TravelerForm({
  travelerType,
  count,
  onChange,
  onValidationChange,
}: TravelerFormProps) {
  const [travelers, setTravelers] = useState<Traveler[]>(
    Array.from({ length: count }, () => ({ name: "", age: 0, gender: "" as "male" | "female" | "other" }))
  );

  const [errors, setErrors] = useState<Record<number, string[]>>({});


  const validateAge = (age: number): string | null => {
    if (travelerType === "Child") {
      if (age >= 12) return "Child age must be less than 12 years";
      if (age < 1) return "Age must be at least 1 year";
    } else {
      if (age < 12) return "Adult age must be 12 years or older";
      if (age > 90) return "Age must be 90 or less";
    }
    return null;
  };


  const validateTraveler = (traveler: Traveler): string[] => {
    const errors: string[] = [];


    if (!traveler.name.trim()) {
      errors.push("Full name is required");
    } else if (traveler.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }


    if (!traveler.age || traveler.age === 0) {
      errors.push("Age is required");
    } else {
      const ageError = validateAge(traveler.age);
      if (ageError) errors.push(ageError);
    }


    if (!traveler.gender) {
      errors.push("Please select a gender");
    }

    return errors;
  };


  const validateAllTravelers = (travelersToValidate: Traveler[]) => {
    const newErrors: Record<number, string[]> = {};
    let allValid = true;

    travelersToValidate.forEach((traveler, index) => {
      const travelerErrors = validateTraveler(traveler);
      if (travelerErrors.length > 0) {
        newErrors[index] = travelerErrors;
        allValid = false;
      }
    });

    setErrors(newErrors);
    onValidationChange?.(allValid);
    return allValid;
  };

  useEffect(() => {
    setTravelers((prev) => {
      const newTravelers = Array.from({ length: count }, (_, i) => 
        prev[i] || { name: "", age: 0, gender: "" as "male" | "female" | "other" } 
      );
      validateAllTravelers(newTravelers);
      return newTravelers;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    onChange(travelers);
    validateAllTravelers(travelers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Error styling
  const errorBorder = "border-red-300";
  const errorFocusBorder = "focus:border-red-500";
  const errorFocusRing = "focus:ring-red-200";
  const errorIconColor = "text-red-500";

  const getFieldError = (index: number, fieldName: string): string | undefined => {
    const travelerErrors = errors[index];
    if (!travelerErrors) return undefined;

    return travelerErrors.find(error => 
      error.toLowerCase().includes(fieldName.toLowerCase()) ||
      (fieldName === "age" && error.toLowerCase().includes("age")) ||
      (fieldName === "name" && error.toLowerCase().includes("name")) ||
      (fieldName === "gender" && error.toLowerCase().includes("gender"))
    );
  };

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
        <div>
          <h3 className="text-gray-800 text-lg font-bold">
            {travelerType} Details
            <span className="text-gray-500 text-sm font-normal ml-2">
              ({count} {count === 1 ? 'traveler' : 'travelers'})
            </span>
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isAdult ? "Ages 12 and above" : "Ages 1-11 years"}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        {travelers.map((traveler, idx) => {
          const hasErrors = errors[idx] && errors[idx].length > 0;
          const nameError = getFieldError(idx, "name");
          const ageError = getFieldError(idx, "age");
          const genderError = getFieldError(idx, "gender");

          return (
            <div
              key={`${travelerType}-${idx}`}
              className={`bg-gradient-to-br ${bgGradient} p-5 rounded-xl border-2 ${
                hasErrors ? errorBorder : borderColor
              } shadow-sm hover:shadow-md transition-all duration-300`}
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
                {hasErrors && (
                  <div className="ml-auto flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors[idx].length} error(s)</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {/* Name Field */}
                <div className="relative group">
                  <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                      nameError ? errorIconColor : `text-gray-400 group-focus-within:${iconColor}`
                    } transition-colors`}>
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      value={traveler.name}
                      onChange={(e) => handleChange(idx, "name", e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 bg-white border-2 ${
                        nameError ? errorBorder : "border-gray-200"
                      } rounded-lg text-sm ${
                        nameError ? errorFocusBorder : focusBorder
                      } focus:ring-2 ${
                        nameError ? errorFocusRing : focusRing
                      } focus:outline-none transition-all duration-200 placeholder:text-gray-400`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Age and Gender Fields */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Age Field */}
                  <div className="relative group">
                    <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                      Age
                    </label>
                    <div className="relative">
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                        ageError ? errorIconColor : `text-gray-400 group-focus-within:${iconColor}`
                      } transition-colors`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <input
                        type="number"
                        placeholder="Age"
                        value={traveler.age || ""}
                        onChange={(e) => handleChange(idx, "age", Number(e.target.value))}
                        min="1"
                        max="90"
                        className={`w-full pl-10 pr-4 py-2.5 bg-white border-2 ${
                          ageError ? errorBorder : "border-gray-200"
                        } rounded-lg text-sm ${
                          ageError ? errorFocusBorder : focusBorder
                        } focus:ring-2 ${
                          ageError ? errorFocusRing : focusRing
                        } focus:outline-none transition-all duration-200 placeholder:text-gray-400`}
                      />
                    </div>
                    {ageError && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {ageError}
                      </p>
                    )}
                  </div>

                  {/* Gender Field */}
                  <div className="relative group">
                    <label className="block text-gray-600 text-xs font-semibold mb-1.5 uppercase tracking-wide">
                      Gender
                    </label>
                    <div className="relative">
                      <select
                        value={traveler.gender}
                        onChange={(e) => handleChange(idx, "gender", e.target.value as "male" | "female" | "other")}
                        className={`w-full px-4 py-2.5 bg-white border-2 ${
                          genderError ? errorBorder : "border-gray-200"
                        } rounded-lg text-sm ${
                          genderError ? errorFocusBorder : focusBorder
                        } focus:ring-2 ${
                          genderError ? errorFocusRing : focusRing
                        } focus:outline-none transition-all duration-200 appearance-none cursor-pointer ${
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
                    {genderError && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {genderError}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}