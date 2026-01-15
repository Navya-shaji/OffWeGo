import { ActivityDto } from "../../dto/Package/ActivityDto";


export interface IGetAllActivities {
    execute(page: number, limit: number): Promise<{ activity: ActivityDto[], totalActivities: number }>
}