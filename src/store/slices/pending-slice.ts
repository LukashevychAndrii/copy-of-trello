import { createSlice } from "@reduxjs/toolkit";
interface initialStateI {
  pending: boolean;
}
const initialState: initialStateI = {
  pending: false,
};

const pendingSlice = createSlice({
  name: "pendingSlice",
  initialState,
  reducers: {
    setPending(state) {
      state.pending = true;
    },
    clearPending(state) {
      state.pending = false;
    },
  },
});

export const { setPending, clearPending } = pendingSlice.actions;
export default pendingSlice.reducer;
