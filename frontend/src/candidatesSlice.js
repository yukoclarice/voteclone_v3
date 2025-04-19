import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch candidates from the backend
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (_, thunkAPI) => {
    const response = await fetch('http://localhost:4000/api/candidates');
    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }
    return await response.json();
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default candidatesSlice.reducer;
