import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as subscriptionService from "@/services/subscription/subscriptionservice";

type Subscription = {
  id?: string;
  name: string;
  commissionRate: number;
  price: number;
  durationInDays: number;
};

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

export const addSubscription = createAsyncThunk<
  Subscription,
  Subscription,
  { rejectValue: string }
>("subscription/addSubscription", async (subscriptionData, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.addSubscription(subscriptionData);
    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred while adding subscription.");
  }
});

export const fetchSubscriptions = createAsyncThunk<
  Subscription[],
  void,
  { rejectValue: string }
>("subscription/fetchSubscriptions", async (_, { rejectWithValue }) => {
  try {
    const response = await subscriptionService.getSubscriptions();
    return response;
  } catch (error: any) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("An unknown error occurred while fetching subscriptions.");
  }
});

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSubscription.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions.push(action.payload);
      })
      .addCase(addSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add subscription";
      })
      .addCase(fetchSubscriptions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch subscriptions";
      });
  },
});

export default subscriptionSlice.reducer;
