import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
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
      const index = state.notifications.findIndex((n) => n.id === action.payload.id);
      if (index !== -1) {
        state.notifications[index].read = action.payload.read;
      }
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { setNotifications, updateNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;