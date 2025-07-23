import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { updateUserProfile } from "@/store/slice/user/authSlice";
import { Dialog } from "@headlessui/react";
import { editProfile } from "@/services/user/Userprofile";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const EditProfileModal = ({ isOpen, onClose }: Props) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || "");

  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const handleSave = async () => {
    try {
      const response = await editProfile(user.id, {
        name,
        phone,
      });

      console.log("Updated user:", response);

      const updatedUser = response.data;

      dispatch(updateUserProfile(updatedUser));
      onClose();
    } catch (err) {
      console.log(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 shadow-xl">
          <Dialog.Title className="text-xl font-bold">
            Edit Profile
          </Dialog.Title>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="email"
            value={email}
            readOnly
            className="w-full border px-4 py-2 rounded-lg bg-gray-100 text-gray-500"
          />

          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            className="w-full border px-4 py-2 rounded-lg"
          />
          <div className="flex justify-end gap-2 pt-4">
            <button
              onClick={onClose}
              className="text-sm px-4 py-2 bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
