import { ProfileDto } from "../../dto/user/ProfileDto";

export interface IUserProfileUsecase {
  execute(data: { email: string }): Promise<ProfileDto | null>;
}
