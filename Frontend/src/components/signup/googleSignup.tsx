import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/axios/instance";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "@/store/slice/user/authSlice";

export function GoogleSignup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
      <div style={{ transform: "scale(1.2)", transformOrigin: "top center" }}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => {
            const token = credentialResponse.credential;
            if (!token) {
              console.error("No token received from Google");
              return;
            }

            try {
              const res = await axiosInstance.post("/google-signup", {
                token,
              });
              const userData = res.data.user;

              if (userData) {
                dispatch(
                  login({
                    user: {
                      username: userData.name,
                      email: userData.email,
                    },
                  })
                );

                localStorage.setItem(
                  "authUser",
                  JSON.stringify({
                    isAuthenticated: true,
                    user: {
                      username: userData.name,
                      email: userData.email,
                      phone: userData.phone,
                      imageUrl: userData.imageUrl,
                    },
                  })
                );

                toast.success("Signup successful!");
                navigate("/home");
              } else {
                toast.error("Signup failed");
              }
            } catch (error) {
              console.error("Google signup error:", error);
              toast.error("Server error during Google signup");
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
