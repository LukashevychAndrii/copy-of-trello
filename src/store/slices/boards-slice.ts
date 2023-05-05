import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  set,
  update,
} from "firebase/database";
import { app } from "../../firebase";
import { AppDispatch, RootState } from "..";
import { dataI } from "../../components/Board/Board";

interface initialStateI {
  boards: {
    [key: string]: {
      boardName: string;
      boardImg: string;
      todos?: [];
    };
  };
  currentBoardID: string;
}
const initialState: initialStateI = {
  boards: {},
  currentBoardID: "",
};

const boardsSlice = createSlice({
  name: "boards",
  initialState: initialState,
  reducers: {
    setCurrentBoardID(state, action) {
      state.currentBoardID = action.payload;
    },
    setBoards(state, action) {
      state.boards = action.payload;
    },
  },
});

export default boardsSlice.reducer;
export const { setCurrentBoardID, setBoards } = boardsSlice.actions;

export interface boardsData {
  [key: string]: {
    boardName: string;
    boardImg: string;
    todos?: [];
  };
}
export const fetchBoards = createAsyncThunk<boardsData, undefined, {}>(
  "boards/fetchBoards",
  async function (_, { getState, dispatch }) {
    const state = getState() as RootState;
    // const appDispatch
    const db = getDatabase();
    console.log(state.user.id);
    const boardsRef = ref(db, `users/${state.user.id}/boards`);
    return new Promise<boardsData>((resolve) => {
      onValue(boardsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) dispatch(setBoards(data));
        resolve(data);
      });
    });
  }
);

// const state = getState() as RootState;
// let invitesData: invitesData[] = [];

// const db = getDatabase();
// const starCountRef = ref(db, `users/${state.user.id}/userInviteNotification`);

// await new Promise<void>((resolve) => {
//   onValue(starCountRef, (snapshot) => {
//     const data = snapshot.val();
//     if (data) {
//       invitesData = Object.values(data);
//     }
//     resolve();
//   });
// });

export const createBoard = createAsyncThunk<
  undefined,
  { boardName: string },
  {}
>("boards/createBoard", async function ({ boardName }, { getState, dispatch }) {
  const appDispatch = dispatch as AppDispatch;
  const state = getState() as RootState;
  const db = getDatabase(app);
  const dbRef = ref(db, `users/${state.user.id}/boards`);
  console.log(state.boards);
  push(dbRef, { boardName: boardName });
  return undefined;
});

export const updateBoard = createAsyncThunk<
  undefined,
  { boardID: string; data: dataI[] },
  {}
>(
  "board/updateBoard",
  async function ({ boardID, data }, { getState, dispatch }) {
    const state = getState() as RootState;

    const db = getDatabase();
    const dbRef = ref(db, `users/${state.user.id}/boards/${boardID}/boardData`);
    set(dbRef, data);
    return undefined;
  }
);
