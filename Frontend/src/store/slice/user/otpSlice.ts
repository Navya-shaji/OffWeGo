import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


type OtpUserData = {
  email?: string;
  name?: string;
  id?: string;
  
};

type OtpState = {
  message: string;
  userData: OtpUserData | null;
  isOpen: boolean;
};

const initialState: OtpState = {
  message: "",
  userData: null,
  isOpen: false,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setOtpData: (
      state,
      action: PayloadAction<{ message: string; userData: OtpUserData }>
    ) => {
      state.message = action.payload.message;
      state.userData = action.payload.userData;
      state.isOpen = true;
    },
    clearOtpData: (state) => {
      state.message = "";
      state.userData = null;
      state.isOpen = false;
    },
    closeOtpModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { setOtpData, clearOtpData, closeOtpModal } = otpSlice.actions;
export default otpSlice.reducer;
