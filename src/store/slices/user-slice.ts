import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import { get, getDatabase, ref, set, update } from "firebase/database";
import { createAlert } from "./alert-slice";
import { clearPending, setPending } from "./pending-slice";

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
  },
});

export const {
  setUser,
  removeUser,
  removeUserPhoto,
  setUserPhoto,
  setBoardImg,
} = userSlice.actions;

export default userSlice.reducer;

interface guestBoardDATA {
  boardID: string;
  inviterID: string;
  inviterName: string;
}

export const updateUserProfilePhoto = createAsyncThunk<
  undefined,
  undefined,
  { rejectValue: string }
>(
  "user/updateUserProfilePhoto",

  async function (_, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());

    const state = getState() as RootState;
    const db = getDatabase();
    const dbRef = ref(db, `users/${state.user.id}/userdata`);

    update(dbRef, { uPhoto: state.user.uPhoto })
      .catch((error) => {
        appDispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Database error!",
            alertError: true,
          })
        );
      })
      .then(() => {
        appDispatch(clearPending());
      })
      .then(() => {
        const dbRef = ref(db, `users/${state.user.id}/sharedBoards`);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const dbRef = ref(
              db,
              `users/${state.user.id}/sharedBoards/ownerDATA/ownerPHOTO`
            );
            set(dbRef, state.user.uPhoto);
          }
        });
      })
      .then(() => {
        const dbRef = ref(db, `users/${state.user.id}/guestsBoards`);
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const values: guestBoardDATA[] = Object.values(snapshot.val());
            const keys: string[] = Object.keys(snapshot.val());
            keys.map((el, index) => {
              const dbRef = ref(
                db,
                `users/${values[index].inviterID}/sharedBoards/${el}/GUESTS/${state.user.id}/guestPhoto`
              );
              const userPHOTO = state.user.uPhoto ? state.user.uPhoto : "";
              set(dbRef, userPHOTO);
              return null;
            });
          }
        });
      })
      .catch(() => {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Updating user photo failed",
            alertError: true,
          })
        );
      });

    return undefined;
  }
);
