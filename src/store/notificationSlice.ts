// src/store/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    updateNotification(state, action: PayloadAction<{ id: string; read: boolean }>) {
      const { id, read } = action.payload;
      const notification = state.notifications.find((n) => n.id === id);
      if (notification) {
        notification.read = read;
      }
    },
  },
});

export const { setNotifications, updateNotification } = notificationSlice.actions;
export default notificationSlice.reducer;