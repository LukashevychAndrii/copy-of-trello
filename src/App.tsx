import React from "react";
import "./App.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout/RootLayout";
import BoardPage from "./pages/BoardPage";

import SignUp from "./components/Acc/SignUp";
import SignIn from "./components/Acc/SignIn";
import AccDetails from "./components/Acc/AccDetails/AccDetails";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slices/user-slice";
import { get, getDatabase, ref } from "@firebase/database";
import { app } from "./firebase";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <BoardPage /> },
      { path: "sign-up", element: <SignUp /> },
      { path: "sign-in", element: <SignIn /> },
      { path: "acc-details", element: <AccDetails /> },
    ],
  },
]);

interface userDataI {
  email: string;
  id: string;
  password: string;
  uName: string;
}

function App() {
  const dispatch = useDispatch();
  React.useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const db = getDatabase(app);

        const userRef = ref(db, `users/${user.uid}/userdata`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            const reternedData = snapshot.val();
            if (user.email) {
              const userData: userDataI = {
                email: user.email,
                id: user.uid,
                password: reternedData.password,
                uName: reternedData.uName,
              };
              dispatch(setUser(userData));
            }
          }
        });
      }
    });
  }, [dispatch]);
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
