import type { BannerInterface } from "@/interface/bannerInterface"
import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import { addBanner as addBanners } from "@/services/Banner/bannerService";

type BannerState={
    banner:BannerInterface[];
    loading:boolean;
    error:string|null;
}

const initialState:BannerState={
    banner:[],
    loading:false,
    error:null
}

export const addBanner=createAsyncThunk<
BannerInterface,
BannerInterface,
{rejectValue:string}
>("banner/add",
async (data, { rejectWithValue })=>{
    try {
        const result=await addBanners(data)
        return result
    } catch (error) {
        if(error instanceof Error){
            return rejectWithValue(error.message)
        }
        return rejectWithValue("failed to add banner")
    }
}
)

const bannerSlice=createSlice({
    name:"banner",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(addBanner.pending,(state)=>{
            state.loading=true;
            state.error=null
        })
        .addCase(addBanner.fulfilled,(state,action:PayloadAction<BannerInterface>)=>{
            state.loading=false;
            state.banner.push(action.payload)
        })
        .addCase(addBanner.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload ?? "something went wrong"
        })
    }
})

export default bannerSlice.reducer;