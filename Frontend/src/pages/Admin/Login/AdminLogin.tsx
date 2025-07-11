import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAppDispatch } from "@/hooks";
import { loginAdmin } from "@/store/slice/Admin/adminAuthSlice";
import {AdminloginSchema,type AdminLoginFormData,} from "@/Types/Admin/Login/LoginzodSchema";


export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {register,handleSubmit,formState: { errors },} = useForm<AdminLoginFormData>({
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
      <div className="flex flex-col md:flex-row w-full max-w-5xl h-[85vh] shadow-2xl rounded-2xl bg-white overflow-hidden border border-gray-200">
        <div
          className="md:w-1/2 h-64 md:h-full relative bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/Adminlogin.jpeg")' }}
        >
          <div className="absolute inset-0 bg-opacity-40" />
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 py-10"></div>
        </div>

        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center text-black mb-6">
            Admin Login
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-w-sm mx-auto w-full"
          >
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.email ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Password"
                className="input w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password ? (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              ) : (
                <div className="h-[16px]" />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white font-semibold py-2 rounded text-sm hover:bg-black transition duration-200 shadow-md"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
