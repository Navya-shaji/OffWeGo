import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../store/slice/user/authSlice'
import adminAuthReducer from "../store/slice/Admin/adminAuthSlice"
import vendorAuthReducer from "../store/slice/vendor/authSlice"
import vendorReducer from '../store/slice/vendor/vendorSlice';
import DestinationReducer from "../store/slice/Destination/destinationSlice"
import CategoryReducer from '../store/slice/category/categorySlice'
import BannerReducer from '../store/slice/Banner/BannerSlice'
import otpReducer from "./slice/user/otpSlice"; 
const store=configureStore({
    reducer:{
      
        auth:authReducer,
        adminAuth:adminAuthReducer,
        vendor: vendorReducer,
        vendorAuth: vendorAuthReducer,
        destination:DestinationReducer,
        category:CategoryReducer,
        banner:BannerReducer,
        otp: otpReducer
    }
})

export default store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;