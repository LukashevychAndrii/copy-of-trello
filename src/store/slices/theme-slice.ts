import { createSlice } from "@reduxjs/toolkit";

interface initialStateI {
  theme: string;
}
const initialState: initialStateI = {
  theme: "dark",
};

const themeSlice = createSlice({
  name: "theme",
  initialState: initialState,
  reducers: {
    setTheme(state) {
      state.theme = state.theme === "dark" ? "light" : "dark";
      localStorage.setItem("todo-theme", state.theme);
    },
    setThemeInitial(state, action) {
      if (action.payload.theme) {
        state.theme = action.payload.theme;
      } else {
        state.theme = "dark";
      }
    },
  },
});
export const { setTheme, setThemeInitial } = themeSlice.actions;
export default themeSlice.reducer;
