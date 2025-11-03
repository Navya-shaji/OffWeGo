import { Role } from "../../constants/Roles"

export interface IWallet{
    _id?:string
    owernId:string
    ownerType:Role
    balance:number
    transactions:{
        type:"credit"|"debit"
        amount:number
        description:string
        date:Date
    }[]
}