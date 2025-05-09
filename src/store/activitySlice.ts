import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Activity {
  id: string;
  description: string;
  date: string;
  type: 'login' | 'update' | 'comment';
}

interface ActivityState {
  activities: Activity[];
}

const initialState: ActivityState = {
  activities: [],
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivities(state, action: PayloadAction<Activity[]>) {
      state.activities = action.payload;
    },
  },
});

export const { setActivities } = activitySlice.actions;
export default activitySlice.reducer;