import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/slice/user/authSlice'
import adminAuthReducer from "../store/slice/Admin/adminAuthSlice"

import vendorReducer from '../store/slice/vendor/vendorSlice';
const store=configureStore({
    reducer:{
      
        auth:authReducer,
        adminAuth:adminAuthReducer,
        vendor: vendorReducer
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;