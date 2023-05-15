import { createSlice } from "@reduxjs/toolkit";
interface initialStateI {
  alertTitle: string | null;
  alertText: string | null;
  alertError: boolean | null;
}
const initialState: initialStateI = {
  alertTitle: null,
  alertText: null,
  alertError: null,
};

const alertSlice = createSlice({
  name: "alertSlice",
  initialState,
  reducers: {
    createAlert(state, action) {
      state.alertTitle = action.payload.alertTitle;
      state.alertText = action.payload.alertText;
      state.alertError = action.payload.alertError;
    },
    clearAlert(state) {
      state.alertTitle = null;
      state.alertText = null;
      state.alertError = null;
    },
  },
});

export const { createAlert, clearAlert } = alertSlice.actions;
export default alertSlice.reducer;
