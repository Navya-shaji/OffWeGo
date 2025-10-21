import type { Subscription } from "@/interface/subscription";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";



interface SubscriptionState {
  subscriptions: Subscription[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: SubscriptionState = {
  subscriptions: [],
  status: "idle",
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    
    addSubscriptionStart(state) {
      state.status = "loading";
      state.error = null;
    },
    addSubscriptionSuccess(state, action: PayloadAction<Subscription>) {
      state.status = "succeeded";
      state.subscriptions.push(action.payload);
    },
    addSubscriptionFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },

  
    fetchSubscriptionsStart(state) {
      state.status = "loading";
      state.error = null;
    },
    fetchSubscriptionsSuccess(state, action: PayloadAction<Subscription[]>) {
      state.status = "succeeded";
      state.subscriptions = action.payload;
    },
    fetchSubscriptionsFailure(state, action: PayloadAction<string>) {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  addSubscriptionStart,
  addSubscriptionSuccess,
  addSubscriptionFailure,
  fetchSubscriptionsStart,
  fetchSubscriptionsSuccess,
  fetchSubscriptionsFailure,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
