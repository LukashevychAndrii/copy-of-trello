import React from "react";
import "./App.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./pages/RootLayout/RootLayout";

const router = createBrowserRouter([{ path: "/", element: <RootLayout /> }]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
