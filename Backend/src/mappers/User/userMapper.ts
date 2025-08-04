import { User } from "../../domain/entities/userEntity";


export const mapToUser = (user: User) => ({
  name: user.name,
  email: user.email,
  password: user.password,
  phone: user.phone,
  profileImage: user.imageUrl,
  role: user.role,
});