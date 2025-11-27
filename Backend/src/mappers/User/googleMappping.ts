import { User } from "../../domain/entities/userEntity";

export const mapToGoogleUser = (user: User) => ({
  id: user._id,          
  name: user.name,
  email: user.email,
  password: user.password,
  phone: user.phone,
  imageUrl: user.imageUrl,
  role: user.role,
  fcmToken: user.fcmToken
});
