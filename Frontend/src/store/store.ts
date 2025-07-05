import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "../store/slice/user/userSlice"
import authReducer from '../store/slice/user/authSlice'
import adminAuthReducer from "../store/slice/Admin/adminAuthSlice"

const store=configureStore({
    reducer:{
        // user:userReducer,
        auth:authReducer,
        adminAuth:adminAuthReducer
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;