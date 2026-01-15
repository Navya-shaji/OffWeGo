import { useState, useEffect } from "react"
import {
  Plus,
  Clock,
  CheckCircle,
  Sparkles,
  X,
  FileText,
  Calendar,
  ChevronDown,
  ChevronRight,
  Trash2,
  Stars,
  AlertCircle,
  Info
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Package } from "@/interface/PackageInterface"

interface ItineraryActivity {
  time: string
  activity: string
}

interface ItineraryDay {
  day: number
  activities: ItineraryActivity[]
  isExpanded?: boolean
}

interface ValidationError {
  field: string
  message: string
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
  isLoading = false
}) => {
  const [localData, setLocalData] = useState<Package | null>(pkg)
  const [enhancedItinerary, setEnhancedItinerary] = useState<ItineraryDay[]>([])
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())

  useEffect(() => {
    setLocalData(pkg)
    if (pkg?.itinerary) {
      const groupedItinerary: { [key: number]: ItineraryActivity[] } = {}
      pkg.itinerary.forEach(item => {
        if (!groupedItinerary[item.day]) {
          groupedItinerary[item.day] = []
        }
        groupedItinerary[item.day].push({ time: item.time, activity: item.activity })
      })

      const enhanced = Object.keys(groupedItinerary).map(day => ({
        day: parseInt(day),
        activities: groupedItinerary[parseInt(day)],
        isExpanded: true
      }))

      setEnhancedItinerary(enhanced)
    }
  }, [pkg])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validateField = (field: string, value: any): string | null => {
    switch (field) {
      case 'packageName':
        if (!value || value.trim().length === 0) {
          return 'Package name is required'
        }
        if (value.trim().length < 3) {
          return 'Package name must be at least 3 characters long'
        }
        if (value.trim().length > 100) {
          return 'Package name cannot exceed 100 characters'
        }
        break

      case 'duration':
        if (!value || value < 1) {
          return 'Duration must be at least 1 day'
        }
        if (value > 30) {
          return 'Duration cannot exceed 30 days'
        }
        break

      case 'description':
        if (!value || value.trim().length === 0) {
          return 'Description is required'
        }
        if (value.trim().length < 10) {
          return 'Description must be at least 10 characters long'
        }
        if (value.trim().length > 2000) {
          return 'Description cannot exceed 2000 characters'
        }
        break

      case 'price':
        if (!value || value < 0) {
          return 'Price must be a positive number'
        }
        if (value > 1000000) {
          return 'Price cannot exceed ₹10,00,000'
        }
        break

      case 'checkInTime':
        if (value && !isValidTime(value)) {
          return 'Please enter a valid time (e.g., 3:00 PM or 15:00)'
        }
        break

      case 'checkOutTime':
        if (value && !isValidTime(value)) {
          return 'Please enter a valid time (e.g., 12:00 PM or 12:00)'
        }
        break

      default:
        return null
    }
    return null
  }

  const isValidTime = (time: string): boolean => {
    const timeRegex = /^([1-9]|1[0-2]):([0-5][0-9])\s?(AM|PM)$/i
    const militaryTimeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
    return timeRegex.test(time.trim()) || militaryTimeRegex.test(time.trim())
  }

  const validateForm = (): boolean => {
    if (!localData) return false;
    const errors: ValidationError[] = []

    const fieldsToValidate = ['packageName', 'duration', 'description', 'price'] as const;
    fieldsToValidate.forEach(field => {
      const error = validateField(field, localData[field as keyof Package]);
      if (error) {
        errors.push({ field, message: error });
      }
    });

    const optionalFields = ['checkInTime', 'checkOutTime'] as const;
    optionalFields.forEach(field => {
      if (localData[field as keyof Package]) {
        const error = validateField(field, localData[field as keyof Package]);
        if (error) {
          errors.push({ field, message: error });
        }
      }
    });

    // Validate itinerary
    if (enhancedItinerary.length === 0) {
      errors.push({ field: 'itinerary', message: 'At least one day of itinerary is required' })
    }

    setValidationErrors(errors)
    return errors.length === 0
  }

  const getFieldError = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field)
    return error ? error.message : null
  }

  if (!localData) return null

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    const updated = {
      ...localData,
      [name]: name === "price" || name === "duration" ? Number(value) : value
    }
    setLocalData(updated)
    onChange(updated)

    // Validate field on change if it's been touched
    if (touchedFields.has(name)) {
      const error = validateField(name, value)
      setValidationErrors(prev =>
        prev.filter(err => err.field !== name).concat(error ? [{ field: name, message: error }] : [])
      )
    }
  }

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set([...prev, field]))
    const error = validateField(field, localData[field as keyof Package])
    setValidationErrors(prev =>
      prev.filter(err => err.field !== field).concat(error ? [{ field, message: error }] : [])
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched
    const allFields = ['packageName', 'duration', 'description', 'price', 'checkInTime', 'checkOutTime']
    setTouchedFields(new Set(allFields))

    if (validateForm()) {
      onSubmit(e)
    }
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

  const addDay = () => {
    const newDay: ItineraryDay = {
      day: enhancedItinerary.length + 1,
      activities: [{ time: "", activity: "" }],
      isExpanded: true
    }
    const updated = [...enhancedItinerary, newDay]
    setEnhancedItinerary(updated)
    updateItineraryInPackage(updated)
  }

  const removeDay = (dayIndex: number) => {
    const updated = enhancedItinerary
      .filter((_, index) => index !== dayIndex)
      .map((day, index) => ({ ...day, day: index + 1 }))
    setEnhancedItinerary(updated)
    updateItineraryInPackage(updated)
  }

  const toggleDayExpansion = (dayIndex: number) => {
    const updated = enhancedItinerary.map((day, index) =>
      index === dayIndex ? { ...day, isExpanded: !day.isExpanded } : day
    )
    setEnhancedItinerary(updated)
  }

  const addActivityToDay = (dayIndex: number) => {
    const updated = enhancedItinerary.map((day, index) =>
      index === dayIndex
        ? { ...day, activities: [...day.activities, { time: "", activity: "" }] }
        : day
    )
    setEnhancedItinerary(updated)
    updateItineraryInPackage(updated)
  }

  const removeActivityFromDay = (dayIndex: number, activityIndex: number) => {
    const updated = enhancedItinerary.map((day, index) =>
      index === dayIndex
        ? { ...day, activities: day.activities.filter((_, aIndex) => aIndex !== activityIndex) }
        : day
    )
    setEnhancedItinerary(updated)
    updateItineraryInPackage(updated)
  }

  const updateActivity = (dayIndex: number, activityIndex: number, field: 'time' | 'activity', value: string) => {
    const updated = enhancedItinerary.map((day, dIndex) =>
      dIndex === dayIndex
        ? {
          ...day,
          activities: day.activities.map((activity, aIndex) =>
            aIndex === activityIndex ? { ...activity, [field]: value } : activity
          )
        }
        : day
    )
    setEnhancedItinerary(updated)
    updateItineraryInPackage(updated)
  }

  const updateItineraryInPackage = (enhanced: ItineraryDay[]) => {
    const flatItinerary = enhanced.flatMap(day =>
      day.activities.map(activity => ({
        day: day.day,
        time: activity.time,
        activity: activity.activity
      }))
    )
    const updated = { ...localData, itinerary: flatItinerary }
    setLocalData(updated)
    onChange(updated)
  }

  const generateBasicItinerary = () => {
    if (!localData.duration) return;
    const basicItinerary: ItineraryDay[] = []

    for (let i = 1; i <= localData.duration; i++) {
      let dayActivities: ItineraryActivity[] = []

      if (i === 1) {
        dayActivities = [
          { time: localData.checkInTime || "3:00 PM", activity: "Check-in at hotel" },
          { time: "4:00 PM", activity: "Welcome drink" },
          { time: "5:00 PM", activity: "Local area exploration" },
          { time: "7:00 PM", activity: "Evening tea & snacks" },
          { time: "8:00 PM", activity: "Dinner" }
        ]
      } else if (i === localData.duration) {
        dayActivities = [
          { time: "6:00 AM", activity: "Early morning activity" },
          { time: "8:00 AM", activity: "Breakfast" },
          { time: "10:00 AM", activity: "Final sightseeing" },
          { time: localData.checkOutTime || "12:00 PM", activity: "Check-out" }
        ]
      } else {
        dayActivities = [
          { time: "6:00 AM", activity: "Morning activity" },
          { time: "8:00 AM", activity: "Breakfast" },
          { time: "10:00 AM", activity: "Sightseeing" },
          { time: "1:00 PM", activity: "Lunch" },
          { time: "3:00 PM", activity: "Afternoon activity" },
          { time: "7:00 PM", activity: "Evening activity" },
          { time: "8:00 PM", activity: "Dinner" }
        ]
      }

      basicItinerary.push({
        day: i,
        activities: dayActivities,
        isExpanded: true
      })
    }

    setEnhancedItinerary(basicItinerary)
    updateItineraryInPackage(basicItinerary)
  }

  const renderList = (key: "inclusions" | "amenities") => {
    const items = localData[key] || []
    const isInclusions = key === "inclusions"

    return (
      <div className="space-y-3">
        {items.map((item: string, idx: number) => (
          <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200">
            <input
              type="text"
              value={item}
              onChange={(e) => handleArrayChange(key, idx, e.target.value)}
              placeholder={isInclusions ? "e.g., Welcome drink, Breakfast" : "e.g., WiFi, Parking"}
              className="flex-1 border-0 focus:outline-none bg-transparent font-medium"
            />
            <button
              onClick={() => removeArrayItem(key, idx)}
              type="button"
              className="p-1 hover:bg-red-50 rounded-full transition-colors duration-200"
            >
              <X className="h-4 w-4 text-red-500" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addArrayItem(key)}
          variant="outline"
          size="sm"
          className="w-full border-dashed border-2 border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {isInclusions ? "Inclusion" : "Amenity"}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-y-auto max-h-[95vh] relative">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Edit Package</h2>
                <p className="text-indigo-100">Enhance your travel experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Validation Errors Summary */}
          {validationErrors.length > 0 && (
            <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h3>
                  <ul className="space-y-1 text-sm text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{error.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
            <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-t-lg">
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-slate-600 text-white rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <span>Basic Information</span>
                <div className="ml-auto">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Info className="h-4 w-4" />
                    <span>* Required fields</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Package Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="packageName"
                    value={localData.packageName}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('packageName')}
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium ${getFieldError('packageName')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    placeholder="Enter package name"
                  />
                  {getFieldError('packageName') && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('packageName')}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Duration (Days) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={localData.duration}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('duration')}
                    min="1"
                    max="30"
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium ${getFieldError('duration')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    placeholder="Number of days"
                  />
                  {getFieldError('duration') && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('duration')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={localData.description}
                  onChange={handleInputChange}
                  onBlur={() => handleFieldBlur('description')}
                  rows={4}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 resize-none font-medium ${getFieldError('description')
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-slate-200 focus:border-indigo-500'
                    }`}
                  placeholder="Describe your amazing package..."
                />
                {getFieldError('description') && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('description')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Base Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={localData.price}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('price')}
                    min="0"
                    max="1000000"
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium ${getFieldError('price')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-indigo-500'
                      }`}
                    placeholder="Enter base price"
                  />
                  {getFieldError('price') && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('price')}
                    </p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                    Check-In Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="checkInTime"
                      value={localData.checkInTime || ""}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('checkInTime')}
                      placeholder="e.g., 3:00 PM"
                      className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium pr-12 ${getFieldError('checkInTime')
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 focus:border-indigo-500'
                        }`}
                    />
                    <Clock className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                  </div>
                  {getFieldError('checkInTime') && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {getFieldError('checkInTime')}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Check-Out Time
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="checkOutTime"
                    value={localData.checkOutTime || ""}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('checkOutTime')}
                    placeholder="e.g., 12:00 PM"
                    className={`w-full p-4 border-2 rounded-xl focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 font-medium pr-12 ${getFieldError('checkOutTime')
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-indigo-500'
                      }`}
                  />
                  <Clock className="absolute right-4 top-4 h-5 w-5 text-slate-400" />
                </div>
                {getFieldError('checkOutTime') && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {getFieldError('checkOutTime')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Itinerary Section */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-purple-50">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-t-lg">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span>Detailed Itinerary</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={generateBasicItinerary}
                    variant="outline"
                    size="sm"
                    className="bg-white/80 hover:bg-white transition-all duration-200"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Auto-Generate
                  </Button>
                  <Button
                    type="button"
                    onClick={addDay}
                    variant="outline"
                    size="sm"
                    className="bg-white/80 hover:bg-white transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Day
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {validationErrors.some(err => err.field === 'itinerary') && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {validationErrors.find(err => err.field === 'itinerary')?.message}
                  </p>
                </div>
              )}

              <div className="space-y-4">
                {enhancedItinerary.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No itinerary added yet</p>
                    <p>Click "Add Day" or "Auto-Generate" to start building your itinerary</p>
                  </div>
                ) : (
                  enhancedItinerary.map((day: ItineraryDay, dayIndex: number) => (
                    <Card key={dayIndex} className="border-2 border-purple-200 shadow-md">
                      <CardHeader
                        className="bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer"
                        onClick={() => toggleDayExpansion(dayIndex)}
                      >
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-600 text-white rounded-lg">
                              {day.isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                            <span className="text-lg font-bold">Day {day.day}</span>
                            <span className="text-sm text-purple-600">
                              ({day.activities.length} activities)
                            </span>
                          </div>
                          <Button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeDay(dayIndex)
                            }}
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>

                      {day.isExpanded && (
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {day.activities.map((activity: ItineraryActivity, activityIndex: number) => {
                              const timeError = validationErrors.find(err =>
                                err.field === `itinerary.${dayIndex}.${activityIndex}.time`
                              )
                              const activityError = validationErrors.find(err =>
                                err.field === `itinerary.${dayIndex}.${activityIndex}.activity`
                              )

                              return (
                                <div key={activityIndex} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                                  <input
                                    type="text"
                                    placeholder="Time"
                                    value={activity.time}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, 'time', e.target.value)}
                                    className={`w-28 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${timeError ? 'border-red-500' : 'border-gray-300'
                                      }`}
                                  />
                                  <input
                                    type="text"
                                    placeholder="Activity"
                                    value={activity.activity}
                                    onChange={(e) => updateActivity(dayIndex, activityIndex, 'activity', e.target.value)}
                                    className={`flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 ${activityError ? 'border-red-500' : 'border-gray-300'
                                      }`}
                                  />
                                  <Button
                                    type="button"
                                    onClick={() => removeActivityFromDay(dayIndex, activityIndex)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )
                            })}

                            {(() => {
                              const timeError = validationErrors.find(err =>
                                err.field === `itinerary.${dayIndex}.${day.activities.length - 1}.time`
                              )
                              const activityError = validationErrors.find(err =>
                                err.field === `itinerary.${dayIndex}.${day.activities.length - 1}.activity`
                              )

                              return (timeError || activityError) ? (
                                <div className="p-2 bg-red-50 border border-red-200 rounded">
                                  <p className="text-xs text-red-600">
                                    {timeError?.message || activityError?.message}
                                  </p>
                                </div>
                              ) : null
                            })()}

                            <Button
                              type="button"
                              onClick={() => addActivityToDay(dayIndex)}
                              variant="outline"
                              size="sm"
                              className="w-full border-dashed border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Activity to Day {day.day}
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inclusions & Amenities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-green-600 text-white rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span>Inclusions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderList("inclusions")}
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50">
              <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 text-white rounded-lg">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span>Amenities</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderList("amenities")}
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-slate-600 border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span>Save Changes</span>
                    <Stars className="h-4 w-4 ml-2 animate-pulse" />
                  </>
                )}
              </div>
            </Button>
          </div>
        </form>
      </div>
    </div>)
}
export default EditPackage