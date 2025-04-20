import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { candidateService } from './utils/api';

// Async thunk to fetch candidates from the backend
export const fetchCandidates = createAsyncThunk(
  'candidates/fetchCandidates',
  async (filters = {}, thunkAPI) => {
    try {
      const response = await candidateService.getAllCandidates(filters);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch candidates'
      );
    }
  }
);

// Async thunk to fetch a single candidate by ID
export const fetchCandidateById = createAsyncThunk(
  'candidates/fetchCandidateById',
  async (id, thunkAPI) => {
    try {
      const response = await candidateService.getCandidateById(id);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch candidate'
      );
    }
  }
);

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState: {
    items: [],
    selectedCandidate: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCandidates
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
        state.error = action.payload || action.error.message;
      })
      
      // Handle fetchCandidateById
      .addCase(fetchCandidateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidateById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCandidate = action.payload;
      })
      .addCase(fetchCandidateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSelectedCandidate } = candidatesSlice.actions;
export default candidatesSlice.reducer;
