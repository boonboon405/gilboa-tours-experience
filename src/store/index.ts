import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';
import bookingReducer from './slices/bookingSlice';
import tourReducer from './slices/tourSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    booking: bookingReducer,
    tour: tourReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore Date objects in booking.tourDate
        ignoredActions: ['booking/setTourDate'],
        ignoredPaths: ['booking.tourDate'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
