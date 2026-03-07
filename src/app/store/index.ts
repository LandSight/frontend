import { configureStore } from '@reduxjs/toolkit';

import polygonReducer from './slices/polygon';

export const store = configureStore({
  reducer: {
    polygon: polygonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
