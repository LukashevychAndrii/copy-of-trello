import React from "react";
import styles from "./MainHeader.module.scss";

import { NavLink, useLocation } from "react-router-dom";

const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? styles["header--active"] : "";

const getStyleAuth = (pathname: string) =>
  ["/sign-in", "/sign-up"].includes(pathname) ? styles["header--active"] : "";

const MainHeader = () => {
  const { pathname } = useLocation();

  return (
    <header className={styles["header"]}>
      <NavLink className={getStyle} to="/">
        Boards
      </NavLink>
      <NavLink className={getStyleAuth(pathname)} to={"sign-in"}>
        Account
      </NavLink>
    </header>
  );
};

export default MainHeader;
