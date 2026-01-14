export interface RegisterDTO {
  name: string;
  email: string;
  phone: number;
  password: string;
  imageUrl?: string;
 role: "user" | "admin";
}
