import type React from "react"
import type { Package } from "@/interface/PackageInterface"
import { MapPin, Calendar, Clock, Building, Activity, Star } from "lucide-react"

type PackageTableProps = {
  packages: Package[]
}

const PackagesTable: React.FC<PackageTableProps> = ({ packages }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    })
  }

  if (packages.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border p-16 text-center">
        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No packages available</h3>
        <p className="text-gray-500">Create your first travel package to get started</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Travel Packages
          </h2>
          <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">
            {packages.length} packages
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="p-6 space-y-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Package Info */}
              <div className="lg:col-span-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{pkg.packageName.charAt(0)}</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{pkg.packageName}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{pkg.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {pkg.destinationId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Duration */}
              <div className="lg:col-span-2">
                <div className="text-xl font-bold text-emerald-600 mb-1">
                  {formatCurrency(pkg.price)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1 text-blue-500" />
                  {pkg.duration} days
                </div>
              </div>

              {/* Travel Dates */}
              <div className="lg:col-span-2">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-1 text-green-500" />
                    <span className="text-gray-900 font-medium">{formatDate(pkg.startDate)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Calendar className="w-3 h-3 mr-1 text-red-500" />
                    <span className="text-gray-900 font-medium">{formatDate(pkg.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Hotels */}
              <div className="lg:col-span-2">
                {pkg.hotelDetails && pkg.hotelDetails.length > 0 ? (
                  <div className="space-y-2">
                    {pkg.hotelDetails.slice(0, 2).map((hotel) => (
                      <div key={hotel.hotelId} className="flex items-center gap-2 text-sm">
                        <Building className="w-3 h-3 text-blue-600" />
                        <span className="font-medium text-gray-900 truncate">{hotel.name}</span>
                        {hotel.rating && (
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 ml-0.5">{hotel.rating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {pkg.hotelDetails.length > 2 && (
                      <div className="text-xs text-gray-500">+{pkg.hotelDetails.length - 2} more</div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">No hotels</div>
                )}
              </div>

              {/* Activities */}
              <div className="lg:col-span-2">
                {pkg.activities && pkg.activities.length > 0 ? (
                  <div className="space-y-2">
                    {pkg.activities.slice(0, 2).map((activity) => (
                      <div key={activity.activityId} className="flex items-center gap-2 text-sm">
                        <Activity className="w-3 h-3 text-green-600" />
                        <span className="font-medium text-gray-900 truncate">{activity.title}</span>
                      </div>
                    ))}
                    {pkg.activities.length > 2 && (
                      <div className="text-xs text-gray-500">+{pkg.activities.length - 2} more</div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400">No activities</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-600">
            Showing {packages.length} packages
          </div>
          <div className="flex items-center gap-6 text-gray-600">
            <span>Avg. Price: {formatCurrency(packages.reduce((sum, pkg) => sum + pkg.price, 0) / packages.length)}</span>
            <span>Avg. Duration: {Math.round(packages.reduce((sum, pkg) => sum + pkg.duration, 0) / packages.length)} days</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackagesTable