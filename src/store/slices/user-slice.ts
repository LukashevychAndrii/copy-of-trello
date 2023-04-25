import { createSlice } from "@reduxjs/toolkit";

interface initialStateI {
  email: string | null;
  id: string | null;
  password: string | null;
  uName: string | null;
}
const initialState: initialStateI = {
  email: null,
  id: null,
  password: null,
  uName: null,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.password = action.payload.password;
      state.uName = action.payload.uName;
    },
    removeUser(state) {
      state.email = null;
      state.id = null;
      state.password = null;
      state.uName = null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
