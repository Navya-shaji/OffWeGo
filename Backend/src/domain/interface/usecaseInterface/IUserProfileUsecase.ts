import { Profile } from "../../dto/user/profileDto";

export interface IUserProfileUsecase{
    execute(data:Profile):Promise<Profile|null>
}