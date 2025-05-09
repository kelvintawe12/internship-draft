import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
}

interface Session {
  id: string;
  device: string;
  ip: string;
  lastActive: string;
  active: boolean;
}

interface SecurityState {
  twoFactorEnabled: boolean;
  loginAlertsEnabled: boolean;
  sessions: Session[];
}

const initialState: SecurityState = {
  twoFactorEnabled: false,
  loginAlertsEnabled: false,
  sessions: [],
};

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    setSecuritySettings(state, action: PayloadAction<SecuritySettings>) {
      state.twoFactorEnabled = action.payload.twoFactorEnabled;
      state.loginAlertsEnabled = action.payload.loginAlertsEnabled;
    },
    updateSession(state, action: PayloadAction<{ id: string; active: boolean }>) {
      const index = state.sessions.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.sessions[index].active = action.payload.active;
      }
    },
  },
});

export const { setSecuritySettings, updateSession } = securitySlice.actions;
export default securitySlice.reducer;