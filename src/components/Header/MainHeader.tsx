import React from "react";
import styles from "./MainHeader.module.scss";

import defaultAvatar from "../../img/default-avatar--white.png";

import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import ThemeToggleBtn from "./ThemeToggleBtn/ThemeToggleBtn";

const getStyle = ({ isActive }: { isActive: boolean }) =>
  isActive ? styles["header--active"] : "";

const MainHeader = () => {
  const userPhoto = useAppSelector((state) => state.user.uPhoto);
  const userName = useAppSelector((state) => state.user.uName);

  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <header data-theme={`${theme}`} className={styles["header"]}>
      <NavLink className={getStyle} to="/">
        Boards
      </NavLink>
      {userName ? (
        <div style={{ display: "flex", alignItems: "center", gap: "15rem" }}>
          <ThemeToggleBtn />
          <NavLink className={getStyle} to="acc-details">
            <div className={styles["header__acc"]}>
              <img
                className={styles["header__user-photo"]}
                src={userPhoto ? userPhoto : defaultAvatar}
                alt="user"
              />
              <span className={styles["header__user-name"]}>{userName}</span>
            </div>
          </NavLink>
        </div>
      ) : (
        <div className={styles["header__auth-nav"]}>
          <ThemeToggleBtn />
          <NavLink className={getStyle} to="sign-in">
            Sign In
          </NavLink>
          <NavLink className={getStyle} to="sign-up">
            Sign Up
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default MainHeader;
