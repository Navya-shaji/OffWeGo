import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { DestinationInterface } from "@/interface/destinationInterface"; 
import {
  addDestination as addDestinationService,
  fetchAllDestinations as fetchAllDestinationsService,
} from "@/services/Destination/destinationService";

type DestinationState = {
  destinations: DestinationInterface[];
  loading: boolean;
  error: string | null;
};

const initialState: DestinationState = {
  destinations: [],
  loading: false,
  error: null,
};


export const addDestination = createAsyncThunk<
  DestinationInterface,
  DestinationInterface,
  { rejectValue: string }
>("destination/add", async (data, { rejectWithValue }) => {
  try {
    return await addDestinationService(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to add destination");
  }
});


export const fetchDestinations = createAsyncThunk<
  DestinationInterface[],
  void,
  { rejectValue: string }
>("destination/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await fetchAllDestinationsService();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Failed to fetch destinations");
  }
});

export const destinationSlice = createSlice({
  name: "destination",
  initialState,
  reducers: {
    resetDestinations: (state) => {
      state.destinations = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(addDestination.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addDestination.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations.push(action.payload);
      })
      .addCase(addDestination.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error during add";
      })

      .addCase(fetchDestinations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload;
      })
      .addCase(fetchDestinations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Unknown error during fetch";
      });
  },
});

export const { resetDestinations } = destinationSlice.actions;
export default destinationSlice.reducer;
