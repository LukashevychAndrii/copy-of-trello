import React from "react";
import "./App.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout/RootLayout";
import BoardPage from "./pages/BoardPage";
import NotificationPage from "./pages/NotificationPage";

import AccDetails from "./components/Acc/AccDetails/AccDetails";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { setUser } from "./store/slices/user-slice";
import { get, getDatabase, ref } from "@firebase/database";
import { app } from "./firebase";
import { setThemeInitial } from "./store/slices/theme-slice";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import BoardList from "./components/Board/BoardsList/BoardsList";
import { fetchBoards, fetchGuestsBoards } from "./store/slices/boards-slice";
import { getInvite } from "./store/slices/invite-slice";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import GuestBoardsPage from "./pages/GuestBoardsPage";
import ErrorPage from "./pages/ErrorPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/copy-of-trello",
        element: <RootLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <BoardList /> },
          { path: ":boardID", element: <BoardPage /> },
          { path: "sign-up", element: <SignUpPage /> },
          { path: "sign-in", element: <SignInPage /> },
          { path: "acc-details", element: <AccDetails /> },
          { path: "notification", element: <NotificationPage /> },
          {
            path: "guest-board",
            children: [{ path: ":guestBoardID", element: <GuestBoardsPage /> }],
          },
        ],
      },
    ],
  },
]);

interface userDataI {
  email: string;
  id: string;
  password: string;
  uName: string;
  uPhoto: string;
  boardImg: string;
}

function App() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    const theme = localStorage.getItem("todo-theme");
    dispatch(setThemeInitial({ theme: theme }));
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const fetchDATA = async () => {
          const db = getDatabase(app);
          const userRef = ref(db, `users/${user.uid}/userdata`);
          await get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
              const reternedData = snapshot.val();
              if (user.email) {
                const userData: userDataI = {
                  email: user.email,
                  id: user.uid,
                  password: reternedData.password,
                  uName: reternedData.uName,
                  uPhoto: reternedData.uPhoto,
                  boardImg: reternedData.boardImg,
                };
                dispatch(setUser(userData));
                dispatch(fetchBoards());
                dispatch(fetchGuestsBoards());
                dispatch(getInvite());
              }
            }
          });
        };
        fetchDATA();
      }
    });
  }, [dispatch]);

  const userID = useAppSelector((state) => state.user.id);
  React.useEffect(() => {
    if (userID) {
      dispatch(fetchBoards());
    }
  }, [userID, dispatch]);

  return (
    <SimpleBar style={{ maxHeight: "100vh" }} forceVisible="x">
      <RouterProvider router={router}></RouterProvider>
    </SimpleBar>
  );
}

export default App;
