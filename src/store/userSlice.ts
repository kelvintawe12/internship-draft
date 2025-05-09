import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  language: string;
  timezone: string;
  theme: 'light' | 'dark';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  twoFactorEnabled: boolean;
}

interface UserState {
  settings: UserSettings | null;
}

const initialState: UserState = {
  settings: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setSettings(state, action: PayloadAction<UserSettings>) {
      state.settings = action.payload;
    },
    clearSettings(state) {
      state.settings = null;
    },
  },
});

export const { setSettings, clearSettings } = userSlice.actions;
export default userSlice.reducer;
