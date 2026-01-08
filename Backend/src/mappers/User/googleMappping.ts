import { User } from "../../domain/entities/UserEntity";

export const mapToGoogleUser = (user: User) => ({
  id: user._id?.toString() ?? "",
  name: user.name || "",
  email: user.email || "",
  password: user.password,
  phone: user.phone,
  imageUrl: user.imageUrl || "",
  role: user.role || "user",
  status: user.status || "active",
  fcmToken: user.fcmToken || "",
  isGoogleUser: user.isGoogleUser || false,
  location: user.location
});
