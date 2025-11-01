
import { User } from "../../domain/entities/userEntity";
import { mapNumericRoleToString } from "./mapping";

export const mapToLoginUserDto = (user: User) => {
  const role = typeof user.role === "number" ? mapNumericRoleToString(user.role) : user.role;

  return {
    id: user._id?.toString() ?? "",
    email: user.email,
    username: user.name,
    status: user.status ?? "active",
    role,
    phone: user.phone.toString(),
    imageUrl: user.imageUrl ?? "",
  };
};
