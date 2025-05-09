import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import orderReducer from './orderSlice';
import securityReducer from './securitySlice';
import billingReducer from './billingSlice';
import activityReducer from './activitySlice';
import supportReducer from './supportSlice';
import messageReducer from './messageSlice';
import errorReducer from './errorSlice';
import dashboardReducer from './dashboardSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    order: orderReducer,
    security: securityReducer,
    billing: billingReducer,
    activity: activityReducer,
    support: supportReducer,
    message: messageReducer,
    error: errorReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;