import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Preferences {
  theme: 'light' | 'dark';
  widgetOrder: string[];
}

interface DashboardState {
  preferences: Preferences;
}

const initialState: DashboardState = {
  preferences: {
    theme: 'light',
    widgetOrder: ['stats', 'activity', 'performance'],
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPreferences(state, action: PayloadAction<Preferences>) {
      state.preferences = action.payload;
    },
  },
});

export const { setPreferences } = dashboardSlice.actions;
export default dashboardSlice.reducer;