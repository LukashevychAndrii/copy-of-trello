import React from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "../../components/Header/MainHeader";

import AlertWindow from "../../utils/AlertWindow/AlertWindow";

const RootLayout = () => {
  return (
    <>
      <AlertWindow />
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
