import { Profile } from "../../dto/user/ProfileDto";

export interface IUserProfileUsecase{
    execute(data:Profile):Promise<Profile|null>
}