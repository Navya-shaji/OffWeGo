import { UpdateUserResponseDto } from "../../domain/dto/User/UpdateUserResponseDto";
import { User } from "../../domain/entities/UserEntity";

export const mapToUpdate = (user: User): UpdateUserResponseDto => ({
    id: user._id ? user._id.toString() : "",
    email: user.email,
    status: user.status === "block" ? "blocked" : user.status === "active" ? "active" : "active"
})