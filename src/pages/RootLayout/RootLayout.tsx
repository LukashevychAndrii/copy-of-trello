import React from "react";
import { Outlet } from "react-router-dom";

import MainHeader from "../../components/Header/MainHeader";

const RootLayout = () => {
  return (
    <>
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
