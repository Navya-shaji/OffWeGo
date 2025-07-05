import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/hooks";
import { loginAdmin } from "@/store/slice/Admin/adminAuthSlice";

import { AdminloginSchema, type AdminLoginFormData } from "@/Types/Admin/Login/LoginzodSchema";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(AdminloginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    try {
      await dispatch(loginAdmin(data)).unwrap();
      toast.success("Admin login successful");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Invalid email or password");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-white to-sky-100 p-6">
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        {/* Left Banner */}
        <div
          className="md:w-1/2 h-64 md:h-auto relative bg-cover bg-center"
          style={{ backgroundImage: "url('/images/admin-login.jpg')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 py-10">
            <h1 className="text-4xl font-extrabold italic text-white mb-3">
              Admin Portal
            </h1>
            <p className="text-white text-sm max-w-xs">
              Manage your dashboard and stay updated
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">
            Admin Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            <input
              {...register("email")}
              placeholder="Email"
              className="input"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="input pr-10"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-2 rounded text-sm hover:bg-blue-800 transition duration-200 shadow-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
