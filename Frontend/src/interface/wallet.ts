

export interface IWallet{
    _id?:string
    ownerId:string
    ownerType:"user"|"admin"|"vendor"
    balance:number
    transactions:{
        type:"credit"|"debit"
        amount:number
        description:string
        date:Date
    }[]
}