import type React from "react"
import type { Package } from "@/interface/PackageInterface"
import { MapPin, Clock, Building, Activity, Star } from "lucide-react"

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
   
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Travel Packages
          </h2>
          <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">{packages.length} packages</span>
        </div>
      </div>

   
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package Details
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hotels</th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activities
              </th>
             
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {packages.map((pkg, index) => (
              <tr
                key={pkg.id}
                className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
              >
               
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xs">{pkg.packageName.charAt(0)}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{pkg.packageName}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{pkg.description}</p>
                    </div>
                  </div>
                </td>

               
                <td className="px-6 py-4">
                  <div className="text-lg font-bold text-emerald-600">{formatCurrency(pkg.price)}</div>
                </td>

               
                <td className="px-6 py-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-blue-500" />
                    <span className="font-medium">{pkg.duration} days</span>
                  </div>
                </td>

                
                <td className="px-6 py-4">
                  {pkg.hotelDetails && pkg.hotelDetails.length > 0 ? (
                    <div className="space-y-1">
                      {pkg.hotelDetails.slice(0, 2).map((hotel) => (
                        <div key={hotel.hotelId} className="flex items-center gap-2 text-sm">
                          <Building className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate max-w-32">{hotel.name}</span>
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
                    <div className="text-sm text-gray-400 italic">No hotels</div>
                  )}
                </td>

               
                <td className="px-6 py-4">
                  {pkg.activities && pkg.activities.length > 0 ? (
                    <div className="space-y-1">
                      {pkg.activities.slice(0, 2).map((activity) => (
                        <div key={activity.activityId} className="flex items-center gap-2 text-sm">
                          <Activity className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span className="font-medium text-gray-900 truncate max-w-32">{activity.title}</span>
                        </div>
                      ))}
                      {pkg.activities.length > 2 && (
                        <div className="text-xs text-gray-500">+{pkg.activities.length - 2} more</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400 italic">No activities</div>
                  )}
                </td>

               
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
      
    </div>
  )
}

export default PackagesTable
