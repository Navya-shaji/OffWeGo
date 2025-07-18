import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import ProfileSidebar from "@/components/profile/sidebar";

const Profile = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  console.log(user)
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <ProfileSidebar/>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={user?.username || ""}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>

             <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={user?.phone || ""}
              readOnly
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
