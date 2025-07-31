import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/interface/categoryInterface";
import { addCategory as addCategories } from "@/services/category/categoryService";

type CategoryState = {
  category: Category[];
  loading: boolean;
  error: string | null;
};

const initialState: CategoryState = {
  category: [],
  loading: false,
  error: null,
};

export const addCategory = createAsyncThunk<
  Category,               
  Category,               
  { rejectValue: string } 
>(
  "category/add",
  async (data, { rejectWithValue }) => {
    try {
      const result = await addCategories(data);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to add category");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.category.push(action.payload);
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default categorySlice.reducer;
