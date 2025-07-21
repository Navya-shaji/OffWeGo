import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/user/authSlice";
import { registerGoogleUser } from "@/services/user/userService";

export function GoogleSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <div className="w-full flex items-center gap-2">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="text-gray-500 text-sm">or continue with</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <div className="scale-105">
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const token = credentialResponse.credential;
            if (!token) {
              toast.error("No token received from Google");
              return;
            }

            try {
              const res = await registerGoogleUser(token);
              const { user, accessToken } = res.data;

              if (user && accessToken) {
                dispatch(
                  login({
                    user: {
                      id: user.id,
                      username: user.name,
                      email: user.email,
                      phone: user.phone,
                      status: user.status,
                      role: user.role,
                    },
                    token: accessToken,
                  })
                );

                toast.success("Signup successful!");
                navigate("/home");
              } else {
                toast.error("Signup failed");
              }
            } catch (error) {
             console.log(error)
            }
          }}
          onError={() => {
            toast.error("Google login failed");
          }}
        />
      </div>
    </div>
  );
}
