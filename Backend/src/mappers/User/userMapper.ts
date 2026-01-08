import { User } from "../../domain/entities/UserEntity";


export const mapToUser = (user: User) => ({
  _id: user._id,
  id: user._id?.toString(),
  name: user.name,
  email: user.email,
  password: user.password,
  phone: user.phone,
  imageUrl: user.imageUrl,
  role: user.role,
  status: user.status,
  fcmToken: user.fcmToken,
  isGoogleUser: user.isGoogleUser,
  location: user.location,
});