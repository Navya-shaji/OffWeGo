export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  fcmToken: string; 
  user: {
    id: string;
    email: string;
    username: string;
    role: "user" | "vendor" | "admin";
    status: string;
    imageUrl: string;
  };
}
