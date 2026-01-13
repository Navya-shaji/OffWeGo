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
  showErrors?: boolean;
}

export default function TravelerForm({
  travelerType,
  count,
  onChange,
  onValidationChange,
  showErrors = false,
}: TravelerFormProps) {
  const [travelers, setTravelers] = useState<Traveler[]>(
    Array.from({ length: count }, () => ({ name: "", age: 0, gender: "" as "male" | "female" | "other" }))
  );

  const [errors, setErrors] = useState<Record<number, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const handleBlur = (index: number, field: string) => {
    setTouched(prev => ({ ...prev, [`${index}-${field}`]: true }));
  };

  const isAdult = travelerType === "Adult";

  // Teal (Adult) & Rose (Child) Theme
  const bgGradient = isAdult
    ? "from-teal-50 to-teal-100/50"
    : "from-rose-50 to-rose-100/50";
  const iconBg = isAdult ? "bg-teal-100" : "bg-rose-100";
  const iconColor = isAdult ? "text-teal-600" : "text-rose-600";
  const borderColor = isAdult ? "border-teal-100" : "border-rose-100";
  const focusBorder = isAdult ? "focus:border-teal-500" : "focus:border-rose-500";
  const focusRing = isAdult ? "focus:ring-teal-100" : "focus:ring-rose-100";
  const labelColor = "text-slate-500";

  // Error styling
  const errorBorder = "border-red-300";
  const errorFocusBorder = "focus:border-red-500";
  const errorFocusRing = "focus:ring-red-100";


  const getFieldError = (index: number, fieldName: string): string | undefined => {
    // Show error if global 'showErrors' is true OR specific field was touched
    const isTouched = touched[`${index}-${fieldName}`];
    if (!showErrors && !isTouched) return undefined;

    const travelerErrors = errors[index];
    if (!travelerErrors) return undefined;

    return travelerErrors.find(error =>
      error.toLowerCase().includes(fieldName.toLowerCase()) ||
      (fieldName === "age" && error.toLowerCase().includes("age")) ||
      (fieldName === "name" && error.toLowerCase().includes("name")) ||
      (fieldName === "gender" && error.toLowerCase().includes("gender"))
    );
  };

  const hasAnyError = (index: number) => {
    if (!showErrors) return false; // Optional: Only show global card error badge on submit
    return errors[index] && errors[index].length > 0;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2.5 ${iconBg} rounded-xl`}>
          {isAdult ? (
            <Users className={`w-5 h-5 ${iconColor}`} />
          ) : (
            <User className={`w-5 h-5 ${iconColor}`} />
          )}
        </div>
        <div>
          <h3 className="text-gray-900 text-lg font-bold">
            {travelerType} Details
            <span className="text-slate-400 text-sm font-medium ml-2">
              ({count} {count === 1 ? 'traveler' : 'travelers'})
            </span>
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">
            {isAdult ? "Ages 12+" : "Ages 1-11"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {travelers.map((traveler, idx) => {
          const nameError = getFieldError(idx, "name");
          const ageError = getFieldError(idx, "age");
          const genderError = getFieldError(idx, "gender");
          const hasCardError = hasAnyError(idx);

          return (
            <div
              key={`${travelerType}-${idx}`}
              className={`bg-gradient-to-br ${bgGradient} p-6 rounded-2xl border ${hasCardError ? errorBorder : borderColor
                } shadow-sm transition-all duration-300`}
            >
              <div className="flex items-center gap-3 mb-6 border-b border-black/5 pb-4">
                <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${iconColor}`}>
                    {idx + 1}
                  </span>
                </div>
                <span className="text-gray-900 font-bold">
                  {travelerType} {idx + 1}
                </span>
                {hasCardError && (
                  <div className="ml-auto flex items-center gap-1 text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                    <AlertCircle className="w-3 h-3" />
                    <span>Incomplete</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Name Field - Full Width */}
                <div className="md:col-span-2 relative group">
                  <label className={`block ${labelColor} text-xs font-bold mb-2 uppercase tracking-wide`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name as on ID"
                    value={traveler.name}
                    onChange={(e) => handleChange(idx, "name", e.target.value)}
                    onBlur={() => handleBlur(idx, "name")}
                    className={`w-full px-4 py-3 bg-white border ${nameError ? errorBorder : "border-slate-200"
                      } rounded-xl text-sm font-medium ${nameError ? errorFocusBorder : focusBorder
                      } focus:ring-4 ${nameError ? errorFocusRing : focusRing
                      } focus:outline-none transition-all placeholder:text-slate-300 text-gray-900`}
                  />
                  {nameError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {nameError}
                    </p>
                  )}
                </div>

                {/* Age Field */}
                <div className="relative group">
                  <label className={`block ${labelColor} text-xs font-bold mb-2 uppercase tracking-wide`}>
                    Age
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Age"
                      value={traveler.age || ""}
                      onChange={(e) => handleChange(idx, "age", Number(e.target.value))}
                      onBlur={() => handleBlur(idx, "age")}
                      min="1"
                      max="90"
                      className={`w-full px-4 py-3 bg-white border ${ageError ? errorBorder : "border-slate-200"
                        } rounded-xl text-sm font-medium ${ageError ? errorFocusBorder : focusBorder
                        } focus:ring-4 ${ageError ? errorFocusRing : focusRing
                        } focus:outline-none transition-all placeholder:text-slate-300 text-gray-900`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  {ageError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {ageError}
                    </p>
                  )}
                </div>

                {/* Gender Field */}
                <div className="relative group">
                  <label className={`block ${labelColor} text-xs font-bold mb-2 uppercase tracking-wide`}>
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={traveler.gender}
                      onChange={(e) => handleChange(idx, "gender", e.target.value as "male" | "female" | "other")}
                      onBlur={() => handleBlur(idx, "gender")}
                      className={`w-full px-4 py-3 bg-white border ${genderError ? errorBorder : "border-slate-200"
                        } rounded-xl text-sm font-medium ${genderError ? errorFocusBorder : focusBorder
                        } focus:ring-4 ${genderError ? errorFocusRing : focusRing
                        } focus:outline-none transition-all appearance-none cursor-pointer ${!traveler.gender ? "text-slate-300" : "text-gray-900"
                        }`}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                      <ChevronDownIcon />
                    </div>
                  </div>
                  {genderError && (
                    <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {genderError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);