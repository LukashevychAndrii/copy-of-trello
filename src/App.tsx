import React from "react";
import "./App.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout/RootLayout";
import BoardPage from "./pages/BoardPage";
import NotificationPage from "./pages/NotificationPage";

import SignUp from "./components/Acc/SignUp";
import SignIn from "./components/Acc/SignIn";
import AccDetails from "./components/Acc/AccDetails/AccDetails";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slices/user-slice";
import { get, getDatabase, ref } from "@firebase/database";
import { app } from "./firebase";
import { setThemeInitial } from "./store/slices/theme-slice";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import BoardList from "./components/Board/BoardsList/BoardsList";
import { fetchBoards, fetchGuestsBoards } from "./store/slices/boards-slice";
import { getInvite } from "./store/slices/invite-slice";
import { useAppDispatch } from "./hooks/redux";
import GuestBoardsPage from "./pages/GuestBoardsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <BoardList /> },
      { path: ":boardID", element: <BoardPage /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "acc-details", element: <AccDetails /> },
      { path: "notification", element: <NotificationPage /> },
      {
        path: "guest-board",
        children: [{ path: ":guestBoardID", element: <GuestBoardsPage /> }],
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
                console.log(reternedData.boardImg);
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

                // dispatch(setUserPhoto(reternedData.uPhoto));
              }
            }
          });
        };
        fetchDATA();
      }
    });
  }, [dispatch]);

  return (
    <SimpleBar style={{ maxHeight: "100vh" }} forceVisible="x">
      <RouterProvider router={router}></RouterProvider>
    </SimpleBar>
  );
}

export default App;
