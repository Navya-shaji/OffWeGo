export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    status: string;
    role: "user" | "vendor" | "admin";
    phone: string;
    imageUrl: string;
  };
}
