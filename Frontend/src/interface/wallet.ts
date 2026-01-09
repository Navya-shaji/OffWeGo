/* eslint-disable @typescript-eslint/no-explicit-any */


export interface IWallet{
    _id?:string
    ownerId:string
    ownerType:"user"|"admin"|"vendor"
    balance:number
    transactions:{
        [x: string]: any
        refId: any
        type:"credit"|"debit"
        amount:number
        description:string
        date:Date
    }[]
}