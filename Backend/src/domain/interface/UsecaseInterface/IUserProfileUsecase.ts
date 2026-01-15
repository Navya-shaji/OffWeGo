import { ProfileDto } from "../../dto/User/profileDto";

export interface IUserProfileUsecase {
  execute(data: { email: string }): Promise<ProfileDto | null>;
}
