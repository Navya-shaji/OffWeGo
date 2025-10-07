import { useState, useEffect } from "react";

interface Traveler {
  name: string;
  age: number;
  gender: string;
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
    Array.from({ length: count }, () => ({ name: "", age: 0, gender: "" }))
  );

  useEffect(() => {
   
    setTravelers((prev) => {
      const newTravelers = Array.from({ length: count }, (_, i) => prev[i] || { name: "", age: 0, gender: "" });
      return newTravelers;
    });
  }, [count]);

  useEffect(() => {
    onChange(travelers);
  }, [travelers]);

  const handleChange = (index: number, field: keyof Traveler, value: string | number) => {
    const newTravelers = [...travelers];
    newTravelers[index][field] = value;
    setTravelers(newTravelers);
  };

  return (
    <div className="mb-5">
      <h3 className="text-gray-700 font-semibold mb-3">{travelerType} Details</h3>
      {travelers.map((traveler, idx) => (
        <div
          key={`${travelerType}-${idx}`}
          className="bg-gray-100 p-4 rounded-lg mb-3 flex flex-col gap-2"
        >
          <input
            type="text"
            placeholder="Name"
            value={traveler.name}
            onChange={(e) => handleChange(idx, "name", e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Age"
            value={traveler.age}
            onChange={(e) => handleChange(idx, "age", Number(e.target.value))}
            className="px-3 py-2 border rounded"
          />
          <select
            value={traveler.gender}
            onChange={(e) => handleChange(idx, "gender", e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      ))}
    </div>
  );
}
