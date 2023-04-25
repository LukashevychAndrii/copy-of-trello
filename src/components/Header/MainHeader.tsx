import React from "react";
import styles from "./MainHeader.module.scss";

import { NavLink, useLocation } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";

const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? styles["header--active"] : "";

const getStyleAuth = (pathname: string) =>
  ["/sign-in", "/sign-up"].includes(pathname) ? styles["header--active"] : "";

const MainHeader = () => {
  const { pathname } = useLocation();

  const userId = useAppSelector((state) => state.user.id);

  return (
    <header className={styles["header"]}>
      <NavLink className={getStyle} to="/">
        Boards
      </NavLink>
      <NavLink
        className={getStyleAuth(pathname)}
        to={userId ? "acc-details" : "sign-in"}
      >
        Account
      </NavLink>
    </header>
  );
};

export default MainHeader;
