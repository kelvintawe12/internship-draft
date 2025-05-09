import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
  joinedDate: string;
  role: 'user' | 'admin';
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