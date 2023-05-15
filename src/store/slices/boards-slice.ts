import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { app } from "../../firebase";
import { AppDispatch, RootState } from "..";
import { dataI } from "../../components/Board/Board";
import { createAlert } from "./alert-slice";
import getErrorDetails from "../../utils/getErrorDetails";
import { NavigateFunction, redirect, useNavigate } from "react-router-dom";
import { log } from "console";
import { resolve } from "path";
import { useAppDispatch } from "../../hooks/redux";
import { clearPending, setPending } from "./pending-slice";

interface initialStateI {
  boards: {
    [key: string]: {
      boardName: string;
      boardImg: string;
      todos?: [];
    };
  };
  currentBoardID: string;
  currentBoardIMG: string;

  currentSharedBoard: currentSharedBoardI | null;

  guestsBoards: guestsBoardDATAI[];
  currentGuestBoard?: guestsBoardDATAI | null;
}
const initialState: initialStateI = {
  boards: {},
  currentBoardID: "",
  currentBoardIMG: "",
  guestsBoards: [],
  currentSharedBoard: null,
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
    setCurrentBoardIMG(state, action) {
      state.currentBoardIMG = action.payload;
    },
    setGuestsBoards(state, action) {
      state.guestsBoards = action.payload;
    },
    setCurrentGuestBoard(state, action) {
      state.currentGuestBoard = action.payload;
    },
    setCurrentSharedBoard(state, action) {
      state.currentSharedBoard = action.payload;
    },
    removeGuestBoardFromState(state, action) {
      state.guestsBoards = state.guestsBoards.filter(
        (el) => el.boardID !== action.payload
      );
    },
  },
});

interface currentSharedBoardI {
  GUESTS: {
    [id: string]: {
      guestID: string;
      guestName: string;
      guestPhoto: string;
    };
  };
  OWNER: string;
  boardDATA: {
    boardData: [];
    boardName: string;
  };
  boardID: string;
  ownerID: string;
  ownerPhoto: string;
}

export default boardsSlice.reducer;
export const {
  setCurrentBoardID,
  setBoards,
  setCurrentBoardIMG,
  setGuestsBoards,
  setCurrentGuestBoard,
  setCurrentSharedBoard,
  removeGuestBoardFromState,
} = boardsSlice.actions;

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
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());
    const state = getState() as RootState;
    const db = getDatabase();
    console.log(state.user.id);
    const boardsRef = ref(db, `users/${state.user.id}/boards`);
    return new Promise<boardsData>((resolve) => {
      onValue(boardsRef, (snapshot) => {
        dispatch(setBoards(snapshot.val()));
        resolve(snapshot.val());
        appDispatch(clearPending());
      });
    });
  }
);
interface guestsBoardsDATAI {
  [id: string]: {
    boardID: string;
    inviterID: string;
    inviterName: string;
  };
}

export interface guestBoardOwnerData {
  OWNER: string;
  ownerID: string;
  ownerPHOTO: string;
}

export interface guestsBoardDATAI {
  GUESTS: {
    [guestID: string]: {
      guestID: string;
      guestName: string;
      guestPhoto: string;
    };
  };
  boardDATA: {
    boardData: [];
    boardName: string;
  };
  boardID: string;
  boardPhoto: string;
  OWNER: string;
  ownerID: string;
  ownerPHOTO: string;
}

export const fetchGuestsBoards = createAsyncThunk<undefined, undefined, {}>(
  "boards/fetchGuestsBoards",
  async function (_, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());

    const state = getState() as RootState;
    const db = getDatabase();
    const boardsRef = ref(db, `users/${state.user.id}/guestsBoards`);
    new Promise<guestsBoardsDATAI>((resolve) => {
      onValue(boardsRef, (snapshot) => {
        const data = snapshot.val();
        resolve(data);
      });
    }).then((snapshot) => {
      if (snapshot) {
        const keys = Object.keys(snapshot);
        console.log(keys);
        const promises = keys.map(async (key) => {
          const value = snapshot[key];
          const dbRef = ref(
            db,
            `users/${value.inviterID}/sharedBoards/ownerDATA`
          );
          return get(dbRef).then((snapshot) => {
            if (snapshot.val()) {
              const ownerData: guestBoardOwnerData = snapshot.val();
              const dbRef = ref(
                db,
                `users/${value.inviterID}/sharedBoards/${value.boardID}__${value.inviterName}`
              );
              return get(dbRef).then((snapshot) => {
                const guestBoard: guestsBoardDATAI = {
                  ...snapshot.val(),
                  ...ownerData,
                };
                return guestBoard;
              });
            } else {
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            }
          });
        });
        Promise.all(promises)
          .then((snapshot) => {
            dispatch(setGuestsBoards(snapshot));
          })
          .then(() => {
            appDispatch(clearPending());
          });
      } else {
        dispatch(setGuestsBoards([]));
        appDispatch(clearPending());
      }
    });
    return undefined;
  }
);

