
export interface UserDto {
  id?: string;           
  name: string;
  email: string;
  phone: number;
  role: "user" | "admin";
  status?: "active" | "block";
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  lastLogin?: Date;
  isAdmin?: boolean;
}
