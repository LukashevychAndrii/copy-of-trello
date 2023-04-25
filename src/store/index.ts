import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user-slice";
import alertSlice from "./slices/alert-slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    alert: alertSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
