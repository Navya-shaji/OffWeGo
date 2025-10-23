import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Subscription } from "@/interface/subscription";

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
   
    addSubscriptionStart: (state) => {
      state.status = "loading";
    },
    addSubscriptionSuccess: (state, action: PayloadAction<Subscription>) => {
      state.status = "succeeded";
      state.subscriptions.push(action.payload);
    },
    addSubscriptionFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },

    getSubscriptionsStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    getSubscriptionsSuccess: (state, action: PayloadAction<Subscription[]>) => {
      state.status = "succeeded";
      state.subscriptions = action.payload;
    },
    getSubscriptionsFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },

   
    updateSubscriptionStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    updateSubscriptionSuccess: (state, action: PayloadAction<Subscription>) => {
      state.status = "succeeded";
      const index = state.subscriptions.findIndex(
        (sub) => sub._id === action.payload._id
      );
      if (index !== -1) {
        state.subscriptions[index] = action.payload;
      }
    },
    updateSubscriptionFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },

    
    deleteSubscriptionStart: (state) => {
      state.status = "loading";
      state.error = null;
    },
    deleteSubscriptionSuccess: (state, action: PayloadAction<string>) => {
      state.status = "succeeded";
      state.subscriptions = state.subscriptions.filter(
        (sub) => sub._id !== action.payload
      );
    },
    deleteSubscriptionFailure: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export const {
  addSubscriptionStart,
  addSubscriptionSuccess,
  addSubscriptionFailure,
  getSubscriptionsStart,
  getSubscriptionsSuccess,
  getSubscriptionsFailure,
  updateSubscriptionStart,
  updateSubscriptionSuccess,
  updateSubscriptionFailure,
  deleteSubscriptionStart,
  deleteSubscriptionSuccess,
  deleteSubscriptionFailure,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;