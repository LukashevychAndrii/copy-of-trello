import React from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "../../components/Header/MainHeader";
import AlertWindow from "../../utils/AlertWindow/AlertWindow";
import Pending from "../../utils/Pending/Pending";

import { useAppSelector } from "../../hooks/redux";
import Footer from "../../components/Footer/Footer";

const RootLayout = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  const pending = useAppSelector((state) => state.pending.pending);
  return (
    <>
      {pending && <Pending />}
      <AlertWindow />
      <MainHeader />
      <main data-theme={theme} style={{ minHeight: "80vh" }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
