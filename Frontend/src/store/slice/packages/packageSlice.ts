import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Package } from "@/interface/PackageInterface";
import {
  addPackage as addPackageService,
  fetchAllPackages as fetchAllPackagesService,
} from "@/services/packages/packageService";
import { getPackagesByDestination } from "@/services/packages/packageService";

type PackageState = {
  packages: Package[];
  loading: boolean;
  error: string | null;
};

const initialState: PackageState = {
  packages: [],
  loading: false,
  error: null,
};

export const addPackage = createAsyncThunk<
  Package,
  Package,
  { rejectValue: string }
>("package/add", async (data, { rejectWithValue }) => {
  try {
    const response = await addPackageService(data);
    console.log("thunk", response.packages[0]);
    return response.packages[0];
  } catch (error) {
    console.log("er");
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue("Unknown error while adding package");
  }
});

export const fetchPackages = createAsyncThunk<
  Package[],
  void,
  { rejectValue: string }
>("package/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await fetchAllPackagesService();

    return response.packages ?? [];
  } catch (error) {
    if (error instanceof Error) return rejectWithValue(error.message);
    return rejectWithValue("Unknown error while fetching packages");
  }
});
export const fetchPackagesByDestination = createAsyncThunk<
  Package[],
  { destinationId: string },
  { rejectValue: string }
>(
  "package/fetchByDestination",
  async ({ destinationId }, { rejectWithValue }) => {
    try {
      const response = await getPackagesByDestination(destinationId);
      return response.packages || response;
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue(
        "Unknown error while fetching packages by destination"
      );
    }
  }
);

export const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {
    resetPackages: (state) => {
      state.packages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages.push(action.payload);
      })
      .addCase(addPackage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add package";
      })

      // FETCH PACKAGES
      .addCase(fetchPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch packages";
      })
      .addCase(fetchPackagesByDestination.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      });
  },
});

export const { resetPackages } = packageSlice.actions;
export default packageSlice.reducer;
