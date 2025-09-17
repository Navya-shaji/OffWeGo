import { User } from "../../domain/entities/UserEntity";


export const mapToUser = (user: User) => ({
  name: user.name,
  email: user.email,
  password: user.password,
  phone: user.phone,
  imageUrl: user.imageUrl,
  role: user.role,
});