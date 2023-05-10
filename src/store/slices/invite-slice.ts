import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "..";
import {
  getDatabase,
  ref,
  onValue,
  push,
  remove,
  set,
  get,
  update,
} from "firebase/database";
import { app } from "../../firebase";

interface initialStateI {
  invites: {
    [inviteID: string]: inviteDATAI;
  }[];
  sentInvites: {
    [boardID: string]: string;
  }[];
}

const initialState: initialStateI = {
  invites: [],
  sentInvites: [],
};

const inviteSlice = createSlice({
  name: "invite",
  initialState: initialState,
  reducers: {
    setInvites(state, action) {
      state.invites = action.payload;
    },
    removeInvite(state, action) {
      console.log("qwe");
      console.log(state.invites.findIndex(action.payload));
    },
    setSentInvites(state, action) {
      state.sentInvites.push(action.payload);
    },
  },
  extraReducers(builder) {},
});

export const { setInvites, setSentInvites, removeInvite } = inviteSlice.actions;

interface invitesData {
  inviteKey: {
    inviterID: string;
    inviterName: string;
    inviterPhoto: string;
  };
}
export const sendInvite = createAsyncThunk<
  undefined,
  { inviteUserID: string },
  {}
>(
  "invite/sendInvite",
  async function ({ inviteUserID }, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    const state = getState() as RootState;

    const db = getDatabase();
    const boardRef = ref(
      db,
      `users/${state.user.id}/boards/${state.boards.currentBoardID}`
    );
    let boardDATA = {};
    await get(boardRef)
      .then((snapshot) => {
        if (snapshot.exists()) boardDATA = snapshot.val();
      })
      .then(() => {
        const dbRef = ref(db, `users/${inviteUserID}/userInvites`);
        const userPHOTO = state.user.uPhoto ? state.user.uPhoto : "";
        const boardPHOTO = state.boards.currentBoardIMG
          ? state.boards.currentBoardIMG
          : "";
        push(dbRef, {
          inviterName: state.user.uName,
          inviterPhoto: userPHOTO,
          inviterID: state.user.id,
          boardID: state.boards.currentBoardID,
          boardPhoto: boardPHOTO,
          inviterDATA: boardDATA,
        }).then(() => {});
      });

    return undefined;
  }
);

export const getInvite = createAsyncThunk<
  { invitesData: invitesData[] } | undefined,
  undefined,
  {}
>("invite/getInvite", async function (_, { getState, dispatch }) {
  const state = getState() as RootState;
  let invitesData: invitesData[] = [];

  const db = getDatabase();
  const starCountRef = ref(db, `users/${state.user.id}/userInvites`);

  await new Promise<void>((resolve) => {
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        invitesData = Object.values(data);
        // console.log(data);
        dispatch(setInvites(data));
      } else {
        dispatch(setInvites({}));
      }
      resolve();
    });
  });

  return { invitesData };
});

export interface inviteDATAI {
  inviterDATA: {
    boardData: [];
    boardImg: string;
    boardName: string;
  };
  inviterName: string;
  inviterPhoto: string;
  boardPhoto: string;
}

export const acceptInvite = createAsyncThunk<
  undefined,
  {
    notifID: string;
    inviterID: string;
    boardID: string;
    inviterName: string;
    inviterDATA: [];
    boardName: string;
    inviterPhoto: string;
    boardPhoto: string;
  },
  {}
>(
  "invite/acceptInvite",
  async function (
    {
      notifID,
      boardID,
      inviterID,
      inviterName,
      inviterDATA,
      boardName,
      inviterPhoto,
      boardPhoto,
    },
    { getState, dispatch }
  ) {
    const appDispatch = dispatch as AppDispatch;
    const state = getState() as RootState;
    dispatch(rejectInvite({ notifID: notifID })).then(() => {
      const db = getDatabase(app);
      const dbRef = ref(
        db,
        `users/${state.user.id}/guestsBoards/${boardID}__${inviterName}`
      );
      set(dbRef, {
        inviterID: inviterID,
        boardID: boardID,
        inviterName: inviterName,
      }).then(() => {
        const dbRef = ref(
          db,
          `users/${inviterID}/sharedBoards/${boardID}__${inviterName}`
        );
        update(dbRef, {
          OWNER: inviterName,
          ownerID: inviterID,
          boardID: boardID,
          boardDATA: inviterDATA,
          ownerPHOTO: inviterPhoto,
          boardNAME: boardName,
          boardPhoto: boardPhoto,
        }).then(() => {
          const dbRef = ref(
            db,
            `users/${inviterID}/sharedBoards/${boardID}__${inviterName}/GUESTS/${state.user.id}`
          );
          const uPhoto = state.user.uPhoto ? state.user.uPhoto : "";
          set(dbRef, {
            guestID: state.user.id,
            guestName: state.user.uName,
            guestPhoto: uPhoto,
          });
        });
      });
    });

    return undefined;
  }
);

export const rejectInvite = createAsyncThunk<
  undefined,
  { notifID: string },
  {}
>("invite/acceptInvite", async function ({ notifID }, { getState, dispatch }) {
  const appDispatch = dispatch as AppDispatch;
  const state = getState() as RootState;
  const db = getDatabase();
  const dbRef = ref(db, `users/${state.user.id}/userInvites/${notifID}`);

  remove(dbRef);

  return undefined;
});

export default inviteSlice.reducer;
