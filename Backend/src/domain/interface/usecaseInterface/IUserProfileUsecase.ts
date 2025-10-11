import { ProfileDto } from "../../dto/User/ProfileDto";

export interface IUserProfileUsecase {
  execute(data: { email: string }): Promise<ProfileDto | null>;
}
