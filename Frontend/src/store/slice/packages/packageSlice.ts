import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Package } from "@/interface/PackageInterface";
import {
  addPackage as addPackageService,
  fetchAllPackages as fetchAllPackagesService,
} from "@/services/packages/packageService";
import { getPackagesByDestination } from "@/services/Destination/destinationService";

// 1. Define state structure
type PackageState = {
  packages: Package[];
  loading: boolean;
  error: string | null;
};

// 2. Initial state
const initialState: PackageState = {
  packages: [],
  loading: false,
  error: null,
};

// 3. Async thunk for adding a package
export const addPackage = createAsyncThunk<
  Package, // Return type
  Package, // Input parameter type
  { rejectValue: string } // Error type
>("package/add", async (data, { rejectWithValue }) => {
  try {
    const response = await addPackageService(data);
    return response.result;
  } catch (error) {
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
  {
    packages: Package[];
    totalPackages: number;
    totalPages: number;
    currentPage: number;
  }, 
  { destinationId: string; page?: number; limit?: number },
  { rejectValue: string }
>(
  "package/fetchByDestination",
  async ({ destinationId, page = 1, limit = 5 }, { rejectWithValue }) => {
    try {
      // getPackagesByDestination already returns:
      // { packages: Package[], totalPackages: number, totalPages: number, currentPage: number }
      const response = await getPackagesByDestination(destinationId, page, limit);
      return response; // ✅ return the full object, not just response.packages
    } catch (error) {
      if (error instanceof Error) return rejectWithValue(error.message);
      return rejectWithValue("Unknown error while fetching packages by destination");
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
      // ADD PACKAGE
      .addCase(addPackage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        state.loading = false;
        state.packages.push(action.payload); // ✅ adds new package
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
  state.packages = action.payload.packages; // ✅ use .packages from the full object
});

  },
});

// 6. Export actions and reducer
export const { resetPackages } = packageSlice.actions;
export default packageSlice.reducer;
