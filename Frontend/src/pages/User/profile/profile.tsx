
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {  X } from "lucide-react";
import ProfileSidebar from "@/components/profile/sidebar";


const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">OffeGo</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:w-80">
            <ProfileSidebar />
          </div>

         
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">My Account</h2>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-8">
              
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {user?.username || "Navya CS"}
                    </h3>
                    <p className="text-gray-600">
                      {user?.email || "navyacsharij@gmail.com"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={user?.username || "Navya CS"}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || "navyacsharij@gmail.com"}
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile number
                      </label>
                      <input
                        type="tel"
                        value="8590834303"
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value="India"
                        readOnly
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
