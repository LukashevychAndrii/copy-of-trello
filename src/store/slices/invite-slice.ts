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
import { clearPending, setPending } from "./pending-slice";
import { createAlert } from "./alert-slice";
import { NavigateFunction } from "react-router-dom";
import { resolve } from "path";

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
    setSentInvites(state, action) {
      state.sentInvites.push(action.payload);
    },
  },
  extraReducers(builder) {},
});

export const { setInvites, setSentInvites } = inviteSlice.actions;

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
    appDispatch(setPending());
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
        }).then(() => {
          appDispatch(clearPending());
        });
      })
      .catch(() => {
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "Database error",
            alertError: true,
          })
        );
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
        dispatch(setInvites(data));
      } else {
        dispatch(setInvites({}));
      }
      resolve();
    });
  }).catch(() => {
    dispatch(
      createAlert({
        alertTitle: "Error!",
        alertText: "An error occurs while getting invite",
        alertError: true,
      })
    );
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
    navigate: NavigateFunction;
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
      navigate,
    },
    { getState, dispatch }
  ) {
    const appDispatch = dispatch as AppDispatch;
    // appDispatch(setPending());
    const state = getState() as RootState;
    await new Promise<void>((resolve) => {
      return dispatch(rejectInvite({ notifID: notifID }))
        .then(() => {
          const db = getDatabase(app);
          const dbRef = ref(
            db,
            `users/${state.user.id}/guestsBoards/${boardID}__${inviterName}`
          );
          return set(dbRef, {
            inviterID: inviterID,
            boardID: boardID,
            inviterName: inviterName,
          })
            .then(() => {
              const dbRef = ref(
                db,
                `users/${inviterID}/sharedBoards/ownerDATA`
              );
              return set(dbRef, {
                OWNER: inviterName,
                ownerID: inviterID,
                ownerPHOTO: inviterPhoto,
              });
            })
            .then(() => {
              const dbRef = ref(
                db,
                `users/${inviterID}/sharedBoards/${boardID}__${inviterName}`
              );
              return update(dbRef, {
                boardID: boardID,
                boardDATA: inviterDATA,
                boardNAME: boardName,
                boardPhoto: boardPhoto,
              }).then(() => {
                const dbRef = ref(
                  db,
                  `users/${inviterID}/sharedBoards/${boardID}__${inviterName}/GUESTS/${state.user.id}`
                );
                const uPhoto = state.user.uPhoto ? state.user.uPhoto : "";
                resolve(undefined);
                return set(dbRef, {
                  guestID: state.user.id,
                  guestName: state.user.uName,
                  guestPhoto: uPhoto,
                });
              });
            });
        })
        .catch(() => {
          dispatch(
            createAlert({
              alertTitle: "Error!",
              alertText: "An error occurs while accepting invite",
              alertError: true,
            })
          );
          appDispatch(clearPending());
        });
    })
      .then(() => {
        appDispatch(clearPending());
        navigate(`/copy-of-trello/guest-board/${boardID}`);
      })
      .catch(() => {
        navigate("/copy-of-trello");
        dispatch(
          createAlert({
            alertTitle: "Error!",
            alertText: "An error occurs while accepting invite",
            alertError: true,
          })
        );
      });

    return undefined;
  }
);

export const rejectInvite = createAsyncThunk<
  undefined,
  { notifID: string },
  {}
>("invite/rejectInvite", async function ({ notifID }, { getState, dispatch }) {
  const appDispatch = dispatch as AppDispatch;
  dispatch(setPending());
  const state = getState() as RootState;
  const db = getDatabase();
  const dbRef = ref(db, `users/${state.user.id}/userInvites/${notifID}`);

  remove(dbRef).then(() => {
    appDispatch(clearPending());
  });

  return undefined;
});

export const removeUser = createAsyncThunk<undefined, { userID: string }, {}>(
  "invite/removeUser",
  async function ({ userID }, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());

    const state = getState() as RootState;
    const db = getDatabase();
    const dbRef = ref(
      db,
      `users/${state.user.id}/sharedBoards/${state.boards.currentBoardID}__${state.user.uName}/GUESTS/${userID}`
    );

    remove(dbRef).then(() => {
      appDispatch(clearPending());
    });

    return undefined;
  }
);

export default inviteSlice.reducer;
