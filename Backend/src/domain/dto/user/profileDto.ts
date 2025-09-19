export interface ProfileDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  password:string;
  imageUrl?: string;
  role: "user" | "vendor" | "admin";
  status?: string;
}
