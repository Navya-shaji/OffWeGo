import { ObjectId } from "mongoose"

export interface User{
    _id?:ObjectId,
    name:string,
    email:string,
    phone:number,
    password:string,
    role:'user'|'vendor' | 'admin',
    status?:'active'|'block',
    profileImage?:string
    createdAt?:Date,
    updatedAt?:Date,
    lastLogin?:Date,
    isAdmin?:boolean
    
}