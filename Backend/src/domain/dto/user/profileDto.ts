import { Role } from "../../constants/Roles";

export interface ProfileDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  password:string;
  imageUrl?: string;
  role: Role;
  status?: string;
}
