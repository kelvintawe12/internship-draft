// src/store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  username: string;
  fullName: string;
  avatar: string;
  bio: string;
  joinedDate: string;
}

interface UserState {
  profile: UserProfile | null;
}

const initialState: UserState = {
  profile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;