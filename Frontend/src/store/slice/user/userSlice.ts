import {createSlice} from "@reduxjs/toolkit"

interface User{
     name:string,
    email:string,
    phone:number,
    _id:string,
    profileImage?:string,
    role:"user"|"admin",
    is_blocked:boolean
    googleVerified: boolean
}

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
