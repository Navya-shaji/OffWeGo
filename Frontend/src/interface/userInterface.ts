export interface User{
     name:string,
    email:string,
    phone:number,
    _id:string,
    profileImage?:string,
    role:"user"|"admin",
    is_blocked:boolean
    googleVerified: boolean
}
