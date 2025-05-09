import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice';
import notificationReducer from './notificationSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    order: orderReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
