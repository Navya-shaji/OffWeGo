import { User } from "../../domain/entities/userEntity";

export const mapToGoogleUser = (user: User) => ({
  id: user._id?.toString() ?? "",
  name: user.name,
  email: user.email,
  password: user.password,
  phone: user.phone,
  imageUrl: user.imageUrl,
  role: user.role,
  fcmToken: user.fcmToken,
  isGoogleUser: user.isGoogleUser,
  location: user.location
});