export const removeBoard = createAsyncThunk<undefined, { boardID: string }, {}>(
  "boards/removeBoard",
  async function ({ boardID }, { getState, dispatch }) {
    const db = getDatabase();
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());

    const state = getState() as RootState;

    const dbRef = ref(db, `users/${state.user.id}/boards/${boardID}`);
    remove(dbRef).then(() => {
      const dbRef = ref(
        db,
        `users/${state.user.id}/sharedBoards/${boardID}__${state.user.uName}`
      );
      remove(dbRef).then(() => {
        appDispatch(clearPending());
      });
    });
    return undefined;
  }
);

export const removeGuestBoard = createAsyncThunk<
  undefined,
  { boardID: string; ownerNAME: string; ownerID: string },
  {}
>(
  "boards/removeGuestBoard",
  async function ({ boardID, ownerNAME, ownerID }, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());

    const db = getDatabase();
    const state = getState() as RootState;
    const dbRef = ref(
      db,
      `users/${state.user.id}/guestsBoards/${boardID}__${ownerNAME}`
    );

    remove(dbRef).then(() => {
      const dbRef = ref(
        db,
        `users/${ownerID}/sharedBoards/${boardID}__${ownerNAME}/GUESTS/${state.user.id}`
      );
      remove(dbRef);
      dispatch(removeGuestBoardFromState(boardID));
      appDispatch(clearPending());
    });

    return undefined;
  }
);

export const fetchGuestBoard = createAsyncThunk<
  undefined,
  { boardID: string; navigate: NavigateFunction },
  {}
>(
  "boards/fetchGuestBoard",
  async function ({ boardID, navigate }, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());
    const state = getState() as RootState;
    const db = getDatabase();
    const boardDATA = state.boards.guestsBoards.find(
      (el) => el.boardID === boardID
    );

    // const guestRef = ref(
    //   db,
    //   `users/${boardDATA?.ownerID}/sharedBoards/${boardDATA?.boardID}__${boardDATA?.OWNER}/GUESTS/${state.user.id}`
    // );
    // if (boardDATA) {
    //   onValue(guestRef, (snapshot) => {
    //     if (snapshot.exists()) {
    //       console.log("!!!!!!!!!!!!");
    //       appDispatch(setCurrentGuestBoard(boardDATA));
    //     } else {
    //       const dbRef = ref(
    //         db,
    //         `users/${state.user.id}/guestsBoards/${boardDATA.boardID}__${boardDATA.OWNER}`
    //       );
    //       remove(dbRef);
    //       navigate("/");
    //       appDispatch(
    //         createAlert({
    //           alertTitle: "Database error!",
    //           alertText: "Trying to connect to board that was deleted!",
    //           alertError: true,
    //         })
    //       );
    //     }
    //   });
    // }
    // new Promise<undefined>((resolve)=>{
    //   if(boardDATA){
    //     const dbRef = ref(`users/${boardDATA.ownerID}/sharedBoards/ownerDATA`)
    //   }
    // })
    new Promise<guestsBoardDATAI>((resolve) => {
      if (boardDATA) {
        const dbRef = ref(
          db,
          `users/${boardDATA.ownerID}/sharedBoards/${boardDATA.boardID}__${boardDATA.OWNER}`
        );
        onValue(dbRef, (board) => {
          if (board.exists()) {
            const dbRef = ref(
              db,
              `users/${boardDATA.ownerID}/sharedBoards/ownerDATA`
            );
            onValue(dbRef, (ownerDATA) => {
              const transformedBoard = {
                ...board.val(),
                boardDATA: {
                  boardData: board.val().boardDATA.boardData
                    ? board.val().boardDATA.boardData
                    : [],
                  boardName: board.val().boardDATA.boardName,
                },
              };
              if (ownerDATA) {
                dispatch(
                  setCurrentGuestBoard({
                    ...transformedBoard,
                    ...ownerDATA.val(),
                  })
                );
                appDispatch(clearPending());
              }
            });
          }
          if (board.exists()) resolve(board.val());
          else {
            const dbRef = ref(
              db,
              `users/${state.user.id}/guestsBoards/${boardDATA.boardID}__${boardDATA.OWNER}`
            );
            remove(dbRef);
            navigate("/");
            appDispatch(
              createAlert({
                alertTitle: "Database error!",
                alertText: "Trying to connect to board that was deleted!",
                alertError: true,
              })
            );
            appDispatch(clearPending());
          }
        });
      }
    }).then((snapshot) => {
      const boardDATA = snapshot;
      new Promise((resolve) => {
        const dbRef = ref(
          db,
          `users/${boardDATA.ownerID}/sharedBoards/${boardDATA.boardID}__${boardDATA.OWNER}`
        );
      });
    });

    return undefined;
  }
);

export const createBoard = createAsyncThunk<
  undefined,
  { boardName: string },
  {}
