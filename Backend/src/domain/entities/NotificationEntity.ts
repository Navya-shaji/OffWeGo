import { ObjectId } from "mongoose";
import { Role } from "../constants/Roles";

export interface INotification {
    _id?: string;
    from: ObjectId | string ;             
    to: ObjectId | string;              
    message: string;           
    read: boolean;           
    senderModel:Role
    receiverModel:Role
    type: 'warning' | 'info' | 'success' | 'error'
}