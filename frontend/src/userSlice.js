import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from './utils/api';

// Async thunk to submit a vote
export const submitVote = createAsyncThunk(
  'user/submitVote',
  async (voteData, thunkAPI) => {
    try {
      const response = await userService.submitVote(voteData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to submit vote'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    voteStatus: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetUserState: (state) => {
      state.voteStatus = null;
      state.error = null;
    },
    resetVoteStatus: (state) => {
      state.voteStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle vote submission
      .addCase(submitVote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitVote.fulfilled, (state, action) => {
        state.loading = false;
        state.voteStatus = action.payload;
      })
      .addCase(submitVote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetUserState, resetVoteStatus } = userSlice.actions;
export default userSlice.reducer; 