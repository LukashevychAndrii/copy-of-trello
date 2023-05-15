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
      state.theme = action.payload.theme;
    },
  },
});
export const { setTheme, setThemeInitial } = themeSlice.actions;
export default themeSlice.reducer;
