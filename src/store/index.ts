import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/user-slice";
import alertSlice from "./slices/alert-slice";
import themeSlice from "./slices/theme-slice";
import boardsSlice from "./slices/boards-slice";
import inviteSlice from "./slices/invite-slice";
import pendingSlice from "./slices/pending-slice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    alert: alertSlice,
    theme: themeSlice,
    boards: boardsSlice,
    invite: inviteSlice,
    pending: pendingSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
