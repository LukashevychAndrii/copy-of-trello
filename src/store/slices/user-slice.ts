import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import { getDatabase, ref, set, update } from "firebase/database";
import { createAlert } from "./alert-slice";

interface initialStateI {
  email: string | null;
  id: string | null;
  password: string | null;
  uName: string | null;
  uPhoto: string | null;
}
const initialState: initialStateI = {
  email: null,
  id: null,
  password: null,
  uName: null,
  uPhoto: null,
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
      state.uPhoto = action.payload.uPhoto;
      console.log(action.payload);
    },
    removeUser(state) {
      state.email = null;
      state.id = null;
      state.password = null;
      state.uName = null;
      state.uPhoto = null;
    },
    setUserPhoto(state, action) {
      state.uPhoto = action.payload.uPhoto;
    },
    removeUserPhoto(state) {
      state.uPhoto = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(updateUserProfilePhoto.fulfilled, () => {
      console.log("success");
    });
    builder.addCase(updateUserProfilePhoto.rejected, () => {
      console.log("error");
    });
  },
});

export const { setUser, removeUser, removeUserPhoto, setUserPhoto } =
  userSlice.actions;
export default userSlice.reducer;

export const updateUserProfilePhoto = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: string }
>(
  "user/updateUserProfilePhotoupdateUserProfilePhoto",

  async function (_, { rejectWithValue, getState, dispatch }) {
    console.log("update");
    const appDispatch = dispatch as AppDispatch;
    const state = getState() as RootState;
    const db = getDatabase();
    const dbRef = ref(db, `users/${state.user.id}/userdata`);

    update(dbRef, { uPhoto: state.user.uPhoto }).catch((error) => {
      appDispatch(
        createAlert({
          alertTitle: "Error!",
          alertText: "Database error!",
          alertError: true,
        })
      );
    });

    return undefined;
  }
);
