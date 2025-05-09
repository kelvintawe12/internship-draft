import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ErrorLog {
  id: string;
  message: string;
  stack: string;
  componentStack: string;
  userId?: string;
  role?: string;
  timestamp: string;
}

interface ErrorState {
  errors: ErrorLog[];
}

const initialState: ErrorState = {
  errors: [],
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<ErrorLog>) {
      state.errors.push(action.payload);
    },
  },
});

export const { setError } = errorSlice.actions;
export default errorSlice.reducer;