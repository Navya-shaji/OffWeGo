import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/slice/user/authSlice";
import adminAuthReducer from "../store/slice/Admin/adminAuthSlice";
import vendorAuthReducer from "../store/slice/vendor/authSlice";
import vendorReducer from "../store/slice/vendor/vendorSlice";
import DestinationReducer from "../store/slice/Destination/destinationSlice";
import CategoryReducer from "../store/slice/category/categorySlice";
import BannerReducer from "../store/slice/Banner/BannerSlice";
import otpReducer from "./slice/user/otpSlice";
import packageReducer from "./slice/packages/packageSlice";
import tokenSlice from "./slice/Token/tokenSlice"
import subscriptionreducer from "./slice/Subscription/subscription";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  auth: authReducer,
  adminAuth: adminAuthReducer,
  vendor: vendorReducer,
  vendorAuth: vendorAuthReducer,
  destination: DestinationReducer,
  category: CategoryReducer,
  banner: BannerReducer,
  otp: otpReducer,
  package: packageReducer,
  subscription: subscriptionreducer,
  token:tokenSlice
});


const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "adminAuth", "vendorAuth"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/FLUSH",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
