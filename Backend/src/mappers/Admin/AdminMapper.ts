import { AdminResponseDto } from "../../domain/dto/User/AdminResponseDto";
import { User } from "../../domain/entities/UserEntity";

export const mapToAdmin  = (
  adminEntity: User,
  accessToken: string,
  refreshToken: string
): AdminResponseDto => ({
  accessToken,
  refreshToken,
  admin: {
    id: adminEntity._id?.toString() ?? "",
    email: adminEntity.email,
    role: adminEntity.role,
  },
});
