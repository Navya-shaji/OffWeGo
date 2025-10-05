import { Schema } from "mongoose";

export const flightSchema=new Schema({
    date:{type:Date,
        required:true
    },
    fromLocation:{
        type:String,
        required:true
    },
    toLocation:{
        type:String,
        required:true
    },
    airLine:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
})