>("boards/createBoard", async function ({ boardName }, { getState, dispatch }) {
  const appDispatch = dispatch as AppDispatch;
  appDispatch(setPending());

  const state = getState() as RootState;
  const db = getDatabase(app);
  const dbRef = ref(db, `users/${state.user.id}/boards`);
  console.log(state.boards);
  push(dbRef, { boardName: boardName }).then(() => {
    appDispatch(clearPending());
  });

  return undefined;
});

export const updateBoard = createAsyncThunk<
  undefined,
  { boardID: string; data: dataI[]; guest: boolean },
  {}
>(
  "board/updateBoard",
  async function ({ boardID, data, guest }, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;

    const state = getState() as RootState;
    console.log(guest);
    const db = getDatabase();
    if (guest) {
      const boardDATA = state.boards.guestsBoards.find(
        (el) => el.boardID === boardID
      );
      const dbRef = ref(
        db,
        `users/${boardDATA?.ownerID}/boards/${boardDATA?.boardID}/boardData`
      );
      set(dbRef, data).then(() => {
        const dbRef = ref(
          db,
          `users/${boardDATA?.ownerID}/sharedBoards/${boardDATA?.boardID}__${boardDATA?.OWNER}/boardDATA/boardData`
        );
        set(dbRef, data);
      });
    } else {
      const dbRef = ref(
        db,
        `users/${state.user.id}/boards/${boardID}/boardData`
      );
      set(dbRef, data).then(() => {
        const dbRef = ref(
          db,
          `users/${state.user.id}/sharedBoards/${boardID}__${state.user.uName}`
        );
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const dbRef = ref(
              db,
              `users/${state.user.id}/sharedBoards/${boardID}__${state.user.uName}/boardDATA/boardData`
            );

            set(dbRef, data);
          }
        });
      });
    }
    return undefined;
  }
);

export const getBoardImg = createAsyncThunk<string, undefined, {}>(
  "board/getBoardImg",
  async function (_, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;

    appDispatch(setPending());

    const state = getState() as RootState;
    const db = getDatabase(app);
    const dbRef = ref(
      db,
      `users/${state.user.id}/boards/${state.boards.currentBoardID}/boardImg`
    );
    return new Promise<string>((resolve) => {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        dispatch(setCurrentBoardIMG(data));
        resolve(data);
        appDispatch(clearPending());
      });
    });
  }
);

export const updateBoardImg = createAsyncThunk<undefined, undefined, {}>(
  "board/updateBoardImg",
  async function (_, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());

    const state = getState() as RootState;
    const boardID = state.boards.currentBoardID;
    const db = getDatabase(app);
    const dbRef = ref(db, `users/${state.user.id}/boards/${boardID}`);
    console.log(state.boards.currentBoardIMG);
    update(dbRef, { boardImg: state.boards.currentBoardIMG })
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
        const dbRef = ref(
          db,
          `users/${state.user.id}/sharedBoards/${boardID}__${state.user.uName}`
        );
        get(dbRef).then((snapshot) => {
          if (snapshot.exists()) {
            const dbRef = ref(
              db,
              `users/${state.user.id}/sharedBoards/${boardID}__${state.user.uName}/boardPhoto`
            );
            const boardPHOTO = state.boards.currentBoardIMG;
            set(dbRef, boardPHOTO).then(() => {
              appDispatch(clearPending());
            });
          }
        });
      });
    return undefined;
  }
);

export const updateUserTodos = createAsyncThunk<
  undefined,
  { data: dataI[] },
  {}
>("board/updateUsersTodos", async function ({ data }, { getState, dispatch }) {
  const appDispatch = dispatch as AppDispatch;
  appDispatch(setPending());

  const state = getState() as RootState;
  console.log(data);
  const db = getDatabase();
  const dbRef = ref(
    db,
    `users/${state.user.id}/boards/${state.boards.currentBoardID}/boardData`
  );
  set(dbRef, data)
    .catch((error) => {
      dispatch(appDispatch(createAlert(getErrorDetails(error.code))));
    })
    .then(() => {
      appDispatch(clearPending());
    });
  return undefined;
});

export const fetchSharedBoards = createAsyncThunk<
  undefined,
  { boardID: string },
  {}
>(
  "board/updateUsersTodos",
  async function ({ boardID }, { getState, dispatch }) {
    const appDispatch = dispatch as AppDispatch;
    appDispatch(setPending());
    const state = getState() as RootState;
    const db = getDatabase();
    const dbRef = ref(
      db,
      `users/${state.user.id}/sharedBoards/${boardID}__${state.user.uName}`
    );

    return new Promise<undefined>((resolve) => {
      try {
        onValue(dbRef, (snapshot) => {
          dispatch(setCurrentSharedBoard(snapshot.val()));

          resolve(snapshot.val());
          appDispatch(clearPending());
        });
      } catch (error) {
        dispatch(
          appDispatch(
            createAlert({
              alertTitle: "Database error!",
              alertText: "Fetching board mebmers failed",
              alertError: true,
            })
          )
        );
      }
    });
  }
);
