import type { User } from "@/interface/userInterface"
import {createSlice} from "@reduxjs/toolkit"


const initialState:{user:User|null}={
    user:null
}

export const userSlice=createSlice({
    name:"userSlice",
    initialState,
    reducers:{
        addUser:(state,action)=>{
            state.user=action.payload
        },
        removeUser:(state,action)=>{
            state.user=action.payload
        }
    }
})


export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
