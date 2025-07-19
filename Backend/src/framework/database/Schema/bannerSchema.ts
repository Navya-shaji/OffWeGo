import { Schema } from "mongoose";

export const BannerSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    Banner_video_url:{
        type:String,
        required:true
    },
    action:{
        type:Boolean,
        required:true
    }
})