import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import { getDatabase, ref, update } from "firebase/database";
import { createAlert } from "./alert-slice";
import { app } from "../../firebase";

interface initialStateI {
  email: string | null;
  id: string | null;
  password: string | null;
  uName: string | null;
  uPhoto: string | null;
  boardImg: string | null;
}
const initialState: initialStateI = {
  email: null,
  id: null,
  password: null,
  uName: null,
  uPhoto: null,
  boardImg: null,
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
      state.boardImg = action.payload.boardImg;
    },
    removeUser(state) {
      state.email = null;
      state.id = null;
      state.password = null;
      state.uName = null;
      state.uPhoto = null;
      state.boardImg = null;
    },
    setUserPhoto(state, action) {
      state.uPhoto = action.payload.uPhoto;
    },
    removeUserPhoto(state) {
      state.uPhoto = null;
    },
    setBoardImg(state, action) {
      state.boardImg = action.payload.boardImg;
    },
    removeBoardImg(state) {
      state.boardImg = null;
    },
  },
});

export const {
  setUser,
  removeUser,
  removeUserPhoto,
  setUserPhoto,
  setBoardImg,
  removeBoardImg,
} = userSlice.actions;

export default userSlice.reducer;

export const updateUserProfilePhoto = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: string }
>(
  "user/updateUserProfilePhoto",

  async function (_, { getState, dispatch }) {
    console.log("update");
    const appDispatch = dispatch as AppDispatch;
    const state = getState() as RootState;
    const db = getDatabase();
    console.log(state.user.uPhoto);
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

export const updateBoardImg = createAsyncThunk<undefined, undefined, {}>(
  "user/updateBoardImg",
  async function (_, { getState, dispatch }) {
    console.log("qwe");
    const appDispatch = dispatch as AppDispatch;
    const state = getState() as RootState;
    const db = getDatabase(app);
    console.log(state.user.boardImg);
    const dbRef = ref(db, `users/${state.user.id}/userdata`);
    update(dbRef, { boardImg: state.user.boardImg }).catch((error) => {
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
