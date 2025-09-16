import { useState, useEffect } from "react"
import { Plus, Clock, CheckCircle, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Package {
  _id: string
  packageName: string
  description: string
  price: number
  duration: number
  checkInTime?: string
  checkOutTime?: string
  images?: string[]
  hotels?: Array<{ name: string }>
  activities?: Array<{ title: string }>
  itinerary?: Array<{ day: number; time: string; activity: string }>
  inclusions?: string[]
  amenities?: string[]
}

interface EditPackageProps {
  pkg: Package | null
  onClose: () => void
  onChange: (pkg: Package) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading?: boolean
}

const EditPackage: React.FC<EditPackageProps> = ({
  pkg,
  onClose,
  onChange,
  onSubmit,
  isLoading = false,
}) => {
  const [localData, setLocalData] = useState<Package | null>(pkg)

  useEffect(() => {
    setLocalData(pkg)
  }, [pkg])

  if (!localData) return null

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    const updated = { ...localData, [name]: name === "price" || name === "duration" ? Number(value) : value }
    setLocalData(updated)
    onChange(updated)
  }

  const handleArrayChange = (key: "inclusions" | "amenities", index: number, value: string) => {
    const updatedArray = [...(localData[key] || [])]
    updatedArray[index] = value
    const updated = { ...localData, [key]: updatedArray }
    setLocalData(updated)
    onChange(updated)
  }

  const addArrayItem = (key: "inclusions" | "amenities") => {
    const updatedArray = [...(localData[key] || []), ""]
    const updated = { ...localData, [key]: updatedArray }
    setLocalData(updated)
    onChange(updated)
  }

  const removeArrayItem = (key: "inclusions" | "amenities", index: number) => {
    const updatedArray = [...(localData[key] || [])]
    updatedArray.splice(index, 1)
    const updated = { ...localData, [key]: updatedArray }
    setLocalData(updated)
    onChange(updated)
  }

  const renderList = (key: "inclusions" | "amenities") => {
    return (
      <div className="space-y-2">
        {(localData[key] || []).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(key, idx, e.target.value)}
              className="flex-1 border border-slate-300 rounded px-2 py-1"
            />
            <button onClick={() => removeArrayItem(key, idx)} type="button">
              <X className="h-4 w-4 text-red-600" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addArrayItem(key)}
          size="sm"
          className="flex items-center gap-2 mt-2"
        >
          <Plus className="h-4 w-4" /> Add {key === "inclusions" ? "Inclusion" : "Amenity"}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[90vh] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Edit Package</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-slate-700" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="space-y-2">
            <label className="font-medium">Package Name</label>
            <input
              type="text"
              name="packageName"
              value={localData.packageName}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded px-2 py-1"
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium">Description</label>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleInputChange}
              className="w-full border border-slate-300 rounded px-2 py-1"
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="font-medium">Price</label>
              <input
                type="number"
                name="price"
                value={localData.price}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded px-2 py-1"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="font-medium">Duration (Days)</label>
              <input
                type="number"
                name="duration"
                value={localData.duration}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Check-in/Check-out */}
          <div className="flex gap-4">
            <div className="space-y-2 flex-1">
              <label className="font-medium">Check-In Time</label>
              <input
                type="time"
                name="checkInTime"
                value={localData.checkInTime || ""}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded px-2 py-1"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="font-medium">Check-Out Time</label>
              <input
                type="time"
                name="checkOutTime"
                value={localData.checkOutTime || ""}
                onChange={handleInputChange}
                className="w-full border border-slate-300 rounded px-2 py-1"
              />
            </div>
          </div>

          {/* Inclusions & Amenities */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-medium mb-2 block">Inclusions</label>
              {renderList("inclusions")}
            </div>
            <div>
              <label className="font-medium mb-2 block">Amenities</label>
              {renderList("amenities")}
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button type="button" onClick={onClose} variant="outline" className="mr-3">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditPackage
