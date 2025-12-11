import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/user/authSlice";
import { setToken } from "@/store/slice/Token/tokenSlice";
import { registerGoogleUser } from "@/services/user/userService";

export function GoogleSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center mt-6 space-y-4">
      <div className="w-full flex items-center gap-2">
        <hr className="flex-grow border-t" />
        <span className="text-gray-500 text-sm">or continue with</span>
        <hr className="flex-grow border-t" />
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
              console.log("Google signup response:", res);
              
              if (!res || !res.data) {
                toast.error("Invalid response from server");
                return;
              }
              
              const { user, accessToken } = res.data;
              console.log("Google signup response data:", res.data);
              console.log("User:", user);
              console.log("AccessToken:", accessToken);
              
              if (user && accessToken) {
                // Store token in token slice for axios interceptor
                dispatch(setToken(accessToken));
                
                // Store user data in auth slice
                dispatch(
                  login({
                    user: {
                      id: user.id || user._id || "",
                      username: user.name || user.username || "",
                      email: user.email || "",
                      phone: user.phone || "",
                      status: user.status || "active",
                      role: user.role || "user",
                      isGoogleUser: user.isGoogleUser !== undefined ? user.isGoogleUser : true,
                      location: user.location,
                      imageUrl: user.imageUrl
                    },
                    token: accessToken,
                    refreshToken: "",
                  })
                );

                toast.success("Signup successful!");
                navigate("/");
              } else {
                toast.error("Signup failed");
              }
            } catch (error: any) {
              console.error("Google signup error:", error);
              const errorMessage = error?.message || error?.response?.data?.message || "Google signup failed. Please try again.";
              toast.error(errorMessage);
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
