import { Role } from "../../constants/Roles"

export interface WalletDto{
    _id?:string
    ownerId:string
    ownerType:Role
    balance:number
    transactions:{
        type:"credit"|"debit"
        amount:number
        description:string
        date:Date
    }[]
}