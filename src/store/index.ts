import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './orderSlice';
import notificationReducer from './notificationSlice';
import userReducer from './userSlice';
import securityReducer from './securitySlice';
import billingReducer from './billingSlice';
import activityReducer from './activitySlice';
import supportReducer from './supportSlice';
import messageReducer from './messageSlice'; // Added missing import

export const store = configureStore({
  reducer: {
    order: orderReducer,
    notification: notificationReducer,
    user: userReducer,
    security: securityReducer,
    billing: billingReducer,
    activity: activityReducer,
    support: supportReducer,
    message: messageReducer, // Added missing reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
