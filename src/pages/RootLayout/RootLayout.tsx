import React from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "../../components/Header/MainHeader";

import AlertWindow from "../../utils/AlertWindow/AlertWindow";
import { useAppSelector } from "../../hooks/redux";

const RootLayout = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <>
      <AlertWindow />
      <MainHeader />
      <main data-theme={theme} style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
